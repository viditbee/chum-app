import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './form-styles.scss';
import Button from "../misc/button";
import { sendFeedback } from "../../interface/interface";

function FeedbackForm({ userInfo }) {

  const [name, setName] = useState(userInfo ? userInfo.firstName + " " + userInfo.lastName : "");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  let history = useHistory();

  const emailChanged = (event) => {
    setName(event.target.value);
  };

  const passwordChanged = (event) => {
    setFeedback(event.target.value);
  };

  const sendFeedbackClicked = async () => {
    const res = await sendFeedback(name, feedback);
    alert("Thank you for your valuable feedback!");
    history.replace('/');
  };

  return <div className="form-cont login">
    <div className="form-header">Feedback is important :)</div>
    <div className="form-msg">Your feedback is highly appreciated and will help us to improve how we organise events like these in the future. You may write about the event, the problem statements, the web-app, or even about your wish to add anything to this web-app.<p>Happy hacking!</p></div>
    <div className="field-cont">
      <div className="field-label">Name (optional)</div>
      <div className="field-input">
        <input value={name} placeholder="Anonymous" autoComplete="chrome-off" type="text" onChange={(e) => emailChanged(e)} />
      </div>
    </div>
    <div className="field-cont">
      <div className="field-label">Message</div>
      <div className="field-input">
        <textarea value={feedback} autoComplete="chrome-off"
               onChange={(e) => passwordChanged(e)} />
      </div>
    </div>
    {feedback ? <Button className="send-now-button" text="SEND" onClick={() => {
      sendFeedbackClicked();
    }} /> : null}
    <div className="error-box">{error}</div>
  </div>;
}

FeedbackForm.propTypes = {};

FeedbackForm.defaultProps = {};

export default FeedbackForm;

