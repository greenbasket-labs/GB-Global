import Link from "next/link";

export default function Services() {
  return (
    <main>
      <section className="page page-hero">
        <div className="pill">Services</div>
        <h1>School Management System.</h1>
        <p className="page-lead">Green Basket is currently focused on one core product: a complete digital school management system for private schools.</p>
        <div className="actions"><Link className="btn" href="/register">Get Started <span>→</span></Link></div>
      </section>
      <section className="section">
        <div className="grid service-grid">
          <div className="card service-card">
            <div className="service-number">01</div>
            <h3>School Management System</h3>
            <p className="muted">A practical digital platform for managing the day-to-day operations of a school in one place.</p>
            <Link href="/register">Request the system <span>→</span></Link>
          </div>
          <div className="card service-card">
            <div className="service-number">02</div>
            <h3>Ongoing Digital Support</h3>
            <p className="muted">Implementation, hosting, maintenance and support for schools using the Green Basket school system.</p>
            <Link href="/contact">Talk to us <span>→</span></Link>
          </div>
        </div>
      </section>
      <section className="section"><div className="trust-card"><div className="pill">More to come</div><div className="trust-content"><div><h2>One focused product today. More digital services in the future.</h2><p className="muted">Green Basket is keeping the platform ready for additional digital services, but they are not offered yet.</p></div><Link className="btn" href="/how-it-works">How it works <span>→</span></Link></div></div></section>
    </main>
  );
}
