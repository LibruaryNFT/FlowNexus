import 'tailwindcss/tailwind.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMedal } from 'react-icons/fa';

const Sales = (props) => {
    const { type } = props;
  const [eventData, setEventData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [owners, setOwners] = useState({});
  const [imageUrls, setImageUrls] = useState({});

  const urls = {
    nba: {
      events: 'https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.c1e4f4f4c4257510.TopShotMarketV3.MomentPurchased&flowTransactionId=0f8ae65270044a3a882d6fc4e3354c8408acb83cd7621817e842b3938040c2c4',
    //  offerEvents: 'https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.b8ea91944fd51c43.OffersV2.OfferCompleted',
    //  owners: 'https://prod-main-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.0b2a3299cc857e29.TopShot.Deposit',
    },
    // Add more types here...
  };

  useEffect(() => {
    getEvents();
  //  getOfferEvents();
   // getOwners();
  }, []);

  

 // useEffect(() => {
//    filterData(); 
//  }, [combinedData]);

//  useEffect(() => {
 //   if (eventData.length > 0 && offerData.length > 0) {
//        const combined = [...eventData, ...offerData];
//        setCombinedData(combined);
 //       console.log('combined', combined);
//    }
//}, [eventData, offerData]);


  const getEvents = async () => {

    try {
      const res = await axios.get(urls[type].events);
    
      let data = res.data;
      
      // Normalize data to common format
      data = data.map(item => {
        return {
          id: item.blockEventData.id,
          price: item.blockEventData.price,
          seller: item.blockEventData.seller,
          eventDate: item.eventDate,
        };
      });
  
      setEventData(data);

      console.log('getEvents', data);

    } catch (error) {
      console.error('Error fetching TopShot data:', error);
    }
  };
  
  const getOfferEvents = async () => {
    try {
      const res = await axios.get(urls[type].offerEvents);
    
      let data = res.data;
      
      // filter the data based on blockEventData.purchased=true
      data = data.filter(item => item.blockEventData.purchased === true);
      
      // Normalize data to common format
      data = data.map(item => {
        return {
          id: item.blockEventData.nftId,
          price: item.blockEventData.offerAmount,
          seller: item.blockEventData.acceptingAddress,
          eventDate: item.eventDate,
        };
      });

      
      setOfferData(data);

      console.log('getOfferEvents', data);
    } catch (error) {
      console.error('Error fetching TopShot data from another source:', error);
    }
  };
  

  const getOwners = async () => {
    try {
      const res = await axios.get(
        urls[type].owners
      );

      const data = res.data;
      console.log('getOwners', data);

      const ownersMap = data.reduce((acc, item) => {
        acc[item.blockEventData.id] = item.blockEventData.to;
        return acc;
      }, {});

      setOwners(ownersMap);
      
    } catch (error) {
      console.error('Error fetching TopShot owners data:', error);
    }
  };

  const filterData = () => {
    const filtered = combinedData
      .filter(item => item.price > 1)
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)); // This will sort in descending order
  
    setFilteredData(filtered);
    console.log('filterData', filtered);
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Interesting Events</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          {filteredData.map((item, id) => {
            const saleDateTime = new Date(item.eventDate);
            const timeElapsed = calculateTimeElapsed(saleDateTime);
            const imageUrl = `https://assets.nbatopshot.com/media/${item.id}?width=512`;

            return (
              <tr key={id}>
                <td className="py-1 px-1 border border-gray-300">
                  <div className="flex flex-col items-center">
                    <a
                      href={`https://nbatopshot.com/moment/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        src={imageUrl}
                        alt="Moment"
                        className="h-64 w-64 object-contain min-w-0"
                      />
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
                  <p className="mb-2">
                    <span className="font-bold">Seller:</span>{' '}
                    {item.seller}
                  </p>
                  <p>
                    <span className="font-bold">Date/Time:</span> {timeElapsed}
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

export default Sales;
