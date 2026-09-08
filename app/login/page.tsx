"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function submit(e:React.FormEvent){
    e.preventDefault(); setError(''); setBusy(true);
    try{
      const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(!r.ok){setError(d.error||'Login failed');return}
      if(d.role==='COMPANY_ADMIN'||d.role==='COMPANY_STAFF') router.push('/company');
      else if(d.role==='PARTNER') router.push('/partner');
      else router.push('/client');
    }catch{setError('Unable to connect. Please try again.');}
    finally{setBusy(false);}
  }

  return <main className="page auth"><div className="pill">Green Basket portal</div><h1>Welcome back.</h1><p>Sign in to manage your services, work, and support.</p>{error&&<div className="error">{error}</div>}<form className="form" onSubmit={submit}><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label><label>Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label><button className="btn" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form></main>
}
