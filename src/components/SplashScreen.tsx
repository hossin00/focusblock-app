import { useEffect, useState } from 'react';
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t1=setTimeout(()=>setP(1),300);
    const t2=setTimeout(()=>setP(2),1100);
    const t3=setTimeout(()=>onDone(),2400);
    return ()=>[t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`radial-gradient(ellipse at 50% 15%, #35353d 0%, #080810 60%)`, opacity:p===2?0:1, transition:'opacity 0.5s ease' }}>
      <div style={{ transform:p>=1?'scale(1) translateY(0)':'scale(0.45) translateY(36px)', opacity:p>=1?1:0, transition:'all 0.7s cubic-bezier(0.34,1.56,0.64,1)', marginBottom:'22px' }}>
        <div style={{ width:'88px', height:'88px', borderRadius:'24px', background:`linear-gradient(145deg,#6366f1,#6366f1bb)`, boxShadow:`0 18px 56px #6366f155`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'38px' }}>
          ⏱️
        </div>
      </div>
      <div style={{ opacity:p>=1?1:0, transform:p>=1?'translateY(0)':'translateY(14px)', transition:'all 0.5s ease 0.15s', textAlign:'center', marginBottom:'44px' }}>
        <h1 style={{ fontFamily:'Inter', fontWeight:'700', fontSize:'29px', color:'white', marginBottom:'7px' }}>FocusBlock</h1>
        <p style={{ color:'#6366f185', fontSize:'14px' }}>Deep work starts here.</p>
      </div>
      <div style={{ opacity:p>=1?1:0, transition:'opacity 0.3s ease 0.4s', display:'flex', flexDirection:'column', gap:'9px', alignItems:'center' }}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:"12px",padding:"10px 16px",width:"252px"}}><span style={{fontSize:"20px"}}>⏱️</span><div><div style={{color:"white",fontSize:"13px",fontWeight:"500"}}>Pomodoro timer</div><div style={{color:"#6366f180",fontSize:"11px"}}>25/5 technique</div></div></div><div style={{display:"flex",alignItems:"center",gap:"12px",background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:"12px",padding:"10px 16px",width:"252px"}}><span style={{fontSize:"20px"}}>📊</span><div><div style={{color:"white",fontSize:"13px",fontWeight:"500"}}>Daily stats</div><div style={{color:"#6366f180",fontSize:"11px"}}>Focus streaks</div></div></div><div style={{display:"flex",alignItems:"center",gap:"12px",background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:"12px",padding:"10px 16px",width:"252px"}}><span style={{fontSize:"20px"}}>🔇</span><div><div style={{color:"white",fontSize:"13px",fontWeight:"500"}}>Focus mode</div><div style={{color:"#6366f180",fontSize:"11px"}}>Distraction-free</div></div></div>
      </div>
      <div style={{ position:'absolute', bottom:'56px', display:'flex', gap:'6px', opacity:p>=1?1:0 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#6366f1', animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
