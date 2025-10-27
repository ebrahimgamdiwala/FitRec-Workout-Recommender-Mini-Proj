'use client';

import GlassCard from './GlassCard';

export default function Footer() {
  return (
    <footer id="about" className="relative z-10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <GlassCard hover={false}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-3">
                FitRec
              </h3>
              <p className="text-gray-300 mb-4">
                Your AI-powered fitness companion for personalized workout recommendations. 
                Built with passion for helping you achieve your fitness goals.
              </p>
              <div className="flex gap-4">
                {['twitter', 'github', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  >
                    <span className="text-white">
                      {social.charAt(0).toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {['Home', 'Features', 'Recommend', 'About'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Contact
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>support@fitrec.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Fitness Street</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 FitRec. All rights reserved. Built with ❤️ for fitness enthusiasts.</p>
          </div>
        </GlassCard>
      </div>
    </footer>
  );
}
