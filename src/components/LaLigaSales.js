import 'tailwindcss/tailwind.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMedal } from 'react-icons/fa';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { getLaLigaThumbnail } from "../scripts/read_laliga_thumbnail.js";

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/api/authn");

const LaLigaSales = (props) => {
  const [eventData, setEventData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [owners, setOwners] = useState({});
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    getEvents();
    getOwners();
  }, []);

  useEffect(() => {
    filterData();
  }, [eventData, viewMode, owners]);

  const fetchThumbnail = async (ownerAddress, id) => {
   
      const result = await fcl.send([
        fcl.script(getLaLigaThumbnail),
        fcl.args([fcl.arg(ownerAddress, t.Address)]),
        fcl.args([fcl.arg(id, t.UInt64)]),
      ]).then(fcl.decode);
  
      return result;
  };

  const getEvents = async () => {
    try {
      const res = await axios.get('https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.4eb8a10cb9f87357.NFTStorefrontV2.ListingCompleted&nftType.typeID="A.87ca73a41bb50ad5.Golazos.NFT"');
    
      let data = res.data;

      // Filter the data based on blockEventData.purchased=true
      data = data.filter(item => item.blockEventData.purchased === true);

      // Normalize data to common format
      data = data.map(item => {
        return {
          id: item.blockEventData.nftID,
          price: item.blockEventData.salePrice,
          eventDate: item.eventDate,
          transactionId: item.flowTransactionId,

        };
      });

      setEventData(data);

      console.log('getEvents', data);
    } catch (error) {
      console.error('Error fetching LaLiga data:', error);
    }
  };    

  const filterData = () => {
    const currentDate = new Date();
    let filtered = [];
  
    switch (viewMode) {
      case 'day':
        filtered = eventData
          .filter((item) => isSameDay(new Date(item.eventDate), currentDate))
          .sort((a, b) => b.price - a.price)
          .slice(0, props.count);
        break;
      case 'week':
        const weekStartDate = getWeekStartDate(currentDate);
        filtered = eventData
          .filter((item) => isSameWeek(new Date(item.eventDate), weekStartDate))
          .sort((a, b) => b.price - a.price)
          .slice(0, props.count);
        break;
      case 'month':
        const monthStartDate = getMonthStartDate(currentDate);
        filtered = eventData
          .filter((item) => isSameMonth(new Date(item.eventDate), monthStartDate))
          .sort((a, b) => b.price - a.price)
          .slice(0, props.count);
        break;
      default:
        filtered = eventData;
        break;
    }
    

    // Amend buyer information to filteredData
  filtered = filtered.map((item) => ({
    ...item,
    buyer: owners[item.id] || 'N/A',
  }));
  
    setFilteredData(filtered);
  
    console.log('filterData', filtered);
  };

  const getOwners = async () => {
    try {
      const res = await axios.get(
        `https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.87ca73a41bb50ad5.Golazos.Deposit&`
      );
  
      const data = res.data;
      console.log('getOwners', data);

      const ownersMap = data.reduce((acc, item) => {
        acc[item.blockEventData.id] = item.blockEventData.to;
        return acc;
      }, {});
  
      setOwners(ownersMap);
    } catch (error) {
      console.error('Error fetching LaLiga owners data:', error);
    }
  };
  
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isSameWeek = (date1, weekStartDate) => {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    return date1 >= weekStartDate && date1 <= weekEndDate;
  };

  const isSameMonth = (date1, monthStartDate) => {
    const nextMonthStartDate = new Date(monthStartDate);
    nextMonthStartDate.setMonth(nextMonthStartDate.getMonth() + 1);

    return date1 >= monthStartDate && date1 < nextMonthStartDate;
  };

  const getWeekStartDate = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(date.setDate(diff));
  };

  const getMonthStartDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const calculateTimeElapsed = (date) => {
    const timeDiff = new Date() - date;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Top LaLiga Sales</h2>

      <div className="mb-1">
        <button
          className={`mr-2 ${
            viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-500'
          } px-4 py-2 rounded`}
          onClick={() => handleViewModeChange('day')}
        >
          Day
        </button>
        <button
          className={`mr-2 ${
            viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-500'
          } px-4 py-2 rounded`}
          onClick={() => handleViewModeChange('week')}
        >
          Week
        </button>
        <button
          className={`mr-2 ${
            viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-500'
          } px-4 py-2 rounded`}
          onClick={() => handleViewModeChange('month')}
        >
          Month
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          {filteredData.map((item, id) => {
            const saleDateTime = new Date(item.eventDate);
            const timeElapsed = calculateTimeElapsed(saleDateTime);
            const imageUrl = thumbnails[item.id] || '';

            console.log('Thumbnail URL:', imageUrl);

            return (
              <tr key={id}>
                <td className="py-1 px-1 border border-gray-300">
                  <div className="flex flex-col items-center">
                    <a
                      href={`https://laligagolazos.com/moments/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      
                      <div className="flex items-center ml-4">
                        {id === 0 && (
                          <FaMedal className="text-yellow-400 text-4xl mr-1" />
                        )}
                        {id === 1 && (
                          <FaMedal className="text-gray-400 text-4xl mr-1" />
                        )}
                        {id === 2 && (
                          <FaMedal className="text-orange-400 text-4xl mr-1" />
                        )}
                        <span className="text-3xl">{id + 1}</span>
                      </div>
                    </a>
                  </div>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <p className="mb-8 text-3xl font-bold">
                    ${item.price}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Buyer:</span>{' '}
                    {owners[item.id] || 'N/A'}
                  </p>
                  <p>
                    <span className="font-bold">Date/Time:</span> {timeElapsed}
                  </p>
                  <p>
                    <span className="font-bold">Transaction ID:</span> {item.transactionId}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LaLigaSales;
