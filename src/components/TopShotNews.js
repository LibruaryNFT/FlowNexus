import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'htmlparser2';
import * as fcl from "@onflow/fcl";
import { currentUser } from "@onflow/fcl";
import * as t from "@onflow/types";
import moment from 'moment';
import Filter from 'bad-words';

import { createThought } from '../transactions/create_thought.js';
import { getName } from '../scripts/read_name.js';

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/api/authn");

const TopShotNews = (props) => {
  const [eventData, setEventData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [messages, setMessages] = useState({});
  const [filteredMessages, setFilteredMessages] = useState({});
  const [creatorNames, setCreatorNames] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const[txId, setTxId] = useState();
  const[txInProgress, setTxInProgress] = useState(false);
  const [txStatuses, setTxStatuses] = useState({});
  const [errorMessages, setErrorMessages] = useState({}); 

  const filter = new Filter();
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  useEffect(() => {
    getEvents();
    getBlogPosts();

    // refresh every 60 seconds
    const intervalId = setInterval(() => {
      getEvents();
      getBlogPosts();
    }, 10000);

    // clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Effect to check user's login status
  useEffect(() => {
    let unsubscribe;

    const checkUser = currentUser().subscribe((user) => {
      if (user.loggedIn) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, []);

  const handleMessageChange = (postLink, event) => {
    const inputMessage = event.target.value;
    setMessages({ ...messages, [postLink]: inputMessage });

    if (inputMessage) {
      setFilteredMessages({ ...filteredMessages, [postLink]: filter.clean(inputMessage) }); // Update the specific filtered message for this post
    } else {
      setFilteredMessages({ ...filteredMessages, [postLink]: "" }); // Update the specific filtered message for this post
    }
  };

  const handleSendThought = (postLink) => {
    setErrorMessages(prevState => ({...prevState, [postLink]: ""})); // clear the specific error message
    
    const message = messages[postLink]; // Get the message for the specific post link
    
    if (message) { // Check if the message is defined
      if (message.trim() !== '') { // Check if the message is not empty
        createTheThought(postLink, message);
      } else {
        // Handle the case where the message is empty
        setErrorMessages(prevState => ({...prevState, [postLink]: "Please enter a non-empty message before sending."}));
      }
    } else {
      // Handle the case where there is no message
      setErrorMessages(prevState => ({...prevState, [postLink]: "Please enter a message before sending."}));
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      let names = {};
      for(let item of eventData) {
        const name = await fetchName(item.blockEventData.creator);
        names[item.blockEventData.creator] = name;
      }
      setCreatorNames(names);
    };
  
    if(eventData.length > 0) {
      fetchNames();
    }
  }, [eventData]);

  const getTxStatus = (status) => {
    switch(status) {
      case 0:
        return "Unknown";
      case 1:
        return "Pending.";
      case 2:
        return "Pending.";
      case 3:
        return "Pending.";
      case 4:
        return "Success!";
      case 5:
        return "Failed";
      default:
        return "Waiting for confirmation.";
    }
  };
  

  const fetchName = async (address) => {
    try {
      const result = await fcl.send([
        fcl.script(getName),
        fcl.args([fcl.arg(address, t.Address)]),
      ]).then(fcl.decode);
  
      if (result) {
        console.log("Name", result);
        return result;
      } else {
        console.log("No name found for the user");
        return null;
      }
    } catch (error) {
      console.error("Error fetching name:", error);
      return null;
    }
  };

  const filterThought = (thought) => {
    return filter.clean(thought);
  };

  const createTheThought = async (header, message) => {
    const filteredMessage = filterThought(message);
    setTxInProgress(true);
    setTxStatuses({
      ...txStatuses,
      [header]: -1  // initialize the specific transaction status for this post
    });

    if (filteredMessage === message) {
      try {
        const response = await fcl.send([
          fcl.transaction(createThought),
          fcl.payer(fcl.currentUser),
          fcl.proposer(fcl.currentUser),
          fcl.authorizations([fcl.currentUser]),
          fcl.limit(9999),
          fcl.args([
            fcl.arg(header, t.String),
            fcl.arg(filteredMessage, t.String),
            fcl.arg([], t.Array(t.String)),
            fcl.arg(null, t.Optional(t.String)),
            fcl.arg(null, t.Optional(t.String)),
            fcl.arg(null, t.Optional(t.Address)),
            fcl.arg(null, t.Optional(t.String)),
            fcl.arg(null, t.Optional(t.UInt64)),
            fcl.arg(null, t.Optional(t.Address)),
            fcl.arg(null, t.Optional(t.UInt64))
          ])
        ]);

      setTxId(response);
      
      fcl.tx(response).subscribe((res) => {
        setTxStatuses((prevTxStatuses) => ({
          ...prevTxStatuses,
          [header]: res.status, // update the specific transaction status for this post
        }));

        console.log(res);
      });
        
      } catch (error) {
        setErrorMessage('Comment creation failed.');
      }
    } else {
      setErrorMessage('Comment contains inappropriate content.');
    }
  };

  const getEvents = async () => {
    try {
      const resThoughts = await axios.get(
        'https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.097bafa4e0b48eef.FindThoughts.Published'
      );

      const data = resThoughts.data;
      setEventData(data.reverse());
      console.log('Thoughts', data);
    } catch (error) {
      console.error('Error fetching Comments', error);
    }
  };

  const getBlogPosts = async () => {
    try {
      const blogFeedURLs = [
        'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://www.collectinandconnectin.com/blog-feed.xml',
        'https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://thefirstmint.substack.com/feed'
      ];
  
      const feedItems = [];
  
      for (const url of blogFeedURLs) {
        const res = await axios.get(url);
  
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
  
        parser.write(res.data);
        parser.end();
      }
  
      // Sort blog posts by pubDate in descending order
      feedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
      const recentPosts = feedItems.slice(0, props.postCount);
      setBlogData(recentPosts);
      console.log('Blog Posts', recentPosts);
    } catch (error) {
      console.error('Error fetching Blog Posts:', error);
    }
  };

  return (
    <div className="ml-1 mr-1">
      <h2 className="text-2xl font-bold mb-1">Latest Community Articles</h2>
      <ul>
        {blogData.map((post, index) => {
          const relatedThoughts = eventData.filter(
            thought => thought.blockEventData.header === post.link
          );
  
          // Convert the GMT date to the user's local time
          const localPubDate = moment(post.pubDate).format('YYYY-MM-DD HH:mm:ss');
  
          return (
            <li key={index} className="flex flex-row items-center">
              <div className="flex justify-center">
                <div className="flex">
                  <img 
                    className="w-1/2 h-auto object-contain max-h-48" 
                    src={post.media?.url || post['media:content']} 
                    alt={post.title} 
                  />
                  <div className="ml-1">
                    <div>
                      <h3 className="text-lg font-bold">
                        <a href={post.link}>{post.title}</a>
                      </h3>
                      <p className="italic">Published: {localPubDate}</p>
                      <p className="italic" dangerouslySetInnerHTML={{ __html: post.description }}></p>
                    </div>
  
                    <h4 className="text-xl mt-1">Comments ({relatedThoughts.length})</h4>
                    {relatedThoughts.map((thought, i) => {
                      const thoughtDate = moment.utc(thought.eventDate).local();
                      const currentTime = moment();
                      const relativeTime = moment.duration(thoughtDate.diff(currentTime)).humanize(true);
                      const creatorAddress = thought.blockEventData.creator;
                      const creatorName = creatorNames[creatorAddress] || '';
  
                      return (
                        <div key={i} className="py-4 border border-gray-300">
                          <p>
                            <a href={`/profile/${creatorAddress}`}>
                              {creatorName || creatorAddress}
                            </a> - {creatorName && creatorAddress} - {thoughtDate.format('YYYY-MM-DD HH:mm:ss')} ({relativeTime})
                          </p>
                          <p>&nbsp;</p> {/* Empty paragraph for blank line */}
                          <p>{thought.blockEventData.message}</p>
                        </div>
                      );
                    })}
  
                    {isLoggedIn ? (
                      <div className="mt-1 text-black mb-3">
                        <textarea
                          id={`messageInput-${index}`}
                          placeholder="Enter message"
                          value={messages[post.link] || ""}
                          onChange={(event) => handleMessageChange(post.link, event)}
                          className="border border-gray-300 p-2 h-24 resize-none mb-1 w-full"
                        />
  
                      <div className="flex">
                      <button 
                        onClick={() => handleSendThought(post.link)} 
                        className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                      >
                        Create Comment
                      </button>
                      {errorMessages[post.link] && <p className="text-red-500">{errorMessages[post.link]}</p>}
                      {txStatuses[post.link] !== undefined && <p className="text-white">Status: {getTxStatus(txStatuses[post.link])}</p>}
                    </div>
                      </div>
                    ) : (
                      <p className="mt-1">Please login to comment.</p>
                    )}
                  </div>
                </div>
  
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
  
};

export default TopShotNews;
