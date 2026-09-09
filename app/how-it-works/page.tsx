import Link from "next/link";

const steps = [
  ["01", "Tell us", "Create your account, organization and service request."],
  ["02", "We organize", "Green Basket reviews the work and arranges the right solution or specialist."],
  ["03", "We deliver", "The requested work is carried out and kept organized through the platform."],
  ["04", "We manage", "Your ongoing services, applications and support stay organized in one place."],
];

export default function How() {
  return (
    <main>
      <section className="page page-hero"><div className="pill">How it works</div><h1>Start with what you need.</h1><p className="page-lead">A simple way to get digital work done without having to coordinate every specialist, provider and recurring service yourself.</p></section>
      <section className="section"><div className="grid process-grid">{steps.map(([number,title,description])=><div className="card process-card" key={number}><div className="service-number">{number}</div><h3>{title}</h3><p className="muted">{description}</p></div>)}</div></section>
      <section className="section"><div className="trust-card"><div className="pill">Keep it simple</div><div className="trust-content"><div><h2>You focus on your organization. We organize the digital work.</h2><p className="muted">From a single website to ongoing infrastructure and support, the process stays straightforward.</p></div><Link className="btn" href="/register">Get Started <span>→</span></Link></div></div></section>
    </main>
  );
}
