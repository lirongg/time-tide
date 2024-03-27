import React, { useState, useEffect } from "react";
import "./App.css";
import FocusFormPage from "./FocusFormPage";
import CountdownTimer from "./CountdownTimer";
import AirtableData from "./AirtableData";
import SummaryBox from "./SummaryBox";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  const [formData, setFormData] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timerEnded, setTimerEnded] = useState(false); // State to track whether timer has ended
  const [ringing, setRinging] = useState(false); // State to track whether alarm is ringing
  const [refreshKey, setRefreshKey] = useState(0);
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  const history = useHistory();


  const handleTimerStop = (elapsedTime) => {
    setTimerEnded(true); // Set timerEnded to true
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleStopAlarm = () => {
    setRinging(false); // Stop the alarm
    setTimerEnded(false); // Reset timerEnded state
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="header">
          <h1>Time Tide</h1>
        </div>
        <div className="button-container">
          <Link to="/focus-form">
            <button>+ New Focus Session</button>
          </Link>
        </div>
        <Switch>
          <Route path="/focus-form">
          <FocusFormPage
          apiKey={apiKey}
          onSubmitSuccess={(duration) => {
            console.log("selectedTime in App.jsx:", duration); 
            setSelectedTime(duration); // Update selectedTime state
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
            {timerEnded && <div>Time is up!</div>}
            {ringing && <button onClick={handleStopAlarm}>Stop Alarm</button>}
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
