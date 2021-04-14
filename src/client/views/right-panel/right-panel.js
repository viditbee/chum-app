import React from 'react';
import './right-panel.scss';
import UserList from './../widgets/user-list';
import EventList from "../widgets/event-list";

function RightPanel({ userInfo, resetFollowStaler, eventStaler, followStaler }) {

  return <div className="right-panel-container">
    <UserList resetFollowStaler={resetFollowStaler} loggedInUserInfo={userInfo} followStaler={followStaler} />
    <EventList userInfo={userInfo} eventStaler={eventStaler} />
  </div>;
}

RightPanel.propTypes = {};

RightPanel.defaultProps = {};

export default RightPanel;


