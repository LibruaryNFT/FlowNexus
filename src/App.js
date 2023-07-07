import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";
import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";

import { getBalance } from './scripts/read_balance.js';

import Home from './components/Home.js';
import Header from './components/Header.js';
import Profile from './components/Profile.js';
import TopShot from './components/TopShot.js';
import NFLAD from './components/NFLAD.js';
import UFCStrike from './components/UFCStrike.js';
import LaLiga from './components/LaLiga.js';
import Flow from './components/Flow.js';
import BlogPostPage from './components/BlogPostPage';
import Footer from './components/Footer.js';

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn");

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState({ loggedIn: false });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  useEffect(() => {
    // Check if user is in initial state
    if (!user.loggedIn && !user.addr) {
      return;
    }
    
    if (user.loggedIn) {
      console.log('User', user);
      getTheBalance();
    } else {
      console.log('User', user);
    }
  }, [user]);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleDisconnectWallet = () => {
    fcl.unauthenticate();
  };

  const handleConnectWallet = () => {
    fcl.authenticate();
  }; 

  const getTheBalance = async () => {
    const result = await fcl.send([
      fcl.script(getBalance),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);
    setBalance(result);
    console.log("Balance", result);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Header
          activePage={activePage}
          handlePageChange={handlePageChange}
          handleDisconnectWallet={handleDisconnectWallet}
          handleConnectWallet={handleConnectWallet}
          user={user}
          balance={balance}
          getBalance={getBalance}
        />
  
  <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ufcstrike" element={<UFCStrike />} />
            <Route path="/flow" element={<Flow />} />
            <Route path="/blogs/:slug" element={<BlogPostPage />} />
            <Route path="/laliga" element={<LaLiga />} />
            <Route path="/topshot" element={<TopShot />} />
            <Route path="/nflallday" element={<NFLAD />} />
            <Route path="/profile/:address" element={<Profile />} />
            <Route path="/404" element={<h1>404 - Page not found</h1>} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </div>
    
  
        <Footer />
      </div>
    </Router>
  );
}

export default App;
