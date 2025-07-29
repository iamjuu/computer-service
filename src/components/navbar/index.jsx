import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LOgo } from "../../assets";

const Navbar = ({ isModalOpen: externalIsModalOpen, setIsModalOpen: externalSetIsModalOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidNumber, setIsValidNumber] = useState(false);

  // Use external modal state if provided, otherwise use internal state
  const isModalOpen = externalIsModalOpen !== undefined ? externalIsModalOpen : false;
  const setIsModalOpen = externalSetIsModalOpen || (() => {});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setIsValidNumber(value.length === 10);
    console.log('Phone number changed:', value, 'Is valid:', value.length === 10);
  };

  const handleContinue = () => {
    if (isValidNumber) {
      console.log('Proceeding with phone number:', phoneNumber);
      setIsModalOpen(false);
      setPhoneNumber("");
      navigate('/bill', { state: { phoneNumber } });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPhoneNumber("");
    setIsValidNumber(false);
    console.log('Closing modal and resetting state');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const handleNavigation = (item) => {
    if (item === 'Home') {
      navigate('/');
    } else if (item === 'Bill') {
      setIsModalOpen(true);
    } else if (item === 'About') {
      scrollToSection('about');
    } else if (item === 'Our Services') {
      scrollToSection('services');
    } else if (item === 'Contact') {
      scrollToSection('contact');
    }
  };

  return (
    <>
      <div className={`w-full flex justify-center items-center transform transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-[1300px] w-full px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div 
              className="flex items-center gap-4 md:gap-12 flex-shrink-0 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <img src={LOgo} alt="logo" className="w-[60px] md:w-[80px]" />
              {/* Name */}
              <div>
                <h1 className="text-[28px] md:text-[35px] font-[400]">
                  TechFix
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12 justify-end w-[50%]">
              <div className="hidden md:block">
                <ul className="flex gap-4 justify-center items-center">
                  {['Home', 'Bill', 'About', 'Our Services', 'Contact'].map((item, index) => (
                    <li 
                      key={item}
                      className={`text-[16px] hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      } ${item === 'Bill' ? 'text-blue-600 font-medium' : ''}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      onClick={() => handleNavigation(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect Us Button */}
              <div className="hidden md:block">
                <a href="https://wa.me/916235227964" target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 border border-blue-500 rounded-full text-black hover:bg-blue-500 hover:text-white transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                    Connect Us
                  </button>
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 transition-transform duration-300 ease-in-out"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className={`w-6 h-6 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} 
                   fill="none" 
                   stroke="currentColor" 
                   viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="flex flex-col py-4 gap-6">
              {['Home', 'Bill', 'About', 'Our Services', 'Contact'].map((item, index) => (
                <li 
                  key={item}
                  className={`text-[18px] hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:-translate-x-2 ${
                    item === 'Bill' ? 'text-blue-600 font-medium' : ''
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => handleNavigation(item)}
                >
                  {item}
                </li>
              ))}
              <li>
                <a href="https://wa.me/916235227964" target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transform transition-all duration-300 hover:scale-105">
                    Connect Us
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phone Number Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 p-4 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Enter Phone Number</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="10"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!isValidNumber}
                className={`px-4 py-2 rounded-lg ${
                  isValidNumber
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;