import Blogs from './Blogs';
import React from 'react';


function NFLAD() {
  return (
    <div className="flex flex-wrap">

    {/* First Column */}
    <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
      <div className="mb-1 mt-3">
      <Blogs sources={['nfl']} postCount={5}/>
      </div> 
      
    
    </div> 
      {/* Second Column */}
      <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <div className="mb-1">
        
        </div>
       
      </div>
  
    </div>
  );
}

export default NFLAD;
