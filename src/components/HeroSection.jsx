import React from 'react';
import { Brain, Stethoscope, ShieldCheck, HeartPulse, ArrowRight, Activity } from 'lucide-react';
import { Button } from './Button';
export const HeroSection = ({ onOpenAIDiagnosis, onSearchDoctors }) => {
    return (<div className="relative overflow-hidden bg-slate-50 pt-10 pb-20 border-b border-slate-200">
      {/* Background soft glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-100/60 blur-[120px] pointer-events-none rounded-full"/>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-emerald-100/50 blur-[100px] pointer-events-none rounded-full"/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-2xs">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse"/>
              <span>Next-Gen AI Healthcare & Clinical Triage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Instant AI Triage & <span className="text-blue-600">Expert Doctor Care</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              CareXpertAI combines real-time Gemini AI symptom diagnosis with seamless doctor bookings, hospital discovery, and digital prescriptions in one clinical platform.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button onClick={onOpenAIDiagnosis} size="lg" variant="primary" icon={<Brain className="w-5 h-5 text-white"/>} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-base">
                Analyze Symptoms with AI
              </Button>

              <Button onClick={onSearchDoctors} size="lg" variant="secondary" icon={<Stethoscope className="w-5 h-5 text-blue-600"/>} className="text-base">
                Find Specialist Doctor
              </Button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">99.4%</p>
                <p className="text-xs text-slate-500">AI Diagnostic Accuracy</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-600">150+</p>
                <p className="text-xs text-slate-500">Verified Specialists</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">24/7</p>
                <p className="text-xs text-slate-500">Emergency Map Tracking</p>
              </div>
            </div>
          </div>

          {/* Right Floating Card Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
                    <Brain className="w-6 h-6"/>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">AI Live Symptom Triage</h3>
                    <p className="text-xs text-slate-500">Powered by Gemini AI Engine</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"/>
              </div>

              {/* Mock AI Live Demo Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Sample Symptoms:</span>
                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Moderate Risk
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"Chest tightness after exertion, mild breathlessness"</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-blue-600 font-semibold">
                  <span>Recommended Specialist: Cardiologist</span>
                  <ArrowRight className="w-4 h-4"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0"/>
                  <span className="text-slate-700 font-medium">HIPAA Compliant Data</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500 shrink-0"/>
                  <span className="text-slate-700 font-medium">Real-time Vitals Triage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
