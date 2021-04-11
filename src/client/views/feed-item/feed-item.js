import React, { useState, useEffect } from 'react';
import './feed-item.scss';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import DefChannels from '../../../facts/def-channels';
import { likeFeed } from "../../interface/interface";

TimeAgo.addDefaultLocale(en);

function FeedItem({ userInfo, feedInfo, channelLabels, userLabels, showWherePosted }) {

  const [liked, setLiked] = useState(false);
  const [likedByCount, setLikedByCount] = useState(feedInfo.likedBy ? feedInfo.likedBy.length : 0);
  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    if (feedInfo && feedInfo.likedBy) {
      if (feedInfo.likedBy.indexOf(userInfo.id) !== -1) {
        setLiked(true);
      }
    }
  }, [feedInfo]);

  const { id, channelId, createdOn, text } = feedInfo;

  const createdBy = feedInfo.createdBy;
  let headerText = userLabels && userLabels[createdBy];
  let headerSplit = headerText.split(" ");

  if (showWherePosted && channelId && channelId !== DefChannels.post) {
    if (channelId === DefChannels.lend) {
      headerText += " is lending a hand"
    } else {
      headerText += " has posted in " + (channelLabels ? channelLabels[channelId] : "");
    }
  }

  const handleLikeClicked = async () => {
    const { status, response } = await likeFeed(userInfo.id, id);
    if (status === "success") {
      setLiked(response);
      if (response) {
        setLikedByCount(likedByCount + 1);
      } else {
        setLikedByCount(likedByCount - 1);
      }
    }
  };

  return <div className="feed-item-cont">
    <div
      className="feed-item-image">{(headerSplit[0] || " ")[0].toLocaleUpperCase() + (headerSplit[1] || " ")[0].toLocaleUpperCase()}</div>
    <div className="feed-item-text-section">
      <div className="feed-item-title">{headerText}</div>
      <div className="feed-item-ts">{timeAgo.format(new Date(createdOn))}</div>
      <div className="feed-item-sub-item-cont">
        {text}
      </div>
      <div title={liked ? "Unlike" : "Like"} className={`feed-like-button ${liked ? "liked" : ""}`}
           onClick={() => {
             handleLikeClicked()
           }}>{likedByCount}</div>
    </div>
  </div>;
}

FeedItem.propTypes = {};

FeedItem.defaultProps = {
  channel: DefChannels.post
};

export default FeedItem;


