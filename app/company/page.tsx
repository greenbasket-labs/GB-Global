import {redirect} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import LogoutButton from '@/components/logout-button';

const money=(kobo:number)=>`₦${(kobo/100).toLocaleString('en-NG',{maximumFractionDigits:0})}`;

export default async function Company(){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))redirect('/login');

  const now=new Date();
  const in30=new Date(now);
  in30.setDate(in30.getDate()+30);

  const [clients,services,approvedPartners,apps,tickets,activeProjects,partnerReferrals,renewals,assetRenewals,serviceCatalog,recentProjects,deadlineServices]=await Promise.all([
    prisma.organization.count(),
    prisma.service.count({where:{active:true}}),
    prisma.partnerProfile.count({where:{status:'APPROVED'}}),
    prisma.application.count(),
    prisma.supportTicket.count({where:{status:{in:['OPEN','IN_PROGRESS']}}}),
    prisma.project.count({where:{status:{in:['IN_PROGRESS','AWAITING_REVIEW']}}}),
    prisma.partnerClient.count(),
    prisma.clientService.count({where:{status:'ACTIVE',nextBillingDate:{not:null,lte:in30}}}),
    prisma.serviceAsset.count({where:{renewalDate:{not:null,lte:in30}}}),
    prisma.service.findMany({where:{active:true},orderBy:{createdAt:'asc'},take:10,select:{id:true,name:true,category:true}}),
    prisma.project.findMany({orderBy:{updatedAt:'desc'},take:4,include:{organization:{select:{name:true}},milestones:{orderBy:{sequence:'asc'},take:1,select:{status:true,title:true}}}}),
    prisma.clientService.findMany({where:{nextBillingDate:{not:null,lte:in30}},orderBy:{nextBillingDate:'asc'},take:4,include:{organization:{select:{name:true}},service:{select:{name:true}}}})
  ]);

  const attention=renewals+assetRenewals;
  const quickServices=serviceCatalog.slice(0,10);

  return <main className="company-shell">
    <aside className="company-sidebar">
      <Link href="/" className="company-logo">
        <Image src="/gb-logo.svg" alt="Green Basket" width={190} height={64} priority/>
      </Link>
      <div className="company-nav-label">CONTROL CENTER</div>
      <nav className="company-nav">
        <Link href="/company" className="active"><span>⌂</span> Dashboard</Link>
        <Link href="/company/projects"><span>▣</span> Projects</Link>
        <Link href="/company/clients"><span>♙</span> Clients</Link>
        <Link href="/company/services"><span>▤</span> Services</Link>
        <Link href="/company/partners"><span>♧</span> Partners</Link>
        <Link href="/company/invoices"><span>₦</span> Billing</Link>
        <Link href="/company/operations"><span>◫</span> Operations</Link>
        <Link href="/company/notifications"><span>◉</span> Attention <b>{attention}</b></Link>
        <Link href="/company/support"><span>?</span> Support <b>{tickets}</b></Link>
        <Link href="/company/control"><span>⚙</span> Control</Link>
      </nav>
      <div className="company-sidebar-card">
        <div className="sidebar-leaf">◆</div>
        <strong>People. Business.<br/>Solutions. Growth.</strong>
        <span>A brighter tomorrow.</span>
      </div>
    </aside>

    <section className="company-main">
      <header className="company-topbar">
        <div className="company-search">⌕ <span>Search services, projects, clients, or anything...</span></div>
        <div className="company-user">
          <span className="notification-dot">{tickets}</span>
          <div className="avatar">{u.name.slice(0,1).toUpperCase()}</div>
          <div><strong>{u.name}</strong><small>{u.role==='COMPANY_ADMIN'?'Company Admin':'Company Staff'}</small></div>
          <span>⌄</span>
        </div>
      </header>

      <div className="company-content">
        <section className="company-welcome">
          <div className="welcome-copy">
            <div className="eyebrow">GREEN BASKET CONTROL</div>
            <h1>Welcome back,<br/><span>{u.name}</span> 👋</h1>
            <p>Manage. Deliver. Grow. Together.</p>
            <div className="actions">
              <Link href="/company/projects" className="btn">Manage projects <span>→</span></Link>
              <Link href="/company/clients" className="btn alt">View clients</Link>
            </div>
          </div>
          <div className="welcome-brand">
            <Image src="/gb-logo.svg" alt="Green Basket" width={330} height={110} priority/>
            <div className="welcome-tagline">Your Business Partner<br/>for a Bigger Tomorrow</div>
            <div className="welcome-line"/>
          </div>
        </section>

        <section className="company-stats">
          <Link href="/company/projects" className="company-stat stat-green"><span className="stat-icon">▣</span><div><strong>{activeProjects}</strong><small>Active Projects</small><em>View all →</em></div></Link>
          <Link href="/company/clients" className="company-stat stat-blue"><span className="stat-icon">♙</span><div><strong>{clients}</strong><small>Total Clients</small><em>View all →</em></div></Link>
          <Link href="/company/partners" className="company-stat stat-purple"><span className="stat-icon">♧</span><div><strong>{partnerReferrals}</strong><small>Partner Referrals</small><em>View all →</em></div></Link>
          <Link href="/company/invoices" className="company-stat stat-orange"><span className="stat-icon">₦</span><div><strong>{services}</strong><small>Active Services</small><em>View details →</em></div></Link>
        </section>

        <section className="company-panel services-panel">
          <div className="panel-heading"><div><h2>Our Services</h2><p>Services currently available through Green Basket.</p></div><Link href="/company/services">View All Services →</Link></div>
          <div className="service-tiles">
            {quickServices.map((service,index)=><Link href="/company/services" key={service.id} className="service-tile"><span className={`service-tile-icon icon-${index%5}`}>{['▱','◎','▤','✉','▥'][index%5]}</span><strong>{service.name}</strong><small>{service.category.replace('_',' ')}</small></Link>)}
            {serviceCatalog.length>10&&<Link href="/company/services" className="service-tile more-tile"><span className="service-tile-icon">•••</span><strong>More Services</strong><small>View catalogue</small></Link>}
          </div>
        </section>

        <div className="company-lower-grid">
          <section className="company-panel activity-panel">
            <div className="panel-heading"><div><h2>Recent Activity</h2><p>Latest project movement.</p></div><Link href="/company/projects">View All →</Link></div>
            <div className="activity-list">
              {recentProjects.length===0&&<div className="empty-state">No projects yet. Start by creating or requesting a project.</div>}
              {recentProjects.map(project=><div className="activity-item" key={project.id}><span className="activity-icon">✓</span><div><strong>{project.title}</strong><small>{project.organization.name}{project.milestones[0]?` · ${project.milestones[0].title}`:''}</small></div><time>{project.status.replace('_',' ')}</time></div>)}
            </div>
          </section>

          <section className="company-panel deadline-panel">
            <div className="panel-heading"><div><h2>Upcoming Deadlines</h2><p>Billing items due within 30 days.</p></div><Link href="/company/notifications">View All →</Link></div>
            <div className="deadline-list">
              {deadlineServices.length===0&&<div className="empty-state">No upcoming client billing deadlines.</div>}
              {deadlineServices.map(item=><div className="deadline-item" key={item.id}><span className="deadline-icon">₦</span><div><strong>{item.service.name}</strong><small>{item.organization.name}</small></div><time>{item.nextBillingDate?item.nextBillingDate.toLocaleDateString('en-NG',{day:'2-digit',month:'short',year:'numeric'}):'—'}</time></div>)}
            </div>
          </section>
        </div>

        <section className="company-bottom-grid">
          <div className="company-promise">
            <div className="promise-copy"><div className="eyebrow">OUR PROMISE</div><h2>More possibilities<br/>for your business.</h2><p>Real solutions, trusted partners and quality services — managed from one place.</p></div>
            <div className="promise-list"><span>✓ Real Solutions</span><span>✓ Trusted Partners</span><span>✓ Quality Services</span><span>✓ Business Growth</span><span>✓ A Brighter Tomorrow</span></div>
          </div>
          <div className="company-quick-card"><Image src="/gb-logo.svg" alt="Green Basket" width={250} height={84}/><p>Turning ideas into<br/><strong>real business growth.</strong></p><Link href="/company/operations" className="btn">Open Operations →</Link></div>
        </section>

        <footer className="company-footer">© {new Date().getFullYear()} Green Basket Global Limited <span>•</span> All rights reserved.</footer>
      </div>
    </section>
  </main>;
}
