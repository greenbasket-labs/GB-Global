import Link from "next/link";

export default function Contact() {
  return (
    <main>
      <section className="page page-hero"><div className="pill">Contact</div><h1>Talk to Green Basket.</h1><p className="page-lead">Tell us what you are trying to build, fix or manage. We&apos;ll help you find the practical next step.</p></section>
      <section className="section"><div className="closing-card"><div><div className="pill">Green Basket Global Limited</div><h2>Let&apos;s talk about what your organization needs.</h2><p className="muted">Phone, email and WhatsApp contact details will be available here when you are ready. No physical office address is required.</p></div><Link className="btn" href="/register">Get Started <span>→</span></Link></div></section>
      <section className="section"><div className="card"><h3>Serving businesses across Nigeria and Africa.</h3><p className="muted">Whether you need software, infrastructure, technical support or digital services, start by telling us what you need.</p><Link href="/services">Explore our services <span>→</span></Link></div></section>
    </main>
  );
}
