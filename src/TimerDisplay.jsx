import React from "react";

const TimerDisplayComponent = ({ timeLeft }) => {
  return (
    <div className="content">
      <div className="box">
        <div className="value">
          <span>{timeLeft.hours || 0}</span>
        </div>
        <span className="label">hours</span>
      </div>
      <div className="box">
        <div className="value">
          <span>{timeLeft.minutes || 0}</span>
        </div>
        <span className="label">minutes</span>
      </div>
      <div className="box">
        <div className="value">
          <span>{timeLeft.seconds || 0}</span>
        </div>
        <span className="label">seconds</span>
      </div>
    </div>
  );
};

export default TimerDisplayComponent;
