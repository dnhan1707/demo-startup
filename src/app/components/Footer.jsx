import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-300 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <span className="text-2xl font-bold">ClaimSwift</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Revolutionizing insurance claims processing with AI-powered automation and intelligent decision-making.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Solutions</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Auto Claims</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Property Claims</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Health Insurance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Commercial Lines</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Life Insurance</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span>hello@claimswift.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            {/* <div className="mt-6">
              <h4 className="font-medium mb-3 text-white">Stay Updated</h4>
              <div className="flex space-x-2">
                <input 
                  type="email"
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-300 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ClaimSwift AI. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Security</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;