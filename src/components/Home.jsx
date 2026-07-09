import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaCogs, FaTractor, FaClock, FaChartLine } from 'react-icons/fa';
import { HiOutlineChevronDown, HiMenu, HiX } from 'react-icons/hi';
import logo from '../assets/logo.png';
import home1 from '../assets/home1.jpg';
import home2 from '../assets/home2.jpg';
import home3 from '../assets/home3.jpg';
import p1 from '../assets/p1.jpg';
import p2 from '../assets/p2.jpg';
import p3 from '../assets/p3.jpg';
import p4 from '../assets/p4.jpg';
import p5 from '../assets/p5.png';
import Problem from './pages/Problem';
import Platform from './pages/Platform';
import Services from './pages/Services';
import Geospatial from './pages/Geospatial';
import AICoordination from './pages/AICoordination';
import HowItWorks from './pages/HowItWorks';
import Vision from './pages/Vision';
import Contact from './pages/Contact';
import Credibility from './pages/Credibility';
import Impact from './pages/Impact';
import Partner from './pages/Partner';
import Metrics from './pages/Metrics';
import SharedFooter from './SharedFooter';
import AnimateOnScroll from './AnimateOnScroll';
import AnimateOnScrollStagger from './AnimateOnScrollStagger';
import LiveMetrics from './LiveMetrics';
import LandingMap from './LandingMap';
import ContactFormInline from './ContactFormInline';
import './Home.css';

const BANNER_IMAGES = [home1, home2, home3];

/* Top-level nav: single items + dropdown groups (for large screens) */
const NAV_TOP = [
  { id: 'home', label: 'Home' },
  {
    id: 'about',
    label: 'About',
    dropdown: [
      { id: 'credibility', label: 'About Us' },
      { id: 'impact', label: 'Impact & Goals' },
      { id: 'vision', label: 'Vision' },
      { id: 'partner', label: 'Partner' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    dropdown: [
      { id: 'platform', label: 'Platform Overview' },
      { id: 'services', label: 'Services' },
      { id: 'geospatial', label: 'Geospatial' },
      { id: 'ai-coordination', label: 'AI & Coordination' },
    ],
  },
  { id: 'problem', label: 'The Problem' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'live-metrics', label: 'Metrics' },
  { id: 'footer', label: 'Contact' },
];

/* Flat list for mobile (all items expanded) */
const NAV_MOBILE = [
  { id: 'home', label: 'Home' },
  { id: 'credibility', label: 'About' },
  { id: 'impact', label: 'Impact' },
  { id: 'vision', label: 'Vision' },
  { id: 'partner', label: 'Partner' },
  { id: 'platform', label: 'Platform' },
  { id: 'services', label: 'Services' },
  { id: 'geospatial', label: 'Geospatial' },
  { id: 'ai-coordination', label: 'AI & Coordination' },
  { id: 'problem', label: 'The Problem' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'live-metrics', label: 'Metrics' },
  { id: 'footer', label: 'Contact' },
];

const HERO_BRAND_TEXT = 'Digilync';

function TypewriterBrand({ text = HERO_BRAND_TEXT, className }) {
  const [display, setDisplay] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!isDeleting && display.length < text.length) {
      timer = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 110);
    } else if (!isDeleting && display.length === text.length) {
      timer = setTimeout(() => setIsDeleting(true), 1600);
    } else if (isDeleting && display.length > 0) {
      timer = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), 75);
    } else if (isDeleting && display.length === 0) {
      timer = setTimeout(() => setIsDeleting(false), 500);
    }

    return () => clearTimeout(timer);
  }, [display, isDeleting, text]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">
        {display}
        <span className="hero-brand-cursor">|</span>
      </span>
    </span>
  );
}

