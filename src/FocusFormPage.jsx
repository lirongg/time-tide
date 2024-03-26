import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import "./Form.css"

const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

const FocusFormPage = ({ onFormSubmit, apiKey }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const history = useHistory(); // Initialize useHistory
  

  const generateDurationOptions = () => {
    const options = [];
    for (let hours = 0; hours <= 12; hours++) {
      for (let minutes = 0; minutes < 60; minutes++) {
        for (let seconds = 0; seconds < 60; seconds += 5) { // Include seconds starting from 0 and incrementing by 5
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          options.push(
            <option key={totalSeconds} value={`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}>
              {hours > 0 ? `${hours} hours` : ''} {minutes > 0 ? `${minutes} minutes` : ''} {seconds > 0 ? `${seconds} seconds` : ''}
            </option>
          );
        }
      }
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { title, type, duration };
  
    try {
      const [hours, minutes, seconds] = duration.split(':');
      const durationInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  
      const response = await axios.post(
        'https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201',
        {
          fields: { Title: title, Type: type, Duration: durationInSeconds, ElapsedTime: 0 },// Initialize elapsed time
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
        // Redirect to the countdown timer page
        history.push('/countdown-timer');
      } else {
        console.error('Failed to upload data to Airtable:', response.status);
        // Show error message to the user
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      // Log detailed error information
      console.error('Error details:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  };


  return (
    <div className="form">
      <div className="title">New Focus Session</div>
      <form onSubmit={handleSubmit}>
        <div className="input-container ic1">
          <input id="title" className="input" type="text" placeholder=" " value={title} onChange={(e) => setTitle(e.target.value)}/>
          <div className="cut"></div>
          <label htmlFor="title" className="placeholder">Title</label>
        </div>
        <div className="input-container ic2">
          <input id="type" className="input" type="text" placeholder=" " value={type} onChange={(e) => setType(e.target.value)} />
          <div className="cut"></div>
          <label htmlFor="type" className="placeholder">Type</label>
        </div>
        <div className="input-container ic3">
          <select id="duration" className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
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
