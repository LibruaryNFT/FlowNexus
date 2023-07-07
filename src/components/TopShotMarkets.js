import React from 'react';
import TopShotSales from './TopShotSales';

function TopShotMarkets() {

  return (
    <div className="flex flex-wrap">
      
      {/* First Column */}

        <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
            <div className="mb-4">
                <TopShotSales count={15}/>
            </div>
        </div>

        {/* Second Column */}
        <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        
        <div className="mt-4 mb-4">
          <h1>Marketplaces</h1>        
          <ul className="list-disc ml-6">
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.nbatopshot.com">NBA Top Shot</a>
              <ul>
                <li>Fee: 5%</li>
              </ul>
            </li>
            <li>
            <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.flowty.io/">flowty</a>
              <ul>
                <li>When using Dapper Wallet Fee: 5%</li>
                <li>When using non-Dapper Wallet Fee: whichever is greater, 1% of sale price or $0.44.</li>
              </ul>
            </li>
            <li>
            <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://ongaia.com/">gaia</a>
              <ul>
                <li>Fee: 5%</li>
              </ul>
            </li>
            <li>
            <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://nft.flowverse.co/">Flowverse</a>
              <ul>
                <li>Fee: 0%</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h1>Trading</h1>        
          <ul className="list-disc ml-6">
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://evaluate.xyz/">Evaluate</a>
              <ul>
              <li>Live trading</li>
              </ul>
            </li>
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://topshoters.com/">TopShoters</a>
              <ul>
              <li>Trades Tracking</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h1>Loans/Rentals</h1>        
          <ul className="list-disc ml-6">
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.flowty.io/">flowty</a>
              <ul>
              <li>Rent a moment you don't own, or loan a moment you do own</li>
              </ul>
            </li>
          </ul>
        </div>

       

        <div className="mb-4">
          <h1>Market Analysis</h1>        
          <ul className="list-disc ml-6">
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.momentmob.com/">MomentMob</a>
              <ul>
              <li>Challenge tracker</li>
            <li>Drop tracker</li>
              </ul>
            </li>
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://twitter.com/intangible_eth">intangible</a>
              <ul>
             
              </ul>
            </li>
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.otmnft.com/">OTM</a>
              <ul>
              <li>Market Activity</li>
              <li>Collection View</li>
              <li>Challenges View - Paid Version Only</li>
              <li>Sniper View - Paid Version Only</li>
              </ul>
            </li>
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://livetoken.co/">LiveToken</a>
              <ul>
              <li>Listings</li>
              <li>Deals</li>
              <li>Offers</li>
              <li>Account Lookup</li>
              <li>Fast Fingers</li>
              <li>Top Gifters</li>
              <li>Odd Sales</li>
              </ul>
            </li>
            <li>
              <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.rayvin.io/">Rayvin</a>
              <ul>
              <li>Portfolio estimator</li>
            <li>Drop notifications</li>
            <li>Drop notifications via Telegram - Paid service</li>
            <li>Marketplace price alerts - Paid service</li>
              </ul>
            </li>
          </ul>
        </div>

       
      </div>
      
      
    </div>
   
  );
}

export default TopShotMarkets;
