'use client';

import Image from 'next/image';
import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import paints from '@/lib/data/generated-paints.json';

const categories = [['all','Tất cả'],['be-tong','Bê tông'],['son-voi','Sơn vôi Limewash'],['gi-set','Gỉ sét'],['ngoc-trai','Ngọc trai']] as const;

export default function PaintCatalogPage() {
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [limit,setLimit]=useState(24);
  const [selected,setSelected]=useState<(typeof paints)[number]|null>(null);
  const filtered=useMemo(()=>paints.filter(p=>(category==='all'||p.categoryId===category)&&(`${p.code} ${p.name}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))),[category,query]);
  return <>
    <section className="catalog-controls">
      <div className="catalog-tabs">{categories.map(([id,label])=><button className={category===id?'active':''} key={id} onClick={()=>{setCategory(id);setLimit(24)}}>{label}<sup>{id==='all'?paints.length:paints.filter(p=>p.categoryId===id).length}</sup></button>)}</div>
      <label><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm mã sơn, màu sắc..."/></label>
    </section>
    <section className="catalog-grid">{filtered.slice(0,limit).map(p=><button className="catalog-item" key={p.code} onClick={()=>setSelected(p)} data-reveal><span><Image src={p.image} alt={`${p.category} ${p.code}`} fill sizes="(max-width:600px) 50vw,25vw"/></span><div><small>{p.category}</small><strong>{p.name}</strong><b>{p.code}</b></div></button>)}</section>
    {limit<filtered.length&&<button className="catalog-more" onClick={()=>setLimit(limit+24)}>Xem thêm <ArrowRight size={17}/></button>}
    {selected&&<div className="catalog-modal" onClick={()=>setSelected(null)}><article onClick={e=>e.stopPropagation()}><button aria-label="Đóng" onClick={()=>setSelected(null)}><X/></button><span><Image src={selected.image} alt={selected.code} fill sizes="80vw"/></span><div><small>{selected.category}</small><h2>{selected.name}</h2><strong>{selected.code}</strong><p>Hình ảnh mẫu bề mặt thực tế. Liên hệ AKACONS để nhận mẫu và tư vấn phối màu phù hợp với không gian.</p></div></article></div>}
  </>;
}
