import React from "react";
import PropTypes from "prop-types";

interface GridItemProps {
  title: string;
  children: React.ReactNode;
}

function GridItem({ title, children }: GridItemProps) {
  return (
    <div className="flex flex-col justify-between p-6 border border-gray-300 bg-white shadow-lg rounded-md h-[400px] transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex-1 w-full h-full">{children}</div>
    </div>
  );
}

GridItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default GridItem;
