import React from 'react';
import { NonIt } from '../../assets';

const leftRadiusCard = ({img, description}) => {
  return (
    <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-r-3xl sm:rounded-r-full flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
      
      <div className='w-full sm:w-[30%] flex justify-center sm:justify-start order-1'>
        <img className='w-40 sm:w-48 md:w-56' src={img} alt="" />
      </div>
      
      <div className='w-full sm:w-[70%] order-2'>
        <p className=' text-xs sm:text-sm md:text-base lg:text-md font-[400]'>
          {description}
        </p>
      </div>
      
    </div>
  );
};

export default leftRadiusCard;