import React from 'react';
import PropTypes from 'prop-types';
import './right-panel.scss';
import UserList from './../widgets/user-list';

function RightPanel({ userInfo, resetFollowStaler }) {

  return <div className="right-panel-container">
    <UserList resetFollowStaler={resetFollowStaler} loggedInUserInfo={userInfo} />
  </div>;
}

RightPanel.propTypes = {};

RightPanel.defaultProps = {};

export default RightPanel;


