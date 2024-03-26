import React, { useState, useEffect } from 'react';
import './App.css';
import FocusFormPage from './FocusFormPage';
import CountdownTimerPage from './CountdownTimerPage';
import AirtableData from './AirtableData'; 
import SummaryBox from './SummaryBox';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';



function App() {
  const [showFormPage, setShowFormPage] = useState(false);
  const [formData, setFormData] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [displayFormData, setDisplayFormData] = useState(false);
  const [showTimerPage, setShowTimerPage] = useState(false);
  const [showFocusSessionPage, setShowFocusSessionPage] = useState(true);
  const [records, setRecords] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

  const handleClearAllData = async () => {
    try {
      const response = await fetch('https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.status === 200) {
        fetchData();
      } else {
        console.error('Failed to clear all data from Airtable:', response.status);
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  };

  const handleFormSubmit = (data, duration) => {
    setFormData(data);
    setDisplayFormData(true);
    setShowFormPage(false);
    setShowTimerPage(true);
    setShowFocusSessionPage(false);
    setSelectedTime(duration);
    setIsTimerRunning(true);
  };

  const handleTimerStop = (elapsedTime) => {
    setIsTimerRunning(false);
    setShowFocusSessionPage(true);
    setShowTimerPage(false);
    setElapsedTime(elapsedTime);
    console.log('Elapsed time:', elapsedTime);
  };

  useEffect(() => {
    fetchData();
  }, [apiKey]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();
      setRecords(data.records);
  
      const totalDurationFromRecords = data.records.reduce((total, record) => {
        return total + record.fields.Duration;
      }, 0);
  
      setTotalDuration(totalDurationFromRecords);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sessionCount = records.length;
  const recordCount = records.length;

  return (
    <Router>
      <div className="app-container">
        <div className="header">
          <h1>Time Tide</h1>
        </div>
        <Switch>
          <Route path="/focus-form">
            <FocusFormPage onFormSubmit={handleFormSubmit} apiKey={apiKey} />
          </Route>
          <Route path="/countdown-timer">
            <CountdownTimerPage
              selectedTime={selectedTime}
              onTimerStop={handleTimerStop}
              formData={formData}
            />
          </Route>
          <Route path="/">
            {showFocusSessionPage && ( // Ensure the button is rendered only on the main page
              <div className="button-container">
              <Link to="/focus-form">
                <button>+ New Focus Session</button>
                </Link>
              </div>
            )}
            <div className="summary-airtable-wrapper">
            <SummaryBox sessionCount={sessionCount} recordCount={recordCount} totalDuration={totalDuration} />
          <div className="airtable-wrapper">
            <AirtableData apiKey={apiKey} onDeleteAll={handleClearAllData} />
          </div>
          </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

            

export default App;
