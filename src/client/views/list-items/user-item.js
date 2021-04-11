import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './list-items.scss';
import { followUser, unFollowUser } from "../../interface/interface";
import URLs from "../../../facts/paths";
import Button from "../misc/button";

function UserItem({ resetFollowStaler, loggedInUserInfo, userInfo, following, interestLabels, showBig }) {
  const className = 'user-item-cont list-item-cont';
  const { userId, firstName, lastName } = userInfo;

  const [isFollowing, setIsFollowing] = useState(following);

  const handleFollowClicked = async () => {
    if (!isFollowing) {
      const res = await followUser(userId, loggedInUserInfo.id);
      if (res.status === "success") {
        setIsFollowing(true);
        resetFollowStaler();
      }
    }
  };

  const handleUnFollowClicked = async () => {
    if (isFollowing) {
      const res = await unFollowUser(userId, loggedInUserInfo.id);
      if (res.status === "success") {
        setIsFollowing(false);
        resetFollowStaler();
      }
    }
  };

  const getInterestsView = () => {
    const intViews = [];
    const interests = userInfo.interests;

    for (let i = 0; i < interests.length; i += 1) {
      const interest = interests[i];
      const label = interestLabels[interest.id] || interest.id;
      const otmView = interest.otm ? <div className="otm-icon" /> : null;
      intViews.push(<div key={interest.id} className="user-item-interest-cont">
        <div className="uii-wrap">
          <div className="uii-text">{label}</div>
          <div className="uii-level-bar" style={{ width: interest.level / .05 + "%" }} />
        </div>
        {otmView}
      </div>);
    }

    return intViews;
  };

  const getFollowButton = () => {
    if(!showBig){
      return  <div className={"uii-follow-button " + (isFollowing ? "following" : "")}
                   title={isFollowing ? "Following" : "Follow"} onClick={() => {
        handleFollowClicked()
      }} />
    } else {
      if (!isFollowing) {
        return <div className="follow-button not-following">
          <Button text={"Follow " + firstName} onClick={() => {handleFollowClicked()}}/>
        </div>;
      } else {
        return <div className="follow-button following">
          <Button text={"Unfollow " + firstName} onClick={() => {handleUnFollowClicked()}}/>
          <div className="following-text">Following ✓</div>
        </div>
      }
    }
  };

  return <div className={className}>
    <Link to={URLs.aboutChum + "/" + userId}>
      <div
        className="list-item-image">{(firstName[0] || "").toLocaleUpperCase() + (lastName[0] || "").toLocaleUpperCase()}</div>
      <div className="list-item-text-section">
        <div className="list-item-title" title={`${firstName} ${lastName}`}>{firstName} {lastName}</div>
        <div className="list-item-sub-item-cont">
          {getInterestsView()}
        </div>
      </div>
    </Link>
    {getFollowButton()}
  </div>;
}

UserItem.propTypes = {};

UserItem.defaultProps = {
  userInfo: {},
};

export default UserItem;
