'use client';

import { useState } from 'react';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { CAREERS_HERO_SLIDES } from '@/lib/content/heroSlides';
import { Icon, type IconName } from '@/components/Icon';
import { useToast } from '@/components/Toast';

const ROUTE = '/careers';

export interface OpenRole {
  id: string;
  title: string;
  department: 'Architectural Design' | 'Vastu-Tech & AI' | 'Project Engineering' | '3D & VR Staging' | 'Studio Operations';
  location: string;
  type: 'Full-Time' | 'Hybrid' | 'Remote';
  experience: string;
  salary: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

const OPEN_ROLES: OpenRole[] = [
  {
    id: 'role-sr-arch',
    title: 'Senior Principal Architect (Residential Luxury)',
    department: 'Architectural Design',
    location: 'Chennai Studio (Nungambakkam)',
    type: 'Full-Time',
    experience: '8 - 12 Years',
    salary: '₹18,00,000 - ₹32,00,000 / yr + Performance Bonus',
    overview:
      'Lead high-end villa and penthouse commissions across Chennai and South India. Drive design direction, client spatial presentations, and master BOQ material specs.',
    responsibilities: [
      'Lead design development from concept CAD blueprints to 100% execution details.',
      'Present 3D VR walkthroughs and material boards to ultra-high-net-worth clients.',
      'Coordinate with structural engineers, site project managers, and German CNC joinery labs.',
      'Mentor junior architects and enforce studio design tokens and Vastu-Tech standards.',
    ],
    requirements: [
      'B.Arch / M.Arch from a premier institution (COA registered).',
      'Demonstrated portfolio of turnkey luxury residential transformations (₹1Cr+ budget).',
      'Expertise in AutoCAD, Revit, Rhino/SketchUp, and Enscape/V-Ray.',
      'Deep understanding of marine BWP plywood, Italian marble provenance, and Blum/Hafele joinery.',
    ],
  },
  {
    id: 'role-vastu-lead',
    title: 'Vastu-Tech Computational Lead',
    department: 'Vastu-Tech & AI',
    location: 'Chennai Studio / Hybrid',
    type: 'Hybrid',
    experience: '5 - 8 Years',
    salary: '₹16,00,000 - ₹28,00,000 / yr + Equity Options',
    overview:
      'Bridge traditional Vedic Vastu Shastra principles with modern solar compass vector algorithms, electromagnetic grid mapping, and 3D CAD automated verification.',
    responsibilities: [
      'Refine the studio’s proprietary Vastu-Tech AI engine and automated floorplan analysis pipeline.',
      'Perform micro-compass magnetic declination audits for high-rise penthouses and estate villas.',
      'Collaborate with software engineers to integrate live Space Score™ metrics into Space OS.',
      'Publish architectural whitepapers on natural ventilation, solar vectors, and spatial wellness.',
    ],
    requirements: [
      'Degree in Architecture, Computational Design, or Building Physics.',
      'Formal study or verified practice in classical Vastu Vidya & orientation principles.',
      'Proficiency with Grasshopper/Parametric design or Python spatial geometry libraries.',
      'Strong client-facing communication skills for explaining scientific spatial alignment.',
    ],
  },
  {
    id: 'role-vr-lead',
    title: 'Lead 3D Visualization & VR Engineer',
    department: '3D & VR Staging',
    location: 'Chennai / Remote',
    type: 'Full-Time',
    experience: '4 - 7 Years',
    salary: '₹12,00,000 - ₹22,00,000 / yr',
    overview:
      'Craft photorealistic 4K architectural renders and real-time Unreal Engine 5 / WebGL 3D walkthroughs for residential and commercial client portals.',
    responsibilities: [
      'Build 8K photorealistic lighting, material shaders (pbr), and camera animations.',
      'Convert CAD/Revit BIM models into real-time WebGL and Meta Quest VR walkthroughs.',
      'Maintain the studio’s 3D asset library of custom Italian furniture, joinery, and lighting fixtures.',
      'Optimize asset compression for instant browser loading in Space OS.',
    ],
    requirements: [
      'Mastery in 3ds Max / Blender, V-Ray / Corona Renderer, and Unreal Engine 5.',
      'Portfolio displaying architectural lighting, texture mapping, and photorealistic interior renders.',
      'Experience with PBR material creation (Substance Designer / Quixel Mixer).',
      'Knowledge of WebGL / Three.js pipelines is a strong advantage.',
    ],
  },
  {
    id: 'role-project-eng',
    title: 'Senior Project Execution & Site Engineer',
    department: 'Project Engineering',
    location: 'Chennai On-Site',
    type: 'Full-Time',
    experience: '6 - 10 Years',
    salary: '₹14,00,000 - ₹25,00,000 / yr + Completion Incentive',
    overview:
      'Enforce Luxe Axis’s 45-day guaranteed handover SLA on site. Oversee civil execution, modular joinery installation, MEP integration, and quality assurance audits.',
    responsibilities: [
      'Manage on-site contractor teams, factory delivery schedules, and quality gates.',
      'Enforce zero-tolerance tolerances (±1mm) for CNC modular cabinet fitments.',
      'Upload daily 4K site progress logs and inspection checklists to Space OS.',
      'Conduct final white-glove snagging and client key handover audits.',
    ],
    requirements: [
      'B.Tech / B.E. in Civil Engineering or Construction Management.',
      'Proven track record of managing luxury interior sites simultaneously.',
      'Expertise in site safety, MEP coordination, moisture testing, and BOQ reconciliation.',
      'Fluent in Tamil and English with strong leadership skills under tight SLAs.',
    ],
  },
  {
    id: 'role-cnc-millwork',
    title: 'Computational CAD & CNC Joinery Specialist',
    department: 'Architectural Design',
    location: 'Chennai Studio',
    type: 'Full-Time',
    experience: '3 - 6 Years',
    salary: '₹10,00,000 - ₹18,00,000 / yr',
    overview:
      'Translate architectural concepts into machine-ready CNC cutting patterns, edge-banding schedules, and precision German hardware joinery blueprints.',
    responsibilities: [
      'Generate 2D production drawings and 3D exploded assembly diagrams for off-site manufacturing.',
      'Optimize material nesting algorithms to achieve 95%+ plywood sheet utilization.',
      'Integrate Blum, Hafele, and Hettich hardware specs into automated production files.',
      'Coordinate directly with our German CNC factory team in Chennai.',
    ],
    requirements: [
      'Degree/Diploma in Interior Design, Woodworking Technology, or Production Engineering.',
      'Hands-on experience with Cabinet Vision, Imos, WoodWOP, or AutoCAD Joinery modules.',
      'Deep knowledge of BWP plywood grades, HDMR boards, laminates, and acrylic edge-banding.',
    ],
  },
  {
    id: 'role-ffe-procurement',
    title: 'Luxury Interior FF&E Procurement Manager',
    department: 'Studio Operations',
    location: 'Chennai Studio',
    type: 'Full-Time',
    experience: '5 - 8 Years',
    salary: '₹12,00,000 - ₹20,00,000 / yr',
    overview:
      'Manage global vendor networks for Italian marble slabs, imported solid hardwoods, designer lighting, and custom brass millwork.',
    responsibilities: [
      'Source materials directly from Italian marble quarries, European hardware importers, and artisan workshops.',
      'Negotiate bulk tier pricing, verify material provenance certificates, and enforce delivery timelines.',
      'Manage customs documentation, freight logistics, and studio sample library updates.',
    ],
    requirements: [
      'Degree in Supply Chain, Commerce, or Interior Design.',
      'Established vendor connections across Italian marble importers and luxury lighting houses.',
      'Strong negotiation, contract audit, and ERP inventory tracking skills.',
    ],
  },
  {
    id: 'role-software-eng',
    title: 'Space OS Full-Stack Software Engineer',
    department: 'Vastu-Tech & AI',
    location: 'Remote / Hybrid (Chennai)',
    type: 'Remote',
    experience: '3 - 6 Years',
    salary: '₹15,00,000 - ₹26,00,000 / yr + Stock Grants',
    overview:
      'Build Next.js, React, and Node.js microservices powering Space OS — our client portal for real-time BOQ tracking, 4K camera streams, and Vastu compass algorithms.',
    responsibilities: [
      'Develop reactive web components, interactive budget ledgers, and dynamic 3D viewports.',
      'Build secure REST/tRPC APIs integrating Space OS with factory ERP and payment gateways.',
      'Optimize Web Vitals, accessibility (WCAG 2.2 AAA), and real-time WebSocket notifications.',
    ],
    requirements: [
      'Strong proficiency in TypeScript, React, Next.js App Router, Node.js, and PostgreSQL.',
      'Experience with WebGL / Three.js / Canvas rendering is a huge bonus.',
      'Obsession with performance, clean code, unit testing, and sleek dark UI aesthetics.',
    ],
  },
  {
    id: 'role-jr-arch',
    title: 'Junior Interior Architect',
    department: 'Architectural Design',
    location: 'Chennai Studio',
    type: 'Full-Time',
    experience: '1 - 3 Years',
    salary: '₹6,00,000 - ₹10,00,000 / yr',
    overview:
      'Work alongside Senior Principal Architects on CAD drafting, 3D modeling, material sample selection, and site verification visits.',
    responsibilities: [
      'Draft detailed CAD working drawings for modular kitchens, wardrobes, and false ceilings.',
      'Assist senior architects in 3D modeling and creating client presentation decks.',
      'Participate in physical site measurements and material sample board preparation.',
    ],
    requirements: [
      'B.Arch or Diploma in Interior Design.',
      'Proficiency in AutoCAD, SketchUp, and Photoshop.',
      'High enthusiasm for luxury architectural design, precision details, and continuous learning.',
    ],
  },
];

const CULTURE_PILLARS = [
  {
    num: '01',
    title: 'Architectural Craft & Precision',
    desc: 'We do not build generic interiors. Every project is an architectural statement engineered with BWP marine plywood, German CNC joinery, and 0% compromise.',
  },
  {
    num: '02',
    title: 'Vastu-Tech™ Innovation',
    desc: 'We pioneer spatial intelligence by merging ancient cosmic orientation principles with modern solar compass vector algorithms and 3D computer vision.',
  },
  {
    num: '03',
    title: 'Radical Financial Clarity',
    desc: 'We publish un-gated pricing calculators and transparent itemized BOQs. Honesty is built into our software, contracts, and daily studio culture.',
  },
  {
    num: '04',
    title: 'Rapid Meritocratic Growth',
    desc: 'Careers are defined by impact, not tenure. High performers receive annual leveling, performance bonuses, equity grants, and leadership pathways.',
  },
  {
    num: '05',
    title: 'Zero-Crunch Work-Life Balance',
    desc: 'We respect your life outside work. We operate on a strict 5-day week, enforce no weekend calls, and provide mandatory paid rejuvenation leaves.',
  },
  {
    num: '06',
    title: 'World-Class Studio Ecosystem',
    desc: 'Work with M3 Max workstations, color-calibrated 4K displays, Meta Quest VR headsets, and an inspiring studio environment in Nungambakkam, Chennai.',
  },
];

const BENEFITS: Array<{ icon: IconName; title: string; desc: string }> = [
  {
    icon: 'compass',
    title: 'Top 10% Industry CTC',
    desc: 'Competitive salary packages benchmarked against top architectural firms and tech studios, plus biannual performance bonuses.',
  },
  {
    icon: 'gauge',
    title: 'Comprehensive Medical',
    desc: '₹5L health insurance coverage for employee, spouse, children, and dependent parents with zero co-pay.',
  },
  {
    icon: 'layers',
    title: '₹1.5L Learning Stipend',
    desc: 'Annual individual budget for international design conferences, software certifications, and specialized masterclasses.',
  },
  {
    icon: 'device',
    title: 'Modern Hardware & VR',
    desc: 'Choice of M3 Max MacBook Pro or Dual-RTX Workstations with color-calibrated 4K monitors and VR testing gear.',
  },
  {
    icon: 'check',
    title: 'Annual Studio Retreats',
    desc: 'All-expenses-paid annual international studio retreats to design capitals like Bali, Dubai, and Singapore.',
  },
  {
    icon: 'info',
    title: 'Relocation & Housing',
    desc: 'Full relocation assistance + 30 days free stay in a luxury serviced apartment for team members moving to Chennai.',
  },
];

const HIRING_STAGES = [
  {
    step: '01',
    title: 'Application & Portfolio Review',
    desc: 'Submit your resume and portfolio. Our design leads review every submission and respond within 48 hours.',
  },
  {
    step: '02',
    title: 'Architectural / Tech Deep-Dive',
    desc: 'A 45-minute video call discussing your past projects, design methodology, or code architectural patterns.',
  },
  {
    step: '03',
    title: 'Collaborative Design Challenge',
    desc: 'A short paid 2-hour practical challenge or live walkthrough solving a real spatial or technical problem.',
  },
  {
    step: '04',
    title: 'Studio Tour & Offer',
    desc: 'Visit our Chennai studio, meet the team, discuss compensation & equity options, and receive your formal offer letter.',
  },
];

const FAQS = [
  {
    q: 'Are remote or hybrid positions available?',
    a: 'Yes. Software engineering, 3D visualization, and computational Vastu roles support remote or hybrid arrangements. Site engineering and principal architect roles are located at our Chennai studio.',
  },
  {
    q: 'How does the performance bonus structure work?',
    a: 'Performance bonuses are evaluated biannually based on project completion timelines, client satisfaction index on Space OS, and individual design contributions.',
  },
  {
    q: 'Can fresh graduates apply for roles at Luxe Axis?',
    a: 'Yes! We hire junior architects and junior visualization artists through our Graduate Architect Program with 1-on-1 mentorship from senior principal architects.',
  },
  {
    q: 'What is the interview response time guarantee?',
    a: 'We respect candidate time. Every applicant receives an update on their application status within 48 business hours of submission.',
  },
];

export function CareersClient() {
  const [selectedDept, setSelectedDept] = useState<string>('All Roles');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Senior Principal Architect (Residential Luxury)',
    portfolio: '',
    experience: '5-8 Yrs',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pushToast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      pushToast({
        title: 'File Too Large',
        description: 'Resume file size must be less than 10MB.',
        tone: 'warning',
      });
      return;
    }

