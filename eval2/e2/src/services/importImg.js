/**
 * GLPI Asset Image Upload Service — Browser/Vue compatible
 * Dépendances : jszip (npm install jszip)
 */

import JSZip from "jszip";
import { uploadDocumentFile, createDocumentItem } from "./document";

// ─── Config ───────────────────────────────────────────────────────────────────

const JPEG_QUALITY = 0.92;
const CONCURRENCY  = 3;

const SUPPORTED_EXTS = new Set([
  "jpg", "jpeg", "png", "webp", "avif", "gif",
  "tiff", "tif", "bmp", "heic", "heif",
]);
const JPEG_EXTS = new Set(["jpg", "jpeg"]);

// ─── Conversion JPEG via Canvas API ──────────────────────────────────────────

async function convertToJpegFile(arrayBuffer, basename) {
  const url = URL.createObjectURL(new Blob([arrayBuffer]));
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload  = () => resolve(el);
      el.onerror = () => reject(new Error("Impossible de décoder l'image"));
      el.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const jpegBlob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob a retourné null"))),
        "image/jpeg",
        JPEG_QUALITY
      )
    );

    return new File([jpegBlob], `${basename}.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ─── Extraction ZIP ───────────────────────────────────────────────────────────

async function extractImagesFromZip(zipSource) {
  const data = zipSource instanceof File ? await zipSource.arrayBuffer() : zipSource;
  const zip  = await JSZip.loadAsync(data);
  const entries = [];

  for (const [relativePath, file] of Object.entries(zip.files)) {
    if (file.dir || relativePath.includes("__MACOSX")) continue;

    const basename = relativePath.split("/").pop() ?? "";
    const dotIdx   = basename.lastIndexOf(".");
    if (dotIdx === -1) continue;

    const name = basename.slice(0, dotIdx);
    const ext  = basename.slice(dotIdx + 1).toLowerCase();

    if (!name || !SUPPORTED_EXTS.has(ext)) continue;

    const arrayBuffer = await file.async("arraybuffer");
    entries.push({ name, ext, arrayBuffer, originalPath: relativePath });
  }

  return entries;
}

// ─── Concurrence ──────────────────────────────────────────────────────────────

async function runWithConcurrency(items, task, limit) {
  const queue   = [...items];
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => { while (queue.length > 0) await task(queue.shift()); }
  );
  await Promise.all(workers);
}

const parseDocumentId = (response) => {
  const data = response?.data || response;
  if (!data) return null;
  return data?.id || data?.ID || data?.document?.id || null;
};

// ─── Export principal ─────────────────────────────────────────────────────────

/**
 * @typedef {{ id: number, name: string, itemtype: string }} CreatedAsset
 * @typedef {{ name: string, assetId: number, itemtype: string, documentId: number, status: 'ok' }
 *          | { name: string, status: 'error', error: string }} ImportImageResult
 */

/**
 * @param {File|ArrayBuffer}  zipSource     Fichier ZIP venant du drop-zone
 * @param {CreatedAsset[]}    createdAssets Résultat de importCSV : [{ id, name, itemtype }]
 * @returns {Promise<ImportImageResult[]>}
 */
export async function importImages(zipSource, createdAssets = []) {
  const assetIndex = new Map(
    createdAssets.map((a) => [a.name.toLowerCase().trim(), a])
  );

  const images = await extractImagesFromZip(zipSource);
  if (images.length === 0) return [];

  const results = [];

  await runWithConcurrency(
    images,
    async ({ name, ext, arrayBuffer }) => {
      const asset = assetIndex.get(name.toLowerCase().trim());

      if (!asset) {
        results.push({ name, status: "error", error: `Aucun asset trouvé pour "${name}"` });
        return;
      }

      try {
        let file;
        if (JPEG_EXTS.has(ext)) {
          file = new File([arrayBuffer], `${name}.${ext}`, { type: "image/jpeg" });
        } else {
          file = await convertToJpegFile(arrayBuffer, name);
        }

        const docResp = await uploadDocumentFile(file, {
          name,
          comment: `Image imported from ZIP for item ${asset.id}`,
        });

        const documentId = parseDocumentId(docResp);
        if (!documentId) {
          throw new Error("Failed to extract document ID from upload response");
        }

        await createDocumentItem({
          itemtype: asset.itemtype || "Computer",
          items_id: Number(asset.id),
          documents_id: Number(documentId),
        });

        results.push({ name, assetId: asset.id, itemtype: asset.itemtype, documentId, status: "ok" });
      } catch (err) {
        results.push({ name, status: "error", error: err.message });
      }
    },
    CONCURRENCY
  );

  return results;
}