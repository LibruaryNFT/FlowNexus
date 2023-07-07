import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { getProfile } from "../scripts/read_profile.js";
import { getName } from "../scripts/read_name.js";
import { getThoughts } from "../scripts/read_thoughts.js";
import { getTopShotLength } from "../scripts/read_topshot_account_length.js";
import { getNFLADAccountLength } from "../scripts/read_nflallday_account_length.js";
import { getUFCStrikeAccountLength } from "../scripts/read_ufcstrike_account_length.js";
import { getLaLigaAccountLength } from "../scripts/read_laliga_account_length.js";
import { getThoughtsAccountLength } from "../scripts/read_thoughts_account_length.js";
import ProfileStats from "./ProfileStats.js";

fcl
  .config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/api/authn");

function Profile() {
  const [profileData, setProfileData] = useState({ links: [] });
  const [name, setName] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useParams() hook gets the address from the current route
  const { address } = useParams();

  useEffect(() => {
    // Fetch data only if the user is logged in
    if (isLoggedIn) {
      fetchName();
      fetchProfileData();
      fetchThoughts();
    }
  }, [address, isLoggedIn]);

  const checkIfLoggedIn = async () => {
    const user = await fcl.currentUser().snapshot();
    setIsLoggedIn(user.loggedIn);
  };

  useEffect(() => {
    // Check if the user is logged in on component mount
    checkIfLoggedIn();
  }, []);

  const fetchName = async () => {
    try {
      const result = await fcl
        .send([fcl.script(getName), fcl.args([fcl.arg(address, t.Address)])])
        .then(fcl.decode);

      if (result) {
        setName(result);
        console.log("Name", result);
      } else {
        console.log("No name found for the user");
      }
    } catch (error) {
      console.error("Error fetching name:", error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const result = await fcl
        .send([fcl.script(getProfile), fcl.args([fcl.arg(address, t.Address)])])
        .then(fcl.decode);

      console.log("Raw Profile Data:", result);

      // Convert `links` object into an array of objects, each with a `name` field for the key
      const linksArray = Object.entries(result.links || {}).map(
        ([name, value]) => ({ name, ...value })
      );

      setProfileData({ ...result, links: linksArray });
      console.log("Profile Data:", { ...result, links: linksArray });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchThoughts = async () => {
    try {
      const result = await fcl
        .send([
          fcl.script(getThoughts),
          fcl.args([fcl.arg(address, t.Address)]),
        ])
        .then(fcl.decode);

      console.log("Thoughts:", result);

      // Assuming the result is an array of thoughts
      const formattedThoughts = result.map((thought) => ({
        ...thought,
        created: new Date(thought.created * 1000).toLocaleString(), // Multiply by 1000 to convert to milliseconds
      }));

      // Keep only the last 5 thoughts
      const lastFiveThoughts = formattedThoughts.slice(-5);

      setThoughts(lastFiveThoughts.reverse());
    } catch (error) {
      console.error("Error fetching thoughts:", error);
    }
  };


  useEffect(() => {
    fetchName();
    fetchProfileData();
    fetchThoughts();
  }, [address]);

  const Wallets = ({ wallets }) => {
    if (!wallets) return null;
    return (
      <ul>
        {wallets.map((wallet, index) => (
          <li key={index}>
            <p>
              {wallet.name || "N/A"}:{" "}
              {wallet.balance ? parseFloat(wallet.balance).toFixed(4) : "N/A"}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  const Links = ({ links }) => {
    if (!Array.isArray(links)) {
      console.error("Links is not an array:", links);
      return null;
    }

    return (
      <ul>
        {links.map((link, index) => {
          if (link.type === "image" && link.name === "artwork") {
            return null; // Skip rendering the artwork link
          }

          return (
            <li key={index}>
              <p className="flex items-center text-gray-300">
                {link.type === "discord" && (
                  <img
                    src="https://www.svgrepo.com/show/353655/discord-icon.svg"
                    alt="Discord"
                    className="w-6 h-6 mr-1"
                  />
                )}
                {link.type === "twitter" && (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553"
                    alt="Twitter"
                    className="w-6 h-6 mr-1"
                  />
                )}
                <span className="font-semibold capitalize">{link.type}:</span>
                {link.type === "twitter" ? (
                  <a
                    href={`https://twitter.com/${link.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    {link.name}
                  </a>
                  ) : link.type === "globe" ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {link.name}
                    </a>
                ) : (
                  link.name || "Link"
                )}
              </p>
            </li>
          );
        })}
      </ul>
    );
  };

  const getAvatarStyle = () => {
    const artworkLink = profileData.links.find(
      (link) => link.type === "image" && link.name === "artwork"
    );
    if (artworkLink) {
      return {
        backgroundImage: `url(${artworkLink.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {};
  };

  return (
    <div className="container mx-auto p-4 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Profile</h2>
      <div className="md:grid md:grid-cols-2 md:gap-4">
        <div className="md:order-1">
          <div
            className="flex justify-center items-center border-2 border-white rounded-lg h-72 w-128"
            style={getAvatarStyle()}
          >
            {profileData.avatar && (
              <img
                className="rounded-full h-40 w-40 object-cover"
                src={profileData.avatar}
                alt="User Avatar"
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center border-2 border-white rounded-lg mt-4">
           <ProfileStats address={address} stats={['nba', 'nfl', 'ufc', 'laliga', 'comments']}/>
          </div>
        </div>
        <div className="md:order-2">
          <p className="text-blue-300 font-semibold text-lg mb-2">
            Find Name: {profileData.findName || "N/A"}
          </p>
          <p className="text-blue-300 font-semibold text-lg mb-2">
            Profile Name: {profileData.name || "N/A"}
          </p>
          <p className="text-gray-300 font-semibold text-lg mb-2">
            Address: {profileData.address || "N/A"}
          </p>
          <p className="text-gray-300 font-semibold text-lg mb-2">
            Description: {profileData.description || "N/A"}
          </p>
          <div className="mt-4">
            <Links links={profileData.links} />
          </div>
          <div className="mt-4">
            <Wallets wallets={profileData.wallets} />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">
              Latest Comments
            </h3>
            {thoughts.map((thought, index) => (
              <div key={index} className="bg-gray-800 p-2 mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{thought.header}</h3>
                  <div className="flex items-center space-x-2">
                    {thought.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-blue-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300">{thought.body}</p>
                <p className="text-gray-300">{thought.created}</p>
                <div className="flex items-center">
                  {Object.entries(thought.reactions).map(
                    ([reaction, count]) => (
                      <div
                        key={reaction}
                        className="flex items-center space-x-1"
                      >
                        <span>{reaction}</span>
                        <span>{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