    setResumeFile(file);
  };

  const departments = [
    'All Roles',
    'Architectural Design',
    'Vastu-Tech & AI',
    'Project Engineering',
    '3D & VR Staging',
    'Studio Operations',
  ];

  const filteredRoles =
    selectedDept === 'All Roles'
      ? OPEN_ROLES
      : OPEN_ROLES.filter((r) => r.department === selectedDept);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      pushToast({
        title: 'Form Incomplete',
        description: 'Please complete your name and email before submitting.',
        tone: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('role', formData.role);
      payload.append('experience', formData.experience);
      payload.append('portfolio', formData.portfolio);
      payload.append('message', formData.message);
      if (resumeFile) {
        payload.append('resume', resumeFile);
      }

      const res = await fetch('/api/careers', {
        method: 'POST',
        body: payload,
      });

      const data = (await res.json()) as { ok?: boolean; message?: string; simulated?: boolean };

      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Failed to submit application.');
      }

      pushToast({
        title: 'Application Submitted Successfully!',
        description: data.simulated
          ? 'Application received! Details logged (Resend API will email careers@luxeaxis.in when API key is provided).'
          : 'Your details & resume have been sent to careers@luxeaxis.in. Our team will contact you within 48 hours.',
        tone: 'success',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Senior Principal Architect (Residential Luxury)',
        portfolio: '',
        experience: '5-8 Yrs',
        message: '',
      });
      setResumeFile(null);
    } catch (err) {
      pushToast({
        title: 'Submission Error',
        description:
          err instanceof Error ? err.message : 'An error occurred while submitting your application.',
        tone: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Luxe Axis Careers',
          description:
            'Careers at Luxe Axis — Join Chennai’s premier architectural luxury & Vastu-Tech studio.',
          url: ROUTE,
          jobPosting: OPEN_ROLES.map((role) => ({
            '@type': 'JobPosting',
            title: role.title,
            description: role.overview,
            employmentType: 'FULL_TIME',
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Chennai',
                addressRegion: 'Tamil Nadu',
                addressCountry: 'IN',
              },
            },
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: 'INR',
              value: role.salary,
            },
          })),
        }}
      />

      {/* 1. Hero Stage with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={CAREERS_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs
            path="/careers"
            labels={{ careers: 'Careers & Culture' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                ⚡ We’re Hiring • 8 Open Positions in Chennai & Remote
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Build the Future of <br />
              <span className="text-accent">
                Luxury Architecture & Vastu-Tech
              </span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Join an elite team of principal architects, computational engineers,
              Vastu researchers, and 3D visualization pioneers designing India’s
              finest residences and high-performance commercial spaces.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="#open-roles"
                size="lg"
                className="shadow-2xl"
              >
                Explore Open Positions ↓
              </Button>
              <Button
                as="a"
                href="#culture"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                Our Studio Culture →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Glassdoor Rating
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Guaranteed Handover
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  100%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Bonus & Equity Eligible
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  0%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Crunch Policy
                </span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Studio Culture & Values Section */}
      <Section
        id="culture"
        eyebrow="Why Build With Us"
        title="Our Studio Culture & Principles"
        lede="We believe exceptional architectural design requires an environment built on craft, radical transparency, and work-life balance."
      >
        <Grid cols={3} gap={6}>
          {CULTURE_PILLARS.map((pillar) => (
            <div
              key={pillar.num}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between hover:border-accent/60 transition-all duration-300 group"
            >
              <div>
                <span className="font-display text-h2 font-bold text-accent/40 group-hover:text-accent transition-colors block mb-2">
                  {pillar.num}
                </span>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-2">
                  {pillar.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 3. Open Roles Directory */}
      <Section
        id="open-roles"
        eyebrow="Career Opportunities"
        title="Open Positions at Luxe Axis"
        lede="Find your next role in architectural design, Vastu-Tech software engineering, 3D visualization, or site execution."
      >
        {/* Department Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-8 border-b border-border-subtle/50">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full font-ui text-small font-bold transition-all duration-200 ${
                selectedDept === dept
                  ? 'bg-accent text-surface-deep shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                  : 'bg-surface-raised border border-border-subtle text-on-surface-2 hover:border-accent/40'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Roles List */}
        <div className="mt-8 space-y-4">
          {filteredRoles.map((role) => {
            const isExpanded = expandedRole === role.id;
            return (
              <div
                key={role.id}
                className="lx-liquid-glass rounded-2xl border border-accent/30 overflow-hidden transition-all duration-300 hover:border-accent/60"
              >
                <button
                  type="button"
                  onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-wider">
                        {role.department}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-surface-raised border border-border-subtle text-on-surface-2 text-[11px] font-semibold">
                        {role.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-surface-raised border border-border-subtle text-on-surface-muted text-[11px]">
                        {role.experience}
                      </span>
                    </div>
                    <h3 className="font-display text-h3 font-bold text-on-surface">
                      {role.title}
                    </h3>
                    <p className="text-small text-on-surface-muted">
                      📍 {role.location} • 💰 {role.salary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-4 py-2 rounded-xl bg-accent text-surface-deep font-ui text-small font-bold shadow-md">
                      {isExpanded ? 'Hide Details' : 'View Role & Apply'}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-block text-accent transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-border-subtle/40 space-y-4 bg-surface-deep/40">
                    <p className="text-body text-on-surface-2 leading-relaxed">
                      {role.overview}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="font-ui text-small uppercase tracking-wider text-accent font-bold mb-2">
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-1.5 text-small text-on-surface-2 list-disc list-inside">
                          {role.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-ui text-small uppercase tracking-wider text-accent font-bold mb-2">
                          Requirements & Qualifications
                        </h4>
                        <ul className="space-y-1.5 text-small text-on-surface-2 list-disc list-inside">
                          {role.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        as="a"
                        href="#apply-form"
                        size="md"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: role.title }))
                        }
                      >
                        Apply for {role.title} →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* 4. Perks & Benefits Grid */}
      <Section
        id="benefits"
        eyebrow="Total Rewards"
        title="Comprehensive Benefits & Support"
        lede="We invest heavily in our team’s health, financial security, workstation tech, and professional growth."
      >
        <Grid cols={3} gap={6}>
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg bg-accent/15 border border-accent/30 text-accent shrink-0">
                <Icon name={b.icon} size="md" decorative />
              </div>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {b.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. 4-Stage Hiring Journey */}
      <Section
        id="hiring-process"
        eyebrow="Transparent Hiring"
        title="Our 4-Step Interview Process"
        lede="No 7-round interview marathons. Our hiring process is streamlined, respectful of your time, and completed within 10 days."
      >
        <Grid cols={4} gap={4}>
          {HIRING_STAGES.map((stage) => (
            <div
              key={stage.step}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 relative"
            >
              <span className="font-display text-h2 font-bold text-accent block mb-2">
                {stage.step}
              </span>
              <h3 className="font-display text-h4 font-bold text-on-surface mb-1.5">
                {stage.title}
              </h3>
              <p className="text-small text-on-surface-2 leading-relaxed">
                {stage.desc}
              </p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 6. Quick Application Form */}
      <Section
        id="apply-form"
        eyebrow="Direct Application"
        title="Apply to Join Luxe Axis Studio"
        lede="Submit your details below. You will receive an email confirmation and an update within 48 business hours."
      >
        <div className="max-w-3xl mx-auto lx-liquid-glass rounded-2xl p-8 border border-accent/40 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="careers-name"
                  className="block text-small font-bold text-on-surface mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="careers-name"
                  type="text"
                  required
                  placeholder="Arjun Ramachandran"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface placeholder:text-on-surface-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="careers-email"
                  className="block text-small font-bold text-on-surface mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="careers-email"
                  type="email"
                  required
                  placeholder="arjun@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface placeholder:text-on-surface-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="careers-phone"
                  className="block text-small font-bold text-on-surface mb-1.5"
                >
                  Phone / WhatsApp
                </label>
                <input
                  id="careers-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface placeholder:text-on-surface-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="careers-role-select"
                  className="block text-small font-bold text-on-surface mb-1.5"
                >
                  Target Position *
                </label>
                <select
                  id="careers-role-select"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface focus:border-accent focus:outline-none"
                >
                  {OPEN_ROLES.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                  <option value="General Spontaneous Application">
                    General Spontaneous Application
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="careers-exp-select"
                  className="block text-small font-bold text-on-surface mb-1.5"
                >
                  Years of Experience
                </label>
                <select
                  id="careers-exp-select"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface focus:border-accent focus:outline-none"
                >
                  <option value="0-2 Yrs">0 - 2 Years</option>
                  <option value="3-5 Yrs">3 - 5 Years</option>
                  <option value="5-8 Yrs">5 - 8 Years</option>
                  <option value="8+ Yrs">8+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="careers-portfolio"
                className="block text-small font-bold text-on-surface mb-1.5"
              >
                Portfolio / LinkedIn / GitHub URL
              </label>
              <input
                id="careers-portfolio"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile or https://behance.net/portfolio"
                value={formData.portfolio}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface placeholder:text-on-surface-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label
                htmlFor="careers-resume"
                className="block text-small font-bold text-on-surface mb-1.5"
              >
                Attach Resume / CV (PDF, DOC, DOCX up to 10MB)
              </label>
              <input
                id="careers-resume"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
              {resumeFile ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-deep border border-accent/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-2 rounded-lg bg-accent/15 text-accent font-bold shrink-0">
                      📄
                    </span>
                    <div className="min-w-0">
                      <p className="font-ui text-small font-bold text-on-surface truncate">
                        {resumeFile.name}
                      </p>
                      <p className="text-[11px] text-on-surface-muted">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to submit
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-small font-bold text-error hover:bg-error/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="careers-resume"
                  className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-deep border-2 border-dashed border-accent/30 hover:border-accent cursor-pointer transition-colors group"
                >
                  <span className="p-3 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-h4 group-hover:scale-110 transition-transform mb-2">
                    📎
                  </span>
                  <span className="font-ui text-small font-bold text-on-surface group-hover:text-accent transition-colors">
                    Click to browse or drop your Resume / CV
                  </span>
                  <span className="text-[11px] text-on-surface-muted mt-1">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </span>
                </label>
              )}
            </div>

            <div>
              <label
                htmlFor="careers-message"
                className="block text-small font-bold text-on-surface mb-1.5"
              >
                Cover Note / Introduction
              </label>
              <textarea
                id="careers-message"
                rows={4}
                placeholder="Tell us briefly about your design philosophy, major projects engineered, or why you want to join Luxe Axis..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-surface-deep border border-accent/30 text-on-surface placeholder:text-on-surface-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Submitting Application...'
                  : 'Submit Application →'}
              </Button>
            </div>
          </form>
        </div>
      </Section>

      {/* 7. Applicant FAQ */}
      <Section
        id="careers-faq"
        eyebrow="Applicant Questions"
        title="Frequently Asked Questions"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group lx-liquid-glass rounded-xl p-4 border border-accent/30"
            >
              <summary className="font-display text-body font-bold text-on-surface cursor-pointer flex items-center justify-between list-none">
                <span>{faq.q}</span>
                <span className="text-accent group-open:rotate-45 transition-transform text-h4">
                  ＋
                </span>
              </summary>
              <p className="text-small text-on-surface-2 mt-3 pt-3 border-t border-border-subtle/40 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <CTASection />
    </main>
  );
}
