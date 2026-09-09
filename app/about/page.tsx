import Link from "next/link";

export default function About() {
  return (
    <main>
      <section className="page page-hero"><div className="pill">About Green Basket</div><h1>We make digital work easier to manage.</h1><p className="page-lead">Green Basket Global Limited helps organizations access and manage the technology they need without carrying all of the technical burden themselves.</p><p className="muted"><strong>Registered company:</strong> Green Basket Global Limited · <strong>CAC Registration No.:</strong> RC9085329</p></section>
      <section className="section"><div className="grid"><div className="card"><div className="service-number">01</div><h3>Practical</h3><p className="muted">We focus on useful technology and services that solve real business needs.</p></div><div className="card"><div className="service-number">02</div><h3>Organized</h3><p className="muted">Services, applications, infrastructure and support can stay together in one place.</p></div><div className="card"><div className="service-number">03</div><h3>Flexible</h3><p className="muted">Start with one need and expand as your organization grows.</p></div></div></section>
      <section className="section"><div className="closing-card"><div><div className="pill">Our approach</div><h2>Technology should support the business — not distract from it.</h2><p className="muted">We coordinate the work around your needs and help keep the services you depend on under control.</p></div><Link className="btn" href="/contact">Talk to Green Basket <span>→</span></Link></div></section>
    </main>
  );
}
