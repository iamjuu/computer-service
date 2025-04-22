import React from 'react';
import { NonIt } from '../../assets';
const LeftRadiusCard = ({img,description}) => {
  return (
    <div className="bg-blue-50 p-8 rounded-l-full  items-center justify-center w-full flex">
 <div className='w-[30%]'>
  <img className='w-56' src={img} alt="" />
 
 </div>
 <div className='w-[70%]'>
 <p>
  {description}
  </p>
 </div>
  
    </div>
  );
};

export default LeftRadiusCard;
