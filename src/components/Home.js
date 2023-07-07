import Blogs from './Blogs';
import React from 'react';
import TopShotSales from './TopShotSales';


function Flow() {
  return (
    <div className="flex flex-wrap">

    {/* First Column */}
    <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
      <div className="mb-1 mt-1">
      <Blogs sources={['nba', 'nfl', 'ufc', 'flow']} postCount={10}/>
      </div> 
      
    
    </div> 
      {/* Second Column */}
      <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <div className="mb-1">
        {/*<TopShotSales count={5}/>*/}
        </div>
       
      </div>
  
    </div>
  );
}

export default Flow;
