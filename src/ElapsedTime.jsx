import React, { useEffect } from "react";
import axios from "axios";

const ElapsedTime = ({ apiKey, selectedTime, timeLeft, latestRecordId }) => {
  useEffect(() => {

    const convertDurationToSeconds = (duration) => {
      const [hours, minutes, seconds] = duration.split(":");
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    };

    const calculateElapsedTime = (timeLeft) => {
      const selectedDurationInSeconds = convertDurationToSeconds(selectedTime);
      const remainingTimeInSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
      const elapsedSeconds = selectedDurationInSeconds - remainingTimeInSeconds;
      return elapsedSeconds;
    };

    const updateElapsedTime = async () => {
      try {
        const elapsedTime = calculateElapsedTime(timeLeft); // Calculate elapsed time
        console.log("Actualtime left:", elapsedTime);
        const requestURL = `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201/${latestRecordId}`;

        const headers = {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };

        const requestData = {
          fields: {
            ElapsedTime: elapsedTime,
          },
        };

        const response = await axios.patch(
          requestURL,
          requestData,
          { headers: headers }
        );

        console.log("Response Data:", response.data); // Log the response data
        console.log("Updated ElapsedTime for record"); // Log success message
      } catch (error) {
        console.error("Error updating ElapsedTime:", error); // Log error message
      }
    };

    updateElapsedTime(); // Call the updateElapsedTime function here
  }, [apiKey, selectedTime, timeLeft, latestRecordId]); // Add latestRecordId to the dependency array

  return null; // This component doesn't render anything
};

export default ElapsedTime;
