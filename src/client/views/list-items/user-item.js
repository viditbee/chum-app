import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './list-items.scss';
import { followUser } from "../../interface/interface";

function UserItem({ loggedInUserInfo, userInfo, following, interestLabels }) {
  const className = 'user-item-cont list-item-cont';
  const { userId, firstName, lastName } = userInfo;

  const [isFollowing, setIsFollowing] = useState(following);

  const handleFollowClicked = async () => {
    if (!isFollowing) {
      const res = await followUser(userId, loggedInUserInfo.id);
      if (res.status === "success") {
        setIsFollowing(true);
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
      intViews.push(<div className="user-item-interest-cont">
        <div className="uii-wrap">
          <div className="uii-text">{label}</div>
          <div className="uii-level-bar" style={{ width: interest.level / .05 + "%" }} />
        </div>
        {otmView}
      </div>);
    }

    return intViews;
  };

  return <div className={className}>
    <div className="list-item-image">{(firstName[0] || "").toLocaleUpperCase()+(lastName[0] || "").toLocaleUpperCase()}</div>
    <div className="list-item-text-section">
      <div className="list-item-title">{firstName} {lastName}</div>
      <div className="list-item-sub-item-cont">
        {getInterestsView()}
      </div>
    </div>
    <div className={"uii-follow-button " + (isFollowing ? "following" : "")} title={isFollowing ? "Following" : "Follow"} onClick={() => {
      handleFollowClicked()
    }} />
  </div>;
}

UserItem.propTypes = {
  userInfo: PropTypes.object,
  interests: PropTypes.array,
  following: PropTypes.bool,
};

UserItem.defaultProps = {
  userInfo: {},
  interests: [],
  following: false,
};

export default UserItem;
