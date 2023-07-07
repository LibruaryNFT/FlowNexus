import React from 'react';
import { Link } from 'react-router-dom';

function TopShotGaming() {

  return (
    <div className="flex">
      <div className="mr-8">
        
        

        <div className="mb-4">
          <h1>Gaming</h1>        
          <ul className="list-disc ml-6">
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://play.momentranks.com/">MomentRanks Play</a>
              <ul>
              <li>Daily Fantasy Sports using your own Moments</li>
              </ul>
            </li>
          </ul>
          <ul className="list-disc ml-6">
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.aisportspro.com/home">aiSports</a>
              <ul>
              <li>Create Teams and Play in Contests. Earn Prizes to Collect Top Shot Moments.</li>
              </ul>
            </li>
          </ul>
        </div>

    
        
      </div>
      
      
    </div>
   
  );
}

export default TopShotGaming;
