import React from 'react';
import { NonIt } from '../../assets';

const rightRadiusCard = ({img, description}) => {
  return (
    <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-l-3xl sm:rounded-l-full flex flex-col sm:flex-row gap-4 justify-center items-center w-full">

      <div className='w-full sm:w-[70%] order-2 sm:order-1'>
        <p className=' text-xs sm:text-sm  lg:text-md font-[400]'>
          {description}
        </p>
      </div>
      
      <div className='w-full sm:w-[30%] flex justify-center sm:justify-end order-1 sm:order-2'>
        <img className='w-40 sm:w-48 md:w-56' src={img} alt="" />
      </div>
      
    </div>
  );
};

export default rightRadiusCard;