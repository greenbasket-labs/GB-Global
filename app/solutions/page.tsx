import Link from "next/link";

const solutions = [
  ["Schools", "Management systems, websites, hosting and support.", "01"],
  ["Businesses", "Custom software, websites, infrastructure and technical support.", "02"],
  ["Growing organizations", "Add digital services gradually instead of building a technical team for everything.", "03"],
];

export default function Solutions() {
  return (
    <main>
      <section className="page page-hero">
        <div className="pill">Solutions</div>
        <h1>Technology for the work you actually do.</h1>
        <p className="page-lead">Practical digital support for organizations that want technology to work for the business — not become another daily burden.</p>
      </section>
      <section className="section">
        <div className="grid service-grid">
          {solutions.map(([name, description, number]) => (
            <div className="card service-card" key={name}>
              <div className="service-number">{number}</div><h3>{name}</h3><p className="muted">{description}</p><Link href="/register">Talk to us <span>→</span></Link>
            </div>
          ))}
        </div>
      </section>
      <section className="section"><div className="closing-card"><div><div className="pill">Nigeria & Africa</div><h2>One place to organize the technology your organization depends on.</h2><p className="muted">Start with one service or bring several needs together. We help coordinate the next step.</p></div><Link className="btn" href="/register">Get Started <span>→</span></Link></div></section>
    </main>
  );
}
