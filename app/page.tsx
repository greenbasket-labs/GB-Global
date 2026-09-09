import Link from "next/link";

const services = [
  ["Software", "Business systems, websites and custom applications.", "01"],
  ["Hosting", "Managed hosting and application infrastructure.", "02"],
  ["Domains", "Domain registration, DNS and renewal management.", "03"],
  ["Technical Support", "Maintenance, monitoring, troubleshooting and updates.", "04"],
  ["Digital Growth", "Marketing and other digital services through our network.", "05"],
  ["Technology Management", "One place to organize the technology your organization depends on.", "06"],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">Green Basket Global Limited</div>
            <h1>Your digital work, <span>handled.</span></h1>
            <p className="hero-lead">
              We help businesses get the software, hosting, domains, technical support and digital services they need — without making technology their daily problem.
            </p>
            <div className="actions">
              <Link className="btn" href="/register">Get Started <span>→</span></Link>
              <Link className="btn alt" href="/services">Explore Services</Link>
            </div>
            <p className="coverage">Serving businesses across Nigeria and Africa.</p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orb orb-one" />
            <div className="hero-orb orb-two" />
            <div className="service-panel">
              <div className="panel-top"><span>GREEN BASKET</span><span className="panel-dot" /></div>
              <div className="panel-title">Your digital operations</div>
              <div className="panel-row"><span>Software</span><b>Managed</b></div>
              <div className="panel-row"><span>Infrastructure</span><b>Active</b></div>
              <div className="panel-row"><span>Support</span><b>Available</b></div>
              <div className="panel-footer">One company. One place. Less to worry about.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-section">
        <div className="section-heading">
          <div className="pill">What we handle</div>
          <h2>One company for your digital needs.</h2>
          <p className="muted">Start with what you need. Add services as your organization grows.</p>
        </div>
        <div className="grid service-grid">
          {services.map(([name, description, number]) => (
            <div className="card service-card" key={name}>
              <div className="service-number">{number}</div>
              <h3>{name}</h3>
              <p className="muted">{description}</p>
              <Link href="/services">Learn more <span>→</span></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section trust-section">
        <div className="trust-card">
          <div className="pill">Simple by design</div>
          <div className="trust-content">
            <div>
              <h2>You tell us what you need. We organize the work.</h2>
              <p className="muted">Green Basket coordinates the right specialists and manages the ongoing digital services your organization depends on.</p>
            </div>
            <Link className="btn" href="/how-it-works">See how it works <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section closing-section">
        <div className="closing-card">
          <div>
            <div className="pill">Ready when you are</div>
            <h2>Let&apos;s take technology off your plate.</h2>
            <p className="muted">Tell us what your business needs. We&apos;ll help organize the next step.</p>
          </div>
          <Link className="btn" href="/register">Get Started <span>→</span></Link>
        </div>
      </section>
    </main>
  );
}
