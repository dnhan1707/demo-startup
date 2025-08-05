import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-semibold mb-6">Company Name</div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Accelerating insurance claim decisions with AI-powered workflows, automation, and explainability.
            </p>
            <div className="flex space-x-4">
              {[Linkedin, Twitter, Github, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-medium uppercase mb-6 tracking-wide text-white/90">Solutions</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Auto Claims', 'Property Claims', 'Health Insurance', 'Commercial Lines', 'Life Insurance'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-medium uppercase mb-6 tracking-wide text-white/90">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {['About Us', 'Careers', 'Press', 'Partners', 'Blog'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium uppercase mb-6 tracking-wide text-white/90">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white" />
                <span>email@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-white" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-white" />
                <span>Location, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Company. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Security', 'Cookies'].map((item, i) => (
              <a key={i} href="#" className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;