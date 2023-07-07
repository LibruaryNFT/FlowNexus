import React from "react";
import { Link } from "react-router-dom";
import OpenAILogo from "../openai.svg";
import FindLogo from "../find.svg";
import GraffleLogo from "../graffle.svg";

function Footer() {
  return (
    <footer className="bg-slate-800 text-white relative bottom-0 left-0 w-full">
      <div className="flex items-center justify-center py-4">
        <div className="flex flex-col px-4">
          <a href="https://flow.com/" aria-label="Flow logo">
            <img
              src="https://nbatopshot.com/static/img/flow.svg"
              alt="Flow logo"
            />
          </a>
        </div>
        <div className="flex flex-col px-4">
          <span className="text-sm">Powered by</span>
          <a href="https://openai.com/" aria-label="OpenAI logo">
            <img src={OpenAILogo} alt="OpenAI logo" className="h-6" />
          </a>
        </div>
        <div className="flex flex-col px-4">
          <span className="text-sm">Powered by</span>
          <a href="https://find.xyz/" aria-label="Find logo">
            <img src={FindLogo} alt="Find logo" className="h-6" />
          </a>
        </div>
        <div className="flex flex-col px-4">
          <span className="text-sm">Powered by</span>
          <a href="https://www.graffle.io/" aria-label="Graffle logo">
            <img src={GraffleLogo} alt="OpenAI logo" className="h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
