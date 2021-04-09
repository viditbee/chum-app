import React from 'react';
import './right-bar.scss';
import Button from "../misc/button";

function RightBar({ goLiveClicked }) {

  return <div className="right-bar-cont">
    <Button text="GoLive" onClick={() => {
      goLiveClicked()
    }} />
  </div>;
}

RightBar.propTypes = {};

RightBar.defaultProps = {};

export default RightBar;


