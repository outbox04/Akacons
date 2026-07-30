'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { History, LoaderCircle, Search, Sparkles } from 'lucide-react';
import ToolLayout from './tool-layout';
import MaskEditor, { MaskPayload } from './mask-editor';
import paints from '@/lib/data/generated-paints.json';
import { readUsageHistory, saveUsageRecord, UsageRecord } from '@/lib/usage-history';

const groups=[['all','Tất cả'],['be-tong','Bê tông'],['son-voi','Limewash'],['gi-set','Gỉ sét'],['ngoc-trai','Ngọc trai']];

export default function AIWorkspace(){
 const [employeeCode,setEmployeeCode]=useState(''),[employee,setEmployee]=useState(''),[source,setSource]=useState<MaskPayload|null>(null);
 const [paintCode,setPaintCode]=useState('XT-01'),[group,setGroup]=useState('all'),[query,setQuery]=useState(''),[description,setDescription]=useState('');
 const [loading,setLoading]=useState(false),[result,setResult]=useState(''),[error,setError]=useState(''),[history,setHistory]=useState<UsageRecord[]>([]);
 const paint=paints.find(p=>p.code===paintCode)||paints[0];
 const options=useMemo(()=>paints.filter(p=>(group==='all'||p.categoryId===group)&&(!query||`${p.code} ${p.name}`.toLowerCase().includes(query.toLowerCase()))),[group,query]);
 useEffect(()=>{const saved=localStorage.getItem('akacons_employee_code');if(saved){setEmployeeCode(saved);setEmployee(saved)}},[]);
 useEffect(()=>{if(employee)setHistory(readUsageHistory('render',employee))},[employee]);
 const activate=()=>{const code=employeeCode.trim().toUpperCase();if(code){setEmployee(code);localStorage.setItem('akacons_employee_code',code)}};
 const render=async()=>{if(!employee||!source?.original||!source.hasMask)return;setLoading(true);setError('');setResult('');
  try{const response=await fetch('/api/render/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({employeeCode:employee,originalImageBase64:source.original,selectionMaskBase64:source.mask,colorId:paint.code,promptAddon:description})});const data=await response.json();if(!response.ok||!data.success)throw new Error(data.error||'Không thể render');const url=data.data.renderedImageUrl;setResult(url);saveUsageRecord({kind:'render',employeeCode:employee,title:`Render ${paint.code}`,status:'completed',details:{paintCode:paint.code,effect:paint.category,sourceFile:source.fileName,note:description||'Không có mô tả',maskedPixelRatio:data.data.maskedPixelRatio||0},resultImage:url});setHistory(readUsageHistory('render',employee))}
  catch(e){const message=e instanceof Error?e.message:'Render thất bại';setError(message);saveUsageRecord({kind:'render',employeeCode:employee,title:`Render ${paint.code}`,status:'failed',details:{paintCode:paint.code,sourceFile:source.fileName,error:message}});setHistory(readUsageHistory('render',employee))}finally{setLoading(false)}};
 return <ToolLayout label="AKACONS AI · MASKED RENDER" title="AI phối màu theo vùng chọn" description="Ảnh gốc ngoài vùng mask được bảo toàn bằng bước composite pixel sau khi AI xử lý.">
  <div className="ai-layout">
   <section className="tool-card employee-gate ai-employee"><h2>Mã nhân viên</h2><div className="employee-row"><input value={employeeCode} onChange={e=>setEmployeeCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&activate()} placeholder="Ví dụ: AKA-001"/><button onClick={activate}>Xác nhận</button></div>{employee&&<small>Đang sử dụng: <b>{employee}</b></small>}</section>
   <div className="ai-main"><section className="tool-card canvas-card"><h2>1. Ảnh hiện trạng & vùng render</h2><p className="subtitle">Tô kín vùng cần thay đổi. Vùng không tô sẽ được giữ nguyên từ ảnh gốc.</p><MaskEditor onChange={setSource}/></section>
   <section className="tool-card ai-controls"><h2>2. Chọn hiệu ứng</h2><p className="subtitle">Chọn bằng ảnh mẫu thật và mã sơn.</p><div className="paint-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm mã sơn..."/></div><div className="paint-groups">{groups.map(([id,name])=><button className={group===id?'active':''} key={id} onClick={()=>setGroup(id)}>{name}</button>)}</div><div className="paint-picker">{options.slice(0,40).map(p=><button className={paintCode===p.code?'active':''} key={p.code} onClick={()=>setPaintCode(p.code)}><span><Image src={p.image} alt={`Mẫu ${p.code}`} fill/></span><b>{p.code}</b><small>{p.name}</small></button>)}</div><div className="chosen-paint"><span><Image src={paint.image} alt={paint.code} fill/></span><div><small>ĐANG CHỌN</small><b>{paint.code} · {paint.name}</b><p>{paint.category}</p></div></div><div className="tool-field"><label>3. Mô tả thêm</label><textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Ví dụ: bề mặt mờ, vân nhẹ, giữ nguyên cửa và đồ nội thất..."/></div><button className="tool-action" disabled={!employee||!source?.hasMask||loading} onClick={render}>{loading?<LoaderCircle className="animate-spin"/>:<Sparkles/>}{loading?'AI đang xử lý vùng chọn...':'Render vùng đã khoanh'}</button>{!source?.hasMask&&source?.original&&<div className="mask-warning">Hãy dùng bút tô vùng cần render trước.</div>}{error&&<div className="error-message">{error}</div>}</section></div>
   {result&&<section className="tool-card ai-result"><h2>Kết quả composite</h2><p className="subtitle">Ngoài vùng mask được lấy lại nguyên vẹn từ ảnh hiện trạng.</p><div><Image src={result} alt="Kết quả render AI" fill unoptimized/></div></section>}
   <RenderHistory records={history}/>
  </div>
 </ToolLayout>
}
function RenderHistory({records}:{records:UsageRecord[]}){return <aside className="tool-card ai-history"><h2><History size={18}/> Lịch sử render</h2><div className="history-list">{records.length?records.map(r=><article className="history-item" key={r.id}><div><strong>{r.title}</strong><time>{new Date(r.createdAt).toLocaleString('vi-VN')}</time></div><p>{r.details.sourceFile}<br/>{r.details.effect||r.details.error}</p>{r.resultImage&&<span className="history-thumb"><Image src={r.resultImage} alt="" fill unoptimized/></span>}</article>):<div className="history-empty">Chưa có lịch sử theo mã nhân viên này.</div>}</div></aside>}
