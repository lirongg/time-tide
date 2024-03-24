// App.jsx
import React, { useState } from 'react';
import FocusFormPage from './FocusFormPage';
import CountdownTimerPage from './CountdownTimerPage';
import AirtableData from './AirtableData'; // Import AirtableData component

function App() {
  const [showFormPage, setShowFormPage] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [displayFormData, setDisplayFormData] = useState(false);
  const [showTimerPage, setShowTimerPage] = useState(false);
  const [showFocusSessionPage, setShowFocusSessionPage] = useState(true);

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

  return (
    <>
      <h1>Time Tide</h1>
      {showFocusSessionPage && !showFormPage && ( // Conditionally render the button
        <button onClick={() => setShowFormPage(true)}>+ New Focus Session</button>
      )}
      {showFormPage ? (
        <FocusFormPage onFormSubmit={handleFormSubmit} apiKey={apiKey} />
      ) : showTimerPage ? (
        <CountdownTimerPage
          selectedTime={selectedTime}
          onTimerStop={handleTimerStop}
          formData={formData}
        />
      ) : (
        <AirtableData apiKey={apiKey} />
      )}
    </>
  );
}

export default App;
