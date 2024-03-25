import React, { useState } from 'react';
import './App.css'; // Import your CSS file
import FocusFormPage from './FocusFormPage';
import CountdownTimerPage from './CountdownTimerPage';
import AirtableData from './AirtableData'; 
import SummaryBox from './SummaryBox';

function App() {
  const [showFormPage, setShowFormPage] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [displayFormData, setDisplayFormData] = useState(false);
  const [showTimerPage, setShowTimerPage] = useState(false);
  const [showFocusSessionPage, setShowFocusSessionPage] = useState(true);
  const [records, setRecords] = useState([]);

  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

  const handleFormSubmit = (data, duration) => {
    setFormData(data);
    setDisplayFormData(true);
    setShowFormPage(false);
    setShowTimerPage(true);
    setShowFocusSessionPage(false);
    setSelectedTime(duration);
    setIsTimerRunning(true);
  };

  const handleTimerStop = () => {
    setIsTimerRunning(false);
    setShowFocusSessionPage(true);
    setShowTimerPage(false);
  };

  // Calculate session count, record count, and total duration
  const sessionCount = showTimerPage ? 1 : 0;
  const recordCount = records.length;
  const totalDuration = records.reduce((acc, record) => acc + record.fields.Duration, 0);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Time Tide</h1>
      </div>
      <div className="button-container">
        {showFocusSessionPage && !showFormPage && (
          <button onClick={() => setShowFormPage(true)}>+ New Focus Session</button>
        )}
      </div>
      {showFormPage ? (
        <FocusFormPage onFormSubmit={handleFormSubmit} apiKey={apiKey} />
      ) : showTimerPage ? (
        <CountdownTimerPage
          selectedTime={selectedTime}
          onTimerStop={handleTimerStop}
          formData={formData}
        />
      ) : (
        <div className="summary-airtable-wrapper">
          <SummaryBox sessionCount={sessionCount} recordCount={recordCount} totalDuration={totalDuration} />
          <div className="airtable-wrapper">
            <AirtableData apiKey={apiKey} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
