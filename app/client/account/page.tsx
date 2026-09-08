import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {getCurrentOrganization} from '@/lib/organization';

export default async function Account(){
  const u=await getSessionUser();
  if(!u)redirect('/login');
  if(u.role!=='CLIENT')redirect(u.role==='PARTNER'?'/partner':'/company');
  const current=await getCurrentOrganization(u);
  return <main className="dashboard"><div className="pill">Account</div><div className="dashnav"><Link href="/client">Overview</Link><Link href="/client/services">Services</Link><Link href="/client/applications">Applications</Link><Link href="/client/billing">Billing</Link><Link href="/client/support">Support</Link><Link href="/client/account">Account</Link></div><h1>Organization management.</h1><p className="muted">Manage your Green Basket organizations and choose which one you are working with.</p><div className="grid"><div className="card"><h2>Current organization</h2><h3>{current?.name||'None selected'}</h3><p className="muted">Owner: {current?.ownerId===u.id?'You':'Organization owner'}</p></div><div className="card"><h2>Create organization</h2><form className="form" action="/api/client/organization" method="post"><input type="hidden" name="action" value="create"/><label>Organization name<input required minLength={2} name="name" placeholder="e.g. ABC School"/></label><button className="btn">Create organization</button></form></div></div><section className="section"><h2>Your organizations</h2><div className="stack">{u.organizations.map((m:any)=><div className="card" key={m.organizationId}><div className="row"><div><h3>{m.organization.name}</h3><p className="muted">Role: {m.role}</p></div>{current?.id===m.organizationId?<span className="badge">Current</span>:<form action="/api/client/organization" method="post"><input type="hidden" name="action" value="switch"/><input type="hidden" name="organizationId" value={m.organizationId}/><button className="btn">Switch</button></form>}</div></div>)}</div></section></main>
}