import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const apiKey= import.meta.env.VITE_AIRTABLE_API_KEY;

const AirtableData = ({ apiKey }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAirtableData();
  }, [apiKey]);

  const fetchAirtableData = async () => {
    try {
      const response = await axios.get(
        'https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201',
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to fetch data from Airtable');
      }

      setRecords(response.data.records);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
        // Refresh data after successful delete
        fetchAirtableData();
      } else {
        console.error('Failed to delete record from Airtable:', response.status);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Function to convert duration from seconds to h:mm format
  const convertSecondsToHMM = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  return (
    <div className="card">
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            Title: {record.fields.Title}, Type: {record.fields.Type}, Duration: {convertSecondsToHMM(record.fields.Duration)}, Time: {moment(record.createdTime).format('MMMM Do YYYY, h:mm:ss a')},
            <button onClick={() => handleDelete(record.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirtableData;
