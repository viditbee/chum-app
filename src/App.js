import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './client/styleguide/typography.scss';
import './App.css';
import './client/views/misc/misc-styles.scss';
import './client/views/forms/form-styles.scss';
import { checkIfLoggedIn } from "./client/utils/utils";
import Home from "./client/pages/home/home";
import SignUpPage from "./client/pages/signup/sign-up-page";
import SignInPage from "./client/pages/signin/sign-in-page";
import DevSecPage from "./client/pages/dev/dev-secret-page";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const setUserInfoFromResponse = (res) => {
    setUserInfo({
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      teamId: res.teamId,
      organiser: res.hakuna === "tamata"
    });
  };

  useEffect(() => {
    async function check() {
      let res = await checkIfLoggedIn();
      if (res.status === "yay") {
        setLoggedIn(true);
        setUserInfoFromResponse(res);
      } else {
        setLoggedIn(false);
        setUserInfo(null);
      }
    }

    // check();
  }, []);

  const getRedirects = () => {
    const redirects = [];
    if (loggedIn) {
      redirects.push(<Redirect key="loginToRegister" exact from="/login" to="/register" />)
    } else {
      redirects.push(<Redirect key="registerToLogin" exact from="/register" to="/login" />)
    }

    return redirects;
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          {getRedirects()}
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/sign-up">
            <SignUpPage/>
          </Route>
          <Route exact path="/sign-in">
            <SignInPage/>
          </Route>
          <Route exact path="/dev">
            <DevSecPage/>
          </Route>
          <Route path="/*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
