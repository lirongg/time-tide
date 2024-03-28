// App.jsx
import React, { useState } from "react";
import "./App.css";
import FocusFormPage from "./FocusFormPage";
import CountdownMain from "./TimerMain";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FocusSessionButton from "./FocusSessionButton"; 
import AppSummary from "./AppSummary";
import AppHandler from "./AppHandler";

function App() {
  // using 'useState' to manage state in my functional component - initialize a state variable with an empty string and a function to update its value
  const [selectedTime, setSelectedTime] = useState("");
  const [timerEnded, setTimerEnded] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

  const handleTimerStop = (actualTime) => {
    setTimerEnded(true);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleStopAlarm = () => {
    setRinging(false);
    setTimerEnded(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    // using 'BrowserRouter' from 'react-router-dom' to enable routing
    // inside 'Switch', define the different routes using the 'Route' component
    <Router>
      <div className="app-container">
        <div className="header">
          <h1>Time Tide</h1>
        </div>
        <Switch>
          <Route path="/focus-form">
            <FocusFormPage
              apiKey={apiKey}
              // Lifting state: when form is  submitted, calls a function passed as a prop to update 'selectedTime' state in App component
              onSubmitSuccess={(duration) => {
                setSelectedTime(duration);
                setRefreshKey((prevKey) => prevKey + 1);
              }}
            />
          </Route>
          <Route path="/countdown-timer">
            <CountdownMain
              selectedTime={selectedTime}
              // Lifting state: when timer ends/ alarm stopped, calls functions passed as props to update state in App component
              onAlarmStop={handleStopAlarm}
              timerEnded={timerEnded}
              onTimerStop={handleTimerStop}
              apiKey={apiKey}
            />
          </Route>
          <Route path="/">
            <FocusSessionButton /> 
            <div className="summary-airtable-wrapper">
              <AppSummary apiKey={apiKey} refreshKey={refreshKey} />
              <div className="airtable-wrapper">
                <AppHandler apiKey={apiKey} />
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;