import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as fcl from "@onflow/fcl";
import NexusLogo from "../nexus.svg";
import NFLADLogo from "../nflad.svg";
import UFCStrikeLogo from "../ufcstrike.svg";
import FlowLogo from "../flow.svg";
import TopShotLogo from "../topshot.svg";
import DapperLogo from "../dapper.svg";
import communities from "../communities.svg";

function Header({
  activePage,
  handleDisconnectWallet,
  handleConnectWallet,
  user,
  balance,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuClick = (menuName) => {
    setSubMenu(menuName);
    closeMobileMenu(); // close the menu when an item is clicked
  };

  const handleSubMenuClick = (menuName) => {
    setSubMenu(menuName === subMenu ? null : menuName);
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-300 hover:text-white focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <svg
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMobileMenuOpen ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 18L18 6M6 6L18 18"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z"
                    />
                  )}
                </svg>
              </button>
            </div>

            <NavLink
              to="/"
              exact={true.toString()}
              activeclassname="text-white"
              className="text-white hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <img src={NexusLogo} alt="Nexus logo" className="h-14" />
            </NavLink>

            <div className="hidden md:flex">
              <div
                className="relative group text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                onMouseEnter={() => handleMenuClick("Communities")}
                onMouseLeave={() => handleMenuClick(null)}
              >
                <div className="flex items-center">
                  <img
                    src={communities}
                    alt="communities logo"
                    className="h-8 mr-2"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`h-5 transform transition-transform duration-200 ${
                      subMenu === "Communities" ? "rotate-90" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
                {subMenu === "Communities" && (
                  <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-md shadow-lg p-2">
                    <NavLink
                      to="/"
                      activeclassname="text-white"
                      className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                      onClick={() => handleMenuClick(null)}
                    >
                      Home
                    </NavLink>
                    <NavLink
                      to="/topshot"
                      activeclassname="text-white"
                      className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleMenuClick(null)}
                    >
                      <img
                        src={TopShotLogo}
                        alt="TopShot logo"
                        className="h-8"
                      />
                    </NavLink>

                    <NavLink
                      to="/nflallday"
                      activeclassname="text-white"
                      className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleMenuClick(null)}
                    >
                      <img
                        src={NFLADLogo}
                        alt="nfallday logo"
                        className="h-8"
                      />
                    </NavLink>

                    <NavLink
                      to="/ufcstrike"
                      activeclassname="text-white"
                      className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleMenuClick(null)}
                    >
                      <img
                        src={UFCStrikeLogo}
                        alt="ufcstrike logo"
                        className="h-8"
                      />
                    </NavLink>

                    <NavLink
                      to="/laliga"
                      activeclassname="text-white"
                      className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleMenuClick(null)}
                    >
                      <img
                        src="https://assets.website-files.com/62e413b627f7600b8634374e/62e41e09957e75a85767a1f0_Golazos_Logo_Horizontal_W.png"
                        alt="laliga logo"
                        className="h-8"
                      />
                    </NavLink>

                    <NavLink
                      to="/flow"
                      activeclassname="text-white"
                      className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleMenuClick(null)}
                    >
                      <img src={FlowLogo} alt="flow logo" className="h-8" />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-y-0 left-0 z-50 w-1/2 bg-gray-800">
          <div className="flex justify-between items-center px-4 py-2">
            <NavLink
              to="/"
              exact={true.toString()}
              activeclassname="text-white"
              className="text-gray-300 hover:text-white px-3 py-1 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              <img src={NexusLogo} alt="Nexus logo" className="h-14" />
            </NavLink>
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                className="h-6 w-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6L18 18"
                />
              </svg>
            </button>
          </div>
          <div className="px-2 pt-1 pb-3">
            <NavLink
              to="/topshot"
              activeclassname="text-white"
              className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              <img
                src="https://nbatopshot.com/static/img/top-shot-logo-horizontal-white.svg"
                alt="TopShot logo"
                className="h-8"
              />
            </NavLink>

            <NavLink
              to="/nflallday"
              activeclassname="text-white"
              className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              <img src={NFLADLogo} alt="NFLAD logo" className="h-8" />
            </NavLink>

            <NavLink
              to="/laliga"
              activeclassname="text-white"
              className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              <img
                src="https://assets.website-files.com/62e413b627f7600b8634374e/62e41e09957e75a85767a1f0_Golazos_Logo_Horizontal_W.png"
                alt="LaLiga logo"
                className="h-8"
              />
            </NavLink>

            <NavLink
              to="/ufcstrike"
              activeclassname="text-white"
              className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              <img src={UFCStrikeLogo} alt="UFCStrike logo" className="h-8" />
            </NavLink>

            <NavLink
              to="/flow"
              activeclassname="text-white"
              className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              <img src={FlowLogo} alt="Flow logo" className="h-8" />
            </NavLink>

            <div className="mt-auto flex flex-col justify-between items-center px-4 py-2 border-t border-gray-300">
              {user.loggedIn && (
                <NavLink
                  to={user && user.addr ? `/profile/${user.addr}` : "/profile"}
                  activeclassname="text-white"
                  className="text-white hover:text-white flex items-center px-3 py-3 rounded-md text-base font-medium mb-2"
                  onClick={closeMobileMenu}
                >
                  <img
                    src="https://cryptologos.cc/logos/flow-flow-logo.png?v=025"
                    alt="Flow Profile"
                    className="h-8 mr-1"
                  />
                  <span className="md:inline-block md:ml-1 font-bold">
                    profile
                  </span>
                </NavLink>
              )}

              {user.loggedIn ? (
                <div className="inline-block border px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                  <button onClick={handleDisconnectWallet}>
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="inline-block border px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                  <button onClick={handleConnectWallet}>Connect Wallet</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User profile and wallet */}
      <div className="hidden md:flex absolute top-0 right-0 flex-row items-center mr-4 mt-1 border border-gray-300 p-1">
      {user.loggedIn && (
        <NavLink
          to={user && user.addr ? `/profile/${user.addr}` : "/profile"}
          activeclassname="text-white"
          className="text-white hover:text-white flex items-center px-3 py-3 rounded-md text-base font-medium"
          onClick={closeMobileMenu}
        >
          <img
            src="https://cryptologos.cc/logos/flow-flow-logo.png?v=025"
            alt="Flow Profile"
            className="h-8 mr-1"
          />
          <span className="md:inline-block md:ml-1 font-bold">profile</span>
        </NavLink>
      )}

        {user.loggedIn ? (
          <div className="inline-block border px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
            <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
          </div>
        ) : (
          <div className="inline-block border px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
            <button onClick={handleConnectWallet}>Connect Wallet</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
