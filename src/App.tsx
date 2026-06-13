import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Square, RotateCcw, Settings, BarChart2, Coffee, X } from 'lucide-react';

interface Session { type:'work'|'break'; duration:number; completed:number; date:string; }
const SAVE='fb_sessions_v1';
const loadS=():Session[]=>{try{return JSON.parse(localStorage.getItem(SAVE)||'[]')}catch{return[]}};
const saveS=(s:Session[])=>localStorage.setItem(SAVE,JSON.stringify(s));
const fmt=(s:number)=>Math.floor(s/60).toString().padStart(2,'0')+':'+((s%60).toString().padStart(2,'0'));
const ac='#6366f1';

export default function App() {
  const [tab,setTab]=useState<'timer'|'stats'|'settings'>('timer');
  const [mode,setMode]=useState<'work'|'short'|'long'>('work');
  const [secs,setSecs]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState<Session[]>(loadS);
  const [workMin,setWorkMin]=useState(25);
  const [shortMin,setShortMin]=useState(5);
  const [longMin,setLongMin]=useState(15);
  const [count,setCount]=useState(0);
  const intervalRef=useRef<ReturnType<typeof setInterval>|null>(null);

  const durations:{[k:string]:number}={work:workMin*60,short:shortMin*60,long:longMin*60};

  useEffect(()=>{
    if(running){
      intervalRef.current=setInterval(()=>{
        setSecs(s=>{
          if(s<=1){
            setRunning(false);
            const session:Session={type:mode==='work'?'work':'break',duration:durations[mode],completed:Date.now(),date:new Date().toISOString().split('T')[0]};
            setSessions(prev=>{const u=[session,...prev.slice(0,99)];saveS(u);return u;});
            if(mode==='work')setCount(c=>c+1);
            return durations[mode];
          }
          return s-1;
        });
      },1000);
    }else if(intervalRef.current){clearInterval(intervalRef.current);}
    return()=>{if(intervalRef.current)clearInterval(intervalRef.current);};
  },[running,mode,workMin,shortMin,longMin]);

  const switchMode=(m:typeof mode)=>{setMode(m);setSecs(durations[m]);setRunning(false);};
  const reset=()=>{setSecs(durations[mode]);setRunning(false);};

  const todaySessions=sessions.filter(s=>s.date===new Date().toISOString().split('T')[0]);
  const todayWork=todaySessions.filter(s=>s.type==='work').length;
  const totalMins=todaySessions.filter(s=>s.type==='work').reduce((sum,s)=>sum+s.duration/60,0);
  const pct=(1-secs/durations[mode])*100;
  const modeColors:{[k:string]:string}={work:ac,short:'#10b981',long:'#06b6d4'};
  const modeColor=modeColors[mode];
  const r=80; const circ=2*Math.PI*r;

  return(
    <div style={{minHeight:'100vh',background:'#080810',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'14px 20px',borderBottom:'1px solid #1e1b4b',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'9px',background:`linear-gradient(135deg,${ac},#4f46e5)`,display:'flex',alignItems:'center',justifyContent:'center'}}><Timer size={15} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'15px',color:'white',lineHeight:1}}>FocusBlock</div>
          <div style={{fontSize:'10px',color:'#312e81',marginTop:'2px'}}>{todayWork} sessions · {Math.round(totalMins)}m today</div></div>
        </div>
        <div style={{display:'flex',gap:'3px'}}>
          {(['timer','stats','settings'] as const).map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'5px 10px',borderRadius:'7px',background:tab===t?ac+'20':'none',border:`1px solid ${tab===t?ac:'transparent'}`,color:tab===t?'#a5b4fc':'#312e81',fontSize:'11px',cursor:'pointer',fontFamily:'Inter',textTransform:'capitalize'}}>{t}</button>)}
        </div>
      </header>

      {tab==='timer'&&(
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px'}}>
          <div style={{display:'flex',gap:'8px',marginBottom:'36px'}}>
            {[['work','Work'],['short','Short break'],['long','Long break']].map(([k,l])=>(
              <button key={k} onClick={()=>switchMode(k as any)} style={{padding:'6px 14px',borderRadius:'20px',border:`1px solid ${mode===k?modeColors[k]:'#1e1b4b'}`,background:mode===k?modeColors[k]+'18':'transparent',color:mode===k?modeColors[k]:'#312e81',fontSize:'12px',cursor:'pointer',fontFamily:'Inter',whiteSpace:'nowrap'}}>{l}</button>
            ))}
          </div>
          {/* SVG circular timer */}
          <div style={{position:'relative',width:'220px',height:'220px',marginBottom:'36px'}}>
            <svg width="220" height="220" style={{transform:'rotate(-90deg)'}}>
              <circle cx="110" cy="110" r={r} fill="none" stroke="#1e1b4b" strokeWidth="8"/>
              <circle cx="110" cy="110" r={r} fill="none" stroke={modeColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ} style={{transition:'stroke-dashoffset 1s linear,stroke 0.3s'}}/>
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontSize:'48px',fontWeight:'700',color:'white',fontFamily:'monospace',letterSpacing:'2px'}}>{fmt(secs)}</div>
              <div style={{fontSize:'13px',color:modeColor,fontWeight:'500',marginTop:'4px',textTransform:'capitalize'}}>{mode==='short'?'Short Break':mode==='long'?'Long Break':'Focus'}</div>
              {count>0&&<div style={{fontSize:'11px',color:'#312e81',marginTop:'3px'}}>Session {count+1}</div>}
            </div>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            <button onClick={reset} style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1e1b4b',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#a5b4fc',transition:'all 0.2s'}}><RotateCcw size={18}/></button>
            <button onClick={()=>setRunning(!running)} style={{width:'80px',height:'80px',borderRadius:'50%',background:modeColor,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:`0 8px 28px ${modeColor}45`,transition:'all 0.2s'}}>
              {running?<Square size={28} color="white" fill="white"/>:<Play size={28} color="white" fill="white"/>}
            </button>
            <button onClick={()=>switchMode(mode==='work'?'short':'work')} style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1e1b4b',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#a5b4fc'}}><Coffee size={18}/></button>
          </div>
        </div>
      )}

      {tab==='stats'&&(
        <div style={{flex:1,overflow:'auto',padding:'20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'16px'}}>
            {[{l:'Today sessions',v:String(todayWork),c:ac},{l:'Today focus',v:Math.round(totalMins)+'m',c:'#a5b4fc'},{l:'Total sessions',v:String(sessions.filter(s=>s.type==='work').length),c:'#6366f1'},{l:'Streak',v:count+' 🔥',c:'#f59e0b'}].map(s=>(
              <div key={s.l} style={{background:'#0e0c1f',border:'1px solid #1e1b4b',borderRadius:'12px',padding:'14px',textAlign:'center'}}>
                <div style={{fontSize:'22px',fontWeight:'700',color:s.c}}>{s.v}</div>
                <div style={{fontSize:'11px',color:'#312e81',marginTop:'4px'}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#0e0c1f',border:'1px solid #1e1b4b',borderRadius:'12px',padding:'16px'}}>
            <div style={{fontSize:'12px',color:'#312e81',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'12px'}}>Recent sessions</div>
            {sessions.slice(0,10).map((s,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1e1b4b20'}}>
                <span style={{fontSize:'13px',color:s.type==='work'?'#a5b4fc':'#34d399',textTransform:'capitalize'}}>{s.type==='work'?'Focus':'Break'}</span>
                <span style={{fontSize:'12px',color:'#312e81'}}>{s.duration/60}m · {s.date}</span>
              </div>
            ))}
            {sessions.length===0&&<p style={{color:'#312e81',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>Complete sessions to see stats</p>}
          </div>
        </div>
      )}

      {tab==='settings'&&(
        <div style={{flex:1,overflow:'auto',padding:'20px'}}>
          <div style={{maxWidth:'400px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'14px'}}>
            {[{l:'Work duration (min)',v:workMin,set:setWorkMin,min:5,max:90},{l:'Short break (min)',v:shortMin,set:setShortMin,min:1,max:15},{l:'Long break (min)',v:longMin,set:setLongMin,min:5,max:30}].map(({l,v,set,min,max})=>(
              <div key={l} style={{background:'#0e0c1f',border:'1px solid #1e1b4b',borderRadius:'12px',padding:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                  <span style={{fontSize:'13px',color:'#a5b4fc',fontWeight:'500'}}>{l}</span>
                  <span style={{fontSize:'14px',fontWeight:'700',color:'white'}}>{v}</span>
                </div>
                <input type="range" min={min} max={max} value={v} onChange={e=>set(+e.target.value)} style={{width:'100%',accentColor:ac}}/>
              </div>
            ))}
            <button onClick={()=>{if(window.confirm('Clear all sessions?')){setSessions([]);saveS([]);}}} style={{padding:'12px',borderRadius:'10px',background:'#ef444415',border:'1px solid #ef444430',color:'#f87171',fontSize:'13px',cursor:'pointer',fontFamily:'Inter'}}>Clear session history</button>
          </div>
        </div>
      )}
    </div>
  );
}
