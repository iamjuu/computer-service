import React, { useState, useEffect } from "react";
import { LOgo } from "../../assets";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <div className={`w-full  flex justify-center items-center transform transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-[1300px] w-full ">
        <div className="flex justify-between   items-center">
          <div className="">
            <img src={LOgo} alt="logo" className="w-[80px] " />
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden transition-transform   duration-300 ease-in-out"
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

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex gap-4 justify-center items-center">
              {['Home', 'About', 'Our Services', 'Contact'].map((item, index) => (
                <li 
                  key={item}
                  className={`text-[16px] hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => {
                    if (item === 'About') scrollToSection('about');
                    else if (item === 'Our Services') scrollToSection('services');
                    else if (item === 'Contact') scrollToSection('contact');
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <button className="px-4 py-2 border border-blue-500 rounded-full text-black  hover:bg-blue-500  hover:text-white transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              Follow Us
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="flex flex-col pl-10 gap-4 mt-4">
            {['Home', 'About', 'Our Services', 'Contact'].map((item, index) => (
              <li 
                key={item}
                className="text-[16px] hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:-translate-x-2"
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (item === 'About') scrollToSection('about');
                  else if (item === 'Our Services') scrollToSection('services');
                  else if (item === 'Contact') scrollToSection('contact');
                }}
              >
                {item}
              </li>
            ))}
            <li>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transform transition-all duration-300 hover:scale-105">
                Follow Us
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
