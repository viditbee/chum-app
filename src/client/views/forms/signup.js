import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import './form-styles.scss';
import Button from "../misc/button";
import { requestSignup } from "../../interface/interface";

function SignUpForm() {

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  let history = useHistory();

  const emailChanged = (event) => {
    setEmail(event.target.value);
  };

  const firstNameChanged = (event) => {
    setFirstName(event.target.value);
  };

  const lastNameChanged = (event) => {
    setLastName(event.target.value);
  };

  const reqSignUp = async () => {
    let res = await requestSignup(email, firstName, lastName);
    if (res && res.status === "success") {
      setError("");
      alert("You have been registered successfully. Please check your inbox for credentials.");
      history.replace('/sign-in')
    } else if (res && res.status === "user_already_registered") {
      setError("You are already registered! Please check your inbox for credentials.");
    } else {
      setError("You have entered an invalid email id. Chum is open only for Contentserv" +
        " employees.");
    }
  };

  return <div className="form-cont sign-up">
    <div className="vect-cont" />
    <div className="fields-cont">
      <div className="form-header">Sign up to Chum.</div>
      <div className="form-sub-header">Already have an account? <Link to="/sign-in">Sign in</Link></div>
      <div className="field-cont">
        <div className="field-label">Email</div>
        <div className="field-input">
          <input value={email} autoComplete="chrome-off" type="text"
                 onChange={(e) => emailChanged(e)} />
        </div>
      </div>
      <div className="field-cont">
        <div className="field-label">First name</div>
        <div className="field-input">
          <input value={firstName} autoComplete="chrome-off"
                 onChange={(e) => firstNameChanged(e)} />
        </div>
      </div>
      <div className="field-cont">
        <div className="field-label">Last name</div>
        <div className="field-input">
          <input value={lastName} autoComplete="chrome-off"
                 onChange={(e) => lastNameChanged(e)} />
        </div>
      </div>
      <div className="error-box">{error}</div>
      <Button disabled={!email || !firstName} className="login-form-button" text="Sign up" onClick={() => {
        reqSignUp()
      }} />
    </div>
  </div>;
}

SignUpForm.propTypes = {};

SignUpForm.defaultProps = {};

export default SignUpForm;

