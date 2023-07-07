import React, { useEffect, useState } from 'react';
import {getTotalSupply} from "../scripts/read_laliga_totalsupply.js";
import * as fcl from "@onflow/fcl";

function LaLigaStats() {
  const [totalSupply, setTotalSupply] = useState(0);

  const getTheTotalSupply = async () => {
    const result = await fcl.send([
      fcl.script(getTotalSupply)
    ]).then(fcl.decode);
    setTotalSupply(result);
    console.log("TotalSupply", result);
}

  useEffect(() => {
    getTheTotalSupply();
  }, []);

  return (
    <div>
      <h2>LaLiga Stats</h2>
      <p>Total NFTs in LaLiga: {totalSupply}</p>
    </div>
  );
}

export default LaLigaStats;
