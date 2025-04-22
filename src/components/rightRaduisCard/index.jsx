import React from 'react';
import { NonIt } from '../../assets';
const rightRadiusCard = ({img,description}) => {
  return (
    <div className="bg-blue-50 p-8 rounded-l-full  justify-center items-center w-full flex">

 <div className='w-[70%]'>
 <p>
    {description}
  </p>
 </div>
 <div className='w-[30%]'>
  <img className='w-56' src={img} alt="" />
 
 </div>
    </div>
  );
};

export default rightRadiusCard;
