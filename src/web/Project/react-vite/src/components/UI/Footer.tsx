/**
 * VAULT DEM Engine — Footer Component
 * Legal disclaimers and links
 */

import { Shield, Lock, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeedbackWidget from './FeedbackWidget';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="container-wide py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center border border-slate-700 text-brass">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-medium tracking-widest text-slate-100 uppercase">VAULT</span>
                <span className="text-xs text-slate-500 ml-2">DEM Engine</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Deterministic Entitlement Maximization for VA disability claims. Exact VASRD calculations, evidence intelligence,
              and auto-filled forms. 100% offline, zero privacy risk.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
              <Lock className="w-3 h-3 text-success" />
              <span>All processing happens on your device. We never see your data.</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-200 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/calculator" className="text-slate-400 hover:text-brass transition-colors">
                  VASRD Calculator
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-brass transition-colors">
                  About VAULT
                </Link>
              </li>
              <li>
                <a
                  href="https://www.va.gov/disability/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brass transition-colors"
                >
                  VA.gov Official Site
                </a>
              </li>
              <li>
                <a
                  href="https://www.ecfr.gov/current/title-38/chapter-I/part-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brass transition-colors"
                >
                  38 CFR Part 4
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-200 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.veteranscrisisline.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brass transition-colors inline-flex items-center gap-1"
                >
                  Veterans Crisis Line
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="tel:988" className="text-slate-400 hover:text-brass transition-colors">
                  Call/Text 988, Press 1
                </a>
              </li>
              <li>
                <a
                  href="https://www.va.gov/vso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brass transition-colors inline-flex items-center gap-1"
                >
                  Find a VSO
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>

            {/* Feedback Section */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h5 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                Help Us Improve
              </h5>
              <p className="text-xs text-slate-500 mb-3">
                Your feedback shapes VAULT's future.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Widget - Floating */}
        <FeedbackWidget />

        <div className="mt-10 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> VAULT DEM Engine is an educational tool and is not
            affiliated with the U.S. Department of Veterans Affairs. Calculations are estimates based on 38 CFR Part 4.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">© {currentYear} Northstar-Insight Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-error" />
            <span>for those who served</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


