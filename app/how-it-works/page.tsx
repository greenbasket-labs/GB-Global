import Link from "next/link";

const steps = [
  ["01", "Tell us", "Create your account, school organization and service request."],
  ["02", "We organize", "Green Basket reviews your school needs and prepares the right setup."],
  ["03", "We deliver", "The school management system is configured and brought into operation."],
  ["04", "We support", "Your school stays organized with ongoing digital support from Green Basket."],
];

export default function How() {
  return (
    <main>
      <section className="page page-hero"><div className="pill">How it works</div><h1>Bring your school into one place.</h1><p className="page-lead">A simple process for getting your school management system set up and supported without having to coordinate the technical work yourself.</p></section>
      <section className="section"><div className="grid process-grid">{steps.map(([number,title,description])=><div className="card process-card" key={number}><div className="service-number">{number}</div><h3>{title}</h3><p className="muted">{description}</p></div>)}</div></section>
      <section className="section"><div className="trust-card"><div className="pill">Keep it simple</div><div className="trust-content"><div><h2>You focus on running the school. We organize the digital system.</h2><p className="muted">Green Basket handles the technology side so your school can focus on students, staff and education.</p></div><Link className="btn" href="/register">Get Started <span>→</span></Link></div></div></section>
    </main>
  );
}
