import axios from 'axios'
import { API_URL1, API_URL2, post, getAccessToken, getSession, initSession, setSession, APP_TOKEN, USER_TOKEN } from '../util'

async function ensureSession() {
  const session = getSession()
  if (session) {
    return
  }

  try {
    const resp = await initSession()
    const token = resp?.data?.session_token || resp?.data?.session?.session_token || resp?.data?.session || resp?.data?.session_token || resp?.data
    const tok = typeof token === 'string' ? token : token?.session_token || token?.value || null
    if (tok) {
      setSession(tok)
    }
  } catch (err) {
    console.warn('ensureSession Document failed', err?.response?.data || err)
  }
}

export function getManagementDocuments(params = {}) {
  const url = `${API_URL2}/Management/Document`
  console.log('📄 getManagementDocuments URL:', url, 'params:', params)
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    },
    params
  })
}

export function uploadDocumentFile(file, metadata = {}) {
  const url = `${API_URL1}/Document`
  console.log('📤 uploadDocumentFile URL:', url, 'filename:', file.name)
  
  const formData = new FormData()
  const manifest = {
    input: {
      name: metadata.name || file.name,
      comment: metadata.comment || '',
      ...metadata,
      _filename: [file.name]
    }
  }
  
  formData.append('uploadManifest', JSON.stringify(manifest))
  formData.append('filename[0]', file, file.name)
  
  return axios.post(url, formData, {
    headers: {
      'Session-Token': getSession(),
      'App-Token': APP_TOKEN,
      Accept: 'application/json'
    }
  }).then(response => {
    // Vérifier les erreurs d'upload comme dans GlpiService
    const uploadResult = response.data?.upload_result?.filename?.[0]
    
    if (uploadResult?.error) {
      // Si document créé mais erreur d'upload, supprimer le document
      if (response.data?.id) {
        deleteDocument(response.data.id).catch(err => {
          console.warn('Failed to cleanup document after upload error:', err)
        })
      }
      throw new Error(U`pload image refused by GLPI: ${uploadResult.error}`)
    }
    
    console.log('✅ Upload successful, response:', response.data)
    return response
  })
}

export function deleteDocument(documentId) {
  const url = `${API_URL1}/Document/${documentId}`
  console.log('🗑️ deleteDocument URL:', url)
  return axios.delete(url, {
    params: { force_purge: true },
    headers: {
      'Session-Token': getSession(),
      'App-Token': APP_TOKEN
    }
  })
}

export function getDocumentV1(documentId) {
  const url = `${API_URL1}/Document/${documentId}`
  console.log('🔎 getDocumentV1 URL:', url)
  return axios.get(url, {
    headers: {
      'Session-Token': getSession()
    }
  })
}

export async function createDocumentV1(data) {
  await ensureSession()
  const url = `${API_URL1}/Document`
  console.log('🔧 createDocumentV1 URL:', url, 'data:', data)
  return post(url, { input: data }, {
    'Session-Token': getSession(),
    Authorization: `USER_TOKEN ? user_token ${USER_TOKEN}`
  })
}

export async function createDocumentItem(data) {
  await ensureSession()
  const url = `${API_URL1}/Document_Item`
  console.log('🔗 createDocumentItem URL:', url, 'data:', data)
  return post(url, {
    input: data
  }, {
    'Session-Token': getSession()
  })
}