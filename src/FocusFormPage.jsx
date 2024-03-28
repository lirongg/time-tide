import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Form.css";

const FocusFormPage = ({ apiKey, onSubmitSuccess }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const history = useHistory(); // Initialize useHistory

  const generateDurationOptions = () => {
    const options = [];
    for (let hours = 0; hours <= 12; hours++) {
      for (let minutes = 1; minutes < 60; minutes++) { // Start from 1 minute
        const totalSeconds = hours * 3600 + minutes * 60;
        options.push(
          <option
            key={totalSeconds}
            value={`${hours}:${minutes.toString().padStart(2, "0")}:00`}
          >
            {hours > 0 ? `${hours} hours` : ""}{" "}
            {minutes} minutes
          </option>
        );
      }
    }
    return options;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = { title, type, duration };

    try {
      const [hours, minutes, seconds] = duration.split(":");
      const durationInSeconds =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

      const response = await axios.post(
        "https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201",
        {
          fields: { Title: title, Type: type, Duration: durationInSeconds }, // Initialize elasped time
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTitle("");
        setType("");
        setDuration("");
        onSubmitSuccess(duration);
        // Redirect to the countdown timer page
        history.push("/countdown-timer", {selectedTime: duration});
      } else {
        console.error("Failed to upload data to Airtable:", response.status);
        // Show error message to the user
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      // Log detailed error information
      console.error("Error details:", error.response.data);
      console.error("Status code:", error.response.status);
    }
  };

  const handleCancel = () => {
    history.push("/");
  };

  return (
    <div className="form">
      <div className="title">New Focus Session</div>
      <form onSubmit={handleFormSubmit}>
        <div className="input-container ic1">
          <input
            id="title"
            className="input"
            type="text"
            placeholder=" "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required // Add required attribute
          />
          <div className="cut"></div>
          <label htmlFor="title" className="placeholder">
            Title
          </label>
        </div>
        <div className="input-container ic2">
          <input
            id="type"
            className="input"
            type="text"
            placeholder=" "
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <div className="cut"></div>
          <label htmlFor="type" className="placeholder">
            Type
          </label>
        </div>
        <div className="input-container ic3">
          <select
            id="duration"
            className="input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required // Add required attribute
          >
            <option value="">Select Duration</option>
            {generateDurationOptions()}
          </select>
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default FocusFormPage;
