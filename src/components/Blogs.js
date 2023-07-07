import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'htmlparser2';
import moment from 'moment';

const Blogs = (props) => {
  const [blogData, setBlogData] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const postCount = props.postCount || 10;

  useEffect(() => {
    getBlogPosts();
    getComments();
  }, []);
  

  useEffect(() => {
    setBlogData(sortBlogData());
  }, [sortBy]);

  const blogFeedURLs = {
    nba: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.nbatopshot.com/posts/rss.xml',
    nfl: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.nflallday.com/posts/rss.xml',
    ufc: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.ufcstrike.com/posts/rss.xml',
    laliga: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.laligagolazos.com/posts/rss.xml',
    flow: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://www.onflow.org/post/rss.xml',
    dapper: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.meetdapper.com/posts/rss.xml',
    flow2: 'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://flow.com/post/rss.xml',
  };

  const getComments = async () => {
    try {
      const resComments = await axios.get(
        'https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.097bafa4e0b48eef.FindThoughts.Published'
      );

      const data = resComments.data;
      const counts = {};
      data.forEach((comment) => {
        if (comment.blockEventData && comment.blockEventData.header) {
          const link = comment.blockEventData.header;
          if (counts[link]) {
            counts[link]++;
          } else {
            counts[link] = 1;
          }
        }
      });
      setCommentCounts(counts);
    } catch (error) {
      console.error('Error fetching Comments', error);
    }
  };

  const getBlogPosts = async () => {

    try {
      const sourceURLs = props.sources.map((source) => blogFeedURLs[source]);
      const allFeedItems = [];

      for (const url of sourceURLs) {
        const res = await axios.get(url);
        const feedItems = parseFeedItems(res.data);

        allFeedItems.push(...feedItems);
      }

      allFeedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      const recentPosts = allFeedItems;
      setBlogData(recentPosts);
    } catch (error) {
      console.error('Error fetching Blog Posts:', error);
    }
  };

  const parseFeedItems = (feedData) => {
    const feedItems = [];
    const parser = new Parser(
      {
        onopentag(name, attributes) {
          if (name === 'item') {
            feedItems.push({});
          } else if (feedItems.length > 0) {
            const currentFeedItem = feedItems[feedItems.length - 1];
            currentFeedItem.currentTag = name;
            if (name === 'media:content' || name === 'media:thumbnail' || name === 'enclosure') {
              currentFeedItem['media'] = currentFeedItem['media'] || {};
              currentFeedItem['media']['url'] = attributes.url;
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

    parser.write(feedData);
    parser.end();

    return feedItems;
  };

  const createSlug = (post) => {
    if (post.link.includes('youtube.com')) {
      const videoID = new URLSearchParams(post.link.split('?')[1]).get('v');
      return videoID ? `youtube-${videoID}` : '';
    } else {
      const url = new URL(post.link);
      return url.pathname.split('/').pop();
    }
  };

  const sortBlogData = () => {
    const sortedData = [...blogData];

    if (sortBy === 'popular') {
      sortedData.sort((a, b) => (commentCounts[b.link] || 0) - (commentCounts[a.link] || 0));
    } else if (sortBy === 'newest') {
      sortedData.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    }

    return sortedData;
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Add handlers for pagination
  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const startIndex = (currentPage - 1) * postCount;
  const selectedBlogData = blogData.slice(startIndex, startIndex + postCount);

  const urlToImageUrlMapping = {
    'https://flow-com.webflow.io/post/unity-sdk-2-0-supercharge-game-development-with-unity-se': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/648b8af274445ea678b7ef61_Flow%20SDK%20for%20Unity%202.0.0_6.15.23-p-800.webp',
    'https://flow-com.webflow.io/post/flow-fundamentals-behind-trusting-where-you-build': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/6488c533c7f513febb1ee03c_Body%20-%20Trusting%20where%20you%20build-p-800.png',
    'https://flow-com.webflow.io/post/flow-network-upgrade-june-2023': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/647f882f3d0bae6dea5149c8_flow-network-upgrade2-min-p-800.png',
    'https://flow-com.webflow.io/post/implementing-the-bored-ape-yacht-club-smart-contract-in-cadence': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/648217ecb1e61160100b6dc2_Implementing%20the%20BAYC-p-800.png',
    'https://flow-com.webflow.io/post/announcing-flow-to-the-future-global-hackathon': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/6477dcd23d1502d9fbbf4604_Flow%E2%80%99s%20Hackathon.gif',
    'https://flow-com.webflow.io/post/supercharging-innovation-with-the-flow-incubation-program-pilot': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/645e8854ed4e36dc0473bf56_ezgif.com-resize.gif',
    'https://flow-com.webflow.io/post/flows-product-co-founder-layne-lafrance-on-top-shot-doodles-and-2023': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/645c221fbf56a810102208c9_NFT%20Insider%20Repost%20(Blog%20Hero%20Image).gif',
    'https://flow-com.webflow.io/post/barbie-and-boss-beauties-launch-career-themed-barbie-collectibles-on-flow': 'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/645bb8182db3a4078477687c_Flow%20Blog_Boss%20Beauties%20x%20Barbie_5.10.23-p-800.jpg'

  };
  
  function getImageUrlFromMapping(postUrl) {
    return urlToImageUrlMapping[postUrl];
  }
  

  return (
    <div className="w-full">
      <div className="flex">
        <div className="w-full">
          <div className="flex justify-start mb-1">
            <label htmlFor="sort" className="mr-2">
              Sort By:
            </label>
            <select className="text-black" id="sort" value={sortBy} onChange={handleSortChange}>
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <ul>
            {selectedBlogData.map((post, index) => {
              const localPubDate = moment(post.pubDate).format('YYYY-MM-DD HH:mm:ss');
              const slug = createSlug(post);
              const commentCount = commentCounts[post.link] || 0;

              return (
                <li key={index} className="flex flex-row bg-gray-800">
                  <div className="flex justify-start w-full">
                    <a href={`/blogs/${slug}`} className="w-1/2">
                      <img
                        className="w-full h-auto object-contain"
                        src={
                          (post.media?.url && `https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/${post.media.url}`) ||
                          (post['media:content'] && `https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/${post['media:content']}`) ||
                          getImageUrlFromMapping(post.link) ||
                          'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/63d0ca3a05f315a59814aed3_Screen%20Shot%202023-01-23%20at%202.09.13%20PM-p-800.png'
                        }
                        alt={post.title}
                      />
                    </a>
                    <div className="ml-1 w-1/2">
                      <div>
                        <h3 className="text-lg font-bold">
                        <a 
                          href={`/blogs/${slug}`}
                          className="text-blue-500 hover:underline visited:text-purple-500"
                        >
                          {post.title}
                        </a>
                        </h3>
                        <p className="italic">Published: {localPubDate}</p>
                        {post.description && !post.description.startsWith('<div>') && (
                          <p className="italic hidden sm:block" dangerouslySetInnerHTML={{ __html: post.description }}></p>
                        )}
                        <div className="flex space-x-1">
                          <a href={`/blogs/${slug}`} className="border px-1 py-1 rounded">
                            <span role="img" aria-label="dialog">
                              💬
                            </span>
                            {commentCount} Comments
                          </a>
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border px-1 py-1 rounded"
                          >
                            Direct Link
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Add buttons to move between pages */}
      <div className="flex justify-center space-x-4 mt-1">
  {currentPage !== 1 && (
    <button
      onClick={prevPage}
      className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
    >
      Previous
    </button>
  )}
  <span className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-lg shadow-md">
    Page {currentPage}
  </span>
  {startIndex + postCount < blogData.length && (
    <button
      onClick={nextPage}
      className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
    >
      Next
    </button>
  )}
</div>
    </div>
  );
};

export default Blogs;
