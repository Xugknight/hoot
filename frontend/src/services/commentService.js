import sendRequest from "./sendRequest";

const HOOT_BASE = '/api/hoots';

export async function getCommentsByHoot(hootId) {
  return sendRequest(`${HOOT_BASE}/${hootId}/comments`);
}

export function createComment(hootId, commentData) {
  return sendRequest(`${HOOT_BASE}/${hootId}/comments`, 'POST', commentData);
};

export function updateComment(hootId, commentId, commentData) {
  return sendRequest(
    `${HOOT_BASE}/${hootId}/comments/${commentId}`,
    'PUT',
    commentData
  );
};

export function deleteComment(hootId, commentId) {
  return sendRequest(`${HOOT_BASE}/${hootId}/comments/${commentId}`, 'DELETE');
};