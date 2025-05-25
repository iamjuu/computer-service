import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LeftRadiusCard = ({ img, listPoints = [], header }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-r-3xl sm:rounded-r-full flex flex-col sm:flex-row gap-4 w-full">
      
      <div className='w-full sm:w-[25%] flex justify-center sm:justify-start order-1' data-aos="fade-up">
        <img className='w-40 sm:w-48 md:w-56' src={img} alt="" />
      </div>
      
      <div className='w-full flex flex-col  p-4 justify-center items-center gap-4 sm:w-[70%] order-2' data-aos="fade-down">
        <h1 className='text-xl font-[500] text-center'>
          {header}
        </h1>
        <div className='text-sm md:text-[16px] font-[400] space-y-2 w-full'>
          {Array.isArray(listPoints) && listPoints.map((point, index) => (
            <p 
              key={index} 
              className='leading-relaxed'
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {point}
            </p>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default LeftRadiusCard;