import React, { useState } from 'react';
import axios from 'axios';

const FocusFormPage = ({ onFormSubmit, apiKey }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');

  const generateDurationOptions = () => {
    const options = [];
    for (let hours = 0; hours <= 12; hours++) {
      for (let minutes = 0; minutes < 60; minutes++) {
        const totalMinutes = hours * 60 + minutes;
        options.push(
          <option key={totalMinutes} value={`${hours}:${minutes.toString().padStart(2, '0')}`}>
            {hours > 0 ? `${hours} hours` : ''} {minutes > 0 ? `${minutes} minutes` : ''}
          </option>
        );
      }
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { title, type, duration };

    try {
      const [hours, minutes] = duration.split(':');
      const durationInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;

      const response = await axios.post(
        'https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201',
        {
          fields: { Title: title, Type: type, Duration: durationInSeconds },
        },
        {
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        setTitle('');
        setType('');
        setDuration('');
        onFormSubmit(response.data, duration); // Pass duration to onFormSubmit
      } else {
        console.error('Failed to upload data to Airtable:', response.status);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div>
          <label htmlFor="duration">Duration:</label>
          <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="">Select Duration</option>
            {generateDurationOptions()}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FocusFormPage;