import React, { useEffect, useState } from 'react';
import { Parser } from 'htmlparser2';

const fetchRSSFeed = async () => {
  try {
    const response = await fetch('https://status.onflow.org/history.rss');
    const xml = await response.text();
    return xml;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
};

const parseFeedItems = (feedData) => {
  const feedItems = [];
  const parser = new Parser(
    {
      onopentag(name, attributes) {
        if (name === 'item') {
          feedItems.push({});
        } else if (feedItems.length > 0) {
          const currentFeedItem = feedItems[feedItems.length - 1];
          currentFeedItem.currentTag = name;
        }
      },
      ontext(text) {
        if (feedItems.length > 0) {
          const currentFeedItem = feedItems[feedItems.length - 1];
          const currentTag = currentFeedItem.currentTag;

          if (currentTag) {
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

  parser.write(feedData);
  parser.end();

  return feedItems;
};

const FlowStatus = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const xml = await fetchRSSFeed();
        const parsedIncidents = parseFeedItems(xml);  // corrected function name here

        // Get the last two incidents
        const lastTwoIncidents = parsedIncidents.slice(0, 2);
        setIncidents(lastTwoIncidents);

        console.log('lastTwoIncidents:', lastTwoIncidents);
      } catch (error) {
        console.error('Error fetching Flow status:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Latest Events</h2>
      {incidents.map((incident, index) => {
        const key = `${incident.title}-${index}`;

        // Format dates to remove the "+0000" part
        const pubDate = incident.pubDate?.trim().substring(0, incident.pubDate?.trim().length - 6);
        const maintenanceEndDate = incident.maintenanceEndDate?.trim().substring(0, incident.maintenanceEndDate?.trim().length - 6);

        return (
          <div key={key}>
            <a href={incident.link} className="text-blue-500 hover:underline visited:text-purple-500">
              <h3 >{incident.title}</h3>
            </a>
            <p>Date: {pubDate}</p>
            <p>Maintenance End Date: {maintenanceEndDate}</p>
            {index !== incidents.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
};

export default FlowStatus;
