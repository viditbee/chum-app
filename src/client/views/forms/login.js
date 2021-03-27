import React, { useState } from 'react';
import './form-styles.scss';
import Button from "../misc/button";
import { checkIfLoggedIn } from "../../utils/utils";

function LoginForm({ loginSetter }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailChanged = (event) => {
    setEmail(event.target.value);
  };

  const passwordChanged = (event) => {
    setPassword(event.target.value);
  };

  const authenticationSuccess = (userInfo) => {
    loginSetter(true, userInfo);
  };

  const reqLogin = async () => {
    let res = await checkIfLoggedIn(email, password);
    if (res && res.status === "yay") {
      setError("");
      authenticationSuccess(res);
    } else if (res && res.status === "nay") {
      setError("Are you sure you have copied the password correctly?");
    } else {
      setError("Are you not a part of Contentserv family yet? We would love to work with you." +
        " Come, join us! :)");
    }
  };

  return <div className="team-builder-wrapper">
    <div className="form-cont login">
      <div className="form-header">Sign in</div>
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
      {email && password ? <Button className="login-form-button" text="LOGIN" onClick={() => {
        reqLogin()
      }} /> : null}
      <div className="error-box">{error}</div>
    </div>
  </div>;

}

LoginForm.propTypes = {};

LoginForm.defaultProps = {};

export default LoginForm;

