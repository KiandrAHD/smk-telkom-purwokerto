// QA only: this module is aliased exclusively by uji-spmb-ui-server.mjs.
// It never connects to Supabase or sends an application to the school.
import { preparePpdbSubmission } from '../../src/utils/ppdbSubmission.js';
export const DUPLICATE_SUBMISSION_MESSAGE = 'Anda sudah memiliki pendaftaran SPMB.';
export const ppdbCombinedDocumentRules = { allowedTypes: ['application/pdf'], maxSize: 10485760 };
const request = async (action, body) => {
  const response = await fetch(`/__spmb-qa/${action}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) throw new Error('Simulated service error');
  return response.json();
};
export const getMyPpdb = () => request('submission');
export const getMyPpdbDraft = () => request('draft');
export const savePpdbDraft = (biodata, nilai) => request('draft', { biodata, nilai });
export const submitPpdb = ({ biodata, nilai, dokumen }) => {
  if (!dokumen || dokumen.type !== 'application/pdf' || dokumen.size > ppdbCombinedDocumentRules.maxSize) throw new Error('Invalid PDF');
  return request('submission', preparePpdbSubmission(biodata, nilai));
};
export const signOutPpdb = async () => {};
export const signUpPpdb = async () => {};
export const signInPpdb = async () => {};
