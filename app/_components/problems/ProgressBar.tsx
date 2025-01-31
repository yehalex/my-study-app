import React from "react";

type ProgressBarProps = {
  percentage: number;
};

const ProgressBar = ({ percentage }: ProgressBarProps) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default ProgressBar;
