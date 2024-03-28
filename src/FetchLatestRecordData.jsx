import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const FetchLatestRecordData = ({ apiKey, onLatestRecordId }) => {
  const [latestRecordId, setLatestRecordId] = useState(null);

  useEffect(() => {
    const fetchLatestRecordId = async () => {
      try {
        const response = await axios.get(
          "https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201",
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
  
        if (response.status !== 200) {
          throw new Error("Failed to fetch data from Airtable");
        }
  
        // Sort records based on createdTime in descending order
        const sortedRecords = response.data.records.sort((a, b) =>
          moment(a.createdTime).isBefore(moment(b.createdTime)) ? 1 : -1
        );
  
        // Get the latest record (first element)
        const latestRecord = sortedRecords[0];
  
        // Set the latest record ID
        if (latestRecord) {
          setLatestRecordId(latestRecord.id);
          onLatestRecordId(latestRecord.id); // Pass the latest record ID back to the parent component
        } else {
          console.error("No records found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchLatestRecordId();
  }, [apiKey, onLatestRecordId]);
  
  return null;
};

export default FetchLatestRecordData;
