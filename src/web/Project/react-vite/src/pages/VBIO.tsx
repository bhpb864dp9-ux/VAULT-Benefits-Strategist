/**
 * VAULT — VBIO Network
 * Educational/Power-user path entry point.
 *
 * Note: This page is intentionally local-first. No signup data is transmitted from the client.
 */
import { ArrowRight, BookOpen, Lock, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VBIO() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-narrow">
        <div className="mb-10">
          <span className="eyebrow">VBIO</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-50 mt-4">
            Veteran Benefits Intelligence Officer Network
          </h1>
          <p className="text-slate-400 mt-4 text-lg">
            A power-user lane for veterans and trusted helpers who want to learn the system, build stronger evidence chains,
            and teach others—without paywalls or data extraction.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="card">
            <h2 className="text-xl font-serif text-slate-100 mb-4">What VBIO is</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <BookOpen className="w-5 h-5 text-brass mt-0.5" />
                <span>
                  <span className="text-slate-100 font-medium">Education-first</span> — VASRD math, evidence logic, and claim narrative craft.
                </span>
              </li>
              <li className="flex gap-3">
                <Users className="w-5 h-5 text-brass mt-0.5" />
                <span>
                  <span className="text-slate-100 font-medium">Community-ready</span> — designed for peer support (Battle Buddy / VSO workflows) while staying local-first.
                </span>
              </li>
              <li className="flex gap-3">
                <Lock className="w-5 h-5 text-brass mt-0.5" />
                <span>
                  <span className="text-slate-100 font-medium">Offline by default</span> — your claim data stays on your device.
                </span>
              </li>
              <li className="flex gap-3">
                <Shield className="w-5 h-5 text-brass mt-0.5" />
                <span>
                  <span className="text-slate-100 font-medium">Anti-scam posture</span> — no upsells, no data harvesting, no middlemen for core workflow.
                </span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-serif text-slate-100 mb-2">Start now</h2>
            <p className="text-slate-400">
              If you’re here to learn and execute, the fastest path is to run the workflow and build clean artifacts.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/claim/mission" className="btn btn-primary">
                Start a Claim
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/tools" className="btn btn-ghost">
                Open Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="card border-brass/20">
            <h2 className="text-xl font-serif text-slate-100 mb-2">Join (coming next)</h2>
            <p className="text-slate-400">
              VBIO membership and verified identity (ID.me) will be added as an optional flow.
              It will never be required to use the core claim tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


