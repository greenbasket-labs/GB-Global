import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function Work(){
  const u=await getSessionUser();
  if(!u)redirect('/login');
  const p=await prisma.partnerProfile.findUnique({where:{userId:u.id},include:{work:{include:{milestones:{include:{project:{include:{organization:true}}},orderBy:{sequence:'asc'}}},orderBy:{updatedAt:'desc'}}}});
  if(!p||p.status!=='APPROVED')redirect('/partner/apply');
  const milestoneIds=p.work.flatMap(w=>w.milestones.map(m=>m.id));
  const reviews=milestoneIds.length?await prisma.auditLog.findMany({where:{entity:'Milestone',action:'MILESTONE_REVIEWED',entityId:{in:milestoneIds}},orderBy:{createdAt:'desc'}}):[];
  const reviewFor=(id:string)=>reviews.find(r=>r.entityId===id);
  return <main className="dashboard">
    <div className="pill">Partner • Work</div>
    <div className="dashnav"><Link href="/partner">Overview</Link><Link href="/partner/profile">Profile</Link><Link href="/partner/clients">Clients</Link><Link href="/partner/work">Work</Link></div>
    <h1>Your work.</h1>
    <p className="muted">Receive assignments from Green Basket, complete the milestone, submit proof, and respond to review feedback.</p>
    <div className="stack">
      {p.work.length?p.work.map(w=><div className="card" key={w.id}>
        <div className="row"><div><h2>{w.title}</h2><p className="muted">{w.description||'No description.'}</p></div><span className="badge">{w.status}</span></div>
        <div className="stack">
          {w.milestones.map(m=>{const review=reviewFor(m.id);const meta=(review?.metadata||{}) as Record<string,unknown>;return <div className="card milestone-card" key={m.id}>
            <div className="row"><div><strong>{m.sequence}. {m.title}</strong><p className="muted">{m.project.organization.name} · {m.status}</p><p>{m.description||'No milestone description.'}</p></div><span className="badge">{m.status}</span></div>
            {m.status==='AVAILABLE'&&<form action="/api/partner/milestones" method="post"><input type="hidden" name="action" value="start"/><input type="hidden" name="milestoneId" value={m.id}/><button className="btn" type="submit">Start milestone</button></form>}
            {m.status==='REJECTED'&&<div className="proof-card"><strong>Changes requested</strong>{typeof meta.reviewNote==='string'&&meta.reviewNote&&<p>{meta.reviewNote}</p>}<form action="/api/partner/milestones" method="post"><input type="hidden" name="action" value="start"/><input type="hidden" name="milestoneId" value={m.id}/><button className="btn" type="submit">Work on changes</button></form></div>}
            {m.status==='IN_PROGRESS'&&<form className="stack" action="/api/partner/milestones" method="post"><label>Proof link<input name="proofUrl" type="url" placeholder="https://..."/></label><label>Proof note<textarea name="proofNote" rows={4} placeholder="Explain what was completed and what the proof shows."/></label><button className="btn" type="submit">Submit proof for review</button><input type="hidden" name="action" value="submit"/><input type="hidden" name="milestoneId" value={m.id}/></form>}
            {m.status==='SUBMITTED'&&<div className="proof-card"><strong>Awaiting Green Basket review</strong><p className="muted">Your proof has been submitted. You can continue only after review.</p>{m.proofUrl&&<p><a href={m.proofUrl} target="_blank" rel="noreferrer">Open submitted proof →</a></p>}</div>}
            {m.status==='APPROVED'&&<div className="proof-card"><strong>✓ Proof approved</strong>{typeof meta.reviewNote==='string'&&meta.reviewNote&&<p>{meta.reviewNote}</p>}</div>}
            {m.status==='COMPLETED'&&<div className="proof-card"><strong>✓ Milestone completed</strong></div>}
          </div>})}
        </div>
      </div>):<div className="card"><p className="muted">No work assigned yet.</p></div>}
    </div>
  </main>
}
