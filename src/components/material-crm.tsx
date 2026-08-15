'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { FolderUp, Plus, Save, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import './material-crm.css';

type Draft = {
  code: string;
  name: string;
  productType: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  detailedDescription: string;
  seoTitle: string;
  seoDescription: string;
  files: File[];
};

const DEFAULT_CATEGORIES: Record<string, string[]> = {
  'Lớp phủ hiệu ứng': ['Vữa Hiệu Ứng Stucco', 'Sơn hiệu ứng bê tông', 'Sơn hiệu ứng gỉ sét', 'Sơn hiệu ứng ngọc trai', 'Sơn Tự Hiệu Ứng', 'Sơn Vô Cơ', 'Sơn vôi'],
  'Sơn đá': ['Sơn đá tự nhiên', 'Sơn Đá Hoa Cương', 'Sơn đá bàn bả'],
};

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;
const codePattern = /^[a-z]{1,8}[\s_-]*\d{1,6}$/i;
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fileLabel = (file: File) => file.name.replace(/\.[^.]+$/, '');

function foldersToDrafts(files: File[]): Draft[] {
  const groups = new Map<string, File[]>();
  files.filter(file => imagePattern.test(file.name)).forEach(file => {
    const parts = (file.webkitRelativePath || file.name).split('/').filter(Boolean);
    const code = [...parts].reverse().slice(1).find(part => codePattern.test(part)) || (parts.length > 1 ? parts[parts.length - 2] : fileLabel(file));
    groups.set(code, [...(groups.get(code) || []), file]);
  });
  return [...groups.entries()].map(([code, groupFiles]) => ({
    code: code.toUpperCase(), name: '', productType: 'Lớp phủ hiệu ứng', category: DEFAULT_CATEGORIES['Lớp phủ hiệu ứng'][0], subcategory: '',
    shortDescription: '', detailedDescription: '', seoTitle: '', seoDescription: '', files: groupFiles,
  }));
}

