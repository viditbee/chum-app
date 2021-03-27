import React from 'react';
import { Link } from 'react-router-dom';
import { getPixDim } from "../../utils/utils";

const pixDim = getPixDim();
const pixDimWMargin = pixDim + 4;

function RegisterNowButton({ loggedIn, userInfo }) {
  const topPos = pixDimWMargin * 24;
  const topPosSubLine = pixDimWMargin * 26;
  let view = null;
  const subLineView = <div className="register-now-subline" style={{top: topPosSubLine}}>Registration closes 19th March</div>;

  if (loggedIn) {
    const text = userInfo && userInfo.teamId ? "MY TEAM" : "REGISTER NOW";
    view = <Link to="/register">
      <div className="register-now-button button" style={{ top: topPos }}>{text}</div>
      {userInfo && userInfo.teamId ? null : subLineView}
    </Link>;
  } else {
    view = <Link to="/login">
      <div className="register-now-button button" style={{ top: topPos }}>SIGN IN • REGISTER NOW</div>
      {subLineView}
      </Link>;
  }
  return view;
}

RegisterNowButton.propTypes = {};

RegisterNowButton.defaultProps = {};

export default RegisterNowButton;


