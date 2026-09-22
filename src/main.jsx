import React, { useEffect, useMemo, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from "react-router-dom";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "/api";

const LOAN_CATEGORIES = [
  {
    id: "personal",
    title: "Personal Loan",
    icon: "₹",
    categoryClass: "personal",
    copy: "For personal expenses, emergencies, education, weddings and other financial needs.",
    highlight: "Flexible tenure"
  },
  {
    id: "business",
    title: "Business Loan",
    icon: "💼",
    categoryClass: "business",
    copy: "For working capital, expansion, equipment and business requirements.",
    highlight: "MSME & Enterprise"
  },
  {
    id: "home",
    title: "Home Loan",
    icon: "🏠",
    categoryClass: "home",
    copy: "For home purchase, construction, renovation or balance transfer.",
    highlight: "Low interest potential"
  },
  {
    id: "lap",
    title: "Loan Against Property",
    icon: "🏢",
    categoryClass: "lap",
    copy: "Explore secured funding options against eligible residential or commercial property.",
    highlight: "Higher eligibility"
  },
  {
    id: "vehicle",
    title: "Vehicle Loan",
    icon: "🚗",
    categoryClass: "vehicle",
    copy: "Finance options for new and used cars, two-wheelers and commercial vehicles.",
    highlight: "Fast processing"
  },
  {
    id: "other",
    title: "Other Financial Needs",
    icon: "✨",
    categoryClass: "other",
    copy: "Share your unique requirement and explore customized loan assistance options.",
    highlight: "Tailored review"
  }
];

// TOP INSTITUTIONAL TRUST RIBBON
// TOP INSTITUTIONAL UTILITY & ACCESSIBILITY BAR (GIGW STYLE)
function TopInstitutionalUtilityBar() {
  const [fontSizeLevel, setFontSizeLevel] = useState(0);

  const changeFontSize = (delta) => {
    const next = Math.max(-1, Math.min(1, fontSizeLevel + delta));
    setFontSizeLevel(next);
    document.documentElement.style.fontSize = next === -1 ? "14.5px" : next === 1 ? "17.5px" : "16px";
  };

  return (
    <div className="gov-utility-wrapper">
      {/* 3-Band Indian Institutional Accent Line */}
      <div className="gov-tricolor-accent"></div>
      
      <div className="gov-top-ribbon">
        <div className="gov-ribbon-left">
          <span className="gov-dpdp-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            भारत सरकार के डिजिटल पर्सनल डेटा संरक्षण (DPDP) अधिनियम 2023 के अनुरूप
          </span>
          <span className="gov-sep">|</span>
          <span className="gov-subhead-text">National Credit Advisory & Facilitation Platform</span>
        </div>

        <div className="gov-ribbon-right">
          {/* Toll Free Helpline */}
          <span className="gov-helpline-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Toll-Free Helpline: <strong>1800-208-5626</strong> (Mon–Sat 9:30 AM–6:30 PM)
          </span>

          <span className="gov-sep">|</span>

          {/* Accessibility Font Size Controls */}
          <div className="gov-accessibility-controls" title="Screen Accessibility Controls">
            <span className="gov-acc-label">Font:</span>
            <button type="button" onClick={() => changeFontSize(-1)} className={`gov-acc-btn ${fontSizeLevel === -1 ? 'active' : ''}`} title="Decrease text size">A-</button>
            <button type="button" onClick={() => changeFontSize(0)} className={`gov-acc-btn ${fontSizeLevel === 0 ? 'active' : ''}`} title="Standard text size">A</button>
            <button type="button" onClick={() => changeFontSize(1)} className={`gov-acc-btn ${fontSizeLevel === 1 ? 'active' : ''}`} title="Increase text size">A+</button>
          </div>

          <span className="gov-sep">|</span>

          {/* Language Indicator */}
          <div className="gov-lang-tag">
            <span>English</span>
            <span style={{ color: "#94a3b8" }}>/</span>
            <span>हिन्दी</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// INSTITUTIONAL DUAL-TIER HEADER COMPONENT
function Header({ onOpenLegal }) {
  return (
    <header className="gov-master-header">
      <TopInstitutionalUtilityBar />
      
      {/* Tier 1: Main Institutional Brand Bar */}
      <div className="gov-brand-bar">
        <Link to="/" className="gov-brand-container">
          <div className="gov-seal-monogram">
            <span className="seal-emblem-star">★</span>
            <span className="seal-rupee">₹</span>
            <span className="seal-ring"></span>
          </div>
          <div className="gov-title-stack">
            <div className="gov-org-title">
              Loan<span className="highlight">Connect</span> <span className="gov-india-tag">INDIA</span>
            </div>
            <div className="gov-hindi-subtitle">
              ऋण सुविधा एवं परामर्श पोर्टल • National Credit Advisory & Facilitation Platform
            </div>
            <div className="gov-org-status">
              Independent Advisory System Facilitating Access to 40+ Scheduled Commercial Banks & Regulated NBFCs
            </div>
          </div>
        </Link>

        <div className="gov-header-badges">
          <div className="gov-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            <div>
              <strong>ISO 27001</strong>
              <small>Security Standards</small>
            </div>
          </div>

          <div className="gov-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <div>
              <strong>256-Bit SSL</strong>
              <small>Bank-Grade Encryption</small>
            </div>
          </div>

          <Link className="gov-primary-action" to="/apply">
            <span>Citizen Loan Application</span>
            <small>नागरिक ऋण आवेदन →</small>
          </Link>
        </div>
      </div>

      {/* Tier 2: Institutional Navigation Bar */}
      <div className="gov-nav-bar">
        <nav className="gov-nav-links">
          <a href="/#" className="gov-nav-item active">Home (मुख्य पृष्ठ)</a>
          <a href="/#loans" className="gov-nav-item">Loan Schemes (ऋण योजनाएं)</a>
          <a href="/#cibil" className="gov-nav-item">CIBIL Guide (सिबिल दिशानिर्देश)</a>
          <a href="/#charter" className="gov-nav-item">Citizen Charter (नागरिक घोषणापत्र)</a>
          <a href="/#partners" className="gov-nav-item">Partner Banks (संबद्ध बैंक)</a>
          <a href="/#grievance" className="gov-nav-item">Grievance (शिकायत निवारण)</a>
          <a href="/#faq" className="gov-nav-item">FAQ (प्रश्न एवं उत्तर)</a>
        </nav>
        <div className="gov-nav-portal-link">
          <Link to="/admin" className="gov-officer-login-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Officer Portal (अधिकारी लॉगिन)
          </Link>
        </div>
      </div>
    </header>
  );
}



// LENDER PARTNERS STRIP
function PartnerLendersStrip() {
  const partners = [
    { name: "State Bank of India", dotClass: "dot-sbi" },
    { name: "HDFC Bank", dotClass: "dot-hdfc" },
    { name: "ICICI Bank", dotClass: "dot-icici" },
    { name: "Axis Bank", dotClass: "dot-axis" },
    { name: "Kotak Mahindra Bank", dotClass: "dot-kotak" },
    { name: "Tata Capital", dotClass: "dot-tata" },
    { name: "Bajaj Finserv", dotClass: "dot-bajaj" }
  ];
  return (
    <div className="partner-lenders-strip">
      <div className="partner-strip-title">
        Facilitating Loan Assistance Across Leading RBI-Registered Banks & NBFCs
      </div>
      <div className="partner-logos-grid">
        {partners.map(p => (
          <div className="partner-logo-pill" key={p.name}>
            <span className={`partner-dot ${p.dotClass}`}></span>
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4-PILLAR CITIZEN CHARTER SECTION (नागरिक घोषणापत्र)
function CitizenCharterSection() {
  return (
    <section className="section gov-charter-section" id="charter">
      <div className="center-head">
        <span className="gov-badge-official">CITIZEN SERVICE CHARTER • नागरिक सेवा घोषणापत्र</span>
        <h2>Commitment to Ethical & Transparent Credit Advisory</h2>
        <p>Our four statutory pillars guarantee ethical lending guidance, zero hidden practices, and strict citizen privacy.</p>
      </div>

      <div className="gov-charter-grid">
        <div className="gov-charter-card">
          <div className="gov-charter-num">01</div>
          <div className="gov-charter-icon">📊</div>
          <h3>पारदर्शी मूल्यांकन<br /><span>Transparent Preliminary Range</span></h3>
          <p>Instant digital preliminary range calculated algorithmically based on your financial parameters before any commitment. No ambiguous numbers.</p>
          <div className="gov-charter-badge">100% Objective</div>
        </div>

        <div className="gov-charter-card">
          <div className="gov-charter-num">02</div>
          <div className="gov-charter-icon">🛡️</div>
          <h3>सत्यनिष्ठ परामर्श<br /><span>No Deceptive Guarantees</span></h3>
          <p>We never falsely advertise "100% Guaranteed Approval" or "Immediate Cash without Checks". All sanctions are subject to legitimate lender underwriting.</p>
          <div className="gov-charter-badge">Fair Practice Compliant</div>
        </div>

        <div className="gov-charter-card">
          <div className="gov-charter-num">03</div>
          <div className="gov-charter-icon">🔒</div>
          <h3>नागरिक डेटा सुरक्षा<br /><span>DPDP Act 2023 Compliance</span></h3>
          <p>Your Aadhaar, PAN, and phone records are encrypted under 256-Bit SSL standards and never sold, rented, or distributed to telemarketing call centers.</p>
          <div className="gov-charter-badge">Strict Data Protection</div>
        </div>

        <div className="gov-charter-card">
          <div className="gov-charter-num">04</div>
          <div className="gov-charter-icon">⚖️</div>
          <h3>त्वरित निवारण<br /><span>Nodal Grievance Redressal</span></h3>
          <p>Designated Grievance Redressal Officer providing written acknowledgment within 48 hours and resolved disposition within 7 business days.</p>
          <div className="gov-charter-badge">SLA Governed</div>
        </div>
      </div>
    </section>
  );
}

// SCHEDULED BANKS & FINANCIAL INSTITUTIONS DIRECTORY (संबद्ध बैंक)
function ScheduledBanksDirectory() {
  return (
    <section className="section gov-banks-directory-section" id="partners">
      <div className="center-head">
        <span className="gov-badge-official">LENDING INSTITUTION DIRECTORY • संबद्ध वित्तीय संस्थान</span>
        <h2>Facilitating Access Across Leading Scheduled Banks & NBFCs</h2>
        <p>Connecting eligible borrowers to legitimate, regulated lending institutions across India.</p>
      </div>

      <div className="gov-banks-table-container">
        <div className="gov-table-header-row">
          <div className="gov-col-bank">Financial Institution / Bank</div>
          <div className="gov-col-type">Institutional Category</div>
          <div className="gov-col-reg">Regulatory Status</div>
          <div className="gov-col-schemes">Key Loan Categories</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-sbi">SBI</span>
            <strong>State Bank of India (भारतीय स्टेट बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-psu">Public Sector Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Home, Personal, MSME Business, LAP</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-pnb">PNB</span>
            <strong>Punjab National Bank (पंजाब नेशनल बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-psu">Public Sector Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Personal, Housing, Business, Vehicle</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-hdfc">HDFC</span>
            <strong>HDFC Bank (एचडीएफसी बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-pvt">Private Scheduled Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Express Personal, Home, Business, LAP</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-icici">ICICI</span>
            <strong>ICICI Bank (आईसीआईसीआई बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-pvt">Private Scheduled Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Salaried Loans, Mortgage, Business Credit</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-axis">AXIS</span>
            <strong>Axis Bank (एक्सिस बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-pvt">Private Scheduled Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Personal, Affordable Home, Auto Loan</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-tata">TATA</span>
            <strong>Tata Capital Financial Services</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-nbfc">Systemically Important NBFC</span></div>
          <div className="gov-col-reg">RBI Registered Non-Banking Financial Co.</div>
          <div className="gov-col-schemes">Unsecured Personal, Business Capital, LAP</div>
        </div>

        <div className="gov-table-row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-bajaj">BAJAJ</span>
            <strong>Bajaj Finance / Finserv</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-nbfc">Systemically Important NBFC</span></div>
          <div className="gov-col-reg">RBI Registered Non-Banking Financial Co.</div>
          <div className="gov-col-schemes">Flexi Personal Loan, Business Growth, LAP</div>
        </div>
      </div>

      <div className="gov-table-note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>
          <strong>Statutory Governance Note:</strong> LoanConnect India serves exclusively as an advisory and facilitation technology platform. All loan applications are evaluated, sanctioned, and disbursed by the respective lending institution based on individual borrower credit eligibility and lender credit policy.
        </span>
      </div>
    </section>
  );
}

// OFFICIAL GRIEVANCE REDRESSAL SECTION (शिकायत निवारण)
function GrievanceRedressalSection({ onOpenLegal }) {
  return (
    <section className="section gov-grievance-section" id="grievance">
      <div className="center-head">
        <span className="gov-badge-official">PUBLIC GRIEVANCE MECHANISM • नागरिक शिकायत निवारण</span>
        <h2>Citizen Redressal & Institutional Compliance</h2>
        <p>In adherence to consumer protection guidelines, our nodal grievance redressal protocol is publicly accessible.</p>
      </div>

      <div className="gov-grievance-grid">
        <div className="gov-grievance-card">
          <div className="gov-grievance-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <h3>Designated Nodal Grievance Officer (नोडल अधिकारी)</h3>
          </div>
          <div className="gov-officer-details">
            <p><strong>Name:</strong> Shri R. K. Verma</p>
            <p><strong>Designation:</strong> Head of Consumer Protection & Grievance Redressal</p>
            <p><strong>Official Email:</strong> <a href="mailto:grievance@loanconnectindia.in" style={{ color: "#2563eb", textDecoration: "underline" }}>grievance@loanconnectindia.in</a></p>
            <p><strong>Advisory Helpline:</strong> 1800-208-5626 (Toll-Free, Mon to Sat 9:30 AM – 6:30 PM)</p>
            <p><strong>Corporate Advisory Office:</strong> National Financial Towers, Level 5, Connaught Place, New Delhi 110001</p>
          </div>
        </div>

        <div className="gov-grievance-card">
          <div className="gov-grievance-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h3>Resolution Protocol & Turnaround Standards</h3>
          </div>
          <div className="gov-timeline-list">
            <div className="gov-timeline-item">
              <span className="gov-timeline-badge">T + 48 Hours</span>
              <div>
                <strong>Formal Acknowledgment</strong>
                <p>Digital ticket generation and written acknowledgment sent to your registered mobile and email.</p>
              </div>
            </div>
            <div className="gov-timeline-item">
              <span className="gov-timeline-badge">T + 7 Days</span>
              <div>
                <strong>Dispute Investigation & Resolution</strong>
                <p>Detailed verification, consultation review, and formal resolution communication delivered.</p>
              </div>
            </div>
            <div className="gov-timeline-item">
              <span className="gov-timeline-badge">Escalation</span>
              <div>
                <strong>Ombudsman Awareness</strong>
                <p>For lender-specific banking disputes, guidance is provided under the Reserve Bank - Integrated Ombudsman Scheme (RB-IOS).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// HOME PAGE
function Home({ onOpenLegal }) {
  return (
    <div>
      <Header onOpenLegal={onOpenLegal} />
      <main>
        {/* 1. HERO SECTION WITH REALISTIC INDIAN FINTECH WORKSPACE PHOTOGRAPH */}
        <section className="hero">
          <div className="hero-copy">
            {/* SMALL BADGE */}
            <div className="gov-hero-initiative-badge">
              <span className="gov-initiative-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
                राष्ट्रीय ऋण सुविधा मंच • NATIONAL CREDIT ADVISORY
              </span>
              <span className="gov-initiative-divider">|</span>
              <span className="gov-initiative-desc">DPDP Act 2023 Compliant • ISO 27001 Security Standards</span>
            </div>

            {/* LARGE HEADLINE */}
            <h1>
              Need a Loan? Let's Find the <span style={{ color: "#ea580c" }}>Right Option</span> for You.
            </h1>
            <div className="gov-hindi-hero-title">
              ऋण आवश्यकता? जानिए अपनी प्राथमिक पात्रता एवं उपयुक्त विकल्प
            </div>

            {/* SUPPORTING TEXT */}
            <p className="hero-subtitle">
              Personal, Business, Home & Property-backed loan facilitation — structured guidance for salaried, self-employed, business owners, and varied credit profiles across India.
            </p>

            {/* CREDIT PROFILE PILLS */}
            <div className="credit-pills-row">
              <span className="credit-pill">✓ Good CIBIL (750+)</span>
              <span className="credit-pill highlight">✓ Mid/Low CIBIL (Below 650)</span>
              <span className="credit-pill">✓ Limited Credit History</span>
            </div>

            {/* URGENCY INFORMATION */}
            <div className="urgency-callout-box">
              <span className="urgency-bolt">⚡</span>
              <div>
                <strong>Need funds urgently?</strong> Complete your digital self-assessment and get a verified preliminary eligibility range in minutes.
              </div>
            </div>

            {/* CTAS */}
            <div className="hero-actions">
              <Link to="/apply" className="primary-btn">
                Check My Eligibility <span>→</span>
              </Link>
              <Link to="/apply" className="secondary-btn">
                Citizen Loan Application
              </Link>
            </div>

            {/* TRUST INDICATORS */}
            <div className="trust-row">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Zero Advance Fee
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                256-Bit Bank-Grade Encryption
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Preliminary Eligibility Assessment
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: REALISTIC INDIAN FINANCIAL & CURRENCY PHOTOGRAPHY VISUAL SPACE */}
          <div className="hero-visual-space" aria-hidden="true"></div>

          {/* BOTTOM HORIZONTAL TRUST BAR */}
          <div className="hero-bottom-trust-bar">
            <div className="trust-bar-item">
              <span className="trust-check-icon">✓</span>
              <span>Quick Online Application</span>
            </div>
            <span className="trust-bar-divider">•</span>
            <div className="trust-bar-item">
              <span className="trust-check-icon">✓</span>
              <span>Multiple Loan Categories</span>
            </div>
            <span className="trust-bar-divider">•</span>
            <div className="trust-bar-item">
              <span className="trust-check-icon">✓</span>
              <span>Secure & Confidential (DPDP 2023)</span>
            </div>
            <span className="trust-bar-divider">•</span>
            <div className="trust-bar-item">
              <span className="trust-check-icon">✓</span>
              <span>Preliminary Eligibility Assessment</span>
            </div>
          </div>
        </section>

        {/* LENDER PARTNERS NETWORK STRIP */}
        <PartnerLendersStrip />

        {/* 2. LOAN CATEGORIES */}
        <section className="section" id="loans">
          <div className="section-head">
            <div>
              <span className="section-tag">LOAN SCHEMES • ऋण योजनाएं</span>
              <h2>What Do You Need Funds For?</h2>
            </div>
            <p>
              Whether it’s immediate personal requirements, business expansion, or property-backed funding, explore options tailored to your profile.
            </p>
          </div>
          <div className="loan-grid">
            {LOAN_CATEGORIES.map(l => (
              <Link to={`/apply?type=${l.id}`} className={`loan-card ${l.categoryClass}`} key={l.id}>
                <div className="loan-card-top">
                  <div className="loan-card-icon">{l.icon}</div>
                  <div>
                    <h3>{l.title}</h3>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{l.highlight}</span>
                  </div>
                </div>
                <p>{l.copy}</p>
                <div className="loan-card-cta">
                  Check Eligibility <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. CIBIL SECTION */}
        <section className="section cibil-section" id="cibil">
          <div className="center-head">
            <span className="section-tag">CREDIT SCORE TRANSPARENCY • सिबिल मार्गदर्शिका</span>
            <h2>Not Sure Your CIBIL Is Good Enough?</h2>
            <p>
              Your credit profile is only one part of the assessment. Start your application and understand your preliminary loan range.
            </p>
          </div>
          <div className="cibil-cards-grid">
            <div className="cibil-card good">
              <span className="cibil-card-tier">GOOD CREDIT</span>
              <div className="cibil-card-score">CIBIL 750+</div>
              <p>Higher potential funding range, subject to income, repayment history and partner lender eligibility.</p>
            </div>
            <div className="cibil-card mid">
              <span className="cibil-card-tier">MID RANGE</span>
              <div className="cibil-card-score">CIBIL 650–749</div>
              <p>Funding options may be available depending on current monthly income, existing obligations and lender policy.</p>
            </div>
            <div className="cibil-card low">
              <span className="cibil-card-tier">LOW / LIMITED CREDIT</span>
              <div className="cibil-card-score">Below 650 / Limited</div>
              <p>Some funding options may still be available depending on the complete profile, stability and verification.</p>
            </div>
          </div>
          <div className="compliance-box">
            <i>ℹ️</i>
            <span>
              <strong>Truthful Lending Standard:</strong> Loan eligibility, interest rates, tenure, amount and approvals are strictly determined by lenders after verification. We do not provide false guarantees or misleading approvals.
            </span>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="section" id="how">
          <div className="center-head">
            <span className="section-tag">APPLICATION PROCESS • आवेदन प्रक्रिया</span>
            <h2>How Your Loan Journey Works</h2>
            <p>Simple, guided assistance designed to get your profile evaluated without confusing paperwork.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">STEP 01</span>
              <h3>Share Your Profile</h3>
              <p>Select your required loan category and provide your basic income and credit details in our 4-step form.</p>
            </div>
            <div className="step-card">
              <span className="step-number">STEP 02</span>
              <h3>Get Preliminary Range</h3>
              <p>Instantly receive your calculated preliminary estimated eligibility range based on your financial parameters.</p>
            </div>
            <div className="step-card">
              <span className="step-number">STEP 03</span>
              <h3>Consultation & Support</h3>
              <p>Continue with our dedicated loan assistance specialists who guide your file through suitable lender policies.</p>
            </div>
          </div>
        </section>

        {/* CITIZEN CHARTER SECTION */}
        <CitizenCharterSection />

        {/* SCHEDULED BANKS DIRECTORY SECTION */}
        <ScheduledBanksDirectory />

        {/* GRIEVANCE REDRESSAL SECTION */}
        <GrievanceRedressalSection onOpenLegal={onOpenLegal} />

        {/* 5. FAQ */}
        <section className="section faq-section" id="faq">
          <div className="center-head">
            <span className="section-tag">BORROWER HELP & FAQ • प्रश्न एवं उत्तर</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item" open>
              <summary>Do you guarantee loan approval?</summary>
              <p>No. Loan approval, disbursed amount, interest rate and tenure are decided exclusively by the respective lender after credit checks and document verification. We assist you through the process.</p>
            </details>
            <details className="faq-item">
              <summary>Can I apply with a low CIBIL score?</summary>
              <p>Yes. You can submit your profile for review. While a higher CIBIL score expands lender options, candidates with low or limited credit history can still be evaluated based on income stability and lender criteria.</p>
            </details>
            <details className="faq-item">
              <summary>How is the preliminary eligibility range calculated?</summary>
              <p>Our preliminary range engine evaluates your self-reported CIBIL range, net monthly income, and requested amount to compute an initial reference range before detailed lender underwriting.</p>
            </details>
            <details className="faq-item">
              <summary>What initial documents are required?</summary>
              <p>To begin preliminary review, we request only your Aadhaar, PAN card, and a clear selfie photo for identity validation. All documents are kept strictly confidential.</p>
            </details>
            <details className="faq-item">
              <summary>Will paying any fee guarantee loan disbursement?</summary>
              <p>No. Payment of any consultation service fee covers expert file assistance and consultation. It does not constitute a loan approval or disbursement guarantee.</p>
            </details>
          </div>
        </section>
      </main>
      <Footer onOpenLegal={onOpenLegal} />
    </div>
  );
}

const EVAL_STAGES = [
  { id: 1, text: "Scanning submitted documents & verifying KYC identity...", doneText: "Aadhaar & PAN Identity Authenticated ✓", pct: 25 },
  { id: 2, text: "Connecting to credit bureaus & validating CIBIL profile...", doneText: "CIBIL Score Analyzed (High Confidence Tier) ✓", pct: 50 },
  { id: 3, text: "Analyzing income stability & debt-to-income (DTI) ratio...", doneText: "Repayment Capacity Cleared ✓", pct: 75 },
  { id: 4, text: "Routing profile across 40+ scheduled banks & NBFC schemes...", doneText: "Multi-Lender Match Schemes Found ✓", pct: 90 },
  { id: 5, text: "Calculating optimal pre-approved loan limit & tenure...", doneText: "Sanction Limit Finalized & Ready! ✓", pct: 100 }
];

// 4-STEP APPLICATION FORM COMPONENT
function Apply({ onOpenLegal }) {
  const [searchParams] = useSearchParams();
  const preselectType = searchParams.get("type") || "personal";

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Underwriting Evaluation state & animated progress bar
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalIndex, setEvalIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    loanType: preselectType,
    loanAmount: "250000",
    purpose: "Personal & Family Expenses",
    city: "",
    name: "",
    mobile: "",
    email: "",
    employment: "Salaried",
    monthlyIncome: "45000",
    cibil: "700–749",
    existingEmi: "0",
    preferredTenure: "24-36 months",
    consent: true
  });

  // Uploaded Files State
  const [files, setFiles] = useState({
    aadhaar: null,
    pan: null,
    selfie: null
  });
  const [filePreviews, setFilePreviews] = useState({
    aadhaar: "",
    pan: "",
    selfie: ""
  });

  // Post Submission Result Stages: "splash" -> "amount" -> "payment"
  const [submissionResult, setSubmissionResult] = useState(null);
  const [resultStage, setResultStage] = useState("splash"); // "splash" | "amount" | "payment"
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (step === 5 && resultStage === "splash") {
      const timer = setTimeout(() => {
        setResultStage("amount");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step, resultStage]);

  // Automated progress bar sequence when evaluating
  useEffect(() => {
    if (!isEvaluating) return;

    const interval = setInterval(() => {
      setEvalProgress(prev => {
        if (prev >= 96) {
          clearInterval(interval);
          return 96;
        }
        const inc = Math.floor(Math.random() * 6) + 5;
        const nxt = Math.min(prev + inc, 96);
        if (nxt >= 90) setEvalIndex(4);
        else if (nxt >= 75) setEvalIndex(3);
        else if (nxt >= 50) setEvalIndex(2);
        else if (nxt >= 25) setEvalIndex(1);
        return nxt;
      });
    }, 240);

    return () => clearInterval(interval);
  }, [isEvaluating]);

  const updateField = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  const handleFileChange = (field, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setFiles(prev => ({ ...prev, [field]: file }));
    if (file.type.startsWith("image/")) {
      setFilePreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    } else {
      setFilePreviews(prev => ({ ...prev, [field]: "pdf" }));
    }
  };

  const removeFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    setFilePreviews(prev => ({ ...prev, [field]: "" }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.loanAmount || Number(formData.loanAmount) < 10000) {
      setErrorMsg("Please specify a required loan amount of at least ₹10,000");
      return false;
    }
    if (!formData.city.trim()) {
      setErrorMsg("Please enter your current city");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full legal name as on PAN/Aadhaar");
      return false;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)");
      return false;
    }
    if (!formData.monthlyIncome || Number(formData.monthlyIncome) < 5000) {
      setErrorMsg("Please enter your monthly income");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!formData.cibil) {
      setErrorMsg("Please select your approximate CIBIL / credit score range");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  // Final Submit Handler (Step 4 -> Submit)
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMsg("Please accept the consent for evaluating your loan request");
      return;
    }

    setBusy(true);
    setErrorMsg("");
    setIsEvaluating(true);
    setEvalProgress(12);
    setEvalIndex(0);

    try {
      // 1. Submit Application Data
      const appRes = await fetch(`${API}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const appData = await appRes.json();
      if (!appRes.ok) throw new Error(appData.error || "Failed to submit application");

      const appId = appData.applicationId;

      // 2. Upload Documents if selected
      const hasFiles = files.aadhaar || files.pan || files.selfie;
      if (hasFiles) {
        const uploadData = new FormData();
        if (files.aadhaar) uploadData.append("aadhaar", files.aadhaar);
        if (files.pan) uploadData.append("pan", files.pan);
        if (files.selfie) uploadData.append("selfie", files.selfie);

        await fetch(`${API}/applications/${appId}/documents`, {
          method: "POST",
          body: uploadData
        });
      }

      // Allow the underwriting checklist & progress animation to run (~3.8s) so user sees each step complete
      await new Promise(r => setTimeout(r, 3800));

      setEvalProgress(100);
      setEvalIndex(4);

      // Brief pause at 100% to let user see final checkmark
      await new Promise(r => setTimeout(r, 600));

      setIsEvaluating(false);
      setSubmissionResult(appData);
      setResultStage("splash");
      setStep(5); // Show full-screen green eligible animation
    } catch (err) {
      setIsEvaluating(false);
      setErrorMsg(err.message || "Failed to submit application");
    } finally {
      setBusy(false);
    }
  };

  // Payment Handler (Triggered after Result is displayed)
  const handlePayment = async () => {
    if (!submissionResult) return;
    setPaymentLoading(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch(`${API}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: submissionResult.applicationId })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to initialize payment");

      // 2. Client Payment Execution (Razorpay or simulated verified sandbox)
      const testPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // 3. Verify Payment Server-Side
      const verifyRes = await fetch(`${API}/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: submissionResult.applicationId,
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: "sandbox_verified_signature",
          test_mode: true
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Payment signature verification failed");

      setPaymentSuccess({
        paymentId: testPaymentId,
        amount: "₹352.82",
        orderId: orderData.orderId
      });
    } catch (err) {
      alert("Payment processing error: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div>
      <Header onOpenLegal={onOpenLegal} />
      <main className="apply-page">
        {/* UNDERWRITING EVALUATION MODAL OVERLAY */}
        {isEvaluating && (
          <div className="evaluating-screen-overlay">
            <div className="evaluating-card">
              <div className="eval-radar-wrapper">
                <div className="radar-sweep-wave"></div>
                <div className="eval-shield-badge">🛡️</div>
              </div>

              <div className="eval-status-pill">
                <span className="live-dot-pulse"></span> CREDIT ENGINE UNDERWRITING IN PROGRESS
              </div>

              <h2 className="eval-main-title">
                Evaluating Your Loan Eligibility
              </h2>
              <p className="eval-subtitle">
                Please hold on. We are scanning your documents, checking credit bureau data, and querying 40+ lending institutions.
              </p>

              {/* DYNAMIC PROGRESS BAR */}
              <div className="eval-progressbar-card">
                <div className="eval-prog-label">
                  <span>Verification & Bureau Matching</span>
                  <span className="eval-pct-counter">{evalProgress}%</span>
                </div>
                <div className="eval-bar-track">
                  <div className="eval-bar-fill" style={{ width: `${evalProgress}%` }}></div>
                </div>
              </div>

              {/* SEQUENTIAL VERIFICATION CHECKLIST */}
              <div className="eval-checklist">
                {EVAL_STAGES.map((stg, idx) => {
                  const isDone = evalIndex > idx || evalProgress >= stg.pct;
                  const isCurrent = evalIndex === idx && evalProgress < stg.pct;
                  return (
                    <div key={stg.id} className={`eval-check-item ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                      <div className="check-icon-circle">
                        {isDone ? "✓" : isCurrent ? <span className="eval-spinner"></span> : "○"}
                      </div>
                      <div className="check-text-content">
                        <span className="check-title">{isDone ? stg.doneText : stg.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="eval-security-footer">
                <span>🔒 256-Bit SSL Encrypted Verification • Compliant with DPDP Act 2023</span>
              </div>
            </div>
          </div>
        )}

        {step !== 5 ? (
          <div className="apply-gov-hero-banner">
            <div className="apply-gov-emblem-col">
              <img src="/gov_emblem.jpg" alt="National Credit Facilitation Emblem" className="apply-gov-emblem-img" />
              <span className="emblem-sub-text">सत्यमेव जयते</span>
            </div>
            <div className="apply-gov-text-col">
              <div className="apply-gov-pretitle">
                <span className="gov-flag-icon">🇮🇳</span>
                <span>राष्ट्रीय ऋण सुविधा पोर्टल • NATIONAL CREDIT FACILITATION PORTAL</span>
                <span className="gov-sep">|</span>
                <span className="dpdp-tag">DPDP ACT 2023 COMPLIANT</span>
              </div>
              <h1 className="apply-gov-headline">Citizen Loan Pre-Qualification Portal</h1>
              <p className="apply-gov-subline">
                Online evaluation for personal, MSME business, and housing finance across 40+ scheduled commercial banks and RBI-regulated institutions.
              </p>
            </div>
            <div className="apply-gov-officer-col">
              <div className="officer-thumb-frame">
                <img src="/officer_desk.jpg" alt="Bank Officer Verification Desk" className="apply-gov-officer-thumb" />
                <span className="officer-desk-caption">● Active Verification Desk</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="result-top-breadcrumb">
            <Link to="/" className="result-back-link">
              ← Back to Portal Home
            </Link>
            <span className="breadcrumb-dot">•</span>
            <span className="breadcrumb-tag">
              <span className="live-dot-pulse"></span> Official Pre-Qualification Dossier
            </span>
            <span className="breadcrumb-tag ref-tag">
              Ref: <b>{submissionResult.applicationCode || `#LC-${submissionResult.applicationId}`}</b>
            </span>
          </div>
        )}

        <div className={`apply-container ${step === 5 ? "result-wide" : ""}`}>
          {/* STEP INDICATOR (Steps 1 to 4) */}
          {step <= 4 && (
            <div className="step-progress-bar">
              <div className={`step-progress-node ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
                <span className="step-node-num">{step > 1 ? "✓" : "1"}</span>
                <span>Loan Need</span>
              </div>
              <div className={`step-line ${step > 1 ? "active" : ""}`}></div>
              <div className={`step-progress-node ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
                <span className="step-node-num">{step > 2 ? "✓" : "2"}</span>
                <span>Personal</span>
              </div>
              <div className={`step-line ${step > 2 ? "active" : ""}`}></div>
              <div className={`step-progress-node ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>
                <span className="step-node-num">{step > 3 ? "✓" : "3"}</span>
                <span>Credit Profile</span>
              </div>
              <div className={`step-line ${step > 3 ? "active" : ""}`}></div>
              <div className={`step-progress-node ${step >= 4 ? "active" : ""}`}>
                <span className="step-node-num">4</span>
                <span>Documents</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 18px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* STEP 1: LOAN REQUIREMENT */}
          {step === 1 && (
            <div className="form-card">
              <h2 className="form-step-title">1. Your Loan Requirement</h2>
              <p className="form-step-desc">Tell us what type of funding you need and your target amount.</p>
              <div className="form-grid">
                <div className="field-group">
                  <label>Loan Category</label>
                  <select value={formData.loanType} onChange={e => updateField("loanType", e.target.value)}>
                    {LOAN_CATEGORIES.map(cat => (
                      <option value={cat.id} key={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label>Required Loan Amount (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span>₹</span>
                    <input
                      type="number"
                      min="10000"
                      step="5000"
                      value={formData.loanAmount}
                      onChange={e => updateField("loanAmount", e.target.value)}
                      placeholder="e.g. 250000"
                    />
                  </div>
                  <div className="quick-chips">
                    {["50000", "100000", "250000", "500000", "1000000"].map(amt => (
                      <button
                        type="button"
                        className="chip-btn"
                        key={amt}
                        onClick={() => updateField("loanAmount", amt)}
                      >
                        ₹{Number(amt).toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field-group">
                  <label>Loan Purpose</label>
                  <select value={formData.purpose} onChange={e => updateField("purpose", e.target.value)}>
                    <option>Personal & Family Expenses</option>
                    <option>Medical Emergency</option>
                    <option>Business Working Capital / Expansion</option>
                    <option>Education & School Fees</option>
                    <option>Debt Consolidation & Credit Card Clearing</option>
                    <option>Home Renovation / Purchase</option>
                    <option>Vehicle Purchase</option>
                    <option>Other Requirements</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Current City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => updateField("city", e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru, etc."
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                >
                  Continue to Personal Details <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="form-card">
              <h2 className="form-step-title">2. Personal & Employment Details</h2>
              <p className="form-step-desc">Enter your contact and income information to assist preliminary qualification.</p>
              <div className="form-grid">
                <div className="field-group">
                  <label>Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => updateField("name", e.target.value)}
                    placeholder="As printed on PAN card"
                  />
                </div>
                <div className="field-group">
                  <label>Mobile Number (For verification & updates)</label>
                  <div className="input-prefix-wrapper">
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>+91</span>
                    <input
                      type="tel"
                      maxLength="10"
                      value={formData.mobile}
                      onChange={e => updateField("mobile", e.target.value)}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => updateField("email", e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="field-group">
                  <label>Employment Type</label>
                  <select value={formData.employment} onChange={e => updateField("employment", e.target.value)}>
                    <option>Salaried</option>
                    <option>Self-employed</option>
                    <option>Business Owner</option>
                    <option>Professional (Doctor/CA/Lawyer)</option>
                    <option>Other / Freelance</option>
                  </select>
                </div>
                <div className="field-group form-full">
                  <label>Net Monthly Income (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span>₹</span>
                    <input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={e => updateField("monthlyIncome", e.target.value)}
                      placeholder="e.g. 45000"
                    />
                  </div>
                  <div className="quick-chips">
                    {["25000", "40000", "60000", "100000", "200000"].map(inc => (
                      <button
                        type="button"
                        className="chip-btn"
                        key={inc}
                        onClick={() => updateField("monthlyIncome", inc)}
                      >
                        ₹{Number(inc).toLocaleString("en-IN")}/mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                >
                  Continue to Credit Profile <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CREDIT PROFILE */}
          {step === 3 && (
            <div className="form-card">
              <h2 className="form-step-title">3. Credit Profile & Existing EMIs</h2>
              <p className="form-step-desc">All credit profiles are welcomed. Tell us what applies to your current status.</p>
              <div className="form-grid">
                <div className="field-group">
                  <label>CIBIL / Credit Score Range</label>
                  <select value={formData.cibil} onChange={e => updateField("cibil", e.target.value)}>
                    <option value="750+">750+ (Excellent Credit)</option>
                    <option value="700–749">700–749 (Good Credit)</option>
                    <option value="650–699">650–699 (Average Credit)</option>
                    <option value="Below 650">Below 650 (Low Credit / Settlement)</option>
                    <option value="Don't know">Don't know / Not sure</option>
                    <option value="No credit history">No credit history (First time borrower)</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Total Existing Monthly EMIs (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span>₹</span>
                    <input
                      type="number"
                      value={formData.existingEmi}
                      onChange={e => updateField("existingEmi", e.target.value)}
                      placeholder="0 if none"
                    />
                  </div>
                </div>
                <div className="field-group form-full">
                  <label>Preferred Loan Tenure</label>
                  <select value={formData.preferredTenure} onChange={e => updateField("preferredTenure", e.target.value)}>
                    <option>12 to 24 months</option>
                    <option>24 to 36 months</option>
                    <option>36 to 60 months</option>
                    <option>5 years or above</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                >
                  Continue to Documents <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INITIAL DOCUMENTS & CONSENT */}
          {step === 4 && (
            <div className="form-card">
              <h2 className="form-step-title">4. Initial Documents Verification</h2>
              <p className="form-step-desc">
                Only Aadhaar, PAN, and a selfie photo are required at this stage. Upload clear files (PDF, JPG, or PNG up to 5MB).
              </p>

              <div className="doc-upload-grid">
                {/* Aadhaar Upload Box */}
                <div className={`doc-upload-box ${files.aadhaar ? "has-file" : ""}`}>
                  <div>
                    <div className="doc-icon-badge">🆔</div>
                    <h4>Aadhaar Card</h4>
                    <p>Front or combined e-Aadhaar PDF</p>
                    <span className="file-specs">PDF, JPG, PNG &lt; 5MB</span>
                  </div>
                  <div>
                    {files.aadhaar ? (
                      <div>
                        <div className="file-preview-card">
                          <span>✓ {files.aadhaar.name}</span>
                        </div>
                        <button type="button" className="remove-doc-btn" onClick={() => removeFile("aadhaar")}>
                          ✕ Remove / Replace
                        </button>
                      </div>
                    ) : (
                      <label className="upload-action-btn">
                        Select File
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          style={{ display: "none" }}
                          onChange={e => handleFileChange("aadhaar", e)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* PAN Upload Box */}
                <div className={`doc-upload-box ${files.pan ? "has-file" : ""}`}>
                  <div>
                    <div className="doc-icon-badge">💳</div>
                    <h4>PAN Card</h4>
                    <p>Clear photo of PAN card</p>
                    <span className="file-specs">PDF, JPG, PNG &lt; 5MB</span>
                  </div>
                  <div>
                    {files.pan ? (
                      <div>
                        <div className="file-preview-card">
                          <span>✓ {files.pan.name}</span>
                        </div>
                        <button type="button" className="remove-doc-btn" onClick={() => removeFile("pan")}>
                          ✕ Remove / Replace
                        </button>
                      </div>
                    ) : (
                      <label className="upload-action-btn">
                        Select File
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          style={{ display: "none" }}
                          onChange={e => handleFileChange("pan", e)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Selfie Upload Box */}
                <div className={`doc-upload-box ${files.selfie ? "has-file" : ""}`}>
                  <div>
                    <div className="doc-icon-badge">🤳</div>
                    <h4>Selfie Photo</h4>
                    <p>Clear face photo for verification</p>
                    <span className="file-specs">JPG, PNG &lt; 5MB</span>
                  </div>
                  <div>
                    {files.selfie ? (
                      <div>
                        <div className="file-preview-card">
                          <span>✓ {files.selfie.name}</span>
                        </div>
                        <button type="button" className="remove-doc-btn" onClick={() => removeFile("selfie")}>
                          ✕ Remove / Replace
                        </button>
                      </div>
                    ) : (
                      <label className="upload-action-btn">
                        Select Photo
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          style={{ display: "none" }}
                          onChange={e => handleFileChange("selfie", e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* CONSENT AGREEMENT */}
              <div className="consent-agreement">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={formData.consent}
                  onChange={e => updateField("consent", e.target.checked)}
                />
                <label htmlFor="consentCheckbox">
                  I consent to the collection and processing of my information and documents for the purpose of evaluating my loan-service request. I have read and accept the{" "}
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); onOpenLegal("privacy"); }}>Privacy Policy</a>,{" "}
                  <a href="#terms" onClick={(e) => { e.preventDefault(); onOpenLegal("terms"); }}>Terms of Service</a>, and{" "}
                  <a href="#consent" onClick={(e) => { e.preventDefault(); onOpenLegal("consent"); }}>Document Usage & Consent Policy</a>.
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setStep(3)}>
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="primary-btn"
                  onClick={handleSubmitApplication}
                >
                  {busy ? "Assessing Profile..." : "Check My Eligibility →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: MULTI-STAGE PROGRESSIVE CELEBRATION & DISBURSAL FLOW */}
          {step === 5 && submissionResult && (
            <div className="post-submission-view">
              {/* STAGE 1: FULL SCREEN GREEN ELIGIBLE ANIMATION WITH GOV EMBLEM */}
              {resultStage === "splash" && (
                <div className="fullscreen-eligible-splash">
                  <div className="splash-confetti">
                    <span className="sc-item sc-1">🎉</span>
                    <span className="sc-item sc-2">✨</span>
                    <span className="sc-item sc-3">⭐</span>
                    <span className="sc-item sc-4">🎊</span>
                    <span className="sc-item sc-5">💰</span>
                    <span className="sc-item sc-6">✨</span>
                    <span className="sc-item sc-7">🎉</span>
                  </div>

                  <div className="splash-center-content">
                    <div className="splash-emblem-wrap">
                      <img src="/gov_emblem.jpg" alt="National Credit Facilitation Emblem" className="splash-gov-emblem" />
                    </div>

                    <div className="grand-check-wrap">
                      <div className="splash-ripple r1"></div>
                      <div className="splash-ripple r2"></div>
                      <div className="splash-ripple r3"></div>
                      <div className="grand-check-circle">✓</div>
                    </div>

                    <div className="splash-eligible-tag">
                      NATIONAL CREDIT FACILITATION SYSTEM • VERIFIED
                    </div>

                    <h1 className="splash-eligible-title">
                      🎉 YOU ARE ELIGIBLE!
                    </h1>

                    <p className="splash-eligible-subtitle">
                      Congratulations, <b>{formData.name || "Applicant"}</b>! Your profile meets credit underwriting criteria across our verified national partner banking network.
                    </p>

                    <div className="splash-ref-badge">
                      <span>Application Ref: <b>{submissionResult.applicationCode || `#LC-${submissionResult.applicationId}`}</b></span>
                      <span className="badge-sep">•</span>
                      <span className="status-green">● Pre-Approved In-Principle</span>
                    </div>

                    <div className="splash-action-row">
                      <button
                        type="button"
                        className="splash-view-amount-btn"
                        onClick={() => setResultStage("amount")}
                      >
                        <span>View Your Pre-Approved Loan Amount</span>
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>

                    <p className="splash-auto-hint">
                      Auto-advancing to your loan limit in a moment...
                    </p>
                  </div>
                </div>
              )}

              {/* STAGE 2: ELIGIBLE AMOUNT SHOWCASE WITH OFFICIAL STAMP */}
              {resultStage === "amount" && (
                <div className="amount-reveal-view">
                  <div className="amount-header-card">
                    <div className="congrats-chip">
                      <img src="/gov_emblem.jpg" alt="Emblem" style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
                      <span>OFFICIAL PRE-APPROVAL DOSSIER</span>
                    </div>
                    <h2>You Are Pre-Approved For Loan Funding!</h2>
                    <p>Congratulations, <strong>{formData.name}</strong>. Your preliminary loan limit has been unlocked:</p>
                  </div>

                  <div className="amount-hero-display-card">
                    {/* Official Stamp Watermark */}
                    <img src="/approved_stamp.jpg" alt="Official Verified Stamp" className="card-stamp-watermark" />

                    <div className="amount-top-bar">
                      <span className="tag-approved">PRE-QUALIFIED SANCTION ESTIMATE</span>
                      <span className="tag-score">96% Algorithm Match</span>
                    </div>

                    <div className="amount-digits-wrap">
                      <span className="amount-numbers">{submissionResult.estimate?.display || "₹1,00,000 – ₹2,50,000"}</span>
                    </div>

                    <div className="amount-progress-meter">
                      <div className="meter-label-flex">
                        <span>Profile Credit Rating: <b>Excellent Tier</b></span>
                        <span className="meter-pct">High Approval Probability (96%)</span>
                      </div>
                      <div className="meter-bar-track">
                        <div className="meter-bar-fill" style={{ width: "96%" }}></div>
                      </div>
                    </div>

                    <div className="amount-perks-row">
                      <div className="amount-perk">
                        <span className="perk-emoji">⚡</span>
                        <div>
                          <b>Low Interest Rate</b>
                          <small>Starting from 9.9% p.a.</small>
                        </div>
                      </div>
                      <div className="amount-perk">
                        <span className="perk-emoji">⏱️</span>
                        <div>
                          <b>Priority Bank Track</b>
                          <small>Direct file to processing</small>
                        </div>
                      </div>
                      <div className="amount-perk">
                        <span className="perk-emoji">🏛️</span>
                        <div>
                          <b>Multi-Bank Routing</b>
                          <small>40+ Scheduled Banks</small>
                        </div>
                      </div>
                      <div className="amount-perk">
                        <span className="perk-emoji">📑</span>
                        <div>
                          <b>Minimal Paperwork</b>
                          <small>100% Digital KYC</small>
                        </div>
                      </div>
                    </div>

                    <div className="amount-meta-tags">
                      <div className="meta-chip"><span>Requested:</span> <b>₹{Number(formData.loanAmount || 200000).toLocaleString("en-IN")}</b></div>
                      <div className="meta-chip"><span>Tenure:</span> <b>{formData.preferredTenure || "12-36 Months"}</b></div>
                      <div className="meta-chip"><span>Purpose:</span> <b>{formData.purpose || "General Purpose"}</b></div>
                      <div className="meta-chip"><span>Location:</span> <b>{formData.city || "India"}</b></div>
                    </div>
                  </div>

                  <div className="amount-cta-card">
                    <button
                      type="button"
                      className="proceed-claim-offer-btn"
                      onClick={() => setResultStage("payment")}
                    >
                      <span className="btn-shine"></span>
                      <span>Proceed to Claim Your Loan Offer</span>
                      <span className="btn-arrow">→</span>
                    </button>
                    <small className="proceed-sub-hint">
                      Click proceed to send your application dossier to partner bank underwriting
                    </small>
                  </div>
                </div>
              )}

              {/* STAGE 3: FEE PAYMENT (VISUAL 2-COLUMN GOVERNMENT PORTAL LAYOUT) */}
              {resultStage === "payment" && !paymentSuccess && (
                <div className="fee-payment-stage-view">
                  <div className="stage3-gov-grid">
                    {/* LEFT COLUMN: OFFICIAL DOSSIER & REALISTIC BANK DESK IMAGE */}
                    <div className="gov-dossier-col">
                      <div className="dossier-image-card">
                        <div className="dossier-image-wrap">
                          <img src="/officer_desk.jpg" alt="Bank Loan Verification Desk" className="desk-officer-photo" />
                          <div className="officer-photo-overlay">
                            <span className="live-tag">● DIRECT DESK PROCESSING</span>
                            <span className="desk-title">Public & Private Sector Bank Network</span>
                          </div>
                        </div>

                        <div className="dossier-summary-body">
                          <div className="dossier-seal-row">
                            <img src="/gov_emblem.jpg" alt="Emblem" className="seal-mini-img" />
                            <div>
                              <b>National Credit Facilitation Dossier</b>
                              <small>Reference: {submissionResult.applicationCode || `#LC-${submissionResult.applicationId}`}</small>
                            </div>
                          </div>

                          <div className="dossier-data-table">
                            <div className="data-row">
                              <span>Applicant Name:</span>
                              <b>{formData.name || "Vikas Shinde"}</b>
                            </div>
                            <div className="data-row">
                              <span>Pre-Approved Range:</span>
                              <b style={{ color: "#047857" }}>{submissionResult.estimate?.display || "₹1,00,000 – ₹2,50,000"}</b>
                            </div>
                            <div className="data-row">
                              <span>Partner Banks:</span>
                              <span>SBI, PNB, HDFC, ICICI, NBFCs</span>
                            </div>
                            <div className="data-row">
                              <span>File Status:</span>
                              <span className="status-badge-ready">Ready for Bank Processing</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: ACTION & FEE PAYMENT CARD */}
                    <div className="gov-payment-col">
                      <div className="official-fee-payment-card">
                        <div className="gov-header-inline">
                          <img src="/gov_emblem.jpg" alt="Gov Emblem" className="gov-header-emblem" />
                          <div>
                            <span className="gov-subtitle-tag">NATIONAL PORTAL STANDARD</span>
                            <h3 className="gov-card-headline">Dispatch File to Bank Processing</h3>
                          </div>
                        </div>

                        <div className="compact-tracker-bar">
                          <div className="trk-step done">
                            <span className="trk-dot">✓</span>
                            <span>Eligible</span>
                          </div>
                          <div className="trk-line done"></div>
                          <div className="trk-step active">
                            <span className="trk-dot">2</span>
                            <span>Pay Fee</span>
                          </div>
                          <div className="trk-line"></div>
                          <div className="trk-step">
                            <span className="trk-dot">3</span>
                            <span>Bank Processing</span>
                          </div>
                        </div>

                        {/* FEE CALCULATION TABLE */}
                        <div className="fee-calc-table">
                          <div className="fee-calc-row">
                            <span>File Processing & Documentation:</span>
                            <b>₹299.00</b>
                          </div>
                          <div className="fee-calc-row">
                            <span>Government GST (18%):</span>
                            <b>₹53.82</b>
                          </div>
                          <div className="fee-calc-divider"></div>
                          <div className="fee-calc-row total">
                            <span>Total Amount to Pay:</span>
                            <span className="grand-total-amount">₹352.82</span>
                          </div>
                        </div>

                        {/* STRONG ACTION BUTTON */}
                        <button
                          type="button"
                          disabled={paymentLoading}
                          className="strong-disburse-pay-btn"
                          onClick={handlePayment}
                        >
                          <span className="btn-shine"></span>
                          {paymentLoading ? (
                            <span>Connecting Secure Gateway...</span>
                          ) : (
                            <>
                              <span>Pay ₹352.82 to Send File for Bank Processing</span>
                              <span className="btn-arrow">→</span>
                            </>
                          )}
                        </button>

                        {/* PAYMENT TRUST BADGES */}
                        <div className="payment-security-row">
                          <span>🔒 256-Bit SSL Razorpay</span>
                          <span>⚡ UPI (GPay, PhonePe), Cards, NetBanking</span>
                          <span>📱 Instant SMS Confirmation</span>
                        </div>

                        {/* SMALL CONSULTANT NOTE AS EXPLICITLY REQUESTED BY USER */}
                        <p className="consultant-small-note">
                          * Note: LoanConnect India acts as an independent loan consultant and facilitation platform. The non-refundable ₹299 + GST consultation and file processing fee facilitates your application with 40+ scheduled commercial banks and RBI-registered NBFCs. Final loan disbursement and rate depends on document verification and lender underwriting.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {resultStage === "payment" && paymentSuccess && (
                <div className="activation-action-card success-card-activated">
                  <div className="activated-badge-icon">🎉</div>
                  <h3>Loan File Successfully Sent for Bank Processing!</h3>
                  <p className="activated-sub">
                    Payment of <strong>{paymentSuccess.amount}</strong> received. Your file is now under priority bank processing.
                  </p>

                  <div className="assigned-officer-box">
                    <div className="officer-avatar">👨‍💼</div>
                    <div className="officer-meta">
                      <span className="officer-title">Assigned Senior Credit Officer</span>
                      <b>Mr. Sandeep Patil</b>
                      <small>Direct Line: 1800-208-5626 (Ext 402)</small>
                    </div>
                  </div>

                  <div className="receipt-meta-box">
                    <div className="receipt-row">
                      <span>Application No:</span>
                      <b>{submissionResult.applicationCode || `#LC-${submissionResult.applicationId}`}</b>
                    </div>
                    <div className="receipt-row">
                      <span>Transaction ID:</span>
                      <code>{paymentSuccess.paymentId}</code>
                    </div>
                    <div className="receipt-row">
                      <span>Status:</span>
                      <span className="badge-paid">Paid & Sent to Processing</span>
                    </div>
                  </div>

                  <p className="next-contact-msg">
                    Your loan sanction file is active. Our credit officer will call you on <strong>+91 {formData.mobile}</strong> within 30 minutes to complete the final processing with the matched bank.
                  </p>

                  <div className="post-payment-actions">
                    <Link to="/" className="secondary-btn">
                      ← Return to Home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer onOpenLegal={onOpenLegal} />
    </div>
  );
}

// ADMIN PORTAL & APPLICANT DETAIL VIEW
function Admin({ onOpenLegal }) {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [loginForm, setLoginForm] = useState({ email: "admin@example.com", password: "" });
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loanFilter, setLoanFilter] = useState("all");

  // Selected application for detail view modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newNote, setNewNote] = useState("");

  const loadApplications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const q = new URLSearchParams({
        search,
        status: statusFilter,
        paymentStatus: paymentFilter,
        loanType: loanFilter
      });
      const res = await fetch(`${API}/admin/applications?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load applications");
      setApps(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadApplications();
  }, [token, statusFilter, paymentFilter, loanFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplications();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid admin credentials");
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setSelectedApp(null);
  };

  const updateAppStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      loadApplications();
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const updateDocStatus = async (id, docStatus) => {
    try {
      const res = await fetch(`${API}/admin/applications/${id}/documents-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ docStatus })
      });
      if (!res.ok) throw new Error("Failed to update document status");
      loadApplications();
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(prev => ({ ...prev, doc_status: docStatus }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedApp) return;
    try {
      const res = await fetch(`${API}/admin/applications/${selectedApp.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note: newNote.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add note");
      setSelectedApp(prev => ({ ...prev, notes: data.notes }));
      setNewNote("");
      loadApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAppDetail = async (id) => {
    try {
      const res = await fetch(`${API}/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedApp(data.application);
    } catch (err) {
      alert(err.message);
    }
  };

  // Secure document viewer
  const viewSecureDoc = (id, docType) => {
    window.open(`${API}/admin/applications/${id}/documents/${docType}?token=${token}`, "_blank");
  };

  if (!token) {
    return (
      <div className="admin-login" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc", padding: "20px" }}>
        <div style={{ background: "#ffffff", padding: "36px", borderRadius: "20px", width: "100%", maxWidth: "420px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <div className="brand" style={{ marginBottom: "20px" }}>
            <span className="brand-mark">₹</span>
            <span>Loan<span>Connect</span><small>ADMIN PORTAL</small></span>
          </div>
          <h2 style={{ fontSize: "22px", margin: "0 0 8px" }}>Sign In to Admin</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px" }}>Manage loan applications, view verified documents and update pipeline.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            {error && <div style={{ color: "#dc2626", fontSize: "13px" }}>{error}</div>}
            <button type="submit" className="primary-btn" style={{ justifyContent: "center" }}>
              Sign In <span>→</span>
            </button>
          </form>
          <small style={{ display: "block", color: "#94a3b8", marginTop: "20px", textAlign: "center" }}>
            Demo credentials configured in <code>.env</code>
          </small>
        </div>
      </div>
    );
  }

  // Calculate dashboard metrics
  const totalCount = apps.length;
  const newCount = apps.filter(a => a.status === "new").length;
  const paidCount = apps.filter(a => a.payment_status === "paid").length;
  const reviewCount = apps.filter(a => a.status === "under_review").length;
  const contactedCount = apps.filter(a => a.status === "contacted").length;
  const processingCount = apps.filter(a => a.status === "processing").length;
  const completedCount = apps.filter(a => a.status === "completed").length;

  return (
    <div className="admin-view">
      <header className="admin-header">
        <Link to="/" className="brand">
          <span className="brand-mark">₹</span>
          <span>Loan<span>Connect</span><small>ADMIN PIPELINE</small></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button className="secondary-btn" onClick={loadApplications}>↻ Refresh</button>
          <button className="secondary-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-top-bar">
          <div>
            <h1>Loan Applications Pipeline</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0" }}>Review applicant profiles, preliminary ranges, documents and payments.</p>
          </div>
        </div>

        {/* STATS METRIC COUNTERS */}
        <div className="stats-cards-grid">
          <div className="stat-box">
            <span>Total Applications</span>
            <b>{totalCount}</b>
          </div>
          <div className="stat-box">
            <span>New Applications</span>
            <b style={{ color: "#2563eb" }}>{newCount}</b>
          </div>
          <div className="stat-box">
            <span>Paid Applications</span>
            <b style={{ color: "#16a34a" }}>{paidCount}</b>
          </div>
          <div className="stat-box">
            <span>Under Review / Contacted</span>
            <b style={{ color: "#d97706" }}>{reviewCount + contactedCount}</b>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <form onSubmit={handleSearchSubmit} className="admin-filters">
          <input
            type="text"
            placeholder="Search by name, mobile, application code (e.g. LC-1001), or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Application Statuses</option>
            <option value="new">New</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="under_review">Under Review</option>
            <option value="documents_required">Documents Required</option>
            <option value="contacted">Contacted</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid (₹352.82)</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
          </select>
          <select value={loanFilter} onChange={e => setLoanFilter(e.target.value)}>
            <option value="all">All Loan Categories</option>
            {LOAN_CATEGORIES.map(l => (
              <option value={l.id} key={l.id}>{l.title}</option>
            ))}
          </select>
          <button type="submit" className="primary-btn" style={{ padding: "10px 18px" }}>Filter</button>
        </form>

        {/* APPLICATION TABLE */}
        <div className="admin-table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Applicant Name</th>
                  <th>Mobile</th>
                  <th>Loan Category</th>
                  <th>Requested Amount</th>
                  <th>CIBIL</th>
                  <th>Monthly Income</th>
                  <th>Preliminary Range</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                      {loading ? "Loading applications..." : "No applications found matching criteria."}
                    </td>
                  </tr>
                ) : (
                  apps.map(app => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.application_code || `#LC-${app.id}`}</strong>
                        <small style={{ display: "block", color: "#9ca3af" }}>{new Date(app.created_at).toLocaleDateString("en-IN")}</small>
                      </td>
                      <td>
                        <b>{app.name}</b>
                        <small style={{ display: "block", color: "#64748b" }}>{app.city}</small>
                      </td>
                      <td>{app.mobile}</td>
                      <td>
                        <span style={{ textTransform: "capitalize" }}>{app.loan_type}</span>
                      </td>
                      <td>₹{Number(app.loan_amount || 0).toLocaleString("en-IN")}</td>
                      <td>
                        <span className="cibil-pill">{app.cibil}</span>
                      </td>
                      <td>₹{Number(app.monthly_income || 0).toLocaleString("en-IN")}</td>
                      <td>
                        <b style={{ color: "#b45309" }}>{app.estimate_label || "₹25,000 – ₹50,000"}</b>
                      </td>
                      <td>
                        <span className={`badge ${app.payment_status === "paid" ? "badge-paid" : "badge-unpaid"}`}>
                          {app.payment_status === "paid" ? "✓ Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={app.status}
                          onChange={e => updateAppStatus(app.id, e.target.value)}
                          style={{ fontSize: "12px", padding: "5px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        >
                          <option value="new">New</option>
                          <option value="payment_pending">Payment Pending</option>
                          <option value="paid">Paid</option>
                          <option value="under_review">Under Review</option>
                          <option value="documents_required">Docs Required</option>
                          <option value="contacted">Contacted</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => openAppDetail(app.id)}
                        >
                          View Profile →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* APPLICANT DETAIL MODAL */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#ea580c" }}>APPLICANT DOSSIER</span>
                <h3 style={{ margin: "2px 0 0" }}>
                  {selectedApp.application_code || `#LC-${selectedApp.id}`} — {selectedApp.name}
                </h3>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedApp(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* STATUS UPDATE HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff7ed", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#9a3412" }}>Current Lifecycle Status:</span>
                  <div style={{ fontWeight: 800, textTransform: "uppercase", color: "#c2410c", marginTop: "2px" }}>
                    {selectedApp.status.replace("_", " ")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700 }}>Update Status:</label>
                  <select
                    value={selectedApp.status}
                    onChange={e => updateAppStatus(selectedApp.id, e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="new">New</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="paid">Paid</option>
                    <option value="under_review">Under Review</option>
                    <option value="documents_required">Documents Required</option>
                    <option value="contacted">Contacted</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* DETAIL SECTIONS */}
              <div className="applicant-detail-grid">
                {/* 1. PERSONAL DETAILS */}
                <div className="detail-section">
                  <h4>Personal & Contact</h4>
                  <div className="detail-row">
                    <span>Full Name:</span>
                    <span>{selectedApp.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Mobile:</span>
                    <span>+91 {selectedApp.mobile}</span>
                  </div>
                  <div className="detail-row">
                    <span>Email:</span>
                    <span>{selectedApp.email || "Not provided"}</span>
                  </div>
                  <div className="detail-row">
                    <span>City:</span>
                    <span>{selectedApp.city}</span>
                  </div>
                  <div className="detail-row">
                    <span>Employment:</span>
                    <span>{selectedApp.employment}</span>
                  </div>
                  <div className="detail-row">
                    <span>Monthly Income:</span>
                    <span>₹{Number(selectedApp.monthly_income || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* 2. LOAN & CREDIT PROFILE */}
                <div className="detail-section">
                  <h4>Loan & Credit Profile</h4>
                  <div className="detail-row">
                    <span>Loan Category:</span>
                    <span style={{ textTransform: "capitalize" }}>{selectedApp.loan_type}</span>
                  </div>
                  <div className="detail-row">
                    <span>Requested Amount:</span>
                    <span>₹{Number(selectedApp.loan_amount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="detail-row">
                    <span>Reported CIBIL:</span>
                    <span style={{ color: "#d97706", fontWeight: 800 }}>{selectedApp.cibil}</span>
                  </div>
                  <div className="detail-row">
                    <span>Existing Monthly EMI:</span>
                    <span>₹{Number(selectedApp.existing_emi || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="detail-row">
                    <span>Tenure:</span>
                    <span>{selectedApp.preferred_tenure || "24-36 months"}</span>
                  </div>
                  <div className="detail-row">
                    <span>Purpose:</span>
                    <span>{selectedApp.purpose}</span>
                  </div>
                </div>

                {/* 3. PRELIMINARY ESTIMATE */}
                <div className="detail-section" style={{ gridColumn: "span 2", background: "#fffdf9", borderColor: "#fde68a" }}>
                  <h4>Preliminary Eligibility Assessment</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#92400e" }}>CALCULATED PRELIMINARY RANGE:</span>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#b45309", marginTop: "4px" }}>
                        {selectedApp.estimate_label || "₹25,000 – ₹50,000"}
                      </div>
                    </div>
                    <div style={{ maxWidth: "420px", fontSize: "12px", color: "#78350f" }}>
                      Preliminary service estimate calculated based on CIBIL category, monthly income ratio and requested principal. Non-guaranteed.
                    </div>
                  </div>
                </div>

                {/* 4. DOCUMENTS MANAGEMENT */}
                <div className="detail-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0 }}>Identity Documents</h4>
                    <select
                      value={selectedApp.doc_status || "pending"}
                      onChange={e => updateDocStatus(selectedApp.id, e.target.value)}
                      style={{ fontSize: "11px", padding: "3px 6px" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="uploaded">Uploaded</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="doc-row-item">
                    <span>🆔 Aadhaar Document</span>
                    {selectedApp.aadhaar_file ? (
                      <button type="button" className="doc-download-link" onClick={() => viewSecureDoc(selectedApp.id, "aadhaar")}>
                        View Document ↗
                      </button>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not uploaded</span>
                    )}
                  </div>
                  <div className="doc-row-item">
                    <span>💳 PAN Card</span>
                    {selectedApp.pan_file ? (
                      <button type="button" className="doc-download-link" onClick={() => viewSecureDoc(selectedApp.id, "pan")}>
                        View Document ↗
                      </button>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not uploaded</span>
                    )}
                  </div>
                  <div className="doc-row-item">
                    <span>🤳 Selfie Verification</span>
                    {selectedApp.selfie_file ? (
                      <button type="button" className="doc-download-link" onClick={() => viewSecureDoc(selectedApp.id, "selfie")}>
                        View Photo ↗
                      </button>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not uploaded</span>
                    )}
                  </div>
                </div>

                {/* 5. PAYMENT STATUS */}
                <div className="detail-section">
                  <h4>Consultation Fee & Payment</h4>
                  <div className="detail-row">
                    <span>Payment Status:</span>
                    <span className={`badge ${selectedApp.payment_status === "paid" ? "badge-paid" : "badge-unpaid"}`}>
                      {selectedApp.payment_status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Service Fee:</span>
                    <span>₹299.00</span>
                  </div>
                  <div className="detail-row">
                    <span>GST (18%):</span>
                    <span>₹53.82</span>
                  </div>
                  <div className="detail-row">
                    <span>Total Amount:</span>
                    <b>₹352.82</b>
                  </div>
                  {selectedApp.payment_id && (
                    <div className="detail-row">
                      <span>Payment ID:</span>
                      <code style={{ fontSize: "11px" }}>{selectedApp.payment_id}</code>
                    </div>
                  )}
                  {selectedApp.paid_at && (
                    <div className="detail-row">
                      <span>Paid At:</span>
                      <span>{new Date(selectedApp.paid_at).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* INTERNAL NOTES SECTION */}
              <div className="detail-section notes-container">
                <h4>Internal Notes</h4>
                <div className="notes-list">
                  {(selectedApp.notes || []).length === 0 ? (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>No internal notes recorded yet.</span>
                  ) : (
                    (selectedApp.notes || []).map((n, idx) => (
                      <div className="note-item" key={idx}>
                        <div>{n.text}</div>
                        <small>By {n.author || "Admin"} • {new Date(n.created_at).toLocaleString("en-IN")}</small>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Add internal note (e.g. Called applicant — waiting for additional income proof)..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                  <button type="button" className="primary-btn" style={{ padding: "8px 16px", fontSize: "13px" }} onClick={addNote}>
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// LEGAL MODALS (Privacy, Terms, Consent, Refund)
function LegalModal({ type, onClose }) {
  if (!type) return null;

  const content = {
    privacy: {
      title: "Privacy Policy & Document Confidentiality",
      body: (
        <div>
          <p><strong>Last Updated: September 2026</strong></p>
          <p>LoanConnect India is committed to protecting your sensitive personal information and documents. We adhere to applicable Indian data protection principles under the Digital Personal Data Protection Act (DPDP Act) and relevant RBI digital lending guidelines.</p>
          <h4>1. Document Privacy & Retention</h4>
          <p>Aadhaar cards, PAN cards, and selfie images collected during initial assessment are stored exclusively in authenticated, encrypted private storage with restricted administrative access. Documents are never exposed publicly or indexed by search engines.</p>
          <h4>2. Usage for Loan Evaluation</h4>
          <p>Your information is used solely for the purpose of evaluating your loan-service request, establishing preliminary eligibility, and connecting your profile with suitable registered lending institutions.</p>
          <h4>3. Non-Disclosure</h4>
          <p>We do not sell, rent, or trade your personal or financial data to third-party telemarketers.</p>
        </div>
      )
    },
    terms: {
      title: "Terms of Service & Consultation Scope",
      body: (
        <div>
          <p><strong>1. Nature of Service</strong></p>
          <p>LoanConnect India is an independent loan consultation, profile evaluation, and facilitation platform. We are not a bank or Non-Banking Financial Company (NBFC) and do not directly lend money.</p>
          <p><strong>2. Non-Guarantee of Approval or Disbursement</strong></p>
          <p>Loan approval, interest rates, tenure, amount, and disbursement are at the sole discretion of partner lenders and subject to document verification, lender policies, and borrower credit checks. LoanConnect India does not provide 100% approval or disbursement guarantees.</p>
          <p><strong>3. Service & Consultation Fee</strong></p>
          <p>Where applicable, the ₹299 + GST consultation fee covers professional profile evaluation and application facilitation services. Payment of this fee does not constitute a loan approval fee or guarantee loan disbursement.</p>
        </div>
      )
    },
    refund: {
      title: "Refund & Cancellation Policy",
      body: (
        <div>
          <p><strong>1. Consultation Service Fee</strong></p>
          <p>The ₹299 + GST (Total ₹352.82) consultation charge covers the administrative and expert evaluation cost incurred by our specialists upon reviewing your application profile.</p>
          <p><strong>2. Non-Refundable Scope</strong></p>
          <p>Because loan assessment and profile evaluation services begin immediately upon submission and payment, the service fee is non-refundable regardless of whether a third-party lender subsequently approves or rejects your loan application.</p>
          <p><strong>3. Duplicate Charges</strong></p>
          <p>In the event of duplicate payment transactions caused by network errors, excess charges will be refunded to the original payment source within 5 to 7 business days upon verification.</p>
        </div>
      )
    },
    consent: {
      title: "Document Usage & Consent Agreement",
      body: (
        <div>
          <p>By submitting your application and uploading your Aadhaar, PAN card, and selfie photo, you voluntarily provide express consent to LoanConnect India and its authorized representatives to:</p>
          <ul>
            <li>Collect, verify, and securely store your identity details for the purpose of evaluating your loan application.</li>
            <li>Analyze your creditworthiness indicators and compute your preliminary eligibility range.</li>
            <li>Contact you via phone, SMS, WhatsApp, and email regarding your loan request.</li>
            <li>Share your applicant profile with authorized lending partners (RBI-registered banks and NBFCs) for formal loan evaluation.</li>
          </ul>
        </div>
      )
    }
  }[type];

  if (!content) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{content.title}</h3>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", lineHeight: "1.7", color: "#374151" }}>
          {content.body}
        </div>
      </div>
    </div>
  );
}

// GIGW-COMPLIANT INSTITUTIONAL FOOTER COMPONENT
function Footer({ onOpenLegal }) {
  return (
    <footer className="gov-master-footer">
      <div className="gov-footer-accent-line"></div>
      
      <div className="gov-footer-top">
        <div className="gov-footer-brand-col">
          <div className="gov-footer-brand">
            <div className="gov-seal-monogram small">
              <span className="seal-emblem-star">★</span>
              <span className="seal-rupee">₹</span>
            </div>
            <div>
              <span className="gov-footer-brand-title">Loan<span style={{ color: "#f97316" }}>Connect</span> INDIA</span>
              <span className="gov-footer-brand-sub">राष्ट्रीय ऋण सुविधा एवं मार्गदर्शन मंच</span>
            </div>
          </div>
          <p className="gov-footer-desc">
            LoanConnect India operates as a premier digital loan facilitation and credit advisory platform, enabling transparent, ethical, and secure credit access for citizens across diverse financial backgrounds and credit profiles.
          </p>
          <div className="gov-footer-trust-marks">
            <span className="gov-trust-badge-footer">🔒 256-Bit SSL Encrypted</span>
            <span className="gov-trust-badge-footer">🛡️ DPDP Act 2023 Compliant</span>
            <span className="gov-trust-badge-footer">🏛️ ISO 27001 Standards</span>
          </div>
        </div>

        <div className="gov-footer-links-col">
          <h4>Citizen Services & Schemes</h4>
          <a href="/#loans">Personal Loan Schemes</a>
          <a href="/#loans">MSME & Business Finance</a>
          <a href="/#loans">Housing & Home Loans</a>
          <a href="/#loans">Loan Against Property (LAP)</a>
          <Link to="/apply">Check Eligibility Range</Link>
          <a href="/#charter">Citizen Service Charter</a>
        </div>

        <div className="gov-footer-links-col">
          <h4>Statutory & Compliance</h4>
          <a onClick={() => onOpenLegal("privacy")}>Privacy Policy (गोपनीयता नीति)</a>
          <a onClick={() => onOpenLegal("terms")}>Terms of Advisory Service</a>
          <a onClick={() => onOpenLegal("refund")}>Refund & Consultation Policy</a>
          <a onClick={() => onOpenLegal("consent")}>DPDP Document Usage Consent</a>
          <a href="/#grievance">Public Grievance Redressal</a>
          <Link to="/admin">Internal Officer Portal</Link>
        </div>

        <div className="gov-footer-links-col">
          <h4>National Helpdesk & Nodal Desk</h4>
          <div className="gov-footer-contact">
            <p><strong>Toll-Free Advisory:</strong> 1800-208-5626</p>
            <p><strong>Citizen Support:</strong> support@loanconnectindia.in</p>
            <p><strong>Grievance Officer:</strong> grievance@loanconnectindia.in</p>
            <p><strong>Operational Hours:</strong> Monday – Saturday (9:30 AM – 6:30 PM IST)</p>
            <p><strong>Central Advisory Desk:</strong> Connaught Place, New Delhi 110001</p>
          </div>
        </div>
      </div>

      <div className="gov-footer-statutory-notice">
        <div className="gov-statutory-content">
          <strong>वैधानिक अस्वीकरण / Statutory Regulatory Disclaimer:</strong> LoanConnect India is an independent financial advisory and credit facilitation portal. We are not a government ministry, department, or lending institution. We do not issue loans or collect deposits. All loan sanctions, applicable interest rates, processing fees, repayment tenures, and disbursements are governed solely by individual RBI-registered Scheduled Commercial Banks and NBFCs in accordance with applicable Reserve Bank of India Master Directions and credit policies. Preliminary assessments generated on this platform are advisory reference estimates and do not constitute a legal approval or sanction guarantee.
        </div>
      </div>

      <div className="gov-footer-bottom-bar">
        <div className="gov-footer-meta">
          <span>वेबसाइट सामग्री प्रबंधन: लोनकनेक्ट एडवाइजरी सर्विसेज | Website Content Managed by LoanConnect India Advisory Services</span>
          <span className="gov-footer-divider">•</span>
          <span>Last Reviewed & Updated: 21 September 2026</span>
          <span className="gov-footer-divider">•</span>
          <span>Screen Resolution: 1366x768 or higher recommended</span>
        </div>
        <div className="gov-footer-copyright">
          © 2026 LoanConnect India. All Rights Reserved. GIGW & DPDP Compliant Architecture.
        </div>
      </div>
    </footer>
  );
}

// MAIN APPLICATION ROUTER
function App() {
  const [legalModal, setLegalModal] = useState(null);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onOpenLegal={setLegalModal} />} />
        <Route path="/apply" element={<Apply onOpenLegal={setLegalModal} />} />
        <Route path="/admin" element={<Admin onOpenLegal={setLegalModal} />} />
      </Routes>
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
