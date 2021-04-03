import React from 'react';
import './user-home-page.scss';
import LeftPanel from "../../views/left-panel/left-panel";

function UserHomePage({ userInfo, logoutSetter }) {

  return <div className="user-home-page gen-page">
    <LeftPanel userInfo={userInfo} logoutSetter={logoutSetter}/>
  </div>;
}

UserHomePage.propTypes = {};

UserHomePage.defaultProps = {};

export default UserHomePage;

