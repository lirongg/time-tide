// App.jsx
import React, { useState } from "react";
import "./App.css";
import FocusFormPage from "./FocusFormPage";
import CountdownTimer from "./CountdownTimer";
import AirtableData from "./AirtableData";
import SummaryBox from "./SummaryBox";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FocusSessionButton from "./FocusSessionButton"; // Import the new component

function App() {
  const [formData, setFormData] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timerEnded, setTimerEnded] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

  const handleTimerStop = (elapsedTime) => {
    setTimerEnded(true);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleStopAlarm = () => {
    setRinging(false);
    setTimerEnded(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="header">
          <h1>Time Tide</h1>
        </div>
        <Switch>
          <Route path="/focus-form">
            <FocusFormPage
              apiKey={apiKey}
              onSubmitSuccess={(duration) => {
                console.log("selectedTime in App.jsx:", duration);
                setSelectedTime(duration);
                setRefreshKey((prevKey) => prevKey + 1);
              }}
            />
          </Route>
          <Route path="/countdown-timer">
            <CountdownTimer
              selectedTime={selectedTime}
              onAlarmStop={handleStopAlarm}
              timerEnded={timerEnded}
              onTimerStop={handleTimerStop}
            />
          </Route>
          <Route path="/">
            <FocusSessionButton /> {/* Render the FocusSessionButton component */}
            <div className="summary-airtable-wrapper">
              <SummaryBox apiKey={apiKey} refreshKey={refreshKey} />
              <div className="airtable-wrapper">
                <AirtableData apiKey={apiKey} />
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
