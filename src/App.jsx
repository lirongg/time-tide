// Import useState, useEffect from React
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');

  const apiKey= import.meta.env.VITE_AIRTABLE_API_KEY;

  useEffect(() => {
    fetchAirtableData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
// Convert duration from h:mm format to seconds
const [hours, minutes] = duration.split(':');
const durationInSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60);

const response = await axios.post(
        'https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201',
        {
          fields: {
            Title: title,
            Type: type,
            Duration: durationInSeconds,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Refresh data after successful upload
        fetchAirtableData();
        // Clear form fields
        setTitle('');
        setType('');
        setDuration('');
      } else {
        console.error('Failed to upload data to Airtable:', response.status);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
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
    <>
      <h1>Time Tide</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="type">Type:</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div>
          <label htmlFor="duration">Duration:</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}>
            <option value="">Select Duration</option>
            <option value="1:00">1:00</option>
            <option value="1:30">1:30</option>
            <option value="2:00">2:00</option></select>
        </div>
          <button type="submit">Submit</button>
        </form>
        <ul>
          {records.map(record => (
            <li key={record.id}>
              Title: {record.fields.Title}, Type: {record.fields.Type}, Duration: {convertSecondsToHMM(record.fields.Duration)},
              <button onClick={()=> handleDelete(record.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
