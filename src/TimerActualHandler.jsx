import React, { useEffect } from "react";
import axios from "axios";

// Function to handle API
const TimerActualHandler = async ({
  apiKey,
  selectedTime,
  timeLeft,
  latestRecordId,
}) => {
  try {
    const convertDurationToSeconds = (duration) => {
      const [hours, minutes, seconds] = duration.split(":");
      return (
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
      );
    };

    const calculateActualTime = (timeLeft) => {
      const selectedDurationInSeconds = convertDurationToSeconds(selectedTime);
      const remainingTimeInSeconds =
        timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
      const actualSeconds = selectedDurationInSeconds - remainingTimeInSeconds;
      return actualSeconds;
    };

    const actualTime = calculateActualTime(timeLeft); // Calculate actual time
    console.log("Actualtime left:", actualTime);
    const requestURL = `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201/${latestRecordId}`;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const requestData = {
      fields: {
        ActualTime: actualTime,
      },
    };

    const response = await axios.patch(requestURL, requestData, { headers });
  } catch (error) {}
};

// uses props (i.e object) to extract specific properties (i.e apikey etc) from prop object and assign them to local variables
const ActualTime = (props) => {
  const { apiKey, selectedTime, timeLeft, latestRecordId } = props;

  useEffect(() => {
    fetchDataAndUpdateTime(props); // Call the function to fetch data and update time
  }, [apiKey, selectedTime, timeLeft, latestRecordId]);

  return null;
};

export default TimerActualHandler;
