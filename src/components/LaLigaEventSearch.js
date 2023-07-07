import 'tailwindcss/tailwind.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as fcl from "@onflow/fcl";

import { getLaLigaAccountID } from "../scripts/read_laliga_account_id.js";

const LaLigaEventSearch = () => {
  const [eventData, setEventData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rarity, setRarity] = useState('All');
  const [timezone, setTimezone] = useState('America/New_York');

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    filterData();
  }, [eventData, rarity, timezone]);

  const getEvents = async () => {
    try {
      const res = await axios.get(
        'https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.87ca73a41bb50ad5.Golazos.Deposit'
      );

      const data = res.data;
      setEventData(data);
      console.log('LaLiga data', data);
    } catch (error) {
      console.error('Error fetching LaLiga data:', error);
    }
  };

  const getLaLigaAccountData = async (address, nftId) => {
    try {
      const result = await getTheLaLigaAccountID(address, nftId);
      return result;
    } catch (error) {
      console.error('Error getting LaLiga Account ID:', error);
      return null;
    }
  };

  const getTheLaLigaAccountID = async (address, nftId) => {
    return new Promise((resolve, reject) => {
      fcl.send([
        fcl.script(getLaLigaAccountID),
        fcl.args([fcl.arg(address, t.Address), fcl.arg(nftId, t.UInt64)]),
      ])
        .then(fcl.decode)
        .then(resolve)
        .catch(reject);
    });
  };

  const filterData = async () => {
    const filtered =
      rarity === 'All'
        ? eventData
        : eventData.filter((item) => item.blockEventData.metadata.rarity === rarity);

    // Sort by date in descending order (most recent at the top)
    const sortedData = filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return dateB - dateA;
    });

    setFilteredData(sortedData);

    // Fetch and set account data for each item
    const updatedData = await Promise.all(
      sortedData.map(async (item) => {
        const { address, nftId } = item;
        const accountIDData = await getLaLigaAccountData(address, nftId);
        return { ...item, accountIDData };
      })
    );

    setFilteredData(updatedData);
  };

  const handleTimezoneChange = (e) => {
    setTimezone(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">LaLiga Event Search</h2>

      <div className="mb-4">
        <label htmlFor="timezone" className="mr-2">
          Select Timezone:
        </label>
        <select
          id="timezone"
          value={timezone}
          onChange={handleTimezoneChange}
          className="border rounded-md py-1 px-2 text-black"
        >
          <option value="America/New_York">Eastern Standard Time (EST)</option>
          <option value="America/Los_Angeles">Pacific Standard Time (PST)</option>
          {/* Add more timezone options here */}
        </select>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border border-gray-300">Date</th>
            <th className="py-2 px-4 border border-gray-300">ID</th>
            <th className="py-2 px-4 border border-gray-300">Address</th>
            <th className="py-2 px-4 border border-gray-300">Transaction Link</th>
            <th className="py-2 px-4 border border-gray-300">Edition ID</th>
            <th className="py-2 px-4 border border-gray-300">Serial Number</th>
            <th className="py-2 px-4 border border-gray-300">Minting Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, id) => (
            <tr key={id}>
              <td className="py-2 px-4 border border-gray-300">{formatDate(item.eventDate)}</td>
              <td className="py-2 px-4 border border-gray-300">{item.blockEventData.id}</td>
              <td className="py-2 px-4 border border-gray-300">{item.blockEventData.to}</td>
              <td className="py-2 px-4 border border-gray-300">
                <a
                  href={`https://flowscan.org/transaction/${item.flowTransactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Result
                </a>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                {item.accountIDData?.editionID || '-'}
              </td>
              <td className="py-2 px-4 border border-gray-300">
                {item.accountIDData?.serialNumber || '-'}
              </td>
              <td className="py-2 px-4 border border-gray-300">
                {item.accountIDData?.mintingDate || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LaLigaEventSearch;
