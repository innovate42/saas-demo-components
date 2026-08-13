import React from 'react';
import './index.css';

type Props = {
  heading?: string;
};

const LOGO = 'https://www.icims.com/wp-content/themes/icims4/src/img/icims-logo-r.svg';

const Candidate = ({ name, role, match }: { name: string; role: string; match: number }) => (
  <div className="im-cand">
    <div className="im-cand-ring" />
    <div style={{ flex: 1 }}>
      <div className="im-cand-name">{name}</div>
      <div style={{ color: '#5b6266', fontSize: 11 }}>{role}</div>
      <div className="im-bar"><i style={{ width: `${match}%` }} /></div>
    </div>
  </div>
);

const Feature = ({
  title,
  points,
  art,
  flip,
}: {
  title: string;
  points: string[];
  art: React.ReactNode;
  flip?: boolean;
}) => (
  <div className="im-feature">
    <div style={{ order: flip ? 2 : 1 }}>
      <h3>{title}</h3>
      <ul>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <a className="im-link im-link--purple" href="#">LEARN MORE</a>
    </div>
    <div className="im-feature-art" style={{ order: flip ? 1 : 2 }}>{art}</div>
  </div>
);

export default function MockupIcims({ heading }: Props) {
  const headline =
    heading || 'Finally, an ATS made to support the needs of global enterprises';

  return (
    <div className="icims-mock">
      {/* promo bar */}
      <div className="im-promo">
        <strong>*NEW*</strong> See why ICIMS was named a Leader in the Gartner® Magic Quadrant™
        <a href="#">Get report ›</a>
      </div>

      {/* header */}
      <header className="im-header">
        <img className="im-logo" src={LOGO} alt="iCIMS logo" />
        <nav className="im-nav">
          <a href="#">Products</a>
          <a href="#">Community</a>
          <a href="#">Resources</a>
          <a href="#">Company</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="im-topcontact">
            Sales <a href="#">+1 (848) 208-6951</a>
          </div>
          <a className="im-btn" href="#">REQUEST DEMO</a>
        </div>
      </header>

      {/* hero */}
      <section className="im-hero">
        <div>
          <p className="im-eyebrow">Enterprise applicant tracking system</p>
          <h1>{headline}</h1>
          <p>
            Whether you’re hiring at a high volume or for highly specialized roles, ICIMS’
            enterprise applicant tracking system makes managing, automating and streamlining
            your hiring workflows a breeze.
          </p>
          <div className="im-hero-cta">
            <a className="im-btn" href="#">SCHEDULE A DEMO</a>
            <a className="im-link" href="#">Take a tour</a>
          </div>
        </div>
        <div className="im-hero-media">
          <div className="im-card">
            <div className="im-card-head">▚ Let ICIMS make suggestions</div>
            <div className="im-chip">
              <span>VP level HR, 15+ years experience</span>
              <span>→</span>
            </div>
            <div className="im-card-label">Recommended candidate</div>
            <Candidate name="Marcus Brown" role="Experience match" match={88} />
            <div className="im-card-label" style={{ marginTop: 10 }}>Additional candidates</div>
            <Candidate name="Candice Morrison" role="Experience match" match={72} />
            <Candidate name="Victor Campagna" role="Experience match" match={64} />
          </div>
        </div>
      </section>

      <div className="im-wrap">
        {/* productivity section */}
        <section className="im-section">
          <h2>Watch your productivity skyrocket</h2>
          <p className="im-lead">
            AI-powered automation available at every step of the hiring process helps recruiters
            focus less on manual tasks and more on getting the right candidate hired.
          </p>

          <Feature
            title="Kick off your recruiting process with ease"
            points={[
              'Streamline job postings using templates with pre-approved content for jobs, emails and offer letters.',
              'Keep stakeholders aligned with pre-defined approval chains for candidates, offers and jobs.',
              'Simplify internal communication with @mentions and in-platform notifications.',
              'Get more applicants with integrated job advertising across multiple job boards.',
            ]}
            art={<span>Recruiting workspace</span>}
          />
          <Feature
            flip
            title="Coalesce AI helps you focus on the most promising candidates"
            points={[
              'Surface best-fit candidates for newly created jobs.',
              'Automate candidate suggestions for recruiters and hiring managers.',
              'Prioritize volume through automated candidate comparison, ranking and job matching.',
            ]}
            art={<span>Candidate ranking</span>}
          />
          <Feature
            title="Reduce manual interview scheduling and free up recruiters’ time"
            points={[
              'Save time with interview scheduling templates for common interview types.',
              'Accelerate the process with candidate self-scheduling based on interviewer availability.',
              'Meet candidates where they are by inviting them to interview via SMS/text.',
            ]}
            art={<span>Interview scheduling</span>}
          />
        </section>

        {/* talent pillars */}
        <section className="im-section" style={{ paddingTop: 10 }}>
          <h2>A complete talent solution that meets your every need</h2>
          <div className="im-pillars">
            <div className="im-pillar">
              <h4>Attract</h4>
              <p>Funnel more applicants with an integrated CRM and a branded career site that captivates candidates.</p>
            </div>
            <div className="im-pillar">
              <h4>Engage</h4>
              <p>Connect with candidates at critical hiring touchpoints via text, video, chat and more.</p>
            </div>
            <div className="im-pillar">
              <h4>Advance</h4>
              <p>Manage internal mobility and advancement to help retain the talent you worked hard to find.</p>
            </div>
            <div className="im-pillar">
              <h4>Integrate</h4>
              <p>Supports 750+ partners across the talent acquisition lifecycle, including hundreds of HCM providers.</p>
            </div>
          </div>
        </section>

        {/* stats band */}
        <section className="im-section">
          <div className="im-stats">
            <div className="im-stat">
              <b>282%</b>
              <span>ROI gain estimated by ICIMS customers</span>
            </div>
            <div className="im-stat">
              <b>22%</b>
              <span>reduction in average time to fill vs. industry benchmarks</span>
            </div>
            <div className="im-quote">
              “ICIMS has been able to adapt with us as we change and grow at a rapid pace. ICIMS has
              actually been able to deliver.”
              <cite>Director of Workforce Systems, Trilogy Health Services</cite>
            </div>
          </div>
        </section>

        {/* coalesce band */}
        <section className="im-section" style={{ paddingTop: 10 }}>
          <div className="im-coalesce">
            <div>
              <h2>Meet ICIMS Coalesce AI</h2>
              <p>
                Responsible, reliable and purpose-built to help your team simplify and accelerate
                hiring. Dial it up or down, on or off at any step in the process. Your team has full
                control. No integration required.
              </p>
              <a className="im-btn" href="#">Explore Coalesce AI</a>
            </div>
            <div className="im-glyph">✦</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="im-section" style={{ paddingTop: 10 }}>
          <h2>Frequently asked questions</h2>
          <div className="im-faq">
            {[
              'Does ICIMS Applicant Tracking software integrate with my HR or payroll system?',
              'Can ICIMS ATS integrate with other recruiting solutions?',
              'What type of customer support can I expect?',
              'What are the reporting capabilities of ICIMS?',
              'How is ICIMS Applicant Tracking different from other applicant tracking software?',
              'How does ICIMS protect candidate data and other sensitive information?',
            ].map((q, i) => (
              <div className="im-faq-item" key={i}>
                <span>{q}</span>
                <i>+</i>
              </div>
            ))}
          </div>
        </section>

        {/* footer CTA */}
        <section className="im-section" style={{ paddingTop: 0, paddingBottom: 40 }}>
          <div className="im-footcta">
            <h2>Learn how ICIMS can help you drive ROI</h2>
            <a className="im-btn" href="#">SCHEDULE A DEMO</a>
          </div>
        </section>
      </div>
    </div>
  );
}
