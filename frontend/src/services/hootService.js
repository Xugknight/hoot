import sendRequest from "./sendRequest";

const BASE_URL = '/api/hoots';

export async function index() {
  return sendRequest(BASE_URL);
}

export async function show(hootId) {
  return sendRequest(`${BASE_URL}/${hootId}`);
}

export async function create(hootData) {
  return sendRequest(BASE_URL, 'POST', hootData);
}

export async function update(hootId, hootData) {
  return sendRequest(`${BASE_URL}/${hootId}`, 'PUT', hootData);
}

export async function deleteHoot(hootId) {
  return sendRequest(`${BASE_URL}/${hootId}`, 'DELETE');
}