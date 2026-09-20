import React from 'react';
import { Download, Smartphone, Monitor, CheckCircle, ExternalLink, X, Shield, Zap, Sparkles } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
  isInstalled: boolean;
  language: 'en' | 'bn';
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
  isInstalled,
  language,
}) => {
  if (!isOpen) return null;

  const isIframe = window.self !== window.top;

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {language === 'bn' ? 'ইন্টেলিজেন্ট টেকনিশিয়ান অ্যাপ ইনস্টল' : 'Install Intelligent Technician App'}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {language === 'bn'
                  ? 'মোবাইল ও পিসিতে দ্রুত অফলাইন ও ফুলস্ক্রিন ব্যবহারের সুবিধা'
                  : 'Fast, offline-ready Progressive Web App (PWA)'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Iframe Warning / Preview Hint */}
          {isIframe && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {language === 'bn' ? 'প্রিভিউ উইন্ডো নোটিশ:' : 'Preview Window Notice:'}
                </p>
                <p className="mt-0.5 text-amber-300/90 leading-relaxed">
                  {language === 'bn'
                    ? 'ব্রাউজার সিকিউরিটির কারণে প্রিভিউ ফ্রেমের ভেতর সরাসরি ইনস্টল প্রম্পট ব্লক থাকতে পারে। নিচের বাটনে ক্লিক করে নতুন ট্যাবে ওপেন করলে খুব সহজেই সরাসরি ইনস্টল করতে পারবেন।'
                    : 'Browsers block PWA installation inside preview iframes. Click below to open in a new tab for one-click installation.'}
                </p>
                <button
                  type="button"
                  onClick={openInNewTab}
                  className="mt-2.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'নতুন ট্যাবে খুলুন (Open in New Tab)' : 'Open in New Tab'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Direct Install Button if Chrome Prompt Ready */}
          {deferredPrompt && (
            <div className="text-center p-4 bg-blue-950/40 border border-blue-800/50 rounded-2xl">
              <button
                type="button"
                onClick={onTriggerInstall}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'bn' ? 'এখনই অ্যাপ ইনস্টল করুন (Install Now)' : 'Install App Now'}</span>
              </button>
            </div>
          )}

          {/* Device Specific Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>{language === 'bn' ? 'যেভাবে ইনস্টল করবেন (How to Install):' : 'Installation Guide:'}</span>
            </h4>

            {/* Android / Chrome */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                <span>Android / Google Chrome & Edge</span>
              </div>
              <p className="text-slate-400 text-[11px] pl-7">
                {language === 'bn'
                  ? 'ব্রাউজারের উপরের ডান কোনায় ৩টি ডট (⋮) চাপুন এবং "Install app" অথবা "Add to Home screen" নির্বাচন করুন।'
                  : 'Tap the 3 dots (⋮) menu in Chrome/Edge, then tap "Install app" or "Add to Home screen".'}
              </p>
            </div>

            {/* iPhone / Safari */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                <span>iPhone / iPad (Apple Safari)</span>
              </div>
              <p className="text-slate-400 text-[11px] pl-7">
                {language === 'bn'
                  ? 'Safari ব্রাউজারের নিচে শেয়ার বাটন (Share ⎋) চাপুন এবং স্ক্রল করে "Add to Home Screen (⊞)" এ ক্লিক করুন।'
                  : 'Tap the Safari Share button (⎋), scroll down and tap "Add to Home Screen (⊞)".'}
              </p>
            </div>

            {/* Desktop PC */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[11px] font-bold">
                  3
                </span>
                <span>Windows PC / Mac</span>
              </div>
              <p className="text-slate-400 text-[11px] pl-7">
                {language === 'bn'
                  ? 'ব্রাউজারের অ্যাড্রেস বারের ডানে ইনস্টল আইকন (⊕) ক্লিক করুন এবং "Install" নির্বাচন করুন।'
                  : 'Look for the Install icon (⊕) in the browser address bar and click "Install".'}
              </p>
            </div>
          </div>

          {/* App Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-950/60">
              <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-300 font-bold">{language === 'bn' ? 'সুপার ফাস্ট' : 'Super Fast'}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60">
              <Shield className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-300 font-bold">{language === 'bn' ? 'অফলাইন সেভ' : 'Offline Ready'}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60">
              <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-300 font-bold">{language === 'bn' ? 'ফুল স্ক্রিন' : 'Standalone'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
