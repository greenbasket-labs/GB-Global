import Link from "next/link";

const items = [
  ["Software", "School systems, business applications, websites and custom software.", "01"],
  ["Hosting", "Managed hosting and application infrastructure.", "02"],
  ["Domains", "Domain registration, DNS and renewal management.", "03"],
  ["Backup", "Managed backups and operational protection.", "04"],
  ["Technical Support", "Maintenance, troubleshooting, monitoring and updates.", "05"],
  ["Digital Marketing", "Marketing and digital growth support through our network.", "06"],
];

export default function Services() {
  return (
    <main>
      <section className="page page-hero">
        <div className="pill">Services</div>
        <h1>Digital services that grow with you.</h1>
        <p className="page-lead">Choose what you need today. Add more as your organization grows, with Green Basket keeping the work organized.</p>
        <div className="actions"><Link className="btn" href="/register">Request a service <span>→</span></Link></div>
      </section>
      <section className="section">
        <div className="grid service-grid">
          {items.map(([name, description, number]) => (
            <div className="card service-card" key={name}>
              <div className="service-number">{number}</div>
              <h3>{name}</h3>
              <p className="muted">{description}</p>
              <Link href="/register">Request this service <span>→</span></Link>
            </div>
          ))}
        </div>
      </section>
      <section className="section"><div className="trust-card"><div className="pill">Built around your organization</div><div className="trust-content"><div><h2>Start small. Add what you need.</h2><p className="muted">You do not need to manage everything at once. Green Basket can organize your software, infrastructure and ongoing digital services as your needs change.</p></div><Link className="btn" href="/how-it-works">How it works <span>→</span></Link></div></div></section>
    </main>
  );
}
