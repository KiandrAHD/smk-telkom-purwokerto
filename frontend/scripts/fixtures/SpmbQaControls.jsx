export default function SpmbQaControls() {
  const inject = async (kind) => {
    const input = document.querySelector('input[type="file"]');
    if (!input) return;
    const bytes = kind === 'valid' ? await (await fetch('/__spmb-qa/pdf-fixture')).arrayBuffer() : kind === 'large' ? new Uint8Array(11 * 1048576) : 'Not a PDF';
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], kind === 'invalid' ? 'qa.txt' : 'qa.pdf', { type: kind === 'invalid' ? 'text/plain' : 'application/pdf' }));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
  return <div className="flex flex-wrap justify-center gap-3 bg-amber-50 text-xs print:hidden">
    <button type="button" onClick={() => void inject('valid')}>QA: PDF valid</button>
    <button type="button" onClick={() => void inject('large')}>QA: PDF 11 MB</button>
    <button type="button" onClick={() => void inject('invalid')}>QA: non-PDF</button>
    <button type="button" onClick={() => void fetch('/__spmb-qa/toggle-failure', { method: 'POST', body: '{}' })}>QA: toggle draft failure</button>
  </div>;
}

