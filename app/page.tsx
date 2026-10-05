import Link from "next/link";

const services = [
  ["01", "Software Development", "Custom digital systems and business applications built around practical needs."],
  ["02", "School Digital Solutions", "Digital school records, results and administrative tools for schools."],
  ["03", "ICT Support", "Computer, software, printer and general technical support."],
  ["04", "Digital Records Management", "Helping organizations move from manual records to organized digital workflows."],
];

const skulgoFeatures = [
  "Students",
  "Classes",
  "Subjects",
  "Teachers",
  "Attendance",
  "CA & Examinations",
  "Results",
  "Grades & Rankings",
  "Report Cards",
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">GREEN BASKET GLOBAL LIMITED • TECHNOLOGY & DIGITAL SOLUTIONS</div>
            <h1>Practical technology for <span>real-world work.</span></h1>
            <p className="hero-lead">
              We build practical software and provide technology support for
              businesses, institutions and schools.
            </p>
            <div className="actions">
              <a className="btn" href="#skulgo">
                Explore SkulGo <span>→</span>
              </a>
              <Link className="btn alt" href="/contact">
                Contact us
              </Link>
            </div>
            <p className="coverage">
              Software development • Digital records • ICT support
            </p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orb orb-one" />
            <div className="hero-orb orb-two" />
            <div className="service-panel">
              <div className="panel-top">
                <span>GREEN BASKET</span>
                <span className="panel-dot" />
              </div>
              <div className="panel-title">Technology & Digital Solutions</div>
              <div className="panel-row"><span>Software</span><b>Built</b></div>
              <div className="panel-row"><span>School Systems</span><b>Supported</b></div>
              <div className="panel-row"><span>Digital Records</span><b>Organized</b></div>
              <div className="panel-row"><span>ICT Support</span><b>Available</b></div>
              <div className="panel-footer">
                Practical digital solutions designed around the work people already do.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-section">
        <div className="section-heading">
          <div className="pill">What we do</div>
          <h2>Technology that solves practical problems.</h2>
          <p className="muted">
            We focus on useful software, organized records and dependable
            technology support rather than unnecessary complexity.
          </p>
        </div>

        <div className="grid">
          {services.map(([number, title, description]) => (
            <div className="card service-card" key={number}>
              <div className="service-number">{number}</div>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section trust-section" id="skulgo">
        <div className="trust-card">
          <div className="pill">Our school technology</div>
          <div className="trust-content">
            <div>
              <h2>SkulGo App — free school-record management.</h2>
              <p className="muted">
                SkulGo App helps schools manage important records without
                requiring constant internet connectivity for normal school
                operations. The core application is provided without a software
                licensing fee.
              </p>
              <div className="actions" style={{ marginTop: 20 }}>
                <a
                  className="btn"
                  href="https://greenbasket-labs.github.io/skulgo-app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open SkulGo App <span>↗</span>
                </a>
              </div>
            </div>
            <div className="grid" style={{ marginTop: 0, width: "100%", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {skulgoFeatures.map((feature) => (
                <div key={feature} style={{ color: "#dce8e1", fontSize: 12, fontWeight: 700 }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div className="pill">Flexible support</div>
          <h2>Part-time and contract technology support.</h2>
          <p className="muted">
            Schools and organizations can engage Green Basket Global Limited for
            technical support, setup, training, maintenance and other agreed
            digital services.
          </p>
        </div>

        <div className="grid">
          <div className="card service-card">
            <div className="service-number">01</div>
            <h3>Practical</h3>
            <p className="muted">Solutions designed around the organization's actual workflow.</p>
          </div>
          <div className="card service-card">
            <div className="service-number">02</div>
            <h3>Flexible</h3>
            <p className="muted">Support can be arranged on a part-time or contract basis.</p>
          </div>
          <div className="card service-card">
            <div className="service-number">03</div>
            <h3>Supported</h3>
            <p className="muted">Setup, training and ongoing technical assistance can be agreed separately.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="closing-card">
          <div>
            <div className="pill">About Green Basket Global Limited</div>
            <h2>Technology and digital services from a Nigerian company.</h2>
            <p className="muted">
              Green Basket Global Limited provides software development and
              digital technology services for businesses, institutions and
              schools.
            </p>
            <p className="muted">
              <strong>CAC Registration No. 9085329</strong>
            </p>
          </div>
          <div className="actions" style={{ marginTop: 0 }}>
            <Link className="btn" href="/contact">Contact us <span>→</span></Link>
            <a
              className="btn alt"
              href="https://greenbasket-labs.github.io/skulgo-app/"
              target="_blank"
              rel="noreferrer"
            >
              SkulGo App <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
