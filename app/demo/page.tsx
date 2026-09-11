import Link from "next/link";

const demoUrl = process.env.NEXT_PUBLIC_SCHOOL_DEMO_URL?.trim();

export default function DemoPage() {
  return (
    <main className="page page-hero">
      <div className="pill">Try the demo</div>
      <h1>See a real school workflow before you sign up.</h1>
      <p className="page-lead">
        Explore the Green Basket School Management System using a prepared demo
        school. No account is required to look around.
      </p>

      <div className="grid service-grid">
        <div className="card service-card">
          <div className="service-number">01</div>
          <h3>Demo School</h3>
          <p className="muted">
            The demo is designed around a realistic private-school operation:
            students, classes, staff, attendance, fees, payments, exams,
            results, announcements and portals.
          </p>
          {demoUrl ? (
            <a className="btn" href={demoUrl} target="_blank" rel="noreferrer">
              Enter demo <span>→</span>
            </a>
          ) : (
            <p className="muted">The demo environment is being connected.</p>
          )}
        </div>

        <div className="card service-card">
          <div className="service-number">02</div>
          <h3>What happens in the demo</h3>
          <p className="muted">
            Visitors use a temporary demo session. Actions are isolated from
            the prepared master dataset, so experimenting cannot damage the
            shared demo school.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="trust-card">
          <div className="pill">Want your own school?</div>
          <div className="trust-content">
            <div>
              <h2>Start with an account, then verify your organisation.</h2>
              <p className="muted">
                Account creation is open. Creating a real school organisation
                follows Green Basket&apos;s organisation verification process.
              </p>
            </div>
            <Link className="btn" href="/register">
              Create account <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
