import React from 'react';
import { useHistory } from 'react-router-dom';
import './right-bar.scss';
import Button from "../misc/button";

function RightBar({ goLiveClicked }) {

  const history = useHistory();

  const handleBackClicked = () => {
    history.goBack();
  };

  return <div className="right-bar-cont">
    <div className="back-button" onClick={() => {handleBackClicked()}} />
    <Button className="go-live" text="GoLive" onClick={() => {
      goLiveClicked()
    }} />
  </div>;
}

RightBar.propTypes = {};

RightBar.defaultProps = {};

export default RightBar;