export default function MaterialCrm() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newType, setNewType] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState('Lớp phủ hiệu ứng');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const totalImages = useMemo(() => drafts.reduce((sum, item) => sum + item.files.length, 0), [drafts]);
  const update = (index: number, patch: Partial<Draft>) => setDrafts(current => current.map((item, i) => i === index ? { ...item, ...patch } : item));

  const chooseFolder = (event: ChangeEvent<HTMLInputElement>) => {
    const next = foldersToDrafts(Array.from(event.target.files || []));
    if (!next.length) {
      setStatus('Không tìm thấy ảnh hợp lệ trong thư mục.');
      event.target.value = '';
      return;
    }
    setDrafts(current => {
      const merged = [...current];
      next.forEach(incoming => {
        const existingIndex = merged.findIndex(item => item.code.toLocaleLowerCase('vi') === incoming.code.toLocaleLowerCase('vi'));
        if (existingIndex < 0) {
          merged.push(incoming);
          return;
        }
        const existing = merged[existingIndex];
        const knownFiles = new Set(existing.files.map(file => `${file.webkitRelativePath || file.name}:${file.size}:${file.lastModified}`));
        const additionalFiles = incoming.files.filter(file => !knownFiles.has(`${file.webkitRelativePath || file.name}:${file.size}:${file.lastModified}`));
        merged[existingIndex] = { ...existing, files: [...existing.files, ...additionalFiles] };
      });
      return merged;
    });
    setStatus(`Đã thêm ${next.length} mã từ thư mục vừa chọn. Bạn có thể tiếp tục chọn thêm thư mục khác.`);
    event.target.value = '';
  };

  const addType = () => {
    const value = newType.trim();
    if (!value || categories[value]) return;
    setCategories(current => ({ ...current, [value]: [] }));
    setCategoryType(value); setNewType('');
  };
  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    setCategories(current => ({ ...current, [categoryType]: [...new Set([...(current[categoryType] || []), value])] }));
    setNewCategory('');
  };

  const save = async () => {
    const invalid = drafts.find(item => !item.code.trim() || !item.name.trim() || !item.productType || !item.category);
    if (!drafts.length) return setStatus('Hãy chọn một thư mục trước.');
    if (invalid) return setStatus(`Mã ${invalid.code || '(trống)'} chưa có đủ tên và danh mục.`);
    setSaving(true); setStatus('Đang tải ảnh lên Supabase Storage…');
    try {
      const supabase = createClient();
      const items = [];
      for (const draft of drafts) {
        const colors = [];
        for (const file of draft.files) {
          const path = `${slugify(draft.productType)}/${slugify(draft.code)}/${crypto.randomUUID()}-${slugify(file.name) || 'mau'}`;
          const { error } = await supabase.storage.from('material-assets').upload(path, file, { cacheControl: '31536000', upsert: false });
          if (error) throw error;
          const { data } = supabase.storage.from('material-assets').getPublicUrl(path);
          colors.push({ code: fileLabel(file), name: fileLabel(file), imageUrl: data.publicUrl, storagePath: path });
        }
        items.push({ ...draft, files: undefined, displayName: `${draft.name.trim()} ${draft.code.trim().toUpperCase()}`, colors });
      }
      setStatus('Đang lưu dữ liệu sản phẩm…');
      const response = await fetch('/api/admin/materials/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể lưu sản phẩm');
      setStatus(`Đã lưu thành công ${result.count} sản phẩm lên Supabase.`);
      setDrafts([]);
    } catch (error) {
      setStatus(`Lỗi: ${error instanceof Error ? error.message : 'Không thể tải dữ liệu'}. Hãy chạy migration SQL và kiểm tra đăng nhập quản trị.`);
    } finally { setSaving(false); }
  };

  return <div className="material-crm">
    <section className="crm-intro">
      <div><small>CRM VẬT LIỆU</small><h1>Nhập thư viện sản phẩm</h1><p>Upload một mã hoặc toàn bộ thư mục sản phẩm. Hệ thống tự nhận mã từ tên thư mục và màu từ tên từng ảnh.</p></div>
      <label className="folder-upload"><FolderUp/><strong>Upload nhiều thư mục</strong><span>Chọn lần lượt các thư mục; dữ liệu sẽ được cộng dồn</span><input type="file" accept="image/*" multiple onChange={chooseFolder} {...({ webkitdirectory: '', directory: '' } as Record<string, string>)} /></label>
    </section>

    <section className="taxonomy-panel">
      <div><label>Thêm nhóm sản phẩm</label><div><input value={newType} onChange={e => setNewType(e.target.value)} placeholder="Ví dụ: Vật liệu xây dựng"/><button onClick={addType}><Plus/> Thêm</button></div></div>
      <div><label>Thêm danh mục</label><div><select value={categoryType} onChange={e => setCategoryType(e.target.value)}>{Object.keys(categories).map(type => <option key={type}>{type}</option>)}</select><input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Tên danh mục mới"/><button onClick={addCategory}><Plus/> Thêm</button></div></div>
    </section>

    <div className="crm-summary"><strong>{drafts.length} sản phẩm</strong><span>{totalImages} ảnh màu</span><span>Tên hiển thị được ghép tự động: Tên + Mã thư mục</span></div>
    <section className="draft-list">
      {!drafts.length && <div className="crm-empty"><FolderUp/><h2>Chưa có dữ liệu thư mục</h2><p>Chọn thư mục XS-001 hoặc một thư mục tổng có nhiều thư mục mã con.</p></div>}
      {drafts.map((draft, index) => <article className="product-draft" key={`${draft.code}-${index}`}>
        <header><div><span>{draft.code}</span><h2>{draft.name ? `${draft.name} ${draft.code}` : `Sản phẩm ${draft.code}`}</h2></div><button aria-label="Xóa sản phẩm" onClick={() => setDrafts(current => current.filter((_, i) => i !== index))}><Trash2/></button></header>
        <div className="draft-fields">
          <label>Mã sản phẩm<input value={draft.code} onChange={e => update(index, { code: e.target.value.toUpperCase() })}/></label>
          <label>Tên sản phẩm<input value={draft.name} onChange={e => update(index, { name: e.target.value })} placeholder="Vữa hiệu ứng vân xước ngang"/></label>
          <label>Nhóm sản phẩm<select value={draft.productType} onChange={e => update(index, { productType: e.target.value, category: categories[e.target.value]?.[0] || '' })}>{Object.keys(categories).map(type => <option key={type}>{type}</option>)}</select></label>
          <label>Danh mục<select value={draft.category} onChange={e => update(index, { category: e.target.value })}>{(categories[draft.productType] || []).map(category => <option key={category}>{category}</option>)}</select></label>
          <label>Danh mục con / từ khóa SEO<input value={draft.subcategory} onChange={e => update(index, { subcategory: e.target.value })} placeholder="Ví dụ: vân xước ngang nội thất"/></label>
          <label>SEO title<input value={draft.seoTitle} onChange={e => update(index, { seoTitle: e.target.value })} placeholder={draft.name ? `${draft.name} ${draft.code} | AKACONS` : 'Tiêu đề tìm kiếm'}/></label>
          <label className="full">Mô tả ngắn<textarea rows={2} value={draft.shortDescription} onChange={e => update(index, { shortDescription: e.target.value })}/></label>
          <label className="full">Mô tả chi tiết sản phẩm<textarea rows={5} value={draft.detailedDescription} onChange={e => update(index, { detailedDescription: e.target.value })}/></label>
          <label className="full">SEO description<textarea rows={2} value={draft.seoDescription} onChange={e => update(index, { seoDescription: e.target.value })}/></label>
        </div>
        <div className="color-preview"><h3>Màu sắc từ tên ảnh <small>{draft.files.length} màu</small></h3><div>{draft.files.map((file, colorIndex) => <figure key={`${file.name}-${colorIndex}`}><img src={URL.createObjectURL(file)} alt={fileLabel(file)}/><figcaption>{fileLabel(file)}</figcaption></figure>)}</div></div>
      </article>)}
    </section>
    {!!drafts.length && <footer className="crm-save"><p className={status.startsWith('Lỗi') ? 'error' : ''}>{status}</p><button disabled={saving} onClick={save}><Save/>{saving ? 'Đang upload…' : `Lưu ${drafts.length} sản phẩm lên Supabase`}</button></footer>}
  </div>;
}
