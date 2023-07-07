import React from 'react';
import { Link } from 'react-router-dom';
import TopShotNews from './TopShotNews';
import TopShotEvents from './TopShotEvents';

function TopShotCommunity() {
    return (
      <div className="flex flex-wrap">
        {/* First Column */}
        <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
          <div className="mb-4">
            
            <TopShotNews postCount={5}/>
          </div>
          <div className="mb-4">
          
            <TopShotVideos postCount={5}/>
          </div>
        </div>
  
        {/* Second Column */}
        <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
          <div className="mr-8">
            <div>
            
              <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=216d7a8cf62561dc5f14e28914f447896088f0f9eacde4e670b0048faf3211f3%40group.calendar.google.com&ctz=America%2FToronto"
                  style={{ border: '0', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
                  frameBorder="0"
                  scrolling="no"
                ></iframe>
              </div>
            </div>
  
            <div className="mb-4">
              <h1>Communities</h1>
              <ul className="list-disc ml-6">
                <li>
                  <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://discord.com/invite/nbatopshot">Official Top Shot Discord</a>
                </li>
                <li>
                  <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://www.reddit.com/r/nbatopshot">/r/NBATopShot</a>
                </li>
                {/* Add more communities here */}
              </ul>
            </div>
  
            <div className="mb-4">
              <h1>Podcasts</h1>
              <ul className="list-disc ml-6">
                <li>
                  <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://topshotexplorer.com/">Badge County Explorer</a>
                  <ul>
                    <li>
                      <a href="https://podcasts.apple.com/us/podcast/badge-county-an-nba-top-shot-podcast/id1645200613?i=1000618127557">
                        Apple Podcasts Link
                      </a>
                    </li>
                    <li>
                      <a href="https://open.spotify.com/episode/0NaNtccMhqn2xCWSTKqsLA?si=b220f1d7bcf44f97&nd=1">
                        Spotify Link
                      </a>
                    </li>
                    {/* Add more podcast episodes here */}
                  </ul>
                </li>
                <li>
                  <a className="text-blue-500 hover:text-blue-600 hover:underline" href="https://podcasts.apple.com/ca/podcast/the-first-mint-podcast/id1547852755">First Mint</a>
                  <ul>
                    {/* Add more podcast episodes here */}
                  </ul>
                </li>
                {/* Add more podcasts here */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default TopShotCommunity;
  