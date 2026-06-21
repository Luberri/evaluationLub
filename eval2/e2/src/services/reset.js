import { API_URL2, del, getAccessToken } from "../util.js";
import { getAllTicket } from "./ticket.js";
import { listItems, getAllItems } from "./item.js";
import {
    supAllStates,
    supAllLocations,
    supAllManufacturers,
    getAllItemModels,
    getAllItemTypes
} from "./dropDown.js";
import { deleteAllCoutSpring } from "./spring.js";
async function safeDelete(path, name, report, category) {
    try {
        await del(path, { Authorization: `Bearer ${getAccessToken()}` });
        if (report && category) report[category]++;
        return true;
    } catch (e) {
        if (report) report.errors.push(`Erreur lors de la suppression de ${name} (${e.message})`);
        return false;
    }
}

export async function resetAll() {

    const report = {
        tickets: 0,
        assets: 0,
        models: 0,
        types: 0,
        manufacturers: 0,
        locations: 0,
        states: 0,
        users: 0,
        errors: []
    };

    try {
        console.log("Deleting cout spring...");
        await deleteAllCoutSpring();
        // ── 1. Tickets ─────────────────────────────────────────
        console.log("Deleting tickets...");
        const ticketsRes = await getAllTicket();
        await Promise.all(
            (ticketsRes.data || []).map(ticket =>
                safeDelete(`${API_URL2}/Assistance/Ticket/${ticket.id}`, `Ticket ${ticket.id}`, report, 'tickets')
            )
        );

        // ── Chargement des types d'assets ──────────────────────
        const itemsListRes = await listItems();
        const assetTypes = (itemsListRes.data || []).map(item => item.itemtype);

        // ── 2. Assets ──────────────────────────────────────────
        console.log("Deleting assets...");
        await Promise.all(
            assetTypes.map(async type => {
                const itemsRes = await getAllItems(type);
                return Promise.all(
                    (itemsRes.data || []).map(item =>
                        safeDelete(`${API_URL2}/Assets/${type}/${item.id}`, `Asset ${type} ${item.id}`, report, 'assets')
                    )
                );
            })
        );

        // ── 3. Models ──────────────────────────────────────────
        console.log("Deleting models...");
        await Promise.all(
            assetTypes.map(async type => {
                try {
                    const modelsRes = await getAllItemModels(type);
                    return Promise.all(
                        (modelsRes.data || []).map(model =>
                            safeDelete(`${API_URL2}/Dropdowns/${type}Model/${model.id}`, `Modèle ${type} ${model.id}`, report, 'models')
                        )
                    );
                } catch (e) {
                    // Ignore missing endpoints
                }
            })
        );

        // ── 4. Types ───────────────────────────────────────────
        console.log("Deleting dropdown types...");
        await Promise.all(
            assetTypes.map(async type => {
                try {
                    const typesRes = await getAllItemTypes(type);
                    return Promise.all(
                        (typesRes.data || []).map(t =>
                            safeDelete(`${API_URL2}/Dropdowns/${type}Type/${t.id}`, `Type ${type} ${t.id}`, report, 'types')
                        )
                    );
                } catch (e) {
                    // Ignore missing endpoints
                }
            })
        );

        // ── 5‑7. Manufacturer / Location / State ───────────────
        console.log("Deleting manufacturers...");
        const mRes = await import("./dropDown.js").then(m => m.getAllManufacturers());
        await Promise.all((mRes.data || []).map(x => safeDelete(`${API_URL2}/Dropdowns/Manufacturer/${x.id}`, `Fabricant ${x.id}`, report, 'manufacturers')));

        console.log("Deleting locations...");
        const lRes = await import("./dropDown.js").then(m => m.getAllLocations());
        await Promise.all((lRes.data || []).map(x => safeDelete(`${API_URL2}/Dropdowns/Location/${x.id}`, `Lieu ${x.id}`, report, 'locations')));
        
        console.log("Deleting states...");
        const sRes = await import("./dropDown.js").then(m => m.getAllStates());
        await Promise.all((sRes.data || []).map(x => safeDelete(`${API_URL2}/Dropdowns/State/${x.id}`, `Statut ${x.id}`, report, 'states')));

        console.log("Deleting users...");
        const uRes = await import("./user.js").then(m => m.getAllUser());
        await Promise.all((uRes.data || []).filter(a => ![1,2,3,4,6].includes(a.id)).map(x => safeDelete(`${API_URL2}/Administration/User/${x.id}`, `Utilisateur ${x.id}`, report, 'users')));
        report.users = (uRes.data || []).length;

        console.log("Reset complete.");
        return report;
    } catch (error) {
        console.error("Error during resetAll:", error);
        report.errors.push(`Erreur fatale: ${error.message}`);
        return report;
    }
}