import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    
    // Show SweetAlert with animation
    Swal.fire({
      title: 'Thank You!',
      text: 'Your message has been sent successfully',
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      message: ''
    });
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md mx-auto">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full opacity-70"></div>
        <div className="absolute top-16 left-16 w-8 h-8 bg-blue-200 rounded-full opacity-70"></div>
        <div className="absolute bottom-8 right-0 w-36 h-36 bg-blue-200 rounded-full opacity-70"></div>
        <div className="absolute bottom-24 right-16 w-10 h-10 bg-blue-200 rounded-full opacity-70"></div>
        
        {/* Form container */}
        <div className="relative bg-white rounded-lg shadow-lg p-8 z-10">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Contact Us</h1>
          
          <div>
            <div className="mb-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Have anything to say?"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              ></textarea>
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;