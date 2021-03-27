import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './client/styleguide/typography.scss';
import './App.css';
import './client/views/misc/misc-styles.scss';
import './client/views/forms/form-styles.scss';
import GOLWrapper from "./client/views/game-of-life/gol-wrapper";
import Pixels from "./client/views/pixels/pixels";
import Pixeletter from "./client/views/pixeletter/pixeletter";
import Header from "./client/views/header/header";
import Footer from "./client/views/footer/footer";
import Clock from "./client/views/clock/clock";
import { checkIfLoggedIn } from "./client/utils/utils";
import RegisterNowButton from './client/views/misc/register-now-button';
import LoginForm from './client/views/forms/login';
import RegistrationForm from './client/views/forms/registration';
import Security from "./client/views/security/security";
import AboutEvent from "./client/views/misc/about-event";
import FeedbackForm from "./client/views/forms/feedback";
import SideButtons from "./client/views/side-buttons/side-button";
import RegisteredTeams from "./client/views/registered-teams/registered-teams";
import FeedbackList from "./client/views/feedback-list/feedback-list";
import Challenges from "./client/views/challenges/challenges";

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

    check();
  }, []);

  const setTeamIdInIndirect = (teamId) => {
    if (teamId) {
      setUserInfo({ ...userInfo, teamId: teamId });
    }
  };

  const setLoggedInIndirect = (val, userInfo) => {
    setLoggedIn(val);
    setUserInfoFromResponse(userInfo);
  };

  const setLoggedOutIndirect = () => {
    setLoggedIn(false);
    setUserInfo(null);
  };

  const getRedirects = () => {
    const redirects = [];
    if (loggedIn) {
      redirects.push(<Redirect key="loginToRegister" exact from="/login" to="/register" />)
    } else {
      redirects.push(<Redirect key="registerToLogin" exact from="/register" to="/login" />)
    }

    return redirects;
  };

  const getSecretPortals = () => {
    let portals = null;

    if (userInfo && userInfo.organiser) {
      portals = [
        <Route path="/secret-teams">
          <Pixels />
          <RegisteredTeams />
        </Route>,
        <Route path="/secret-feedback">
          <Pixels />
          <FeedbackList />
        </Route>
      ]
    }

    return portals;
  };

  return (
    <div className="App">
      <Router>
        <Header userInfo={userInfo} logoutSetter={() => {
          setLoggedOutIndirect()
        }} />
        <Switch>
          {getRedirects()}
          {getSecretPortals()}
          <Route path="/about">
            <Pixels />
            <AboutEvent />
          </Route>
          <Route path="/challenges">
            <Pixels />
            <Challenges />
          </Route>
          <Route path="/gameoflife">
            <GOLWrapper userInfo={userInfo} />
          </Route>
          <Route path="/security">
            <Pixels />
            <Security />
          </Route>
          <Route path="/login">
            <Pixels />
            <LoginForm loginSetter={(val, userInfo) => {
              setLoggedInIndirect(val, userInfo)
            }} />
          </Route>
          <Route path="/register">
            <Pixels />
            <RegistrationForm loggedIn={loggedIn} userInfo={userInfo} teamIdSetter={(id) => {
              setTeamIdInIndirect(id)
            }} />
          </Route>
          <Route path="/feedback">
            <Pixels />
            <FeedbackForm userInfo={userInfo} />
          </Route>
          <Route exact path="/">
            <Pixels />
            <Pixeletter userInfo={userInfo} />
            <Clock evDate="2021-03-22" />
            <RegisterNowButton loggedIn={loggedIn} userInfo={userInfo} />
          </Route>
          <Route path="/*">
            <Redirect to="/" />
          </Route>
        </Switch>
        <Footer />
        <SideButtons userInfo={userInfo} />
      </Router>
    </div>
  );
}

export default App;
