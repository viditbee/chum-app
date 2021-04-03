import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './client/styleguide/typography.scss';
import './App.css';
import './client/pages/common-page-styles.scss';
import './client/views/misc/misc-styles.scss';
import './client/views/forms/form-styles.scss';
import { checkIfLoggedIn } from "./client/utils/utils";
import Home from "./client/pages/home/home";
import SignUpPage from "./client/pages/signup/sign-up-page";
import SignInPage from "./client/pages/signin/sign-in-page";
import DevSecPage from "./client/pages/dev/dev-secret-page";
import AboutYouPage from "./client/pages/about-you/about-you-page";
import Paths from "./facts/paths";
import UserHomePage from "./client/pages/user-home/user-home-page";


class DebugRouter extends Router {
  constructor(props) {
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null, 2))
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
    });
  }
}

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);

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
      setUserInfoLoaded(true);
    }

    check();
  }, []);

  const setGotStartedIndirect = (val) => {
    const userInfoDup = { ...userInfo };
    userInfoDup.gotStarted = val;
    setUserInfo(userInfoDup);
  };

  const setLoggedInIndirect = (val, userInfo) => {
    setUserInfo(userInfo);
    setLoggedIn(val);
  };

  const setLoggedOutIndirect = () => {
    setLoggedIn(false);
    setUserInfo(null);
    setUserInfoLoaded(true);
  };

  const getRedirects = () => {
    const redirects = [];
    if (userInfoLoaded) {
      if (loggedIn) {
        if (!userInfo.gotStarted) {
          redirects.push(<Redirect key="homeToGetStarted" exact from={Paths.home}
                                   to={Paths.getStarted} />);
          redirects.push(<Redirect key="aboutMeToGetStarted" exact from={Paths.aboutMe}
                                   to={Paths.getStarted} />);
          redirects.push(<Redirect key="channelsToGetStarted" exact from={Paths.channels}
                                   to={Paths.getStarted} />);
          redirects.push(<Redirect key="eventsToGetStarted" exact from={Paths.events}
                                   to={Paths.getStarted} />);
          redirects.push(<Redirect key="lendToGetStarted" exact from={Paths.lendAHand}
                                   to={Paths.getStarted} />);
          redirects.push(<Redirect key="myChumsToGetStarted" exact from={Paths.myChums}
                                   to={Paths.getStarted} />);
        } else {
          redirects.push(<Redirect key="getStartedToHome" exact from={Paths.getStarted}
                                   to={Paths.home} />);
        }
        redirects.push(<Redirect key="signInToRoot" exact from={Paths.signIn} to={Paths.root} />);
        redirects.push(<Redirect key="signUpToRoot" exact from={Paths.signUp} to={Paths.root} />);
      } else {
        redirects.push(<Redirect key="homeToRoot" exact from={Paths.home} to={Paths.root} />);
        redirects.push(<Redirect key="aboutMeToRoot" exact from={Paths.aboutMe}
                                 to={Paths.root} />);
        redirects.push(<Redirect key="channelsToRoot" exact from={Paths.channels}
                                 to={Paths.root} />);
        redirects.push(<Redirect key="eventsToRoot" exact from={Paths.events}
                                 to={Paths.root} />);
        redirects.push(<Redirect key="lendToRoot" exact from={Paths.lendAHand}
                                 to={Paths.root} />);
        redirects.push(<Redirect key="myChumsToRoot" exact from={Paths.myChums}
                                 to={Paths.root} />);
      }
    }

    return redirects;
  };

  if (userInfoLoaded) {
    return (
      <div className="App">
        <DebugRouter>
          <Switch>
            {getRedirects()}
            <Route exact path={Paths.root}>
              <Home userInfo={userInfo} />
            </Route>
            <Route exact path={Paths.signUp}>
              <SignUpPage />
            </Route>
            <Route exact path={Paths.signIn}>
              <SignInPage loginSetter={setLoggedInIndirect} />
            </Route>
            <Route exact path={Paths.getStarted}>
              <AboutYouPage gotStartedSetter={setGotStartedIndirect} userInfo={userInfo} />
            </Route>
            <Route exact path={Paths.home}>
              <UserHomePage userInfo={userInfo} logoutSetter={setLoggedOutIndirect} />
            </Route>
            <Route exact path={Paths.dev}>
              <DevSecPage />
            </Route>
            <Route path="/*">
              <Redirect to={Paths.root} />
            </Route>
          </Switch>
        </DebugRouter>
      </div>
    );
  } else {
    return <div className="app-loading">Loading...</div>
  }
}

export default App;
