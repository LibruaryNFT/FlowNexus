import Blogs from './Blogs';
import LaLigaSales from './LaLigaSales';
import React from 'react';


function LaLiga() {
  return (
    <div className="flex flex-wrap">

    {/* First Column */}
    <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
      <div className="mb-1 mt-3">
      <Blogs sources={['laliga']} postCount={5}/>
      </div> 
      
    
    </div> 
      {/* Second Column */}
      <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <div className="mb-1">
         {/* <LaLigaSales count={15}/> */}
        
        </div>
       
      </div>
  
    </div>
  );
}

export default LaLiga;
