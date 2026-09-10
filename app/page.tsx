import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">Green Basket Global Limited</div>
            <h1>Digital solutions for <span>schools.</span></h1>
            <p className="hero-lead">Green Basket currently focuses on one core product: a school management system that helps private schools organize their digital operations in one place.</p>
            <div className="actions">
              <Link className="btn" href="/register">Get Started <span>→</span></Link>
              <Link className="btn alt" href="/services">View Service</Link>
            </div>
            <p className="coverage">Focused on schools today. More digital services can be added in the future.</p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orb orb-one" />
            <div className="hero-orb orb-two" />
            <div className="service-panel">
              <div className="panel-top"><span>GREEN BASKET</span><span className="panel-dot" /></div>
              <div className="panel-title">School Management</div>
              <div className="panel-row"><span>Students</span><b>Managed</b></div>
              <div className="panel-row"><span>Academics</span><b>Organized</b></div>
              <div className="panel-row"><span>School Operations</span><b>Connected</b></div>
              <div className="panel-footer">One school system. One place. Less to worry about.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-section">
        <div className="section-heading">
          <div className="pill">Our current service</div>
          <h2>School Management System.</h2>
          <p className="muted">One focused digital product, supported by Green Basket from setup through ongoing use.</p>
        </div>
        <div className="grid service-grid">
          <div className="card service-card">
            <div className="service-number">01</div>
            <h3>School Management System</h3>
            <p className="muted">A practical platform for managing the academic and administrative work of a private school.</p>
            <Link href="/services">Learn more <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="trust-card">
          <div className="pill">Simple by design</div>
          <div className="trust-content">
            <div>
              <h2>One product today. A platform ready for tomorrow.</h2>
              <p className="muted">Green Basket keeps the foundation flexible so additional digital services can be introduced later without changing the core platform.</p>
            </div>
            <Link className="btn" href="/how-it-works">See how it works <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section closing-section">
        <div className="closing-card">
          <div>
            <div className="pill">For private schools</div>
            <h2>Ready to bring your school into one place?</h2>
            <p className="muted">Create an account and tell Green Basket about your school.</p>
          </div>
          <Link className="btn" href="/register">Get Started <span>→</span></Link>
        </div>
      </section>
    </main>
  );
}
