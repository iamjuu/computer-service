import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp, MessageCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">TechFix</h3>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for custom gaming PC builds and computer services in Kannur, Kerala. We deliver high-performance gaming rigs tailored to your needs and budget.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/916235227964" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
              <a href="https://www.instagram.com/techfix_i_t_solutions/" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Gaming PCs', 'Services', 'About Us', 'Contact', 'Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['Gaming PC Build', 'Custom Configurations', 'PC Repair & Service', 'Hardware Upgrades', 'Performance Tuning', 'Technical Support'].map((service) => (
                <li key={service}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">On Site Service</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">Computer Care, Main Road, Kannur, Kerala 670001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">+91  6235 227 964</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">techfix7964@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                <a href="https://wa.me/916235227964" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                6235 227 964
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4">Get Gaming Updates</h4>
            <p className="text-gray-400 mb-4 text-sm">Subscribe for latest gaming hardware news and exclusive offers</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Computer Care, Kannur. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
              <span className="text-sm">Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;