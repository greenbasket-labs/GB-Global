import Link from "next/link";

export default function Contact() {
  return (
    <main>
      <section className="page page-hero"><div className="pill">Contact</div><h1>Talk to Green Basket.</h1><p className="page-lead">Tell us what you are trying to build, fix or manage. We&apos;ll help you find the practical next step.</p></section>
      <section className="section"><div className="closing-card"><div><div className="pill">Green Basket Global Limited</div><h2>Let&apos;s talk about what your organization needs.</h2><p className="muted">Reach us directly by phone, email or WhatsApp. We&apos;re ready to discuss your technology and digital-service needs.</p><div className="contact-details"><p><strong>Email:</strong> <a href="mailto:greenbasketgloball@gmail.com">greenbasketgloball@gmail.com</a></p><p><strong>Phone:</strong> <a href="tel:+2349067950038">09067950038</a></p><p><strong>WhatsApp:</strong> <a href="https://wa.me/2349067950038" target="_blank" rel="noreferrer">Chat with us on WhatsApp →</a></p></div></div><Link className="btn" href="/register">Get Started <span>→</span></Link></div></section>
      <section className="section"><div className="card"><h3>Serving businesses across Nigeria and Africa.</h3><p className="muted">Whether you need software, infrastructure, technical support or digital services, start by telling us what you need.</p><Link href="/services">Explore our services <span>→</span></Link></div></section>
    </main>
  );
}
