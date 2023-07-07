import Blogs from "./Blogs";
import FlowStatus from "./FlowStatus";
import React from "react";
import Banner from "./Banner";

function Flow() {
  return (
    <div className="flex flex-wrap">
      <Banner/>
      {/* First Column */}
      <div className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
        <div className="mb-1 mt-3">
          <Blogs sources={["flow", "dapper", "flow2"]} postCount={5} />
        </div>
      </div>
      {/* Second Column */}
      <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <div className="mb-1 ml-1">
          <FlowStatus/>
        </div>
      </div>
    </div>
  );
}

export default Flow;
