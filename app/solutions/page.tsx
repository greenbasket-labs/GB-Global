import Link from "next/link";

export default function Solutions() {
  return (
    <main>
      <section className="page page-hero">
        <div className="pill">Solutions</div>
        <h1>Digital solutions for schools.</h1>
        <p className="page-lead">Green Basket currently focuses on helping private schools run their operations through a practical, connected school management system.</p>
      </section>
      <section className="section">
        <div className="grid service-grid">
          <div className="card service-card">
            <div className="service-number">01</div>
            <h3>School Management System</h3>
            <p className="muted">Bring the core administrative and academic work of your school into one organized digital platform.</p>
            <Link href="/register">Get Started <span>→</span></Link>
          </div>
        </div>
      </section>
      <section className="section"><div className="closing-card"><div><div className="pill">Focused today</div><h2>Built for schools. Ready to grow.</h2><p className="muted">The platform is designed so Green Basket can introduce additional digital services in the future without changing the core customer experience.</p></div><Link className="btn" href="/register">Get Started <span>→</span></Link></div></section>
    </main>
  );
}
