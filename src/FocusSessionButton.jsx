// FocusSessionButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./App.css"

const FocusSessionButton = () => {
  return (
    <div className="button-container">
      <Link to="/focus-form">
        <button className="button">+ New Focus Session</button>
      </Link>
    </div>
  );
};

export default FocusSessionButton;
