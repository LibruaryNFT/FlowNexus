import React, { useEffect, useState } from "react";
import { getAvatar } from "../scripts/read_profile_avatar.js";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

fcl
  .config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/api/authn");

const ProfileAvatar = ({ address }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Fetch the avatar URL using the address
        const result = await fcl
          .send([fcl.script(getAvatar), fcl.args([fcl.arg(address, t.Address)])])
          .then(fcl.decode);

        // Set the fetched avatar URL in the state
        setAvatarUrl(result);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    // Call the fetchAvatar function when the component mounts
    fetchAvatar();
  }, [address]);

   // Trim the avatarUrl to remove query parameters and additional segments
  const trimmedAvatarUrl = avatarUrl ? avatarUrl.split("?")[0] : "";

  // Prefix the trimmedAvatarUrl with the desired URL prefix
  const prefixedAvatarUrl = trimmedAvatarUrl
    ? `https://laligagolazos.com/cdn-cgi/image/width=800,height=800,quality=50/${trimmedAvatarUrl}`
    : "";

  return (

    <img
      src={prefixedAvatarUrl}
      alt="avatar"
      className="mr-2 w-32 h-32 rounded-full"
    />
  
  );
};

export default ProfileAvatar;
