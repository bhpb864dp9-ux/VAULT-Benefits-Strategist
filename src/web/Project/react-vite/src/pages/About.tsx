/**
 * VAULT DEM Engine — About Page
 */

import { Shield, Lock, Zap, Heart, ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-brass text-brass">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-50 mb-4">
            About VAULT
          </h1>
          <p className="text-xl text-slate-400">
            Deterministic Entitlement Maximization Engine
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">What is VAULT?</h2>
            <p className="text-slate-400 leading-relaxed">
              VAULT (Veterans Automated Universal Lookup Tool) is a free, privacy-first 
              platform designed to help veterans understand and maximize their VA disability claims. 
              Built with the DEM (Deterministic Entitlement Maximization) engine, VAULT provides 
              exact VASRD calculations, evidence gap analysis, and auto-filled VA forms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">Why "Free Forever"?</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Veterans shouldn't pay for help getting benefits they've already earned through 
              their service. VAULT's free veteran tier is funded by institutional partnerships 
              with VSOs, law firms, and healthcare organizations who need professional-grade 
              claims tools.
            </p>
            <p className="text-slate-400 leading-relaxed">
              This isn't charity — it's the right business model. When organizations pay for 
              VAULT Pro, veterans get the same powerful tools for free. Everyone wins.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">Privacy Guarantee</h2>
            <div className="p-4 sm:p-6 bg-success/5 border border-success/20 rounded-xl">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-success flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-slate-100 mb-2">100% Offline Processing</h3>
                  <p className="text-slate-400 text-sm">
                    VAULT processes all your data directly in your browser. We never transmit 
                    your personal information, medical records, or claim data to any server. 
                    Your information stays on your device, period.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">The DEM Engine</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              DEM stands for Deterministic Entitlement Maximization. It's our proprietary 
              algorithm that analyzes your conditions and identifies the optimal rating 
              strategy within VA regulations.
            </p>
            <ul className="space-y-4">
              {[
                { 
                  text: 'Exact VASRD combined rating math per 38 CFR § 4.25 & § 4.26',
                  cite: 'Combined Ratings Table & Bilateral Factor'
                },
                { 
                  text: 'Automatic TDIU eligibility detection (3 pathways)',
                  cite: '38 CFR § 4.16(a)(b) — Total Disability Individual Unemployability'
                },
                { 
                  text: 'SMC-K, SMC-L, SMC-S, SMC-T trigger identification',
                  cite: '38 U.S.C. § 1114 — Special Monthly Compensation rates'
                },
                { 
                  text: 'Secondary condition nexus suggestions',
                  cite: '38 CFR § 3.310 — Disabilities proximately due to service-connected disease'
                },
                { 
                  text: 'Evidence gap analysis with DBQ checklists',
                  cite: 'VBA-mandated Disability Benefits Questionnaires'
                }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400">
                  <Zap className="w-4 h-4 text-brass mt-1 flex-shrink-0" />
                  <div>
                    <span>{item.text}</span>
                    <span className="block text-xs text-slate-600 mt-0.5">{item.cite}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">Legal Authority & Sources</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Every calculation and recommendation in VAULT is grounded in federal law and VA policy. 
              Here are the primary legal sources:
            </p>
            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Congressional Authority (U.S. Code)</h4>
                <ul className="text-xs text-slate-500 space-y-1.5">
                  <li>
                    <a href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title38-section1155" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 U.S.C. § 1155
                    </a> — Authority for Rating Schedule
                  </li>
                  <li>
                    <a href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title38-section1114" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 U.S.C. § 1114
                    </a> — Special Monthly Compensation Rates
                  </li>
                  <li>
                    <a href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title38-section1110" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 U.S.C. § 1110
                    </a> — Basic Entitlement for Disability Compensation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">VA Regulations (Code of Federal Regulations)</h4>
                <ul className="text-xs text-slate-500 space-y-1.5">
                  <li>
                    <a href="https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 CFR § 4.25
                    </a> — Combined Ratings Table ("Whole Person" Theory)
                  </li>
                  <li>
                    <a href="https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 CFR § 4.26
                    </a> — Bilateral Factor (10% additional for paired extremities)
                  </li>
                  <li>
                    <a href="https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.16" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 CFR § 4.16
                    </a> — Total Disability Individual Unemployability (TDIU)
                  </li>
                  <li>
                    <a href="https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFRb2de7e5c82e0cf4/section-3.310" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 CFR § 3.310
                    </a> — Secondary Service Connection
                  </li>
                  <li>
                    <a href="https://www.ecfr.gov/current/title-38/chapter-I/part-4" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      38 CFR Part 4
                    </a> — Schedule for Rating Disabilities (VASRD)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">VBA Policy & M21-1 Manual</h4>
                <ul className="text-xs text-slate-500 space-y-1.5">
                  <li>
                    <a href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      M21-1 Adjudication Procedures Manual
                    </a> — Official claims processing guidance
                  </li>
                  <li>
                    <a href="https://www.benefits.va.gov/compensation/rates-index.asp" target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">
                      VA Compensation Rates
                    </a> — Current compensation rate tables
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">Important Disclaimer</h2>
            <div className="p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-400 leading-relaxed">
                VAULT is an educational tool, not a substitute for professional representation. 
                We are NOT affiliated with the U.S. Department of Veterans Affairs or any 
                government agency. The calculations and recommendations provided are estimates 
                based on publicly available VA rating criteria.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mt-4">
                For complex claims, appeals, or legal matters, we strongly recommend working 
                with an accredited Veterans Service Organization (VSO), VA-accredited attorney, 
                or claims agent.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif text-slate-100 mb-4">Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'VA.gov', url: 'https://www.va.gov/disability/', desc: 'Official VA disability info' },
                { name: 'eCFR', url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4', desc: '38 CFR Part 4 (Rating Schedule)' },
                { name: 'Find a VSO', url: 'https://www.va.gov/vso/', desc: 'Accredited representatives' },
                { name: 'Crisis Line', url: 'https://www.veteranscrisisline.net/', desc: '988, Press 1' }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 hover:border-brass transition-colors group rounded-xl"
                >
                  <div>
                    <p className="text-slate-200 group-hover:text-brass transition-colors">{link.name}</p>
                    <p className="text-xs text-slate-500">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-brass" />
                </a>
              ))}
            </div>
          </section>

          <section className="text-center py-12 border-t border-slate-800">
            <Heart className="w-8 h-8 mx-auto text-error mb-4" />
            <p className="text-xl font-serif text-slate-200 italic">
              "Built for those who served, by those who served and still care."
            </p>
            <p className="text-sm text-slate-500 mt-4">
              © {new Date().getFullYear()} Northstar-Insight Inc.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


