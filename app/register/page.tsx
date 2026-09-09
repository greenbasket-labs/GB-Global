"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Register(){
  const [f,setF]=useState({name:"",phone:"",email:"",password:""});
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function submit(e:React.FormEvent){
    e.preventDefault();setError('');setBusy(true);
    try{
      const r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});
      const d=await r.json();
      if(!r.ok){setError(d.error||'Registration failed');return}
      router.push('/client');
    }catch{setError('Unable to connect. Please try again.');}
    finally{setBusy(false);}
  }

  return <main className="page auth"><div className="pill">Get started</div><h1>Create your Green Basket account.</h1><p>Create your account and get started with Green Basket.</p>{error&&<div className="error">{error}</div>}<form className="form" onSubmit={submit}><label>Your name<input required minLength={2} value={f.name} onChange={e=>setF({...f,name:e.target.value})} autoComplete="name"/></label><label>Phone number<input required value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} autoComplete="tel" placeholder="090xxxxxxxx"/></label><label>Email<input required type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} autoComplete="email"/></label><label>Password<input required minLength={8} type="password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} autoComplete="new-password"/></label><button className="btn" disabled={busy}>{busy?'Creating account…':'Create account'}</button></form></main>;
}
