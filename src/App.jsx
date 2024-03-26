import React, { useState, useEffect } from 'react';
import './App.css';
import FocusFormPage from './FocusFormPage';
import CountdownTimerPage from './CountdownTimerPage';
import AirtableData from './AirtableData'; 
import SummaryBox from './SummaryBox';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
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
  const [latestRecordId, setLatestRecordId] = useState(null);
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  const history = useHistory();

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
    history.push('/');
    window.location.reload(); 
    console.log("refreshing...")// Refresh the page once route changes to '/'
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
  
      // Find the record with the latest createdTime
      if (data.records.length > 0) {
        const latestRecord = data.records.reduce((prev, current) => (prev.createdTime > current.createdTime) ? prev : current);
        console.log("Latest Record:", latestRecord);
        setLatestRecordId(latestRecord.id);
      }
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
              apiKey={apiKey}
              latestRecordId={latestRecordId}
            />
          </Route>
          <Route path="/">
            {showFocusSessionPage && (
              <div className="button-container">
                <Link to="/focus-form">
                  <button>+ New Focus Session</button>
                </Link>
              </div>
            )}
            <div className="summary-airtable-wrapper">
              <SummaryBox sessionCount={sessionCount} recordCount={recordCount} totalDuration={totalDuration} elapsedTime={elapsedTime}/>
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
