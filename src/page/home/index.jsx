import React from "react";
import Navbar from "../../components/navbar";
import { mainImage, Compterimage, NonIt } from "../../assets";
import LeftRadiusCard from "../../components/leftRadiusCard";
import RightRadiusCard from "../../components/rightRaduisCard";
import ContactForm from "../../components/contactform";
const leftData = [
  {
    img: NonIt,
    description:
      "We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions.We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutionsWe specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions",
  },
  {
    img: NonIt,
    description:
      "We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions.We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutionsWe specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions",
  },
];
const rightData = [
  {
    img: NonIt,
    description:
      "We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions.We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutionsWe specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions",
  },
  {
    img: NonIt,
    description:
      "We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions.We specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutionsWe specialize in delivering high-quality computer hardware and networking solutions for businesses, homes, and institutions",
  },
];
const Index = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="">
      <Navbar />

      <div className="w-full py-8 md:py-16 flex justify-center items-center">
        <div className="w-full max-w-[1300px] px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left content */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="font-normal text-blue-600">
                  Providing Reliable Hardware{" "}
                </span>
                <span className="font-normal text-blue-700">& </span>
                <span className="font-normal text-purple-600">
                  Networking Services
                </span>
              </h1>

              <p className="text-gray-600 text-sm sm:text-base">
                We specialize in delivering high-quality computer hardware and
                networking solutions for businesses, homes, and institutions.
                From device setup and configuration, we ensure speed, security,
                and seamless connectivity in every project.
              </p>

              <button 
                onClick={scrollToServices}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 px-4 sm:px-6 rounded-full flex items-center text-sm sm:text-base"
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Right content - Illustration */}
            <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
              <img
                className="w-full max-w-md"
                src={Compterimage}
                alt="Computer hardware illustration"
              />
            </div>
          </div>

          {/* About Company section with responsive fixes */}
          <div className="bg-[#EDF7FF] p-3 sm:p-5 w-full mt-8 md:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 rounded-3xl sm:rounded-full">
            <div className="w-full sm:w-[30%] py-4 rounded-2xl sm:rounded-l-full bg-white flex justify-center items-center">
              <h1  id="about"  className="text-xl sm:text-2xl text-[#0048FF] font-bold text-center">
                About <br /> Company
              </h1>
            </div>
            <div className="w-full sm:w-[70%] flex justify-center items-center py-4 sm:py-0">
              <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-8 px-4 sm:px-0">
                We specialize in delivering high-quality computer hardware and
                networking solutions for businesses, homes, and institutions.
                From device setup and configuration, we ensure speed, security,
                and seamless connectivity in every project.
              </p>
            </div>
          </div>

          <h1 id="services"  className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 mt-8 sm:mt-10">
            Our Services
          </h1>

          {/* Services section with responsive design */}
          <div className="flex flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-6 sm:gap-10">
              {leftData.map((item, index) => (
                <LeftRadiusCard
                  key={index}
                  img={item.img}
                  description={item.description}
                />
              ))}
            </div>
            <div className="flex flex-col gap-6 sm:gap-10">
              {rightData.map((item, index) => (
                <RightRadiusCard
                  key={index}
                  img={item.img}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 w-full flex justify-center   flex-col sm:mt-10">
            <h1  id="contact"  className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 mt-8 sm:mt-10">
              Contact Us
            </h1>{" "}
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
