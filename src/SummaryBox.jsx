// SummaryBox.jsx
import React from 'react';

function SummaryBox({ sessionCount, recordCount, totalDuration }) {
  return (
    <div className="summary-box">
      <h2>Summary</h2>
      <p>Sessions: {sessionCount}</p>
      <p>Records: {recordCount}</p>
      <p>Total Duration: {totalDuration} minutes</p>
    </div>
  );
}

export default SummaryBox;