function Home({ onAdminLoginSuccess }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'platform' | 'about' | null
  const [currentPage, setCurrentPage] = useState('home');
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 2000);
    return () => clearInterval(bannerTimer);
  }, []);


  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e) => {
      if (!e.target.closest('.hero-nav-dropdown-wrap')) setDropdownOpen(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [dropdownOpen]);

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    setDropdownOpen(null);
  };

  const handleDropdownToggle = (key) => {
    setDropdownOpen((prev) => (prev === key ? null : key));
  };

  const isPageActive = (id) => {
    if (id === 'about') return ['credibility', 'impact', 'vision', 'partner'].includes(currentPage);
    if (id === 'platform') return ['platform', 'services', 'geospatial', 'ai-coordination'].includes(currentPage);
    return currentPage === id;
  };

  const handleExploreClick = () => {
    setCurrentPage('platform');
  };

  return (
    <div className="home">
      {/* Header with logo, nav, Admin Login */}
      <header className="hero-header">
        <div className="hero-header-inner">
          <button type="button" className="hero-logo hero-logo-btn" onClick={() => handleNavClick('home')}>
            <img src={logo} alt="Digilync" className="hero-logo-img" />
            <span className="hero-logo-text">Digilync</span>
          </button>

          <nav className="hero-nav">
            {NAV_TOP.map((item) =>
              item.dropdown ? (
                <div key={item.id} className="hero-nav-dropdown-wrap">
                  <button
                    type="button"
                    className={`hero-nav-link hero-nav-dropdown-trigger ${isPageActive(item.id) ? 'active' : ''}`}
                    onClick={() => handleDropdownToggle(item.id)}
                    aria-expanded={dropdownOpen === item.id}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <HiOutlineChevronDown className={`hero-nav-chevron ${dropdownOpen === item.id ? 'open' : ''}`} />
                  </button>
                  {dropdownOpen === item.id && (
                    <div className="hero-nav-dropdown">
                      {item.dropdown.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          className={`hero-nav-dropdown-item ${currentPage === sub.id ? 'active' : ''}`}
                          onClick={() => handleNavClick(sub.id)}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  className={`hero-nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="hero-header-right">
            <Link to="/admin" className="hero-admin-link">Admin Login</Link>
            <button
              type="button"
              className="hero-mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="hero-mobile-menu">
            {NAV_MOBILE.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hero-mobile-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link to="/admin" className="hero-mobile-link hero-mobile-admin" onClick={() => setMobileMenuOpen(false)}>Admin Login</Link>
          </div>
        )}
      </header>

      {/* Content: full home page or single page component */}
      {currentPage === 'home' && (
        <>
      {/* Hero Section with Banner */}
      <section id="hero" className="hero">
        <div className="hero-banner">
          <div className="hero-geo-bg" aria-hidden="true" />
          {BANNER_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`hero-banner-slide ${i === bannerIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
              aria-hidden={i !== bannerIndex}
            />
          ))}
          <div className="hero-banner-overlay" />
          <div className="hero-banner-dots">
            {BANNER_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`hero-banner-dot ${i === bannerIndex ? 'active' : ''}`}
                onClick={() => setBannerIndex(i)}
                aria-label={`View slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-floating-dots" aria-hidden="true">
            <span className="hero-dot hero-dot-1" /><span className="hero-dot hero-dot-2" /><span className="hero-dot hero-dot-3" /><span className="hero-dot hero-dot-4" />
          </div>
          <h1 className="hero-title hero-title-stagger">
            <TypewriterBrand className="hero-brand hero-brand-char" />
            <span className="hero-tagline hero-tagline-stagger">Africa's Agricultural Coordination & Intelligence Infrastructure</span>
          </h1>
          <p className="hero-subheadline">
            Linking farmers, mechanized service providers, and industrial buyers through structured scheduling, geospatial mapping, and intelligent coordination.
          </p>
          <div className="hero-cta">
            <a
              href="https://wa.me/237689869421"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-primary hero-btn-shine"
            >
              <FaWhatsapp className="hero-btn-icon" />
              Start on WhatsApp
            </a>
            <button
              type="button"
              onClick={handleExploreClick}
              className="hero-btn hero-btn-secondary"
            >
              <HiOutlineChevronDown className="hero-btn-icon" />
              Explore Platform
            </button>
          </div>
        </div>
      </section>

      {/* Video Section - just before Institutional Credibility */}
      <section id="dig-video" className="section section-video">
        <AnimateOnScroll className="video-section-inner">
          <div className="video-wrapper">
            <video
              className="dig-video-player"
              src={`${process.env.PUBLIC_URL || ''}/dig_vid/dig_vid.mp4`}
              controls
              playsInline
              preload="metadata"
              onError={(e) => {
                if (!e.target.dataset.fallbackUsed) {
                  e.target.dataset.fallbackUsed = '1';
                  e.target.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Institutional Credibility - horizontal layout: image left, text right */}
      <section id="credibility" className="section section-credibility section-layout-horizontal">
        <div className="section-layout-inner">
          <AnimateOnScroll className="section-img-wrap section-img-left" direction="right">
            <div className="img-float-wrap">
              <img src={p1} alt="" className="section-scroll-img img-float" aria-hidden />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll className="section-text-block" direction="left">
            <h2 className="section-title">Institutional Credibility</h2>
            <div className="credibility-content">
              <p className="credibility-lead">
                Digilync is developed by a women-founded and women-led agritech company headquartered in Buea, Cameroon.
              </p>
              <p>
                We have deployed three field pilots in Meme Division (Kumba, Mabonji, and Malende), testing structured agricultural service coordination in real rural environments.
              </p>
              <p>
                Our team combines expertise in agricultural engineering, geospatial systems, AI-enabled platform development, and development-sector financial management — with a combined 3 decades of experience working directly with smallholder farmers and public agricultural institutions.
              </p>
              <p className="credibility-tagline">
                We build digital coordination infrastructure grounded in field realities — not theory.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
        <div className="floating-shapes" aria-hidden="true">
          <span className="shape shape-circle shape-1" /><span className="shape shape-square shape-2" /><span className="shape shape-dot shape-3" />
        </div>
      </section>

      {/* Live Platform Metrics */}
      <LiveMetrics />

      {/* Impact & Pilot Goals - horizontal reverse: image right, text left */}
      <section id="impact" className="section section-impact section-layout-horizontal-reverse">
        <div className="section-layout-inner">
          <AnimateOnScroll className="section-text-block" direction="right">
            <h2 className="section-title">Impact & Pilot Goals</h2>
            <p className="section-subtitle">
              Digilync is designed to scale structured agricultural service delivery across fragile and underserved rural regions.
            </p>
            <AnimateOnScrollStagger className="impact-grid" effect="fade-up">
              <div className="impact-card">
                <h3>3-Year Target</h3>
                <ul>
                  <li><strong>20,000</strong> farmers</li>
                  <li><strong>3,000</strong> service providers</li>
                </ul>
              </div>
              <div className="impact-card">
                <h3>Current & Upcoming Pilot Regions</h3>
                <ul>
                  <li>Meme Division – Kumba, Mabonji, Malende</li>
                  <li>Fako Division – Muyuka, Ombe, Tiko</li>
                  <li>Ndian Division</li>
                </ul>
              </div>
              <div className="impact-card">
                <h3>Expected Outcomes</h3>
                <ul>
                  <li>Faster and more reliable service scheduling</li>
                  <li>Reduced seasonal delays in land preparation and harvesting</li>
                  <li>Improved service quality accountability</li>
                  <li>Increased visibility of regional production capacity</li>
                </ul>
              </div>
              <div className="impact-card">
                <h3>Key Performance Indicators</h3>
                <ul>
                  <li>% reduction in service delays</li>
                  <li>% increase in successful service completion</li>
                  <li>Farmer satisfaction ratings</li>
                  <li>Geographic coverage growth</li>
                  <li>Service response time</li>
                </ul>
              </div>
            </AnimateOnScrollStagger>
          </AnimateOnScroll>
          <AnimateOnScroll className="section-img-wrap section-img-right" direction="left">
            <div className="img-float-wrap">
              <img src={p2} alt="" className="section-scroll-img img-float img-float-delay" aria-hidden />
            </div>
          </AnimateOnScroll>
        </div>
        <div className="floating-shapes" aria-hidden="true">
          <span className="shape shape-leaf shape-4" /><span className="shape shape-circle shape-5" />
        </div>
      </section>

      {/* Section 2: The Problem - vertical layout: image top, cards below */}
      <section id="problem" className="section section-problem section-layout-vertical">
        <AnimateOnScroll className="section-img-wrap section-img-top" direction="scale-in">
          <div className="img-float-wrap">
            <img src={p3} alt="" className="section-scroll-img img-float" aria-hidden />
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll className="section-inner" direction="fade-up">
          <h2 className="section-title">Agriculture in Africa Is Fragmented</h2>
          <AnimateOnScrollStagger className="problem-grid" effect="slide-right">
            <div className="problem-card">
              <span className="problem-icon-wrap"><FaCogs className="problem-icon" /></span>
              <h3>Under-Coordinated Mechanization</h3>
              <p>Mechanization exists but is under-coordinated across regions and seasons.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon-wrap"><FaTractor className="problem-icon" /></span>
              <h3>Disconnected Providers</h3>
              <p>Service providers operate in isolation with no structured marketplace.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon-wrap"><FaClock className="problem-icon" /></span>
              <h3>Timing & Availability Gaps</h3>
              <p>Farmers struggle with timing and availability of critical services.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon-wrap"><FaChartLine className="problem-icon" /></span>
              <h3>Lack of Supply Visibility</h3>
              <p>Industrial buyers lack structured supply visibility and traceability.</p>
            </div>
          </AnimateOnScrollStagger>
        </AnimateOnScroll>
        <div className="floating-shapes" aria-hidden="true">
          <span className="shape shape-dot shape-6" /><span className="shape shape-square shape-7" />
        </div>
      </section>

      {/* Section 3: The Digilync Platform - horizontal: image left, layers right */}
      <section id="platform" className="section section-platform section-layout-horizontal">
        <div className="section-layout-inner">
          <AnimateOnScroll className="section-img-wrap section-img-left" direction="right">
            <div className="img-float-wrap">
              <img src={p4} alt="" className="section-scroll-img img-float" aria-hidden />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll className="section-text-block" direction="left">
          <h2 className="section-title">The Digilync Platform</h2>
          <p className="section-subtitle">Layered infrastructure for agricultural coordination</p>
          <AnimateOnScrollStagger className="platform-layers" effect="slide-left">
            <div className="platform-layer live">
              <span className="platform-badge">Live</span>
              <h3>Layer 1 – Coordination Engine</h3>
              <ul>
                <li>WhatsApp onboarding</li>
                <li>Service booking</li>
                <li>Provider confirmation</li>
                <li>Admin oversight</li>
              </ul>
            </div>
            <div className="platform-layer dev">
              <span className="platform-badge">In Development</span>
              <h3>Layer 2 – Geospatial Mapping</h3>
              <ul>
                <li>Geo-tagged farms</li>
                <li>Regional service mapping</li>
                <li>Mechanization density visualization</li>
              </ul>
            </div>
            <div className="platform-layer dev">
              <span className="platform-badge">In Development</span>
              <h3>Layer 3 – AI Matching & Capacity Intelligence</h3>
              <ul>
                <li>Intelligent service matching</li>
                <li>Availability optimization</li>
                <li>Demand forecasting</li>
                <li>Production clustering</li>
              </ul>
            </div>
            <div className="platform-layer planned">
              <span className="platform-badge">Planned</span>
              <h3>Layer 4 – Supply Aggregation & Industrial Integration</h3>
              <ul>
                <li>Aggregated crop supply</li>
                <li>Structured sourcing</li>
                <li>Industrial buyer linkage</li>
                <li>Institutional dashboards</li>
              </ul>
            </div>
          </AnimateOnScrollStagger>
          </AnimateOnScroll>
        </div>
        <div className="floating-shapes" aria-hidden="true">
          <span className="shape shape-circle shape-8" /><span className="shape shape-dot shape-9" />
        </div>
      </section>

      {/* Section 4: Services Offered */}
      <section id="services" className="section section-services">
        <AnimateOnScroll className="section-inner" direction="fade-up">
          <h2 className="section-title">Services Offered</h2>
          <AnimateOnScrollStagger className="services-grid" effect="scale-in">
            <div className="services-category">
              <h3>Pre-Production</h3>
              <ul><li>Land clearing</li><li>Plowing</li><li>Harrowing</li><li>Ridging</li></ul>
            </div>
            <div className="services-category">
              <h3>Planting & Inputs</h3>
              <ul><li>Mechanical planting</li><li>Fertilizer spreading</li><li>Seed drilling</li></ul>
            </div>
            <div className="services-category">
              <h3>Crop Management</h3>
              <ul><li>Spraying</li><li>Drone application</li><li>Irrigation installation</li></ul>
            </div>
            <div className="services-category">
              <h3>Harvesting</h3>
              <ul><li>Combine harvesting</li><li>Shelling</li><li>Threshing</li></ul>
            </div>
            <div className="services-category">
              <h3>Post-Harvest</h3>
              <ul><li>Drying</li><li>Storage</li><li>Processing</li><li>Cold room access</li></ul>
            </div>
            <div className="services-category">
              <h3>Logistics</h3>
              <ul><li>Farm-to-market transport</li><li>Produce aggregation</li></ul>
            </div>
          </AnimateOnScrollStagger>
        </AnimateOnScroll>
      </section>

      {/* Section 5: Geospatial Intelligence - horizontal reverse: text left, map+image right */}
      <section id="geospatial" className="section section-geospatial section-layout-horizontal-reverse">
        <div className="section-layout-inner">
          <AnimateOnScroll className="section-text-block" direction="right">
            <h2 className="section-title">Geospatial Agricultural Intelligence</h2>
            <p className="section-desc">
              Digilync geo-tags farms and mechanized service providers to build structured regional production maps.
            </p>
            <div className="geospatial-visual geospatial-map-wrap">
              <LandingMap />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll className="section-img-wrap section-img-right" direction="left">
            <div className="img-float-wrap">
              <img src={p5} alt="" className="section-scroll-img img-float img-float-delay" aria-hidden />
            </div>
          </AnimateOnScroll>
        </div>
        <div className="floating-shapes" aria-hidden="true">
          <span className="shape shape-dot shape-10" /><span className="shape shape-circle shape-11" />
        </div>
      </section>

      {/* Section 6: AI & Intelligent Coordination */}
      <section id="ai-coordination" className="section section-ai">
        <AnimateOnScroll className="section-inner" direction="fade-in">
          <h2 className="section-title">AI-Driven Agricultural Coordination</h2>
          <AnimateOnScrollStagger className="ai-features" effect="fade-up">
            <div className="ai-feature">Matching optimization</div>
            <div className="ai-feature">Capacity analysis</div>
            <div className="ai-feature">Production clustering</div>
            <div className="ai-feature">Supply forecasting</div>
          </AnimateOnScrollStagger>
        </AnimateOnScroll>
      </section>

      {/* Section 7: How It Works */}
      <section id="how-it-works" className="section section-how">
        <AnimateOnScroll className="section-inner" direction="right">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Current version – grounded and real</p>
          <AnimateOnScrollStagger className="how-steps" effect="slide-left">
            <div className="how-step"><span className="how-num">1</span><p>Register via WhatsApp</p></div>
            <div className="how-step"><span className="how-num">2</span><p>Request service</p></div>
            <div className="how-step"><span className="how-num">3</span><p>Provider confirms</p></div>
            <div className="how-step"><span className="how-num">4</span><p>Service completed</p></div>
          </AnimateOnScrollStagger>
        </AnimateOnScroll>
      </section>

      {/* Section 8: Vision Statement */}
      <section id="vision" className="section section-vision">
        <AnimateOnScroll className="section-inner" direction="fade-up">
          <h2 className="section-title">Building Africa's Agricultural Infrastructure Layer</h2>
          <div className="vision-content">
            <p>Structured capacity coordination across farmers, providers, and buyers.</p>
            <p>Mechanization optimization for efficient resource use.</p>
            <p>Supply intelligence for traceability and market linkage.</p>
            <p>Continental scalability – infrastructure that grows with Africa.</p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Partner With Digilync */}
      <section id="partner" className="section section-partner">
        <AnimateOnScroll className="section-inner" direction="fade-in">
          <h2 className="section-title">Partner With Digilync</h2>
          <div className="partner-content">
            <p>
              We collaborate with governments, development partners, agricultural institutions, cooperatives, and private sector actors to pilot and scale resilient agricultural coordination systems.
            </p>
            <p>
              If you are working to strengthen food systems, improve rural service delivery, or build digital public infrastructure for agriculture, Digilync is ready to partner.
            </p>
            <p className="partner-cta-text">Let's build accountable and scalable agricultural systems together.</p>
            <button
              type="button"
              className="partner-explore-btn"
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Explore Partnership
            </button>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="section section-contact-inline">
        <AnimateOnScroll className="section-inner" direction="scale-in">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Whether you are a farmer, service provider, industrial buyer, or partner — we would like to hear from you.
          </p>
          <AnimateOnScrollStagger className="contact-inline-grid" effect="fade-up">
            <div className="contact-inline-info">
              <h3>Reach Us</h3>
              <p><strong>Email:</strong> contact@digilync.com</p>
              <p><strong>WhatsApp:</strong> +237 678 699 886</p>
              <p className="contact-inline-note">
                For fastest response, start a conversation on WhatsApp. Farmers and providers can register directly via our WhatsApp bot.
              </p>
            </div>
            <ContactFormInline />
          </AnimateOnScrollStagger>
        </AnimateOnScroll>
      </section>

      <SharedFooter />
        </>
      )}

      {currentPage === 'problem' && (
        <div className="page-transition-wrap" key="problem">
          <Problem />
        </div>
      )}
      {currentPage === 'platform' && (
        <div className="page-transition-wrap" key="platform">
          <Platform />
        </div>
      )}
      {currentPage === 'services' && (
        <div className="page-transition-wrap" key="services">
          <Services />
        </div>
      )}
      {currentPage === 'geospatial' && (
        <div className="page-transition-wrap" key="geospatial">
          <Geospatial />
        </div>
      )}
      {currentPage === 'ai-coordination' && (
        <div className="page-transition-wrap" key="ai-coordination">
          <AICoordination />
        </div>
      )}
      {currentPage === 'how-it-works' && (
        <div className="page-transition-wrap" key="how-it-works">
          <HowItWorks />
        </div>
      )}
      {currentPage === 'credibility' && (
        <div className="page-transition-wrap" key="credibility">
          <Credibility />
        </div>
      )}
      {currentPage === 'impact' && (
        <div className="page-transition-wrap" key="impact">
          <Impact />
        </div>
      )}
      {currentPage === 'vision' && (
        <div className="page-transition-wrap" key="vision">
          <Vision />
        </div>
      )}
      {currentPage === 'partner' && (
        <div className="page-transition-wrap" key="partner">
          <Partner />
        </div>
      )}
      {currentPage === 'live-metrics' && (
        <div className="page-transition-wrap" key="live-metrics">
          <Metrics />
        </div>
      )}
      {currentPage === 'footer' && (
        <div className="page-transition-wrap" key="footer">
          <Contact />
        </div>
      )}
    </div>
  );
}

export default Home;
