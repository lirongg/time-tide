import React, { useEffect } from "react";
import axios from "axios";

const TimerController = ({ apiKey, selectedTime, intervalId, onTimerStop, latestRecordId, history }) => {
  useEffect(() => {
    const handleTimerStop = async () => {
      try {
        clearInterval(intervalId);
        const elapsedTime = calculateElapsedTime();
        console.log("Elapsed Time:", elapsedTime);
        await updateElapsedTime(elapsedTime);
        onTimerStop();
        history.push("/");
      } catch (error) {
        console.error("Error updating ElapsedTime:", error);
      }
    };

    if (timerEnded) {
      handleTimerStop();
    }
  }, [timerEnded]);

  const calculateElapsedTime = (timeLeft) => {
    const hours = (timeLeft && timeLeft.hours) || 0;
    const minutes = (timeLeft && timeLeft.minutes) || 0;
    const seconds = (timeLeft && timeLeft.seconds) || 0;
    const selectedDurationInSeconds = convertDurationToSeconds(selectedTime);
    const remainingTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
    const elapsedSeconds = selectedDurationInSeconds - remainingTimeInSeconds;
    const formattedHours = Math.floor(elapsedSeconds / 3600);
    const formattedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
    const formattedSeconds = elapsedSeconds % 60;
    return `${formattedHours.toString().padStart(2, "0")}:${formattedMinutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;
  };

  const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(":");
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  const updateElapsedTime = async (elapsedTime) => {
    try {
      await axios.patch(
        `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201/${latestRecordId}`,
        {
          fields: {
            ElapsedTime: elapsedTime,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Updated ElapsedTime for record:", latestRecordId);
    } catch (error) {
      console.error("Error updating ElapsedTime:", error);
    }
  };

  return null;
};

export default TimerController;
