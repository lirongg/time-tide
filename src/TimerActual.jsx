import React, { useEffect } from "react"; 
import TimerActualHandler from "./TimerActualHandler"; 

const TimerActual = ({ apiKey, selectedTime, timeLeft, latestRecordId }) => {

  useEffect(() => {
    // fetchDataAndUpdateTime is passed using useEffect hook to fetch data and update time
    TimerActualHandler({ apiKey, selectedTime, timeLeft, latestRecordId });
  }, [apiKey, selectedTime, timeLeft, latestRecordId]); 

  return null; 
};

export default TimerActual;
