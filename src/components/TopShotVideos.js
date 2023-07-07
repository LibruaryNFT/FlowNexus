import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'htmlparser2';
import moment from 'moment';

const TopShotVideos = (props) => {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    getVideos();

    // Refresh every 60 seconds
    const intervalId = setInterval(getVideos, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getVideos = async () => {
    try {
      const feedUrls = [
        //'https://rss.app/feeds/DNSgkM9opDKHc00s.xml',
        'https://rss.app/feeds/I8ALkonQwO85dyEq.xml'
      ];

      const fetchPromises = feedUrls.map(async (feedUrl) => {
        const res = await axios.get(feedUrl);
        const feedItems = [];

        const parser = new Parser({
          onopentag(name, attributes) {
            if (name === 'item') {
              feedItems.push({});
            } else if (feedItems.length > 0) {
              const currentFeedItem = feedItems[feedItems.length - 1];
              currentFeedItem.currentTag = name;
              if (name === 'media:content' || name === 'media:thumbnail' || name === 'enclosure') {
                currentFeedItem[name] = attributes.url;
              }
            }
          },
          ontext(text) {
            if (feedItems.length > 0) {
              const currentFeedItem = feedItems[feedItems.length - 1];
              const currentTag = currentFeedItem.currentTag;

              if (currentTag && !['media:content', 'media:thumbnail'].includes(currentTag)) {
                if (currentFeedItem[currentTag]) {
                  currentFeedItem[currentTag] += text;
                } else {
                  currentFeedItem[currentTag] = text;
                }
              }
            }
          },
          onclosetag(tagname) {
            if (tagname === 'item') {
              const currentFeedItem = feedItems[feedItems.length - 1];
              delete currentFeedItem.currentTag;
            }
          },
        },
        { decodeEntities: true, xmlMode: true }
        );

        parser.write(res.data);
        parser.end();

        return feedItems;
      });

      const feedItemsArray = await Promise.all(fetchPromises);

      // Combine all feed items into a single array
      const allFeedItems = feedItemsArray.flat();

      // Sort videos by pubDate in descending order
      allFeedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      const recentFive = allFeedItems.slice(0, props.postCount);
      setVideoData(recentFive);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div className="ml-1 mr-1">
    <h2 className="text-2xl font-bold mb-1">Latest Community Videos</h2>
    
    <ul>
      {videoData.map((video, index) => (
        <li key={index} className="flex flex-row items-center">
          <div className="flex justify-center">
            <a href={video.link}>
              <div className="flex">
                <img className="w-1/2 h-auto object-contain max-h-48" src={video.enclosure} alt={video.title} />
                <div className="ml-1">
                  <h3 className="text-lg font-bold">
                    <a href={video.link}>{video.title}</a>
                  </h3>
                  <p className="italic">Published: {moment(video.pubDate).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              </div>
              <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
            </a>
          </div>
          
        </li>
      ))}
    </ul>
  </div>
  
  );
  
};

export default TopShotVideos;