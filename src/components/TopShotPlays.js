import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";

function TopShotPlays() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0); // Total number of records

  const fetchTotalRecords = async () => {
    try {
      const resp = await fcl.send([
        fcl.script`
          import TopShot from 0x0b2a3299cc857e29

          pub fun main() : UInt32 {
            let total = TopShot.nextPlayID - 1
            return total
          }
        `
      ]);
      const decodedResp = await fcl.decode(resp);
      setTotalRecords(decodedResp);
    } catch (error) {
      console.error('Error fetching total records:', error);
    }
  };

  useEffect(() => {
    fetchTotalRecords();
  }, []);
  
  const script = fcl.script
  `
        
        import TopShot from 0x0b2a3299cc857e29

pub struct MetaData {
    pub let fullName: AnyStruct
    pub let playType: AnyStruct
    pub let playCategory: AnyStruct
    pub let teamAtMoment: AnyStruct
    pub let jerseyNumber: AnyStruct

    init(fullName: AnyStruct, playType: AnyStruct, playCategory: AnyStruct, teamAtMoment: AnyStruct, jerseyNumber: AnyStruct) {
        self.fullName = fullName
        self.playType = playType
        self.playCategory = playCategory
        self.teamAtMoment = teamAtMoment
        self.jerseyNumber = jerseyNumber
    }
}

pub fun loopFunc(fields: [String], start: UInt32, end: UInt32, func: ((UInt32): MetaData)): {UInt32: MetaData} {
    var i: UInt32 = start
    var items: {UInt32: MetaData} = {}
    while i < end {
        items[i] = func(id: i)
        i = i + 1
    }
    return items
}

pub fun main(): {UInt32: MetaData} {
    let fields = ["FullName", "PlayType", "PlayCategory", "TeamAtMoment", "JerseyNumber"]
    var event = loopFunc(fields: fields, start: 1, end: TopShot.nextPlayID, 
                         func: fun(id: UInt32): MetaData { 
                             let fullName = TopShot.getPlayMetaDataByField(playID: id, field: fields[0]) as AnyStruct
                             let playType = TopShot.getPlayMetaDataByField(playID: id, field: fields[1]) as AnyStruct
                             let playCategory = TopShot.getPlayMetaDataByField(playID: id, field: fields[2]) as AnyStruct
                             let teamAtMoment = TopShot.getPlayMetaDataByField(playID: id, field: fields[3]) as AnyStruct
                             let jerseyNumber = TopShot.getPlayMetaDataByField(playID: id, field: fields[4]) as AnyStruct
                             return MetaData(fullName: fullName, playType: playType, playCategory: playCategory, 
                                             teamAtMoment: teamAtMoment, jerseyNumber: jerseyNumber)
                         })

    return event
}
        
        `

  ;
  const getTopshotPlays = async () => {
    setLoading(true);
    try {
      const resp = await fcl.send([script]);
      console.log("Response:", resp);
      const decodedResp = await fcl.decode(resp);
      console.log("Decoded Response:", decodedResp);
      setData(decodedResp);
    } catch (error) {
      console.error('Error fetching Top Shot Plays:', error);
    }
    setLoading(false);
  };

  return (
    <div>
    <h1>Plays!</h1>
    <p>Total Records: {totalRecords}</p>
    <button onClick={getTopshotPlays} disabled={loading}>
      {loading ? 'Loading...' : 'Load Data'}
    </button>
    {data && (
      <table>
        <thead>
          <tr>
            <th>Play ID</th>
            <th>Full Name</th>
            <th>Jersey Number</th>
            <th>Play Category</th>
            <th>Play Type</th>
            <th>Team at Moment</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([playID, playData]) => (
            <tr key={playID}>
              <td>{playID}</td>
              <td>{playData.fullName}</td>
              <td>{playData.jerseyNumber}</td>
              <td>{playData.playCategory}</td>
              <td>{playData.playType}</td>
              <td>{playData.teamAtMoment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
}

export default TopShotPlays;
