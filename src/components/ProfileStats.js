import React, { useEffect, useState } from "react";
import { getTopShotLength } from "../scripts/read_topshot_account_length.js";
import { getNFLADAccountLength } from "../scripts/read_nflallday_account_length.js";
import { getUFCStrikeAccountLength } from "../scripts/read_ufcstrike_account_length.js";
import { getLaLigaAccountLength } from "../scripts/read_laliga_account_length.js";
import { getThoughtsAccountLength } from "../scripts/read_thoughts_account_length.js";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

fcl
  .config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/api/authn");

function ProfileStats({ address, stats }) {
  const [topShotNFTs, setTopShotNFTs] = useState(0);
  const [nflAllDayNFTs, setNflAllDayNFTs] = useState(0);
  const [ufcStrikeNFTs, setUfcStrikeNFTs] = useState(0);
  const [laLigaNFTs, setLaLigaNFTs] = useState(0);
  const [thoughtsNFTs, setThoughtsNFTs] = useState(0);

  const fetchTopShotNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getTopShotLength),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    setTopShotNFTs(result);
  };

  const fetchNFLAllDayNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getNFLADAccountLength),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    setNflAllDayNFTs(result);
  };

  const fetchUFCStrikeNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getUFCStrikeAccountLength),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    setUfcStrikeNFTs(result);
  };

  const fetchLaLigaNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getLaLigaAccountLength),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    setLaLigaNFTs(result);
  };

  const fetchThoughtsNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getThoughtsAccountLength),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode);
    setThoughtsNFTs(result);
  };

  useEffect(() => {
    if (stats.includes("nba")) {
      fetchTopShotNFTs();
    }
    if (stats.includes("nfl")) {
      fetchNFLAllDayNFTs();
    }
    if (stats.includes("ufc")) {
      fetchUFCStrikeNFTs();
    }
    if (stats.includes("laliga")) {
      fetchLaLigaNFTs();
    }
    if (stats.includes("comments")) {
      fetchThoughtsNFTs();
    }
  }, [address, stats]);

  const owned = [
    ...(stats.includes("nba") && topShotNFTs > 0 ? [`${topShotNFTs}x NBA Top Shot${topShotNFTs > 1 ? 's' : ''}`] : []),
    ...(stats.includes("nfl") && nflAllDayNFTs > 0 ? [`${nflAllDayNFTs}x NFL All Day${topShotNFTs > 1 ? 's' : ''}`] : []),
    ...(stats.includes("ufc") && ufcStrikeNFTs > 0 ? [`${ufcStrikeNFTs}x UFC Strike${topShotNFTs > 1 ? 's' : ''}`] : []),
    ...(stats.includes("laliga") && laLigaNFTs > 0 ? [`${laLigaNFTs}x La Liga${topShotNFTs > 1 ? 's' : ''}`] : []),
].join(' | ');

return (
    <div>
      {stats.includes("comments") && (
        <div>
          <span>{thoughtsNFTs}x Comments</span>
          {owned.length > 0 && <span> | {owned}</span>}
        </div>
      )}
    </div>
  );
  
}

export default ProfileStats;
