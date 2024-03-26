import React from "react";

function SummaryBox({ recordCount, totalDuration, elapsedTime }) {
  const sessionCount = recordCount; // Assuming each record represents a session

  // Function to convert total duration from seconds to h:mm format
  const convertSecondsToHMM = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <div className="summary-box">
      <h2>Summary</h2>
      <p>Sessions: {sessionCount}</p>
      <p>Total Planned Time: {convertSecondsToHMM(totalDuration)}</p>
      <p>Total Actual Time Spent: {convertSecondsToHMM(elapsedTime)}</p>
    </div>
  );
}

export default SummaryBox;
