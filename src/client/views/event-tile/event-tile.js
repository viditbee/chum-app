import React, { useState, useEffect } from 'react';
import './event-tile.scss';
import { followEvent } from "../../interface/interface";

function EventTile({ userInfo, eventInfo, userLabels }) {

  const [followed, setFollowed] = useState(false);
  const [event, setEvent] = useState(eventInfo);

  useEffect(() => {
    if (eventInfo && eventInfo.followedBy) {
      if (eventInfo.followedBy.indexOf(userInfo.id) !== -1) {
        setFollowed(true);
      }
    }
    setEvent(eventInfo);
  }, [eventInfo, userInfo]);

  const { id, label, description, followedBy, from, to } = event;

  const handleFollowClicked = async (e) => {
    e.stopPropagation();
    const { status, response } = await followEvent(userInfo.id, id);
    if (status === "success") {
      setFollowed(response);
      if (response) {
        setEvent({ ...event, followedBy: [...event.followedBy, userInfo.id] });
      } else {
        let fb = [...event.followedBy];
        let index = fb.indexOf(userInfo.id);
        if (index !== -1) {
          fb.splice(index, 1);
          setEvent({ ...event, followedBy: fb });
        }
      }
    }
  };

  const getFollowedByText = () => {
    const labels = followedBy.map((it) => userLabels[it] || "");
    return labels.join("\n");
  };

  const getScheduleString = () => {
    let sFrom = new Date(from).toLocaleDateString('en-UK', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, ' ');

    if(to){
      sFrom += " to " + new Date(to).toLocaleDateString('en-UK', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).replace(/ /g, ' ');
    }
    return sFrom;
  };

  return <div className="event-tile-cont">
    <div className="event-tile-image" />
    <div className="event-tile-text-section">
      <div className="event-tile-title" title={label}>{label}</div>
      <div className="event-tile-schedule">{getScheduleString()}</div>
      <div className="event-tile-description">{description}</div>
      <div className="event-tile-followed-by"
           title={getFollowedByText()}>{followedBy.length + " going"}</div>
      <div className={`event-follow-button ${followed ? "followed" : ""}`} onClick={(e) => {
        handleFollowClicked(e)
      }}><span>{followed ? "Going ✓" : "Attend"}</span></div>
    </div>
  </div>;
}

EventTile.propTypes = {};

EventTile.defaultProps = {};

export default EventTile;


