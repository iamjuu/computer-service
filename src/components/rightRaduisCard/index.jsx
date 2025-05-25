const RightRadiusCard = ({ img, listPoints, header }) => {
  return (
    <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-l-3xl sm:rounded-l-full flex flex-col sm:flex-row gap-4 w-full">
      
      <div className='w-full flex flex-col p-4 justify-center items-center gap-4 sm:w-[70%] order-2 sm:order-1'>
        <h1 className='text-xl font-[500] text-center'>
          {header}
        </h1>
        <div className='  text-sm md:text-[16px] font-[400] p-5 w-full'>
          {listPoints.map((point, index) => (
            <p key={index} className='leading-relaxed'>
              {point}
            </p>
          ))}
        </div>
      </div>
      
      <div className='w-full sm:w-[35%] flex justify-center items-center'>
        <img className='w-40 sm:w-48 md:w-56' src={img} alt="" />
      </div>
      
    </div>
  );
};

export default RightRadiusCard;