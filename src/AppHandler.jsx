import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./App.css";

const AppHandler = ({ apiKey }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAirtableData();
  }, [apiKey]);

  const fetchAirtableData = async () => {
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
      // Sort records by createdTime in descending order using Moment.js
      const sortedRecords = response.data.records.sort((a, b) =>
        moment(a.createdTime).isBefore(moment(b.createdTime)) ? 1 : -1
      );

      setRecords(sortedRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to delete a single record
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201/${id}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.status === 200) {
        fetchAirtableData();
      } else {
        console.error(
          "Failed to delete record from Airtable:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Function to delete all records
  const handleDeleteAll = async () => {
    try {
      // Iterate over each record and delete it individually
      for (const record of records) {
        const response = await axios.delete(
          `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201/${record.id}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (response.status !== 200) {
          console.error("Failed to delete record:", record.id);
        }
      }
      fetchAirtableData();
    } catch (error) {
      console.error("Error deleting all records:", error);
    }
  };
  

  // Function to convert duration from seconds to h:mm:ss format
  const convertSecondsToHMMSS = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <div className="airtable-data-container">
      <h2>Sessions</h2>
      <div className="button-container1">
        <button className ="button1" onClick={handleDeleteAll}>Delete All Records</button>
      </div>
      <div className="card">
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <div className="start-time">
                    Start Time: {moment(record.createdTime).format(
                      "Do MMMM YYYY, h:mm:ss a"
                    )}
              </div>
              <div className="subject">Title: {record.fields.Title}
              </div>
              <div className="type">Type: {record.fields.Type}</div>
              <div className="planned-time">Planned Time: {convertSecondsToHMMSS(record.fields.Duration)}</div>
              <div className="actual-time">Actual Time Spent: {convertSecondsToHMMSS(record.fields.ActualTime)}</div>
              <div className="button-container2">
              <button className ="button1" onClick={() => handleDelete(record.id)}>Delete</button>
            
            </div>  </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppHandler;
