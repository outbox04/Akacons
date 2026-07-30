'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Brush, Eraser, ImagePlus, RotateCcw } from 'lucide-react';

export interface MaskPayload {
  original: string;
  mask: string;
  fileName: string;
  hasMask: boolean;
}

export default function MaskEditor({ onChange }: { onChange: (payload: MaskPayload) => void }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef('');
  const fileNameRef = useRef('');
  const drawing = useRef(false);
  const maskExists = useRef(false);
  const lastPoint = useRef<{x:number;y:number}|null>(null);
  const [tool,setTool]=useState<'brush'|'eraser'>('brush');
  const [size,setSize]=useState(42);
  const [loaded,setLoaded]=useState(false);
  const [hasMask,setHasMask]=useState(false);
  const [aspect,setAspect]=useState('16 / 10');

  const loadFile=(file?:File)=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      const raw=String(reader.result);
      const image=new window.Image();
      image.onload=()=>{
        const max=1400;
        const scale=Math.min(1,max/Math.max(image.naturalWidth,image.naturalHeight));
        const width=Math.round(image.naturalWidth*scale),height=Math.round(image.naturalHeight*scale);
        const source=document.createElement('canvas');source.width=width;source.height=height;
        source.getContext('2d')!.drawImage(image,0,0,width,height);
        const normalized=source.toDataURL('image/jpeg',.86);
        originalRef.current=normalized;fileNameRef.current=file.name;
        const canvas=canvasRef.current!;canvas.width=width;canvas.height=height;
        canvas.getContext('2d')!.clearRect(0,0,width,height);
        setAspect(`${width} / ${height}`);setLoaded(true);setHasMask(false);maskExists.current=false;
        onChange({original:normalized,mask:canvas.toDataURL('image/png'),fileName:file.name,hasMask:false});
      };
      image.src=raw;
    };
    reader.readAsDataURL(file);
  };
  const point=(event:React.PointerEvent<HTMLCanvasElement>)=>{const canvas=canvasRef.current!,rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height}};
  const start=(event:React.PointerEvent<HTMLCanvasElement>)=>{if(!loaded)return;drawing.current=true;lastPoint.current=point(event);event.currentTarget.setPointerCapture(event.pointerId);draw(event)};
  const draw=(event:React.PointerEvent<HTMLCanvasElement>)=>{if(!drawing.current)return;const canvas=canvasRef.current!,ctx=canvas.getContext('2d')!,next=point(event),prev=lastPoint.current||next;ctx.save();ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';ctx.strokeStyle='rgba(0, 219, 210, .72)';ctx.lineWidth=size*(canvas.width/canvas.getBoundingClientRect().width);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(next.x,next.y);ctx.stroke();ctx.restore();lastPoint.current=next;if(tool==='brush'){maskExists.current=true;setHasMask(true)}};
  const stop=()=>{if(!drawing.current)return;drawing.current=false;lastPoint.current=null;emit()};
  const emit=()=>{const canvas=canvasRef.current!;onChange({original:originalRef.current,mask:canvas.toDataURL('image/png'),fileName:fileNameRef.current,hasMask:maskExists.current})};
  const clear=()=>{const canvas=canvasRef.current!,ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,canvas.width,canvas.height);maskExists.current=false;setHasMask(false);onChange({original:originalRef.current,mask:canvas.toDataURL('image/png'),fileName:fileNameRef.current,hasMask:false})};

  return <div className="mask-editor">
    <div className="mask-toolbar">
      <label className="mask-upload"><ImagePlus size={16}/> {loaded?'Đổi ảnh':'Tải ảnh hiện trạng'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>loadFile(e.target.files?.[0])}/></label>
      <button className={tool==='brush'?'active':''} onClick={()=>setTool('brush')}><Brush size={16}/> Bút khoanh vùng</button>
      <button className={tool==='eraser'?'active':''} onClick={()=>setTool('eraser')}><Eraser size={16}/> Tẩy mask</button>
      <label className="brush-size">Nét bút <input type="range" min="10" max="100" value={size} onChange={e=>setSize(Number(e.target.value))}/><b>{size}px</b></label>
      <button onClick={clear} disabled={!loaded}><RotateCcw size={15}/> Xóa mask</button>
    </div>
    <div className={`mask-stage ${loaded?'loaded':''}`} style={loaded?{aspectRatio:aspect}:undefined}>
      {!loaded&&<div><ImagePlus size={36}/><strong>Tải ảnh hiện trạng để bắt đầu</strong><small>Sau đó dùng bút tô chính xác vùng tường cần thay sơn</small></div>}
      {loaded&&<Image ref={imageRef} src={originalRef.current} alt="Ảnh hiện trạng" fill unoptimized draggable={false}/>}
      <canvas ref={canvasRef} onPointerDown={start} onPointerMove={draw} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop}/>
    </div>
    {loaded&&<p className="mask-help"><i/> Vùng màu teal là vùng duy nhất AI được phép thay đổi. Dùng Tẩy mask để chỉnh lại mép vùng chọn.</p>}
  </div>;
}
