import React from 'react';

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center bg-gradient-to-r from-purple-900 to-green-500 rounded p-4">
      <div className="w-2/3 mb-1 pr-4">
        <a
          href="https://flow.com/hackathon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://assets-global.website-files.com/618c953e65cc2ba3f44d1a02/6477dcd23d1502d9fbbf4604_Flow%E2%80%99s%20Hackathon.gif"
            alt="Flow's Hackathon"
            className="w-full"
          />
        </a>
      </div>
      <div className="w-1/3 flex flex-col items-center mt-auto">
        <a
          href="/blogs/announcing-flow-to-the-future-global-hackathon"
          className="flex items-center justify-center px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          style={{ width: '120px' }}
        >
          <span className="mr-2" role="img" aria-label="dialog-emoji">
            🗨️
          </span>
          <span className="text-sm">Comments</span>
        </a>
      </div>
    </div>
  );
};

export default Banner;
