"use client";

import {useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';

export default function VerifyEmail(){
  const params=useSearchParams();
  const router=useRouter();
  const initial=params.get('email')||'';
  const [email]=useState(initial);
  const [code,setCode]=useState('');
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [resending,setResending]=useState(false);

  async function verify(e:React.FormEvent){
    e.preventDefault();setError('');setMessage('');setBusy(true);
    try{
      const r=await fetch('/api/auth/verify-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code})});
      const d=await r.json();
      if(!r.ok){setError(d.error||'Verification failed.');return;}
      router.push('/client/account');
    }catch{setError('Unable to connect. Please try again.');}
    finally{setBusy(false);}
  }

  async function resend(){
    setError('');setMessage('');setResending(true);
    try{
      const r=await fetch('/api/auth/resend-verification',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      const d=await r.json();
      if(!r.ok){setError(d.message||'Please try again later.');return;}
      setMessage(d.message||'If the account can be verified, a new code will be sent.');
    }catch{setError('Unable to connect. Please try again.');}
    finally{setResending(false);}
  }

  return <main className="page auth"><div className="pill">Email verification</div><h1>Verify your email.</h1><p>We sent a 6-digit verification code to <strong>{email||'your email address'}</strong>.</p>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<form className="form" onSubmit={verify}><label>Verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} autoComplete="one-time-code" placeholder="123456"/></label><button className="btn" disabled={busy}>{busy?'Verifying…':'Verify Email'}</button></form><button className="link-button" type="button" onClick={resend} disabled={resending}>{resending?'Sending…':'Resend code'}</button><p className="muted">Codes expire after 10 minutes. You can request another code after the cooldown period.</p></main>;
}
