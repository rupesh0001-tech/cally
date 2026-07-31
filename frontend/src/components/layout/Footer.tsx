import React from "react";
import { Link } from "react-router-dom";
import { LogoMarkSvg } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="bg-[#171614] text-[#FDFBF2] py-16 px-0 pb-7">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-[30px] text-left">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-[#7CEFC0] rounded-xl flex items-center justify-center shrink-0">
                <LogoMarkSvg fill="none" className="w-[22px] h-[22px] stroke-[#171614] stroke-[2]" />
              </div>
              <div className="leading-[1.15]">
                <div className="font-cal-sans font-bold text-[19px] tracking-wide text-white">Cally</div>
              </div>
            </div>
            <p className="mt-3 text-[13.5px] opacity-60 max-w-[220px] leading-1.6">
              Scheduling infrastructure for everyone.
            </p>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-wider opacity-55 mb-4 font-bold text-white/70">Product</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2.5 text-sm opacity-85">
                <a href="/#features" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">Features</a>
              </li>
              <li className="mb-2.5 text-sm opacity-85">
                <a href="#" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">Integrations</a>
              </li>
              <li className="mb-2.5 text-sm opacity-85">
                <a href="#" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">Pricing</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-wider opacity-55 mb-4 font-bold text-white/70">Legal & Policy</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2.5 text-sm opacity-85">
                <Link to="/privacy" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline font-medium">Privacy Policy</Link>
              </li>
              <li className="mb-2.5 text-sm opacity-85">
                <Link to="/terms" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline font-medium">Terms of Service</Link>
              </li>
              <li className="mb-2.5 text-sm opacity-85">
                <Link to="/blogs" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">Blog</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-wider opacity-55 mb-4 font-bold text-white/70">Social</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2.5 text-sm opacity-85">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">Twitter</a>
              </li>
              <li className="mb-2.5 text-sm opacity-85">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">GitHub</a>
              </li>
              <li className="mb-2.5 text-sm opacity-85">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:opacity-65 transition-all text-[#FDFBF2] no-underline">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between text-[12.5px] opacity-60 gap-4">
          <div>&copy; {new Date().getFullYear()} Cally. Open scheduling infrastructure.</div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:underline text-[#FDFBF2]">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline text-[#FDFBF2]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
