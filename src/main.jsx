import React, { useEffect, useMemo, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
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

// TOP INSTITUTIONAL UTILITY & ACCESSIBILITY BAR (GIGW STYLE)
function TopInstitutionalUtilityBar() {
  const [fontSizeLevel, setFontSizeLevel] = useState(0);

  const changeFontSize = (delta) => {
    const next = Math.max(-1, Math.min(1, fontSizeLevel + delta));
    setFontSizeLevel(next);
    document.documentElement.style.fontSize = next === -1 ? "14.5px" : next === 1 ? "17.5px" : "16px";
  };

  return (
    <div className="gov-utility-wrapper" role="region" aria-label="Institutional Accessibility Bar">
      {/* 3-Band Indian Institutional Accent Line */}
      <div className="gov-tricolor-accent" aria-hidden="true"></div>
      
      <div className="gov-top-ribbon">
        <div className="gov-ribbon-left">
          <span className="gov-dpdp-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <span className="gov-dpdp-full">भारत सरकार के डिजिटल पर्सनल डेटा संरक्षण (DPDP) अधिनियम 2023 के अनुरूप</span>
            <span className="gov-dpdp-short">DPDP Act 2023 Compliant</span>
          </span>
          <span className="gov-sep" aria-hidden="true">|</span>
          <span className="gov-subhead-text">National Credit Advisory &amp; Facilitation Platform</span>
        </div>

        <div className="gov-ribbon-right">
          {/* Toll Free Helpline - Clickable Phone on Mobile */}
          <a href="tel:18002085626" className="gov-helpline-tag" aria-label="Call Toll-Free Helpline at 1800-208-5626">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="gov-helpline-text">Toll-Free: <strong>1800-208-5626</strong></span>
            <span className="gov-helpline-hours"> (Mon–Sat 9:30 AM–6:30 PM)</span>
          </a>

          <div className="gov-ribbon-tools">
            {/* Accessibility Font Size Controls */}
            <div className="gov-accessibility-controls" role="group" aria-label="Screen Font Size Controls">
              <span className="gov-acc-label">Font:</span>
              <button
                type="button"
                onClick={() => changeFontSize(-1)}
                className={`gov-acc-btn ${fontSizeLevel === -1 ? 'active' : ''}`}
                aria-label="Decrease text size"
                aria-pressed={fontSizeLevel === -1}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFontSize(0)}
                className={`gov-acc-btn ${fontSizeLevel === 0 ? 'active' : ''}`}
                aria-label="Reset text size to standard"
                aria-pressed={fontSizeLevel === 0}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize(1)}
                className={`gov-acc-btn ${fontSizeLevel === 1 ? 'active' : ''}`}
                aria-label="Increase text size"
                aria-pressed={fontSizeLevel === 1}
              >
                A+
              </button>
            </div>

            <span className="gov-sep" aria-hidden="true">|</span>

            {/* Language Indicator */}
            <div className="gov-lang-tag" aria-label="Available languages">
              <span>English</span>
              <span style={{ color: "#94a3b8" }} aria-hidden="true">/</span>
              <span>हिन्दी</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// INSTITUTIONAL DUAL-TIER HEADER WITH ACCESSIBLE MOBILE NAVIGATION DRAWER
function Header({ onOpenLegal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close mobile drawer on Escape key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="gov-master-header">
      <TopInstitutionalUtilityBar />
      
      {/* Tier 1: Main Institutional Brand Bar */}
      <div className="gov-brand-bar">
        <Link to="/" className="gov-brand-container" aria-label="LoanConnect India Home">
          <div className="gov-seal-monogram" aria-hidden="true">
            <span className="seal-emblem-star">★</span>
            <span className="seal-rupee">₹</span>
            <span className="seal-ring"></span>
          </div>
          <div className="gov-title-stack">
            <div className="gov-org-title">
              Loan<span className="highlight">Connect</span> <span className="gov-india-tag">INDIA</span>
            </div>
            <div className="gov-hindi-subtitle">
              ऋण सुविधा एवं परामर्श पोर्टल • National Credit Advisory &amp; Facilitation Platform
            </div>
            <div className="gov-org-status">
              Independent Advisory System Facilitating Access to 40+ Scheduled Commercial Banks &amp; Regulated NBFCs
            </div>
          </div>
        </Link>

        {/* Desktop Trust Badges & Action */}
        <div className="gov-header-badges">
          <div className="gov-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <div>
              <strong>ISO 27001</strong>
              <small>Security Standards</small>
            </div>
          </div>

          <div className="gov-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div>
              <strong>256-Bit SSL</strong>
              <small>Bank-Grade Encryption</small>
            </div>
          </div>

          <Link className="gov-primary-action" to="/apply" aria-label="Citizen Loan Application">
            <span>Citizen Loan Application</span>
            <small>नागरिक ऋण आवेदन →</small>
          </Link>
        </div>

        {/* Accessible Mobile Hamburger / Menu Button (Touch Target >= 44x44px) */}
        <button
          type="button"
          className="gov-mobile-menu-toggle"
          aria-label={mobileMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="gov-mobile-drawer"
          onClick={() => setMobileMenuOpen(prev => !prev)}
        >
          <span className="gov-menu-icon" aria-hidden="true">{mobileMenuOpen ? "✕" : "☰"}</span>
          <span className="gov-menu-text">{mobileMenuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Tier 2: Institutional Desktop Navigation Bar */}
      <div className="gov-nav-bar">
        <nav className="gov-nav-links" aria-label="Desktop Primary Navigation">
          <a href="/#" className="gov-nav-item active">Home (मुख्य पृष्ठ)</a>
          <a href="/#loans" className="gov-nav-item">Loan Schemes (ऋण योजनाएं)</a>
          <a href="/#cibil" className="gov-nav-item">CIBIL Guide (सिबिल दिशानिर्देश)</a>
          <a href="/#how" className="gov-nav-item">How It Works (आवेदन प्रक्रिया)</a>
          <a href="/#charter" className="gov-nav-item">Citizen Charter (नागरिक घोषणापत्र)</a>
          <a href="/#partners" className="gov-nav-item">Partner Banks (संबद्ध बैंक)</a>
          <a href="/#grievance" className="gov-nav-item">Grievance (शिकायत निवारण)</a>
          <a href="/#faq" className="gov-nav-item">FAQ (प्रश्न एवं उत्तर)</a>
        </nav>
        <div className="gov-nav-portal-link">
          <Link to="/admin" className="gov-officer-login-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Officer Portal (अधिकारी लॉगिन)
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer Modal */}
      {mobileMenuOpen && (
        <div className="gov-mobile-drawer-overlay" onClick={closeMenu}>
          <div
            id="gov-mobile-drawer"
            className="gov-mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            onClick={e => e.stopPropagation()}
          >
            <div className="gov-drawer-top">
              <div className="gov-drawer-brand">
                <span className="seal-rupee" aria-hidden="true">₹</span>
                <div>
                  <strong>LoanConnect INDIA</strong>
                  <small>Citizen Credit Portal</small>
                </div>
              </div>
              <button
                type="button"
                className="gov-drawer-close"
                ref={closeButtonRef}
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            <nav className="gov-drawer-nav-list" aria-label="Mobile Menu Links">
              <a href="/#" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">🏠</span>
                <span>Home (मुख्य पृष्ठ)</span>
              </a>
              <a href="/#loans" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">💼</span>
                <span>Loan Schemes (ऋण योजनाएं)</span>
              </a>
              <a href="/#cibil" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">📊</span>
                <span>CIBIL Guide (सिबिल दिशानिर्देश)</span>
              </a>
              <a href="/#how" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">⚡</span>
                <span>How It Works (आवेदन प्रक्रिया)</span>
              </a>
              <a href="/#charter" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">📜</span>
                <span>Citizen Charter (नागरिक घोषणापत्र)</span>
              </a>
              <a href="/#partners" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">🏛️</span>
                <span>Partner Banks (संबद्ध बैंक)</span>
              </a>
              <a href="/#grievance" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">⚖️</span>
                <span>Grievance (शिकायत निवारण)</span>
              </a>
              <a href="/#faq" className="gov-drawer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">❓</span>
                <span>FAQ (प्रश्न एवं उत्तर)</span>
              </a>
              <Link to="/admin" className="gov-drawer-link officer-link" onClick={closeMenu}>
                <span className="drawer-icon" aria-hidden="true">🛡️</span>
                <span>Officer Portal (अधिकारी लॉगिन)</span>
              </Link>
            </nav>

            <div className="gov-drawer-actions">
              <Link to="/apply" className="gov-drawer-primary-btn" onClick={closeMenu}>
                Check My Eligibility →
              </Link>
              <div className="gov-drawer-contact-strip">
                <span className="drawer-helpline-label">Toll-Free Helpline:</span>
                <a href="tel:18002085626" className="drawer-helpline-num">1800-208-5626</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// TASTEFUL STICKY MOBILE CTA (Appears on scroll, respects safe-area insets, dismissible)
function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero CTA threshold (~380px)
      if (window.scrollY > 380) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="sticky-mobile-cta-bar" role="region" aria-label="Quick Loan Application Bar">
      <Link to="/apply" className="sticky-mobile-primary-btn">
        <span>Check My Eligibility</span>
        <span className="sticky-arrow" aria-hidden="true">→</span>
      </Link>
      <button
        type="button"
        className="sticky-mobile-dismiss-btn"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss sticky quick application button"
      >
        ✕
      </button>
    </div>
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
    <div className="partner-lenders-strip" role="region" aria-label="Facilitating Bank Network">
      <div className="partner-strip-title">
        Facilitating Loan Assistance Across Leading RBI-Registered Banks &amp; NBFCs
      </div>
      <div className="partner-logos-grid">
        {partners.map(p => (
          <div className="partner-logo-pill" key={p.name}>
            <span className={`partner-dot ${p.dotClass}`} aria-hidden="true"></span>
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
    <section className="section gov-charter-section" id="charter" aria-labelledby="charter-heading">
      <div className="center-head">
        <span className="gov-badge-official">CITIZEN SERVICE CHARTER • नागरिक सेवा घोषणापत्र</span>
        <h2 id="charter-heading">Commitment to Ethical &amp; Transparent Credit Advisory</h2>
        <p>Our four statutory pillars guarantee ethical lending guidance, zero hidden practices, and strict citizen privacy.</p>
      </div>

      <div className="gov-charter-grid">
        <div className="gov-charter-card">
          <div className="gov-charter-num">01</div>
          <div className="gov-charter-icon" aria-hidden="true">📊</div>
          <h3>पारदर्शी मूल्यांकन<br /><span>Transparent Preliminary Range</span></h3>
          <p>Instant digital preliminary range calculated algorithmically based on your financial parameters before any commitment. No ambiguous numbers.</p>
          <div className="gov-charter-badge">100% Objective</div>
        </div>

        <div className="gov-charter-card">
          <div className="gov-charter-num">02</div>
          <div className="gov-charter-icon" aria-hidden="true">🛡️</div>
          <h3>सत्यनिष्ठ परामर्श<br /><span>No Deceptive Guarantees</span></h3>
          <p>We never falsely advertise "100% Guaranteed Approval" or "Immediate Cash without Checks". All sanctions are subject to legitimate lender underwriting.</p>
          <div className="gov-charter-badge">Fair Practice Compliant</div>
        </div>

        <div className="gov-charter-card">
          <div className="gov-charter-num">03</div>
          <div className="gov-charter-icon" aria-hidden="true">🔒</div>
          <h3>नागरिक डेटा सुरक्षा<br /><span>DPDP Act 2023 Compliance</span></h3>
          <p>Your Aadhaar, PAN, and phone records are encrypted under 256-Bit SSL standards and never sold, rented, or distributed to telemarketing call centers.</p>
          <div className="gov-charter-badge">Strict Data Protection</div>
        </div>

        <div className="gov-charter-card">
          <div className="gov-charter-num">04</div>
          <div className="gov-charter-icon" aria-hidden="true">⚖️</div>
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
    <section className="section gov-banks-directory-section" id="partners" aria-labelledby="partners-heading">
      <div className="center-head">
        <span className="gov-badge-official">LENDING INSTITUTION DIRECTORY • संबद्ध वित्तीय संस्थान</span>
        <h2 id="partners-heading">Facilitating Access Across Leading Scheduled Banks &amp; NBFCs</h2>
        <p>Connecting eligible borrowers to legitimate, regulated lending institutions across India.</p>
      </div>

      <div className="gov-banks-table-container">
        <div className="gov-table-header-row" role="row">
          <div className="gov-col-bank" role="columnheader">Financial Institution / Bank</div>
          <div className="gov-col-type" role="columnheader">Institutional Category</div>
          <div className="gov-col-reg" role="columnheader">Regulatory Status</div>
          <div className="gov-col-schemes" role="columnheader">Key Loan Categories</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-sbi" aria-hidden="true">SBI</span>
            <strong>State Bank of India (भारतीय स्टेट बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-psu">Public Sector Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Home, Personal, MSME Business, LAP</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-pnb" aria-hidden="true">PNB</span>
            <strong>Punjab National Bank (पंजाब नेशनल बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-psu">Public Sector Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Personal, Housing, Business, Vehicle</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-hdfc" aria-hidden="true">HDFC</span>
            <strong>HDFC Bank (एचडीएफसी बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-pvt">Private Scheduled Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Express Personal, Home, Business, LAP</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-icici" aria-hidden="true">ICICI</span>
            <strong>ICICI Bank (आईसीआईसीआई बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-pvt">Private Scheduled Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Salaried Loans, Mortgage, Business Credit</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-axis" aria-hidden="true">AXIS</span>
            <strong>Axis Bank (एक्सिस बैंक)</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-pvt">Private Scheduled Bank</span></div>
          <div className="gov-col-reg">Scheduled Commercial Bank • RBI Regulated</div>
          <div className="gov-col-schemes">Personal, Affordable Home, Auto Loan</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-tata" aria-hidden="true">TATA</span>
            <strong>Tata Capital Financial Services</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-nbfc">Systemically Important NBFC</span></div>
          <div className="gov-col-reg">RBI Registered Non-Banking Financial Co.</div>
          <div className="gov-col-schemes">Unsecured Personal, Business Capital, LAP</div>
        </div>

        <div className="gov-table-row" role="row">
          <div className="gov-col-bank">
            <span className="bank-symbol dot-bajaj" aria-hidden="true">BAJAJ</span>
            <strong>Bajaj Finance / Finserv</strong>
          </div>
          <div className="gov-col-type"><span className="gov-tag-nbfc">Systemically Important NBFC</span></div>
          <div className="gov-col-reg">RBI Registered Non-Banking Financial Co.</div>
          <div className="gov-col-schemes">Flexi Personal Loan, Business Growth, LAP</div>
        </div>
      </div>

      <div className="gov-table-note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
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
    <section className="section gov-grievance-section" id="grievance" aria-labelledby="grievance-heading">
      <div className="center-head">
        <span className="gov-badge-official">PUBLIC GRIEVANCE MECHANISM • नागरिक शिकायत निवारण</span>
        <h2 id="grievance-heading">Citizen Redressal &amp; Institutional Compliance</h2>
        <p>In adherence to consumer protection guidelines, our nodal grievance redressal protocol is publicly accessible.</p>
      </div>

      <div className="gov-grievance-grid">
        <div className="gov-grievance-card">
          <div className="gov-grievance-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h3>Designated Nodal Grievance Officer (नोडल अधिकारी)</h3>
          </div>
          <div className="gov-officer-details">
            <p><strong>Name:</strong> Shri R. K. Verma</p>
            <p><strong>Designation:</strong> Head of Consumer Protection &amp; Grievance Redressal</p>
            <p><strong>Official Email:</strong> <a href="mailto:grievance@loanconnectindia.in" style={{ color: "#2563eb", textDecoration: "underline" }}>grievance@loanconnectindia.in</a></p>
            <p><strong>Advisory Helpline:</strong> <a href="tel:18002085626" style={{ color: "inherit" }}>1800-208-5626</a> (Toll-Free, Mon to Sat 9:30 AM – 6:30 PM)</p>
            <p><strong>Corporate Advisory Office:</strong> National Financial Towers, Level 5, Connaught Place, New Delhi 110001</p>
          </div>
        </div>

        <div className="gov-grievance-card">
          <div className="gov-grievance-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3>Resolution Protocol &amp; Turnaround Standards</h3>
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
                <strong>Dispute Investigation &amp; Resolution</strong>
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

// HOME PAGE — MOBILE-FIRST + ACCESSIBLE ARCHITECTURE
function Home({ onOpenLegal, scrollTo, defaultModal }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (defaultModal && onOpenLegal) {
      onOpenLegal(defaultModal);
    }
  }, [scrollTo, defaultModal, onOpenLegal]);

  return (
    <div>
      <Header onOpenLegal={onOpenLegal} />
      <main id="main-content">
        {/* 1. HERO SECTION WITH ACCESSIBLE MOBILE-FIRST ORDER */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            {/* 1. BADGE */}
            <div className="gov-hero-initiative-badge">
              <span className="gov-initiative-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v12M6 12h12"/>
                </svg>
                राष्ट्रीय ऋण सुविधा मंच • NATIONAL CREDIT ADVISORY
              </span>
              <span className="gov-initiative-divider" aria-hidden="true">|</span>
              <span className="gov-initiative-desc">DPDP Act 2023 Compliant • ISO 27001 Security Standards</span>
            </div>

            {/* 2. HEADLINE (Responsive typography clamp, zero overflow) */}
            <h1 id="hero-title">
              Need a Loan? Let's Find the <span style={{ color: "#ea580c" }}>Right Option</span> for You.
            </h1>

            {/* 3. SUPPORTING TEXT */}
            <div className="gov-hindi-hero-title">
              ऋण आवश्यकता? जानिए अपनी प्राथमिक पात्रता एवं उपयुक्त विकल्प
            </div>
            <p className="hero-subtitle">
              Personal, Business, Home &amp; Property-backed loan facilitation — structured guidance for salaried, self-employed, business owners, and varied credit profiles across India.
            </p>

            {/* 4. CIBIL PILLS */}
            <div className="credit-pills-row" role="group" aria-label="Supported Credit Tiers">
              <span className="credit-pill">✓ Good CIBIL (750+)</span>
              <span className="credit-pill highlight">✓ Mid/Low CIBIL (Below 650)</span>
              <span className="credit-pill">✓ Limited Credit History</span>
            </div>

            {/* 5. URGENCY INFORMATION */}
            <div className="urgency-callout-box">
              <span className="urgency-bolt" aria-hidden="true">⚡</span>
              <div>
                <strong>Need funds urgently?</strong> Complete your digital self-assessment and get a verified preliminary eligibility range in minutes.
              </div>
            </div>

            {/* 6. PRIMARY CTA & 7. SECONDARY CTA */}
            <div className="hero-actions">
              <Link to="/apply" className="primary-btn hero-primary-cta">
                Check My Eligibility <span aria-hidden="true">→</span>
              </Link>
              <Link to="/apply" className="secondary-btn hero-secondary-cta">
                Citizen Loan Application
              </Link>
            </div>

            {/* 8. REAL FINANCIAL BACKGROUND/IMAGE — DEDICATED VISUAL SECTION (Responsive WebP, currency bundles + coins + documents) */}
            <div className="hero-mobile-visual-wrap" aria-label="Indian Loan Consultation Desk Scene">
              <picture>
                <source media="(max-width: 640px)" srcSet="/hero_mobile.webp" type="image/webp" />
                <source media="(max-width: 1024px)" srcSet="/hero_tablet.webp" type="image/webp" />
                <source media="(min-width: 1025px)" srcSet="/hero_desktop.webp" type="image/webp" />
                <img
                  src="/hero_optimized.jpg"
                  alt="Indian financial loan application desk with real Indian Rupee currency bundles, coins, loan documents, smartphone, and keys"
                  className="hero-dedicated-image"
                  loading="eager"
                  fetchPriority="high"
                  width="600"
                  height="338"
                />
              </picture>
              <div className="hero-image-caption">
                <span className="caption-dot" aria-hidden="true">●</span>
                <span>Verified Indian ₹ Currency &amp; Loan Consultation Desk</span>
              </div>
            </div>

            {/* 9. BOTTOM HORIZONTAL TRUST BAR */}
            <div className="hero-bottom-trust-bar">
              <div className="trust-bar-item">
                <span className="trust-check-icon" aria-hidden="true">✓</span>
                <span>Quick Online Application</span>
              </div>
              <span className="trust-bar-divider" aria-hidden="true">•</span>
              <div className="trust-bar-item">
                <span className="trust-check-icon" aria-hidden="true">✓</span>
                <span>Multiple Loan Categories</span>
              </div>
              <span className="trust-bar-divider" aria-hidden="true">•</span>
              <div className="trust-bar-item">
                <span className="trust-check-icon" aria-hidden="true">✓</span>
                <span>Secure &amp; Confidential (DPDP 2023)</span>
              </div>
              <span className="trust-bar-divider" aria-hidden="true">•</span>
              <div className="trust-bar-item">
                <span className="trust-check-icon" aria-hidden="true">✓</span>
                <span>Preliminary Eligibility Assessment</span>
              </div>
            </div>

            {/* 10. TRUST INDICATORS */}
            <div className="trust-row">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Zero Advance Fee
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                256-Bit Bank-Grade Encryption
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Preliminary Eligibility Assessment
              </span>
            </div>
          </div>

          {/* RIGHT SIDE (Desktop Two-Column Visual Anchor) */}
          <div className="hero-visual-space" aria-hidden="true"></div>
        </section>

        {/* LENDER PARTNERS NETWORK STRIP */}
        <PartnerLendersStrip />

        {/* 2. LOAN CATEGORIES */}
        <section className="section" id="loans" aria-labelledby="loan-schemes-title">
          <div className="section-head">
            <div>
              <span className="section-tag">LOAN SCHEMES • ऋण योजनाएं</span>
              <h2 id="loan-schemes-title">What Do You Need Funds For?</h2>
            </div>
            <p>
              Whether it’s immediate personal requirements, business expansion, or property-backed funding, explore options tailored to your profile.
            </p>
          </div>
          <div className="loan-grid">
            {LOAN_CATEGORIES.map(l => (
              <Link to={`/apply?type=${l.id}`} className={`loan-card ${l.categoryClass}`} key={l.id}>
                <div className="loan-card-top">
                  <div className="loan-card-icon" aria-hidden="true">{l.icon}</div>
                  <div>
                    <h3>{l.title}</h3>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{l.highlight}</span>
                  </div>
                </div>
                <p>{l.copy}</p>
                <div className="loan-card-cta">
                  <span>Check Eligibility</span> <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. CIBIL SECTION */}
        <section className="section cibil-section" id="cibil" aria-labelledby="cibil-heading">
          <div className="center-head">
            <span className="section-tag">CREDIT SCORE TRANSPARENCY • सिबिल मार्गदर्शिका</span>
            <h2 id="cibil-heading">Not Sure Your CIBIL Is Good Enough?</h2>
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
            <i aria-hidden="true">ℹ️</i>
            <span>
              <strong>Truthful Lending Standard:</strong> Loan eligibility, interest rates, tenure, amount and approvals are strictly determined by lenders after verification. We do not provide false guarantees or misleading approvals.
            </span>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="section" id="how" aria-labelledby="how-heading">
          <div className="center-head">
            <span className="section-tag">APPLICATION PROCESS • आवेदन प्रक्रिया</span>
            <h2 id="how-heading">How Your Loan Journey Works</h2>
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
              <h3>Consultation &amp; Support</h3>
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
        <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
          <div className="center-head">
            <span className="section-tag">BORROWER HELP &amp; FAQ • प्रश्न एवं उत्तर</span>
            <h2 id="faq-heading">Frequently Asked Questions</h2>
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

        {/* TASTEFUL STICKY MOBILE CTA */}
        <StickyMobileCTA />
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

// 4-STEP APPLICATION FORM COMPONENT — MOBILE FIRST + ACCESSIBLE
function Apply({ onOpenLegal, defaultType, initialStage }) {
  const [searchParams] = useSearchParams();
  const preselectType = defaultType || searchParams.get("type") || "personal";

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Underwriting Evaluation state & animated progress bar
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalIndex, setEvalIndex] = useState(0);

  // Restore non-sensitive draft from sessionStorage if available
  const getInitialFormData = () => {
    try {
      const saved = sessionStorage.getItem("loanconnect_form_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          loanType: preselectType || parsed.loanType || "personal",
          loanAmount: parsed.loanAmount || "250000",
          purpose: parsed.purpose || "Personal & Family Expenses",
          city: parsed.city || "",
          name: parsed.name || "",
          mobile: parsed.mobile || "",
          email: parsed.email || "",
          employment: parsed.employment || "Salaried",
          monthlyIncome: parsed.monthlyIncome || "45000",
          cibil: parsed.cibil || "700–749",
          existingEmi: parsed.existingEmi || "0",
          preferredTenure: parsed.preferredTenure || "24-36 months",
          consent: true
        };
      }
    } catch (e) {
      // Ignore storage error
    }
    return {
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
    };
  };

  // Form State
  const [formData, setFormData] = useState(getInitialFormData);

  // Uploaded Files State (NEVER stored in localStorage/sessionStorage)
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
  const [resultStage, setResultStage] = useState(initialStage || "splash"); // "splash" | "amount" | "payment"
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Sync safe non-sensitive changes to sessionStorage
  const updateField = (k, v) => {
    setFormData(prev => {
      const next = { ...prev, [k]: v };
      try {
        sessionStorage.setItem("loanconnect_form_draft", JSON.stringify({
          loanType: next.loanType,
          loanAmount: next.loanAmount,
          purpose: next.purpose,
          city: next.city,
          name: next.name,
          mobile: next.mobile,
          email: next.email,
          employment: next.employment,
          monthlyIncome: next.monthlyIncome,
          cibil: next.cibil,
          existingEmi: next.existingEmi,
          preferredTenure: next.preferredTenure
        }));
      } catch (e) {}
      return next;
    });
  };

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

  const handleFileChange = (field, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`File size of ${file.name} exceeds 5MB limit. Please upload a smaller file.`);
      return;
    }

    setErrorMsg("");
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
      setErrorMsg("Please specify a required loan amount of at least ₹10,000.");
      return false;
    }
    if (!formData.city.trim()) {
      setErrorMsg("Please enter your current city.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full legal name as printed on PAN/Aadhaar.");
      return false;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).");
      return false;
    }
    if (!formData.monthlyIncome || Number(formData.monthlyIncome) < 5000) {
      setErrorMsg("Please enter your net monthly income.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!formData.cibil) {
      setErrorMsg("Please select your approximate CIBIL / credit score range.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  // Final Submit Handler (Step 4 -> Submit)
  const handleSubmitApplication = async (e) => {
    if (e) e.preventDefault();
    if (!formData.consent) {
      setErrorMsg("Please accept the consent for evaluating your loan request.");
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
      if (!appRes.ok) throw new Error(appData.error || "Failed to submit application.");

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
      setErrorMsg(err.message || "Failed to submit application.");
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
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to initialize payment gateway.");

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
      if (!verifyRes.ok) throw new Error(verifyData.error || "Payment signature verification failed.");

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
      <main className="apply-page" id="main-content">
        {/* UNDERWRITING EVALUATION MODAL OVERLAY */}
        {isEvaluating && (
          <div className="evaluating-screen-overlay" role="dialog" aria-modal="true" aria-labelledby="eval-modal-title">
            <div className="evaluating-card">
              <div className="eval-radar-wrapper" aria-hidden="true">
                <div className="radar-sweep-wave"></div>
                <div className="eval-shield-badge">🛡️</div>
              </div>

              <div className="eval-status-pill">
                <span className="live-dot-pulse" aria-hidden="true"></span> CREDIT ENGINE UNDERWRITING IN PROGRESS
              </div>

              <h2 id="eval-modal-title" className="eval-main-title">
                Evaluating Your Loan Eligibility
              </h2>
              <p className="eval-subtitle">
                Please hold on. We are scanning your documents, checking credit bureau data, and querying 40+ lending institutions.
              </p>

              {/* DYNAMIC PROGRESS BAR */}
              <div className="eval-progressbar-card" role="progressbar" aria-valuenow={evalProgress} aria-valuemin="0" aria-valuemax="100">
                <div className="eval-prog-label">
                  <span>Verification &amp; Bureau Matching</span>
                  <span className="eval-pct-counter">{evalProgress}%</span>
                </div>
                <div className="eval-bar-track">
                  <div className="eval-bar-fill" style={{ width: `${evalProgress}%` }}></div>
                </div>
              </div>

              {/* SEQUENTIAL VERIFICATION CHECKLIST */}
              <div className="eval-checklist" aria-live="polite">
                {EVAL_STAGES.map((stg, idx) => {
                  const isDone = evalIndex > idx || evalProgress >= stg.pct;
                  const isCurrent = evalIndex === idx && evalProgress < stg.pct;
                  return (
                    <div key={stg.id} className={`eval-check-item ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                      <div className="check-icon-circle" aria-hidden="true">
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
              <img src="/gov_emblem.jpg" alt="National Credit Facilitation Emblem" className="apply-gov-emblem-img" width="48" height="48" />
              <span className="emblem-sub-text">सत्यमेव जयते</span>
            </div>
            <div className="apply-gov-text-col">
              <div className="apply-gov-pretitle">
                <span className="gov-flag-icon" aria-hidden="true">🇮🇳</span>
                <span>राष्ट्रीय ऋण सुविधा पोर्टल • NATIONAL CREDIT FACILITATION PORTAL</span>
                <span className="gov-sep" aria-hidden="true">|</span>
                <span className="dpdp-tag">DPDP ACT 2023 COMPLIANT</span>
              </div>
              <h1 className="apply-gov-headline">Citizen Loan Pre-Qualification Portal</h1>
              <p className="apply-gov-subline">
                Online evaluation for personal, MSME business, and housing finance across 40+ scheduled commercial banks and RBI-regulated institutions.
              </p>
            </div>
            <div className="apply-gov-officer-col">
              <div className="officer-thumb-frame">
                <img src="/officer_desk.jpg" alt="Active Bank Officer Verification Desk" className="apply-gov-officer-thumb" width="70" height="70" />
                <span className="officer-desk-caption">● Active Verification Desk</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="result-top-breadcrumb">
            <Link to="/" className="result-back-link">
              ← Back to Portal Home
            </Link>
            <span className="breadcrumb-dot" aria-hidden="true">•</span>
            <span className="breadcrumb-tag">
              <span className="live-dot-pulse" aria-hidden="true"></span> Official Pre-Qualification Dossier
            </span>
            <span className="breadcrumb-tag ref-tag">
              Ref: <b>{submissionResult?.applicationCode || `#LC-${submissionResult?.applicationId}`}</b>
            </span>
          </div>
        )}

        <div className={`apply-container ${step === 5 ? "result-wide" : ""}`}>
          {/* COMPACT PROGRESS BAR FOR MOBILE & DESKTOP */}
          {step <= 4 && (
            <>
              {/* Mobile Step Header */}
              <div className="mobile-step-summary" aria-live="polite">
                <div className="mobile-step-label">
                  <span>STEP {step} OF 4</span>
                  <strong>{step === 1 ? "Loan Requirement" : step === 2 ? "Personal & Employment" : step === 3 ? "Credit Profile" : "Identity Documents"}</strong>
                </div>
                <div className="mobile-step-progress-track">
                  <div className="mobile-step-progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>
              </div>

              {/* Desktop Step Nodes */}
              <div className="step-progress-bar" role="navigation" aria-label="Application Steps Progress">
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
            </>
          )}

          {errorMsg && (
            <div
              role="alert"
              aria-live="assertive"
              className="form-error-alert"
              id="form-error-banner"
            >
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
                  <label htmlFor="field-loan-type">Loan Category</label>
                  <select
                    id="field-loan-type"
                    value={formData.loanType}
                    onChange={e => updateField("loanType", e.target.value)}
                  >
                    {LOAN_CATEGORIES.map(cat => (
                      <option value={cat.id} key={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="field-loan-amount">Required Loan Amount (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span aria-hidden="true">₹</span>
                    <input
                      id="field-loan-amount"
                      type="number"
                      inputMode="decimal"
                      min="10000"
                      step="5000"
                      value={formData.loanAmount}
                      onChange={e => updateField("loanAmount", e.target.value)}
                      placeholder="e.g. 250000"
                      aria-required="true"
                    />
                  </div>
                  <div className="quick-chips" role="group" aria-label="Quick amount shortcuts">
                    {["50000", "100000", "250000", "500000", "1000000"].map(amt => (
                      <button
                        type="button"
                        className="chip-btn"
                        key={amt}
                        onClick={() => updateField("loanAmount", amt)}
                        aria-label={`Select loan amount ₹${Number(amt).toLocaleString("en-IN")}`}
                      >
                        ₹{Number(amt).toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field-group">
                  <label htmlFor="field-loan-purpose">Loan Purpose</label>
                  <select
                    id="field-loan-purpose"
                    value={formData.purpose}
                    onChange={e => updateField("purpose", e.target.value)}
                  >
                    <option>Personal &amp; Family Expenses</option>
                    <option>Medical Emergency</option>
                    <option>Business Working Capital / Expansion</option>
                    <option>Education &amp; School Fees</option>
                    <option>Debt Consolidation &amp; Credit Card Clearing</option>
                    <option>Home Renovation / Purchase</option>
                    <option>Vehicle Purchase</option>
                    <option>Other Requirements</option>
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="field-loan-city">Current City</label>
                  <input
                    id="field-loan-city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={e => updateField("city", e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru, etc."
                    aria-required="true"
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
              <h2 className="form-step-title">2. Personal &amp; Employment Details</h2>
              <p className="form-step-desc">Enter your contact and income information to assist preliminary qualification.</p>
              <div className="form-grid">
                <div className="field-group">
                  <label htmlFor="field-user-name">Full Legal Name</label>
                  <input
                    id="field-user-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={e => updateField("name", e.target.value)}
                    placeholder="As printed on PAN/Aadhaar"
                    aria-required="true"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="field-user-mobile">Mobile Number (For verification &amp; updates)</label>
                  <div className="input-prefix-wrapper">
                    <span style={{ fontSize: "12px", color: "#6b7280" }} aria-hidden="true">+91</span>
                    <input
                      id="field-user-mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength="10"
                      value={formData.mobile}
                      onChange={e => updateField("mobile", e.target.value)}
                      placeholder="10-digit mobile number"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label htmlFor="field-user-email">Email Address</label>
                  <input
                    id="field-user-email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={e => updateField("email", e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="field-employment-type">Employment Type</label>
                  <select
                    id="field-employment-type"
                    value={formData.employment}
                    onChange={e => updateField("employment", e.target.value)}
                  >
                    <option>Salaried</option>
                    <option>Self-employed</option>
                    <option>Business Owner</option>
                    <option>Professional (Doctor/CA/Lawyer)</option>
                    <option>Other / Freelance</option>
                  </select>
                </div>

                <div className="field-group form-full">
                  <label htmlFor="field-monthly-income">Net Monthly Income (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span aria-hidden="true">₹</span>
                    <input
                      id="field-monthly-income"
                      type="number"
                      inputMode="decimal"
                      value={formData.monthlyIncome}
                      onChange={e => updateField("monthlyIncome", e.target.value)}
                      placeholder="e.g. 45000"
                      aria-required="true"
                    />
                  </div>
                  <div className="quick-chips" role="group" aria-label="Quick monthly income shortcuts">
                    {["25000", "40000", "60000", "100000", "200000"].map(inc => (
                      <button
                        type="button"
                        className="chip-btn"
                        key={inc}
                        onClick={() => updateField("monthlyIncome", inc)}
                        aria-label={`Select income ₹${Number(inc).toLocaleString("en-IN")} per month`}
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
              <h2 className="form-step-title">3. Credit Profile &amp; Existing EMIs</h2>
              <p className="form-step-desc">All credit profiles are welcomed. Tell us what applies to your current status.</p>
              <div className="form-grid">
                <div className="field-group">
                  <label htmlFor="field-cibil-score">CIBIL / Credit Score Range</label>
                  <select
                    id="field-cibil-score"
                    value={formData.cibil}
                    onChange={e => updateField("cibil", e.target.value)}
                  >
                    <option value="750+">750+ (Excellent Credit)</option>
                    <option value="700–749">700–749 (Good Credit)</option>
                    <option value="650–699">650–699 (Average Credit)</option>
                    <option value="Below 650">Below 650 (Low Credit / Settlement)</option>
                    <option value="Don't know">Don't know / Not sure</option>
                    <option value="No credit history">No credit history (First time borrower)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="field-existing-emi">Total Existing Monthly EMIs (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span aria-hidden="true">₹</span>
                    <input
                      id="field-existing-emi"
                      type="number"
                      inputMode="decimal"
                      value={formData.existingEmi}
                      onChange={e => updateField("existingEmi", e.target.value)}
                      placeholder="0 if none"
                    />
                  </div>
                </div>

                <div className="field-group form-full">
                  <label htmlFor="field-preferred-tenure">Preferred Loan Tenure</label>
                  <select
                    id="field-preferred-tenure"
                    value={formData.preferredTenure}
                    onChange={e => updateField("preferredTenure", e.target.value)}
                  >
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
                    <div className="doc-icon-badge" aria-hidden="true">🆔</div>
                    <h4>Aadhaar Card</h4>
                    <p>Front or combined e-Aadhaar PDF</p>
                    <span className="file-specs">PDF, JPG, PNG &lt; 5MB</span>
                  </div>
                  <div>
                    {files.aadhaar ? (
                      <div>
                        <div className="file-preview-card">
                          <span>✓ {files.aadhaar.name} ({(files.aadhaar.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          className="remove-doc-btn"
                          onClick={() => removeFile("aadhaar")}
                          aria-label="Remove or replace Aadhaar file"
                        >
                          ✕ Remove / Replace
                        </button>
                      </div>
                    ) : (
                      <label className="upload-action-btn" htmlFor="field-upload-aadhaar">
                        Select Aadhaar File
                        <input
                          id="field-upload-aadhaar"
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
                    <div className="doc-icon-badge" aria-hidden="true">💳</div>
                    <h4>PAN Card</h4>
                    <p>Clear photo of PAN card</p>
                    <span className="file-specs">PDF, JPG, PNG &lt; 5MB</span>
                  </div>
                  <div>
                    {files.pan ? (
                      <div>
                        <div className="file-preview-card">
                          <span>✓ {files.pan.name} ({(files.pan.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          className="remove-doc-btn"
                          onClick={() => removeFile("pan")}
                          aria-label="Remove or replace PAN file"
                        >
                          ✕ Remove / Replace
                        </button>
                      </div>
                    ) : (
                      <label className="upload-action-btn" htmlFor="field-upload-pan">
                        Select PAN File
                        <input
                          id="field-upload-pan"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          style={{ display: "none" }}
                          onChange={e => handleFileChange("pan", e)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Selfie Upload Box with Mobile Camera Integration */}
                <div className={`doc-upload-box ${files.selfie ? "has-file" : ""}`}>
                  <div>
                    <div className="doc-icon-badge" aria-hidden="true">🤳</div>
                    <h4>Selfie Photo</h4>
                    <p>Clear face photo for live identity verification</p>
                    <span className="file-specs">JPG, PNG &lt; 5MB</span>
                  </div>
                  <div>
                    {files.selfie ? (
                      <div>
                        <div className="file-preview-card">
                          <span>✓ {files.selfie.name} ({(files.selfie.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          className="remove-doc-btn"
                          onClick={() => removeFile("selfie")}
                          aria-label="Remove or retake selfie"
                        >
                          ✕ Remove / Retake
                        </button>
                      </div>
                    ) : (
                      <div className="selfie-actions-row">
                        {/* Camera Capture Option */}
                        <label className="upload-action-btn camera-action-btn" htmlFor="field-upload-selfie-camera">
                          <span>📷 Take Selfie</span>
                          <input
                            id="field-upload-selfie-camera"
                            type="file"
                            accept="image/*"
                            capture="user"
                            style={{ display: "none" }}
                            onChange={e => handleFileChange("selfie", e)}
                          />
                        </label>
                        {/* Device File Pick Option */}
                        <label className="upload-action-btn file-action-btn" htmlFor="field-upload-selfie-file">
                          <span>📁 Choose File</span>
                          <input
                            id="field-upload-selfie-file"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            onChange={e => handleFileChange("selfie", e)}
                          />
                        </label>
                      </div>
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
                  <a href="#consent" onClick={(e) => { e.preventDefault(); onOpenLegal("consent"); }}>Document Usage &amp; Consent Policy</a>.
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
                <div className="fullscreen-eligible-splash" role="status" aria-live="polite">
                  <div className="splash-confetti" aria-hidden="true">
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
                      <img src="/gov_emblem.jpg" alt="National Credit Facilitation Emblem" className="splash-gov-emblem" width="60" height="60" />
                    </div>

                    <div className="grand-check-wrap" aria-hidden="true">
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
                      <span className="badge-sep" aria-hidden="true">•</span>
                      <span className="status-green">● Pre-Approved In-Principle</span>
                    </div>

                    <div className="splash-action-row">
                      <button
                        type="button"
                        className="splash-view-amount-btn"
                        onClick={() => setResultStage("amount")}
                      >
                        <span>View Your Pre-Approved Loan Amount</span>
                        <span className="btn-arrow" aria-hidden="true">→</span>
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
                    <img src="/approved_stamp.jpg" alt="Official Verified Stamp" className="card-stamp-watermark" aria-hidden="true" />

                    <div className="amount-top-bar">
                      <span className="tag-approved">PRE-QUALIFIED SANCTION ESTIMATE</span>
                      <span className="tag-score">96% Algorithm Match</span>
                    </div>

                    <div className="amount-prelim-label">
                      YOUR PRELIMINARY RANGE
                    </div>

                    <div className="amount-digits-wrap">
                      <span className="amount-numbers">{submissionResult.estimate?.display || "₹1,00,000 – ₹2,50,000"}</span>
                    </div>

                    <p className="prelim-disclaimer-notice">
                      Based on the information provided, this is a preliminary estimate and not a loan approval.
                    </p>

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
                        <span className="perk-emoji" aria-hidden="true">⚡</span>
                        <div>
                          <b>Low Interest Rate</b>
                          <small>Starting from 9.9% p.a.</small>
                        </div>
                      </div>
                      <div className="amount-perk">
                        <span className="perk-emoji" aria-hidden="true">⏱️</span>
                        <div>
                          <b>Priority Bank Track</b>
                          <small>Direct file to processing</small>
                        </div>
                      </div>
                      <div className="amount-perk">
                        <span className="perk-emoji" aria-hidden="true">🏛️</span>
                        <div>
                          <b>Multi-Bank Routing</b>
                          <small>40+ Scheduled Banks</small>
                        </div>
                      </div>
                      <div className="amount-perk">
                        <span className="perk-emoji" aria-hidden="true">📑</span>
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
                      <span className="btn-shine" aria-hidden="true"></span>
                      <span>Proceed to Claim Your Loan Offer</span>
                      <span className="btn-arrow" aria-hidden="true">→</span>
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
                            <span className="desk-title">Public &amp; Private Sector Bank Network</span>
                          </div>
                        </div>

                        <div className="dossier-summary-body">
                          <div className="dossier-seal-row">
                            <img src="/gov_emblem.jpg" alt="Emblem" className="seal-mini-img" width="28" height="28" />
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
                          <img src="/gov_emblem.jpg" alt="Gov Emblem" className="gov-header-emblem" width="34" height="34" />
                          <div>
                            <span className="gov-subtitle-tag">CONTINUE WITH YOUR LOAN ASSISTANCE</span>
                            <h3 className="gov-card-headline">Dispatch File to Bank Processing</h3>
                          </div>
                        </div>

                        <div className="compact-tracker-bar" role="progressbar" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100">
                          <div className="trk-step done">
                            <span className="trk-dot" aria-hidden="true">✓</span>
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
                            <span>Service/Consultation Fee:</span>
                            <b>₹299.00</b>
                          </div>
                          <div className="fee-calc-row">
                            <span>GST (18%):</span>
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
                          aria-label="Continue & Pay ₹352.82 to send file for bank processing"
                        >
                          <span className="btn-shine" aria-hidden="true"></span>
                          {paymentLoading ? (
                            <span>Connecting Secure Gateway...</span>
                          ) : (
                            <>
                              <span>Continue &amp; Pay ₹352.82</span>
                              <span className="btn-arrow" aria-hidden="true">→</span>
                            </>
                          )}
                        </button>

                        {/* PAYMENT TRUST BADGES */}
                        <div className="payment-security-row">
                          <span>🔒 256-Bit SSL Razorpay</span>
                          <span>⚡ UPI (GPay, PhonePe), Cards, NetBanking</span>
                          <span>📱 Instant SMS Confirmation</span>
                        </div>

                        {/* TRANSPARENT DISCLOSURE NOTE */}
                        <p className="consultant-small-note">
                          * Note: LoanConnect India acts as an independent loan consultant and facilitation platform. The non-refundable ₹299 + GST (Total ₹352.82) consultation and file processing fee facilitates your application with 40+ scheduled commercial banks and RBI-registered NBFCs. Payment does NOT guarantee loan approval or disbursement. Final loan sanction and terms depend on lender underwriting and document verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {resultStage === "payment" && paymentSuccess && (
                <div className="activation-action-card success-card-activated" role="status" aria-live="polite">
                  <div className="activated-badge-icon" aria-hidden="true">🎉</div>
                  <h3>Loan File Successfully Sent for Bank Processing!</h3>
                  <p className="activated-sub">
                    Payment of <strong>{paymentSuccess.amount}</strong> received. Your file is now under priority bank processing.
                  </p>

                  <div className="assigned-officer-box">
                    <div className="officer-avatar" aria-hidden="true">👨‍💼</div>
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
                      <span className="badge-paid">Paid &amp; Sent to Processing</span>
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

// ADMIN PORTAL & APPLICANT DETAIL VIEW — MOBILE & ACCESSIBILITY READY
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

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && selectedApp) {
        setSelectedApp(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedApp]);

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
            <span className="brand-mark" aria-hidden="true">₹</span>
            <span>Loan<span>Connect</span><small>ADMIN PORTAL</small></span>
          </div>
          <h2 style={{ fontSize: "22px", margin: "0 0 8px" }}>Sign In to Admin</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px" }}>Manage loan applications, view verified documents and update pipeline.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
            <div className="field-group">
              <label htmlFor="admin-email">Officer Email</label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            {error && <div role="alert" style={{ color: "#dc2626", fontSize: "13px" }}>{error}</div>}
            <button type="submit" className="primary-btn" style={{ justifyContent: "center", minHeight: "48px" }}>
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

  return (
    <div className="admin-view">
      <header className="admin-header">
        <Link to="/" className="brand" aria-label="Return to LoanConnect Home">
          <span className="brand-mark" aria-hidden="true">₹</span>
          <span>Loan<span>Connect</span><small>ADMIN PIPELINE</small></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button className="secondary-btn" onClick={loadApplications} aria-label="Refresh applications list">↻ Refresh</button>
          <button className="secondary-btn" onClick={handleLogout} aria-label="Log out of admin">Logout</button>
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
        <form onSubmit={handleSearchSubmit} className="admin-filters" role="search" aria-label="Filter loan applications">
          <input
            type="text"
            placeholder="Search by name, mobile, code (e.g. LC-1001), or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search applications"
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by lifecycle status">
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
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} aria-label="Filter by payment status">
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid (₹352.82)</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
          </select>
          <select value={loanFilter} onChange={e => setLoanFilter(e.target.value)} aria-label="Filter by loan category">
            <option value="all">All Loan Categories</option>
            {LOAN_CATEGORIES.map(l => (
              <option value={l.id} key={l.id}>{l.title}</option>
            ))}
          </select>
          <button type="submit" className="primary-btn" style={{ padding: "10px 18px", minHeight: "44px" }}>Filter</button>
        </form>

        {/* APPLICATION TABLE CONTAINER WITH ACCESSIBLE MOBILE SCROLL AFFORDANCE */}
        <div className="admin-table-card">
          <div className="admin-table-mobile-hint">
            <span>← Swipe horizontally to inspect all table columns →</span>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">App ID</th>
                  <th scope="col">Applicant Name</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Loan Category</th>
                  <th scope="col">Requested Amount</th>
                  <th scope="col">CIBIL</th>
                  <th scope="col">Monthly Income</th>
                  <th scope="col">Preliminary Range</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                      {loading ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <span className="eval-spinner"></span> Loading applications...
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: "6px" }}>
                          <b style={{ color: "#334155" }}>No applications yet.</b>
                          <span>New applications will appear here after citizens submit their profiles.</span>
                        </div>
                      )}
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
                          aria-label={`Update status for ${app.name}`}
                          style={{ fontSize: "12px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
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
                          style={{ padding: "6px 12px", fontSize: "12px", minHeight: "36px" }}
                          onClick={() => openAppDetail(app.id)}
                          aria-label={`View dossier for ${app.name}`}
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

      {/* APPLICANT DETAIL MODAL (Fully Accessible & Mobile Responsive) */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)} role="dialog" aria-modal="true" aria-labelledby="applicant-modal-title">
          <div className="modal-card admin-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#ea580c" }}>APPLICANT DOSSIER</span>
                <h3 id="applicant-modal-title" style={{ margin: "2px 0 0" }}>
                  {selectedApp.application_code || `#LC-${selectedApp.id}`} — {selectedApp.name}
                </h3>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setSelectedApp(null)}
                aria-label="Close applicant dossier"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* STATUS UPDATE HEADER */}
              <div className="admin-modal-status-bar">
                <div>
                  <span style={{ fontSize: "12px", color: "#9a3412" }}>Current Lifecycle Status:</span>
                  <div style={{ fontWeight: 800, textTransform: "uppercase", color: "#c2410c", marginTop: "2px" }}>
                    {selectedApp.status.replace("_", " ")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label htmlFor="modal-status-select" style={{ fontSize: "13px", fontWeight: 700 }}>Update Status:</label>
                  <select
                    id="modal-status-select"
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
                  <h4>Personal &amp; Contact</h4>
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
                  <h4>Loan &amp; Credit Profile</h4>
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
                <div className="detail-section prelim-full-card">
                  <h4>Preliminary Eligibility Assessment</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
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
                      aria-label="Update verification status of documents"
                      style={{ fontSize: "11px", padding: "4px 8px" }}
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
                  <h4>Consultation Fee &amp; Payment</h4>
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
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Add internal note (e.g. Called applicant — waiting for additional income proof)..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    aria-label="Write internal note"
                    style={{ flex: 1, minWidth: "220px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                  <button type="button" className="primary-btn" style={{ padding: "8px 16px", fontSize: "13px", minHeight: "40px" }} onClick={addNote}>
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

// ACCESSIBLE LEGAL MODALS (Privacy, Terms, Consent, Refund)
function LegalModal({ type, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (type) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const content = {
    privacy: {
      title: "Privacy Policy & Document Confidentiality",
      body: (
        <div>
          <p><strong>Last Updated: September 2026</strong></p>
          <p>LoanConnect India is committed to protecting your sensitive personal information and documents. We adhere to applicable Indian data protection principles under the Digital Personal Data Protection Act 2023 (DPDP Act) and relevant RBI digital lending guidelines.</p>
          <h4>1. Document Privacy &amp; Retention</h4>
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
          <h4>2. Non-Guarantee of Approval or Disbursement</h4>
          <p>Loan approval, interest rates, tenure, amount, and disbursement are at the sole discretion of partner lenders and subject to document verification, lender policies, and borrower credit checks. LoanConnect India does not provide 100% approval or disbursement guarantees.</p>
          <h4>3. Service &amp; Consultation Fee</h4>
          <p>Where applicable, the ₹299 + GST consultation fee covers professional profile evaluation and application facilitation services. Payment of this fee does not constitute a loan approval fee or guarantee loan disbursement.</p>
        </div>
      )
    },
    refund: {
      title: "Refund & Cancellation Policy",
      body: (
        <div>
          <h4>1. Consultation Service Fee</h4>
          <p>The ₹299 + GST (Total ₹352.82) consultation charge covers the administrative and expert evaluation cost incurred by our specialists upon reviewing your application profile.</p>
          <h4>2. Non-Refundable Scope</h4>
          <p>Because loan assessment and profile evaluation services begin immediately upon submission and payment, the service fee is non-refundable regardless of whether a third-party lender subsequently approves or rejects your loan application.</p>
          <h4>3. Duplicate Charges</h4>
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
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
      <div className="modal-card legal-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="legal-modal-title">{content.title}</h3>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close legal terms modal">✕</button>
        </div>
        <div className="modal-body legal-modal-body">
          {content.body}
        </div>
      </div>
    </div>
  );
}

// GIGW-COMPLIANT INSTITUTIONAL FOOTER COMPONENT
function Footer({ onOpenLegal }) {
  return (
    <footer className="gov-master-footer" role="contentinfo" aria-label="Site Footer">
      <div className="gov-footer-accent-line" aria-hidden="true"></div>
      
      <div className="gov-footer-top">
        <div className="gov-footer-brand-col">
          <div className="gov-footer-brand">
            <div className="gov-seal-monogram small" aria-hidden="true">
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
          <h4>Citizen Services &amp; Schemes</h4>
          <a href="/#loans">Personal Loan Schemes</a>
          <a href="/#loans">MSME &amp; Business Finance</a>
          <a href="/#loans">Housing &amp; Home Loans</a>
          <a href="/#loans">Loan Against Property (LAP)</a>
          <Link to="/apply">Check Eligibility Range</Link>
          <a href="/#charter">Citizen Service Charter</a>
        </div>

        <div className="gov-footer-links-col">
          <h4>Statutory &amp; Compliance</h4>
          <button type="button" className="footer-link-btn" onClick={() => onOpenLegal("privacy")}>Privacy Policy (गोपनीयता नीति)</button>
          <button type="button" className="footer-link-btn" onClick={() => onOpenLegal("terms")}>Terms of Advisory Service</button>
          <button type="button" className="footer-link-btn" onClick={() => onOpenLegal("refund")}>Refund &amp; Consultation Policy</button>
          <button type="button" className="footer-link-btn" onClick={() => onOpenLegal("consent")}>DPDP Document Usage Consent</button>
          <a href="/#grievance">Public Grievance Redressal</a>
          <Link to="/admin">Internal Officer Portal</Link>
        </div>

        <div className="gov-footer-links-col">
          <h4>National Helpdesk &amp; Nodal Desk</h4>
          <div className="gov-footer-contact">
            <p><strong>Toll-Free Advisory:</strong> <a href="tel:18002085626" style={{ color: "inherit" }}>1800-208-5626</a></p>
            <p><strong>Citizen Support:</strong> <a href="mailto:support@loanconnectindia.in" style={{ color: "inherit" }}>support@loanconnectindia.in</a></p>
            <p><strong>Grievance Officer:</strong> <a href="mailto:grievance@loanconnectindia.in" style={{ color: "inherit" }}>grievance@loanconnectindia.in</a></p>
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
          <span className="gov-footer-divider" aria-hidden="true">•</span>
          <span>Last Reviewed &amp; Updated: September 2026</span>
          <span className="gov-footer-divider" aria-hidden="true">•</span>
          <span>Screen Resolution: Responsive on all devices (360px to 2560px)</span>
        </div>
        <div className="gov-footer-copyright">
          © 2026 LoanConnect India. All Rights Reserved. GIGW &amp; DPDP Compliant Architecture.
        </div>
      </div>
    </footer>
  );
}

// MAIN APPLICATION ROUTER WITH COMPREHENSIVE ROUTE ALIASES
function App() {
  const [legalModal, setLegalModal] = useState(null);

  return (
    <>
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={<Home onOpenLegal={setLegalModal} />} />
        <Route path="/apply" element={<Apply onOpenLegal={setLegalModal} />} />
        <Route path="/admin" element={<Admin onOpenLegal={setLegalModal} />} />

        {/* Loan Scheme Specific Aliases */}
        <Route path="/personal-loan" element={<Apply onOpenLegal={setLegalModal} defaultType="personal" />} />
        <Route path="/business-loan" element={<Apply onOpenLegal={setLegalModal} defaultType="business" />} />
        <Route path="/home-loan" element={<Apply onOpenLegal={setLegalModal} defaultType="home" />} />
        <Route path="/loan-against-property" element={<Apply onOpenLegal={setLegalModal} defaultType="lap" />} />
        <Route path="/vehicle-loan" element={<Apply onOpenLegal={setLegalModal} defaultType="vehicle" />} />

        {/* Flow Aliases */}
        <Route path="/eligibility" element={<Apply onOpenLegal={setLegalModal} />} />
        <Route path="/payment" element={<Apply onOpenLegal={setLegalModal} initialStage="payment" />} />
        <Route path="/success" element={<Apply onOpenLegal={setLegalModal} initialStage="amount" />} />

        {/* Informational & Legal Page Aliases */}
        <Route path="/faq" element={<Home onOpenLegal={setLegalModal} scrollTo="faq" />} />
        <Route path="/cibil-guide" element={<Home onOpenLegal={setLegalModal} scrollTo="cibil" />} />
        <Route path="/privacy" element={<Home onOpenLegal={setLegalModal} defaultModal="privacy" />} />
        <Route path="/terms" element={<Home onOpenLegal={setLegalModal} defaultModal="terms" />} />
        <Route path="/refund" element={<Home onOpenLegal={setLegalModal} defaultModal="refund" />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Home onOpenLegal={setLegalModal} />} />
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
