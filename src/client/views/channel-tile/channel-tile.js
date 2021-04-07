import React, { useState, useEffect } from 'react';
import './channel-tile.scss';
import { followChannel } from "../../interface/interface";

function ChannelTile({ userInfo, channelInfo, userLabels }) {

  const [followed, setFollowed] = useState(false);
  const [channel, setChannel] = useState(channelInfo);

  useEffect(() => {
    if (channelInfo && channelInfo.followedBy) {
      if (channelInfo.followedBy.indexOf(userInfo.id) !== -1) {
        setFollowed(true);
      }
    }
    setChannel(channelInfo);
  }, [channelInfo]);

  const { id, label, createdBy, createdOn, description, followedBy } = channel;

  const handleFollowClicked = async () => {
    const { status, response } = await followChannel(userInfo.id, id);
    if (status === "success") {
      setFollowed(response);
      if (response) {
        setChannel({ ...channel, followedBy: [...channel.followedBy, userInfo.id] });
      } else {
        let fb = [...channel.followedBy];
        let index = fb.indexOf(userInfo.id);
        if (index !== -1) {
          fb.splice(index, 1);
          setChannel({ ...channel, followedBy: fb });
        }
      }
    }
  };

  const getFollowedByText = () => {
    const labels = followedBy.map((it) => userLabels[it] || "");
    return labels.join("&#013;");
  };

  return <div className="channel-tile-cont">
    <div className="channel-tile-image" />
    <div className="channel-tile-text-section">
      <div className="channel-tile-title" title={label}>{label}</div>
      <div className="channel-tile-description">{description}</div>
      <div className="channel-tile-followed-by"
           title={getFollowedByText()}>{followedBy.length + " subscriber(s)"}</div>
      <div className={`channel-follow-button ${followed ? "followed" : ""}`} onClick={() => {
        handleFollowClicked()
      }}><span>{followed ? "Subscribed ✓" : "Subscribe"}</span></div>
    </div>
  </div>;
}

ChannelTile.propTypes = {};

ChannelTile.defaultProps = {};

export default ChannelTile;


