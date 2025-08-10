import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { get } from "../../utils/functions";

const Navbar = ({ isModalOpen: externalIsModalOpen, setIsModalOpen: externalSetIsModalOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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

  const handleContinue = async () => {
    if (isValidNumber) {
      console.log('Proceeding with phone number:', phoneNumber);
      setIsLoading(true);
      
      try {
        // Make API call to get bills by phone number
        const response = await get(`/bill-by-number/${phoneNumber}`);
        console.log('Bills found:', response.data);
        
        setIsModalOpen(false);
        setPhoneNumber("");
        setIsLoading(false);
        
        // Navigate to bill page with the fetched data and HTML invoices
        navigate('/bill', { 
          state: { 
            phoneNumber,
            bills: response.data.data,
            htmlInvoices: response.data.htmlInvoices || [],
            admin: false 
          }
        });
      } catch (error) {
        console.error('Error fetching bills:', error);
        setIsLoading(false);
        
        // Handle error cases - still navigate but with empty bills array
        if (error.response && error.response.status === 404) {
          console.log('No bills found for this number');
          setIsModalOpen(false);
          setPhoneNumber("");
          navigate('/bill', { 
            state: { 
              phoneNumber,
              bills: [],
              admin: false,
              message: 'No bills found for this phone number'
            }
          });
        } else {
          // For other errors, show an alert or handle appropriately
          alert('Error fetching bills. Please try again.');
        }
      }
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

  const handleLogoClick = () => {
    console.log('Logo clicked - checking login status');
    if (isLoggedIn) {
      console.log('User is logged in - navigating to admin panel');
      navigate('/admin');
    } else {
      console.log('User is not logged in - navigating to login page');
      navigate('/login');
    }
  };

  const navItems = isLoggedIn 
    ? ['Home', 'Bill', 'About', 'Our Services', 'Contact'] 
    : ['Home', 'Bill', 'About', 'Our Services', 'Contact'];

  return (
    <>
      <div className={`w-full flex justify-center items-center transform transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-[1300px] w-full px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div 
              className="flex items-center gap-4 md:gap-12 flex-shrink-0 cursor-pointer" 
              onClick={handleLogoClick}
            >
              <img src={logo} alt="logo" className="w-[60px] md:w-[80px]" />
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
                  {navItems.map((item, index) => (
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
              {navItems.map((item, index) => (
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
                disabled={!isValidNumber || isLoading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isValidNumber && !isLoading
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? "Loading..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;