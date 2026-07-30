'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { History, ImagePlus, LoaderCircle, Sparkles } from 'lucide-react';
import ToolLayout from '@/components/tool-layout';
import paints from '@/lib/data/generated-paints.json';
import { readUsageHistory, saveUsageRecord, UsageRecord } from '@/lib/usage-history';

function AIPage() {
  const [employeeCode,setEmployeeCode]=useState(''),[activeEmployee,setActiveEmployee]=useState('');
  const [paintCode,setPaintCode]=useState('XT-01'),[preview,setPreview]=useState(''),[fileName,setFileName]=useState('');
  const [prompt,setPrompt]=useState(''),[loading,setLoading]=useState(false),[result,setResult]=useState(''),[error,setError]=useState('');
  const [history,setHistory]=useState<UsageRecord[]>([]);
  const paint=useMemo(()=>paints.find(p=>p.code===paintCode) || paints[0],[paintCode]);
  useEffect(()=>{if(activeEmployee)setHistory(readUsageHistory('render',activeEmployee))},[activeEmployee]);
  const chooseEmployee=()=>{const code=employeeCode.trim().toUpperCase();if(code){setActiveEmployee(code);localStorage.setItem('akacons_employee_code',code)}};
  const upload=(file?:File)=>{if(!file)return;setFileName(file.name);const reader=new FileReader();reader.onload=()=>setPreview(String(reader.result));reader.readAsDataURL(file)};
  const render=async()=>{if(!activeEmployee||!preview)return;setLoading(true);setError('');
    try{const response=await fetch('/api/render/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectImageId:'00000000-0000-0000-0000-000000000001',effectSystemId:paint.categoryId,colorId:paint.code,maskBase64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='})});const data=await response.json();if(!response.ok||!data.success)throw new Error(data.error||'Không thể tạo ảnh');const url=data.data.renderedImageUrl;setResult(url);saveUsageRecord({kind:'render',employeeCode:activeEmployee,title:`Render ${paint.code}`,status:'completed',details:{paintCode:paint.code,effect:paint.category,sourceFile:fileName,note:prompt||'Không có ghi chú'},resultImage:url});setHistory(readUsageHistory('render',activeEmployee))}
    catch(e){const message=e instanceof Error?e.message:'Render thất bại';setError(message);saveUsageRecord({kind:'render',employeeCode:activeEmployee,title:`Render ${paint.code}`,status:'failed',details:{paintCode:paint.code,sourceFile:fileName,error:message}});setHistory(readUsageHistory('render',activeEmployee))}finally{setLoading(false)}};
  return <ToolLayout label="AKACONS AI VISUALIZER" title="Thử sơn bằng AI" description="Tải ảnh không gian, chọn mã sơn và tạo phương án hình ảnh. Mỗi lần sử dụng được lưu theo mã nhân viên.">
    <div className="tool-shell"><div>
      <section className="tool-card employee-gate"><h2>Mã nhân viên</h2><p className="subtitle">Nhập mã để mở công cụ và xem đúng lịch sử của bạn.</p><div className="employee-row"><input value={employeeCode} onChange={e=>setEmployeeCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&chooseEmployee()} placeholder="Ví dụ: AKA-001"/><button onClick={chooseEmployee}>Xác nhận</button></div>{activeEmployee&&<small>Đang sử dụng: <b>{activeEmployee}</b></small>}</section>
      <section className="tool-card"><h2>Tạo phối cảnh mới</h2><p className="subtitle">Ảnh rõ, đủ sáng và nhìn thẳng bề mặt sẽ cho kết quả tốt hơn.</p><label className="upload-zone">{preview?<Image src={preview} alt="Ảnh không gian" fill unoptimized/>:<div><ImagePlus/><strong>Tải ảnh không gian</strong><small>JPG, PNG hoặc WEBP</small></div>}<input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0])}/></label><div className="tool-fields" style={{marginTop:18}}><div className="tool-field"><label>Mã sơn</label><select value={paintCode} onChange={e=>setPaintCode(e.target.value)}>{paints.map(p=><option key={p.code} value={p.code}>{p.code} · {p.name}</option>)}</select></div><div className="tool-field"><label>Ghi chú cho AI</label><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ví dụ: giữ nguyên đồ nội thất"/></div></div><div className="selected-paint"><span><Image src={paint.image} alt={paint.code} fill/></span><div><b>{paint.code} · {paint.name}</b><small>{paint.category}</small></div></div><button className="tool-action" disabled={!activeEmployee||!preview||loading} onClick={render}>{loading?<LoaderCircle className="animate-spin"/>:<Sparkles/>}{loading?'Đang tạo hình ảnh...':'Tạo ảnh bằng AI'}</button>{error&&<div className="error-message">{error}</div>}{result&&<div className="result-image"><Image src={result} alt="Kết quả AI" fill unoptimized/></div>}</section>
    </div><HistoryPanel title="Lịch sử render" records={history}/></div>
  </ToolLayout>;
}

export { default } from '@/components/ai-workspace';

function HistoryPanel({title,records}:{title:string;records:UsageRecord[]}){return <aside className="tool-card history-card"><h2><History size={18}/> {title}</h2><p className="subtitle">Theo mã nhân viên đang sử dụng.</p><div className="history-list">{records.length?records.map(r=><article className="history-item" key={r.id}><div><strong>{r.title}</strong><time>{new Date(r.createdAt).toLocaleString('vi-VN')}</time></div><p>{r.details.sourceFile} · {r.details.effect||r.details.error}<br/>Trạng thái: {r.status==='completed'?'Hoàn thành':'Thất bại'}</p></article>):<div className="history-empty">Chưa có lần render nào.</div>}</div></aside>}
