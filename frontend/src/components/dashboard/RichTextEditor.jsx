import { useEffect, useId, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import { richTextToPlain, sanitizeRichText, toEditorHtml } from '../../utils/richText';
import '../rich-content.css';

export default function RichTextEditor({ id, value = '', onChange, required = false, maxLength, disabled = false, 'aria-describedby': describedBy, 'aria-invalid': invalid, 'aria-label': ariaLabel = 'Editor teks' }) {
  const generatedId = useId();
  const editorId = id || generatedId;
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false } }), TextAlign.configure({ types: ['heading', 'paragraph'] }), TableKit],
    content: toEditorHtml(value),
    immediatelyRender: false,
    editable: !disabled,
    editorProps: { attributes: { id: editorId, role: 'textbox', 'aria-multiline': 'true', 'aria-required': String(required), 'aria-label': ariaLabel, ...(describedBy ? { 'aria-describedby': describedBy } : {}), class: 'rich-content' } },
    onUpdate: ({ editor: current }) => onChange?.({ target: { value: current.isEmpty ? '' : sanitizeRichText(current.getHTML()) } }),
  });
  const state = useEditorState({ editor, selector: ({ editor: current }) => current ? { bold: current.isActive('bold'), italic: current.isActive('italic'), underline: current.isActive('underline'), strike: current.isActive('strike'), bulletList: current.isActive('bulletList'), orderedList: current.isActive('orderedList'), blockquote: current.isActive('blockquote'), table: current.isActive('table'), undo: current.can().undo(), redo: current.can().redo(), heading: current.getAttributes('heading').level || 0, align: current.getAttributes('paragraph').textAlign || current.getAttributes('heading').textAlign || 'left' } : {} });
  useEffect(() => {
    if (editor && sanitizeRichText(toEditorHtml(value)) !== sanitizeRichText(editor.getHTML()) && !(value === '' && editor.isEmpty)) editor.commands.setContent(toEditorHtml(value), { emitUpdate: false });
  }, [editor, value]);
  useEffect(() => { editor?.setEditable(!disabled); }, [editor, disabled]);
  if (!editor) return <p className="text-sm text-dark-500">Memuat editor...</p>;
  const button = (label, action, active, unavailable = false) => <button key={label} type="button" title={label} aria-pressed={active} disabled={disabled || unavailable} onMouseDown={event => event.preventDefault()} onClick={action}>{label}</button>;
  const command = (name, ...args) => editor.chain().focus()[name](...args).run();
  const htmlLength = editor.isEmpty ? 0 : sanitizeRichText(editor.getHTML()).length;
  const tooLong = maxLength && htmlLength > maxLength;
  return <div className="rich-editor" aria-invalid={invalid || Boolean(tooLong)}>
    <div className="rich-editor-toolbar" role="group" aria-label="Format teks">
      <select aria-label="Gaya paragraf" disabled={disabled} value={state?.heading || 0} onChange={e => Number(e.target.value) ? command('toggleHeading', { level: Number(e.target.value) }) : command('setParagraph')}>
        <option value="0">Paragraf</option><option value="2">Heading 2</option><option value="3">Heading 3</option><option value="4">Heading 4</option>
      </select>
      {button('Bold', () => command('toggleBold'), state?.bold)}
      {button('Italic', () => command('toggleItalic'), state?.italic)}
      {button('Underline', () => command('toggleUnderline'), state?.underline)}
      {button('Coret', () => command('toggleStrike'), state?.strike)}
      {button('Daftar poin', () => command('toggleBulletList'), state?.bulletList)}
      {button('Daftar nomor', () => command('toggleOrderedList'), state?.orderedList)}
      {button('Kutipan', () => command('toggleBlockquote'), state?.blockquote)}
      <select aria-label="Perataan teks" disabled={disabled} value={state?.align || 'left'} onChange={e => command('setTextAlign', e.target.value)}>
        <option value="left">Rata kiri</option><option value="center">Tengah</option><option value="right">Rata kanan</option><option value="justify">Rata penuh</option>
      </select>
      {button('Tautan', () => { setLink(editor.getAttributes('link').href || ''); setLinkOpen(v => !v); setLinkError(''); }, editor.isActive('link'))}
      {button('Hapus tautan', () => command('unsetLink'), undefined, !editor.isActive('link'))}
      {button('Tabel', () => command('insertTable', { rows: 3, cols: 3, withHeaderRow: true }), undefined, state?.table)}
      {state?.table && <>{button('+ Baris', () => command('addRowAfter'))}{button('+ Kolom', () => command('addColumnAfter'))}{button('Hapus baris', () => command('deleteRow'))}{button('Hapus kolom', () => command('deleteColumn'))}{button('Hapus tabel', () => command('deleteTable'))}</>}
      {button('Garis pemisah', () => command('setHorizontalRule'))}
      {button('Hapus format', () => editor.chain().focus().unsetAllMarks().clearNodes().run())}
      {button('Undo', () => command('undo'), undefined, !state?.undo)}
      {button('Redo', () => command('redo'), undefined, !state?.redo)}
    </div>
    {linkOpen && <div className="flex flex-wrap items-center gap-2 border-b border-dark-200 p-3">
      <label className="text-xs" htmlFor={`${editorId}-link`}>URL tautan</label>
      <input id={`${editorId}-link`} type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://contoh.com" className="min-w-0 flex-1 rounded border border-dark-200 p-2 text-sm" />
      <button type="button" className="text-sm font-bold text-primary" onClick={() => {
        if (!/^(https?:\/\/|mailto:|tel:)/i.test(link.trim())) { setLinkError('Gunakan https://, http://, mailto:, atau tel:.'); return; }
        command('setLink', { href: link.trim() }); setLinkOpen(false);
      }}>Terapkan</button><button type="button" onClick={() => setLinkOpen(false)}>Batal</button>
      {linkError && <p role="alert" className="w-full text-xs text-red-700">{linkError}</p>}
    </div>}
    <EditorContent editor={editor} />
    <div className="rich-editor-footer">{richTextToPlain(editor.getHTML()).length} karakter teks · Ctrl+B: bold · Ctrl+I: italic · Ctrl+Z: undo{maxLength ? ` · ${htmlLength}/${maxLength} karakter tersimpan (termasuk format)` : ''}</div>
    {tooLong && <p role="alert" className="px-3 pb-2 text-xs text-red-700">Konten melebihi batas penyimpanan. Kurangi teks atau format.</p>}
    <input tabIndex={-1} aria-hidden="true" value={richTextToPlain(value).trim() ? 'valid' : ''} required={required} onChange={() => {}} className="sr-only" onInvalid={() => editor.commands.focus()} />
  </div>;
}
