import React, { useState } from 'react';
import './list-items.scss';
import { followEvent } from "../../interface/interface";

function EventItem({ userInfo, eventInfo }) {
  const className = 'event-item-cont list-item-cont';
  const { id, label, from, to, followedBy } = eventInfo;

  const [isFollowing, setIsFollowing] = useState(followedBy.indexOf(userInfo.id) !== -1);

  const handleAttendClicked = async () => {
    const { status, response } = await followEvent(userInfo.id, id);
    if (status === "success") {
      setIsFollowing(response);
    }
  };

  const getAttendButton = () => {
    let className = "attend-button ";
    if (!isFollowing) {
      className += "not-attending ";
    } else {
      className += "attending ";
    }

    return <div className={className}>
      <div className="at-icon" onClick={() => {
        handleAttendClicked()
      }}/>
      <div className="attending-text">Attending ✓</div>
    </div>
  };

  const getScheduleString = () => {
    let sFrom = new Date(from).toLocaleDateString('en-UK', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, ' ');

    if (to) {
      sFrom += " to " + new Date(to).toLocaleDateString('en-UK', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).replace(/ /g, ' ');
    }
    return sFrom;
  };

  const getInfoView = () => {
    return <div className="list-item-info">
      {getScheduleString()}
      <span>{followedBy.length + " going"}</span>
    </div>;
  };

  return <div className={className}>
    <div className="list-item-image">{label[0] + label[1]}</div>
    <div className="list-item-text-section">
      <div className="list-item-title" title={label}>{label}</div>
      {getInfoView()}
    </div>
    {getAttendButton()}
  </div>;
}

EventItem.propTypes = {};

EventItem.defaultProps = {};

export default EventItem;
