import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './side-button.scss';

function SideButtons({ userInfo }) {

  if(userInfo && userInfo.organiser){
    return <div className="side-button-container">
      <Link to="/secret-teams"><div className="side-button">Teams</div></Link>
      <Link to="/secret-feedback"><div className="side-button">Feedback</div></Link>
    </div>;
  }

  return null;
}

SideButtons.propTypes = {
  userInfo: PropTypes.object
};

SideButtons.defaultProps = {
  userInfo: null
};

export default SideButtons;


