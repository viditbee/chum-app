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
import AboutYouPage from "./client/pages/about-you/about-you-page";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function check() {
      let { status, response } = await checkIfLoggedIn();
      if (status === "success") {
        setUserInfo(response);
        setLoggedIn(true);
      } else {
        setUserInfo(null);
        setLoggedIn(false);
      }
    }

    check();
  }, []);

  const setLoggedInIndirect = (val, userInfo) => {
    setLoggedIn(val);
    setUserInfo(userInfo);
  };

  const getRedirects = () => {
    const redirects = [];
    if (loggedIn) {
      if (!userInfo.gotStarted) {
        redirects.push(<Redirect key="homeToGetStarted" exact from="/home" to="/get-started" />)
      }
      redirects.push(<Redirect key="loginToRegister" exact from="/sign-in" to="/home" />);
      redirects.push(<Redirect key="loginToRegister" exact from="/sign-up" to="/home" />);
    }

    return redirects;
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          {getRedirects()}
          <Route exact path="/">
            <Home userInfo={userInfo} />
          </Route>
          <Route exact path="/sign-up">
            <SignUpPage />
          </Route>
          <Route exact path="/sign-in">
            <SignInPage loginSetter={setLoggedInIndirect} />
          </Route>
          <Route exact path="/get-started">
            <AboutYouPage userInfo={userInfo}/>
          </Route>
          <Route exact path="/dev">
            <DevSecPage />
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
