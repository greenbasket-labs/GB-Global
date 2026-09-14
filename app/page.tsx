import Link from "next/link";

const highlights = [
  ["01", "Students & classes", "Keep student records and class information organized."],
  ["02", "Attendance", "Make daily attendance easier to record and follow."],
  ["03", "Fees & payments", "Track school fees, payments and outstanding balances."],
  ["04", "Exams & results", "Manage academic records and results in one place."],
  ["05", "Staff & announcements", "Keep school staff and important updates connected."],
  ["06", "School portals", "Give the right people access to the information they need."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">GREEN BASKET • FOR PRIVATE SCHOOLS</div>
            <h1>Run your school from <span>one place.</span></h1>
            <p className="hero-lead">
              Green Basket School Management System helps private schools organize
              students, attendance, fees, academics, staff and daily operations
              with one practical digital platform.
            </p>
            <div className="actions">
              <Link className="btn" href="/demo">
                Explore the live demo <span>→</span>
              </Link>
              <Link className="btn alt" href="/register">
                Get started
              </Link>
            </div>
            <p className="coverage">
              No account required to explore the demo • Built for private schools
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
              <div className="panel-title">School Management System</div>
              <div className="panel-row"><span>Students</span><b>Organized</b></div>
              <div className="panel-row"><span>Attendance</span><b>Tracked</b></div>
              <div className="panel-row"><span>Fees & Payments</span><b>Managed</b></div>
              <div className="panel-row"><span>Exams & Results</span><b>Connected</b></div>
              <div className="panel-footer">
                One school system. One place. Less paperwork and less to worry about.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-section">
        <div className="section-heading">
          <div className="pill">Everything your school needs</div>
          <h2>Built around the work schools already do.</h2>
          <p className="muted">
            Instead of juggling separate tools and records, bring the important
            parts of school administration into one connected system.
          </p>
        </div>

        <div className="grid">
          {highlights.map(([number, title, description]) => (
            <div className="card service-card" key={number}>
              <div className="service-number">{number}</div>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section trust-section">
        <div className="trust-card">
          <div className="pill">See it before you decide</div>
          <div className="trust-content">
            <div>
              <h2>Explore the school system yourself.</h2>
              <p className="muted">
                Walk through a prepared demo school and see how the platform can
                fit into your own school&apos;s daily workflow.
              </p>
            </div>
            <Link className="btn" href="/demo">
              Open live demo <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div className="pill">Why Green Basket</div>
          <h2>Simple for the school. Connected behind the scenes.</h2>
          <p className="muted">
            Start with the school management system you need today. Green Basket
            provides the platform, support and ongoing service management so your
            school can focus on running its work.
          </p>
        </div>

        <div className="grid">
          <div className="card service-card">
            <div className="service-number">01</div>
            <h3>Practical</h3>
            <p className="muted">Designed around real school administration, not unnecessary complexity.</p>
          </div>
          <div className="card service-card">
            <div className="service-number">02</div>
            <h3>Supported</h3>
            <p className="muted">Get help with setup and ongoing use instead of being left alone with software.</p>
          </div>
          <div className="card service-card">
            <div className="service-number">03</div>
            <h3>Ready to grow</h3>
            <p className="muted">The Green Basket platform is built to support additional digital services in the future.</p>
          </div>
        </div>
      </section>

      <section className="section closing-section">
        <div className="closing-card">
          <div>
            <div className="pill">For private school owners & administrators</div>
            <h2>Ready to see what your school can do with one system?</h2>
            <p className="muted">
              Start with the live demo, then create an account when you are ready
              to talk to Green Basket about your school.
            </p>
          </div>
          <div className="actions" style={{ marginTop: 0 }}>
            <Link className="btn" href="/demo">Try the demo <span>→</span></Link>
            <Link className="btn alt" href="/contact">Contact us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
