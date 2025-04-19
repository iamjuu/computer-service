import React from "react";
import Navbar from "../../components/navbar";
import { mainImage, Compterimage } from "../../assets";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="w-full py-16  flex justify-center items-center">
        <div className="w-full max-w-[1300px] px-4">
          <div className="flex flex-col   md:flex-row items-center justify-between gap-8">
            {/* Left content */}
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="font-normal text-blue-600">
                  Providing Reliable Hardware{" "}
                </span>
                <span className="font-normal text-blue-700">& </span>
                <span className="font-normal text-purple-600">
                  Networking Services
                </span>
              </h1>

              <p className="text-gray-600">
                We specialize in delivering high-quality computer hardware and
                networking solutions for businesses, homes, and institutions.
                From device setup and configuration, we ensure speed, security,
                and seamless connectivity in every project.
              </p>

              <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 px-6 rounded-full flex items-center">
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
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
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <img
                className="w-full max-w-md"
                src={Compterimage}
                alt="Computer hardware illustration"
              />
            </div>
          </div>
          <div className="bg-[#EDF7FF] p-5 w-full mt-10  h-[200px] flex justify-center  gap-5 rounded-full">
            <div className="w-[30%]    rounded-l-full bg-white flex justify-center items-center">
              <h1 className="text-2xl   text-[#0048FF] font-bold">
                About  <br /> Company
              </h1>
            </div>
            <div className="w-[70%] flex justify-center items-center">
              <p className="text-gray-600 leading-8 " >
                We specialize in delivering high-quality computer hardware and
                networking solutions for businesses, homes, and institutions.
                From device setup and configuration, we ensure speed, security,
                and seamless connectivity in every project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
