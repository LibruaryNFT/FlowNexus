import React, { useEffect, useState, useRef, useMemo, memo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Parser } from "htmlparser2";
import moment from "moment";
import * as fcl from "@onflow/fcl";
import { currentUser } from "@onflow/fcl";
import * as t from "@onflow/types";
import { createComment } from "../transactions/create_comment.js";
import ProfileStats from "./ProfileStats.js";
import ProfileAvatar from "./ProfileAvatar.js";
import { OPENAI_API_KEY } from "../config";
import { debounce } from 'lodash';


fcl
  .config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/api/authn");

const BlogPostPage = () => {
  const { slug } = useParams();
  const [postData, setPostData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState();
  const [txInProgress, setTxInProgress] = useState(false);
  const [txStatus, setTxStatus] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarUrls, setAvatarUrls] = useState({});
  const inputRef = useRef(null);

  const blogFeedURLs = {
    nba: "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.nbatopshot.com/posts/rss.xml",
    nfl: "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.nflallday.com/posts/rss.xml",
    ufc: "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.ufcstrike.com/posts/rss.xml",
    laliga:
      "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.laligagolazos.com/posts/rss.xml",
    flow: "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://www.onflow.org/post/rss.xml",
    dapper:
      "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://blog.meetdapper.com/posts/rss.xml",
    flow2:
      "https://rss-proxy-service-787abe4e5f19.herokuapp.com/https://flow.com/post/rss.xml",
  };

  useEffect(() => {
    // Call the function once when the component mounts
    getComments();
  
    // Then set it to be called at intervals
    const interval = setInterval(() => {
      getComments();

    }, 10000); // 10000 milliseconds = 10 seconds
  
    // Clear interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);  

  useEffect(() => {
  
    // Then set it to be called whenever txStatus changes to 4
    if (txStatus === 4) {
      getComments();

      console.log("txStatus get comments triggered")
    }
  }, [txStatus]); 

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        for (const [source, url] of Object.entries(blogFeedURLs)) {
          const res = await axios.get(url);
          const parser = new Parser(
            {
              onopentag(name, attributes) {
                if (name === "item") {
                  this.currentItem = {};
                } else if (this.currentItem) {
                  this.currentItem.currentTag = name;
                  if (
                    name === "media:content" ||
                    name === "media:thumbnail" ||
                    name === "enclosure"
                  ) {
                    this.currentItem[name] = attributes.url;
                  }
                }
              },
              ontext(text) {
                if (this.currentItem) {
                  const currentTag = this.currentItem.currentTag;
                  if (
                    currentTag &&
                    !["media:content", "media:thumbnail"].includes(currentTag)
                  ) {
                    if (this.currentItem[currentTag]) {
                      this.currentItem[currentTag] += text;
                    } else {
                      this.currentItem[currentTag] = text;
                    }
                  }
                }
              },
              onclosetag(tagname) {
                if (tagname === "item") {
                  const postURL = new URL(this.currentItem.link);
                  const postSlug = postURL.pathname.split("/").pop();
                  if (postSlug === slug) {
                    setPostData(this.currentItem);
                  }
                  delete this.currentItem;
                }
              },
            },
            { decodeEntities: true, xmlMode: true }
          );
          parser.write(res.data);
          parser.end();

          
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [slug]);

  const getComments = async () => {
    try {
      const resComments = await axios.get(
        "https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.097bafa4e0b48eef.FindThoughts.Published"
      );

      const commentData = resComments.data.map((item) => ({
        id: item.blockEventData.id,
        creator: item.blockEventData.creator,
        creatorName: item.blockEventData.creatorName,
        header: item.blockEventData.header,
        message: item.blockEventData.message,
        eventDate: item.eventDate,
        txnId: item.flowTransactionId,
      }));    

      setCommentData(commentData.reverse());
      console.log("getComments", commentData);
    } catch (error) {
      console.error("Error fetching Comments", error);
    }
  };

  const relatedComments = commentData.filter(
    (comment) => postData && comment.header === postData.link
  );
  
  const filterComment = async (comment) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/moderations",
        {
          input: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      console.log("OpenAI response:", response.data.results[0].flagged);

      const filteredComment = response.data.results[0].flagged ? "" : comment;
      console.log("Filtered comment:", filteredComment);
      return filteredComment;
    } catch (error) {
      console.error("Error filtering comment:", error);
      return ""; // Return an empty string if there's an error
    }
  };

  const handleSendThought = (header) => {
    const inputValue = inputRef.current.value;

    if (!inputValue) {
      setErrorMessage('Please enter a message.');
      return;
    }

    // Clear the error message
    setErrorMessage('');

    // Set the message state
    setMessage(inputValue);

    // Call createTheComment with the necessary parameters
    createTheComment(header, inputValue);
  };

  const createTheComment = async (header, message) => {
    const filteredMessage = await filterComment(message);

    setTxInProgress(true);
    setTxStatus(-1);
    setErrorMessage("");

    if (filteredMessage === message) {
      if (!message) {
        setErrorMessage("Please enter a message.");
        return;
      }

      try {
        const response = await fcl.send([
          fcl.transaction(createComment),
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
            fcl.arg(null, t.Optional(t.UInt64)),
          ]),
        ]);

        setTxId(response);

        fcl.tx(response).subscribe((res) => {
          setTxStatus(res.status);
          console.log("Comment Creation", res);
        });
      } catch (error) {
        setErrorMessage("Comment creation failed.");
      }
    } else {
      setErrorMessage("Comment contains inappropriate content.");
    }
  };

  useEffect(() => {
    console.log("Related Comments:", relatedComments);
  }, [relatedComments]);

  if (!postData || !commentData) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  const localPubDate = postData
    ? moment(postData.pubDate).format("YYYY-MM-DD HH:mm:ss")
    : "";

  const urlToImageUrlMapping = {
    "https://flow-com.webflow.io/post/unity-sdk-2-0-supercharge-game-development-with-unity-se":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/648b8af274445ea678b7ef61_Flow%20SDK%20for%20Unity%202.0.0_6.15.23-p-800.webp",
    "https://flow-com.webflow.io/post/flow-fundamentals-behind-trusting-where-you-build":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/6488c533c7f513febb1ee03c_Body%20-%20Trusting%20where%20you%20build-p-800.png",
    "https://flow-com.webflow.io/post/flow-network-upgrade-june-2023":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/647f882f3d0bae6dea5149c8_flow-network-upgrade2-min-p-800.png",
    "https://flow-com.webflow.io/post/implementing-the-bored-ape-yacht-club-smart-contract-in-cadence":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/648217ecb1e61160100b6dc2_Implementing%20the%20BAYC-p-800.png",
    "https://flow-com.webflow.io/post/announcing-flow-to-the-future-global-hackathon":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/6477dcd23d1502d9fbbf4604_Flow%E2%80%99s%20Hackathon.gif",
    "https://flow-com.webflow.io/post/supercharging-innovation-with-the-flow-incubation-program-pilot":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/645e8854ed4e36dc0473bf56_ezgif.com-resize.gif",
    "https://flow-com.webflow.io/post/flows-product-co-founder-layne-lafrance-on-top-shot-doodles-and-2023":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/645c221fbf56a810102208c9_NFT%20Insider%20Repost%20(Blog%20Hero%20Image).gif",
    "https://flow-com.webflow.io/post/barbie-and-boss-beauties-launch-career-themed-barbie-collectibles-on-flow":
      "https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/645bb8182db3a4078477687c_Flow%20Blog_Boss%20Beauties%20x%20Barbie_5.10.23-p-800.jpg",
      
  };

  function getImageUrlFromMapping(postUrl) {
    return urlToImageUrlMapping[postUrl];
  }

  return (
    <div>
      <div className="flex flex-wrap p-6">
      
          <a
            href={postData ? postData.link : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
  className="w-full h-auto object-contain max-h-72 mb-4 sm:mb-0 mx-auto sm:mx-0"
  src={
    (postData && postData["media:content"] && `https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/${postData["media:content"]}`) ||
    ( postData && postData.link && `https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/${getImageUrlFromMapping(postData.link)}`) ||
      'https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/63d0ca3a05f315a59814aed3_Screen%20Shot%202023-01-23%20at%202.09.13%20PM-p-800.png'
  }
  alt={postData ? postData.title : ""}
/>
          </a>
  
        <div className="w-full sm:w-auto sm:ml-4">
          <a
            href={postData ? postData.link : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline visited:text-purple-600"
          >
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
              {postData ? postData.title : ""}
            </h1>
          </a>
          <p className="italic mb-2">Published: {localPubDate}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: postData ? postData.description : "",
            }}
          />
        </div>
      </div>

      <hr className="my-4 border-0 bg-gray-300 h-px w-full" />
      <div className="mt-1 text-black mb-3">
        <textarea
          placeholder="Enter message"
          ref={inputRef}
          className="border border-gray-300 p-2 h-24 resize-none mb-1 w-full"
        />

        <div className="flex">
          <button
            onClick={() => handleSendThought(postData.link)}
            className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
          >
            Create Comment
          </button>

          {errorMessage === "" ? (
            <p className="hidden"></p>
          ) : errorMessage ? (
            <p className="text-red-500">Error: {errorMessage}</p>
          ) : null}

          {txStatus < 0 ? (
            <p className="hidden"></p>
          ) : txStatus < 4 ? (
            <p className="text-white">
              Status: Creating the comment on the Flow blockchain.
            </p>
          ) : txStatus === 4 ? (
            <p className="text-flow">
              Status: Successfully created your comment on the Flow blockchain!
            </p>
          ) : null}
        </div>
      </div>
      {relatedComments.length > 0 && (
  <div>
    <h2 className="text-xl font-bold mb-4">Comments</h2>
    {relatedComments
      .sort(
        (a, b) =>
          moment.utc(b.eventDate).valueOf() -
          moment.utc(a.eventDate).valueOf()
      )
      .map((comment) => {
        const transactionLink = comment.txnId ? `https://flowscan.org/transaction/${comment.txnId}` : null;

        return (
          <div key={comment.id || ""} className="mb-4 p-4 border border-gray-300">
            <div className="flex">
              
            <ProfileAvatar address={comment.creator} />
        

              <div className="flex flex-col justify-center ml-4">
                <p>
                  {comment.creatorName && (
                    <a
                      href={`/profile/${comment.creator}`}
                      className="text-white hover:underline"
                    >
                      {comment.creatorName}
                    </a>
                  )}
                </p>
                <p className="text-gray-500">
                  {comment.creator && (
                    <a
                      href={`/profile/${comment.creator}`}
                      className="text-gray-500 hover:underline"
                    >
                      {comment.creator}
                    </a>
                  )}
                </p>
                <p className="text-gray-500">
                  {transactionLink && (
                    <a
                      href={transactionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-800"
                    >
                      {moment.utc(comment.eventDate).local().format("YYYY-MM-DD HH:mm:ss z")}
                    </a>
                  )}
                </p>
                <div className="text-gray-500">
                
                <ProfileStats
              address={comment.creator}
              stats={[
                postData.link.includes("nbatopshot.com") ? "nba" :
                postData.link.includes("nflallday.com") ? "nfl" :
                postData.link.includes("laligagolazos.com") ? "laliga" :
                postData.link.includes("ufcstrike.com") ? "ufcstrike" : postData.source,
                "comments"
              ]}
            />


                </div>
              </div>
            </div>
            <p className="mt-4">{comment.message || ""}</p>
          </div>
        );
      })}
  </div>
)}

    </div>
  );
};

export default BlogPostPage;
