import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import './form-styles.scss';
import Button from "../misc/button";
import { checkIfLoggedIn } from "../../utils/utils";
import Paths from './../../../facts/paths';

function SignInForm({ loginSetter }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let history = useHistory();

  const emailChanged = (event) => {
    setEmail(event.target.value);
  };

  const passwordChanged = (event) => {
    setPassword(event.target.value);
  };

  const reqSignIn = async () => {
    let { status, response } = await checkIfLoggedIn(email, password);
    if (status === "success") {
      loginSetter(true, response);
      history.replace(Paths.home);
    } else if(status === "user_not_found") {
      setError("We couldn't identify you. Please create an account for signing in.");
      loginSetter(false);
    } else {
      setError("Sorry! Credentials do not match. You can find them in the" +
        " welcome email and try again.");
      loginSetter(false);
    }
  };

  return <div className="form-cont sign-up">
    <div className="vect-cont sign-in" />
    <div className="fields-cont">
      <div className="form-header">Welcome back!</div>
      <div className="form-sub-header">Don't have an account? <Link to="/sign-up">Sign up</Link>
      </div>
      <div className="field-cont">
        <div className="field-label">Email</div>
        <div className="field-input">
          <input value={email} autoComplete="chrome-off" type="text"
                 onChange={(e) => emailChanged(e)} />
        </div>
      </div>
      <div className="field-cont">
        <div className="field-label">Password</div>
        <div className="field-input">
          <input value={password} autoComplete="chrome-off" type="password"
                 onChange={(e) => passwordChanged(e)} />
        </div>
      </div>
      <div className="error-box">{error}</div>
      <Button disabled={!email || !password} className="login-form-button" text="Sign in"
              onClick={() => {
                reqSignIn()
              }} />
    </div>
  </div>;
}

SignInForm.propTypes = {};

SignInForm.defaultProps = {};

export default SignInForm;

