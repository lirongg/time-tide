import React, {useState, useEffect} from "react";

function SummaryBox({ apiKey, refreshKey }) {
  const [records, setRecords] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [latestRecordId, setLatestRecordId] = useState(null);
  const sessionCount = records.length;

  useEffect(() => {
    fetchData();
  }, [apiKey, refreshKey]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const data = await response.json();
      setRecords(data.records);
  
      // Calculate total planned time
      const totalDurationFromRecords = data.records.reduce((total, record) => {
        return total + record.fields.Duration;
      }, 0);
      setTotalDuration(totalDurationFromRecords);
  
      // Calculate total actual time
      const totalElapsedTimeFromRecords = data.records.reduce((total, record) => {
        return total + record.fields.ElapsedTime; // Assuming ElapsedTime represents the actual elapsed time
      }, 0);
      setElapsedTime(totalElapsedTimeFromRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  // Function to convert total duration from seconds to h:mm:ss format
  const convertSecondsToHMMSS = (seconds) => {
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
      <p>Total Planned Time: {convertSecondsToHMMSS(totalDuration)}</p>
      <p>Total Actual Time Spent: {convertSecondsToHMMSS(elapsedTime)}</p>
    </div>
  );
}

export default SummaryBox;
