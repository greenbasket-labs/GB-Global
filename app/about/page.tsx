import Link from "next/link";

export default function About() {
  return (
    <main>
      <section className="page page-hero"><div className="pill">About Green Basket</div><h1>Focused on making school technology easier.</h1><p className="page-lead">Green Basket Global Limited currently focuses on delivering and supporting a practical school management system for private schools.</p><p className="muted"><strong>Registered company:</strong> Green Basket Global Limited · <strong>CAC Registration No.:</strong> RC9085329</p></section>
      <section className="section"><div className="grid"><div className="card"><div className="service-number">01</div><h3>Practical</h3><p className="muted">We focus on useful school technology that solves real administrative and academic needs.</p></div><div className="card"><div className="service-number">02</div><h3>Organized</h3><p className="muted">The school system keeps important school operations together in one digital place.</p></div><div className="card"><div className="service-number">03</div><h3>Ready to grow</h3><p className="muted">We are starting with one focused product while keeping the platform ready for future digital services.</p></div></div></section>
      <section className="section"><div className="closing-card"><div><div className="pill">Our approach</div><h2>Technology should make running a school easier.</h2><p className="muted">We coordinate the school system and the digital support around it so the technology stays under control.</p></div><Link className="btn" href="/contact">Talk to Green Basket <span>→</span></Link></div></section>
    </main>
  );
}
