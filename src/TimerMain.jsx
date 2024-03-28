import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import alarmSound from "./assets/alarm.mp3";
import "./styles.css";
import TimerDisplay from "./TimerDisplay";
import TimerLogic from "./TimerLogic";
import TimerActual from "./TimerActual";
import FetchLatestRecordData from "./FetchLatestRecordData";


const TimerMain = ({ apiKey, selectedTime, onAlarmStop, intervalId, onTimerStop }) => {
  const history = useHistory();
  const [latestRecordId, setLatestRecordId] = useState(null);
  const { timeLeft, ringing, timerEnded } = TimerLogic({ selectedTime, onAlarmStop });

  const handleLatestRecordId = (id) => {
    setLatestRecordId(id);
  };

  const handleStop = () => {
    clearInterval(intervalId);
    onTimerStop();
    history.push("/");
  };

  return (
    <div>
      <div className="countdown">
        <TimerDisplay timeLeft={timeLeft} />
        {ringing && <audio autoPlay loop src={alarmSound} />}
        {timerEnded && <div className="timeup">Time is up! </div>}
        <button onClick={handleStop}>Stop</button>
      </div>
      <FetchLatestRecordData apiKey={apiKey} onLatestRecordId={handleLatestRecordId} />
      <TimerActual apiKey={apiKey} selectedTime={selectedTime} timeLeft={timeLeft} latestRecordId={latestRecordId} />
    </div>
  );
};

export default TimerMain;
