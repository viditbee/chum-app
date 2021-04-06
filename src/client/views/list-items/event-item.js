import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './list-items.scss';
import { } from "../../interface/interface";

function UserItem({ eventInfo, peopleGoing }) {
  const className = 'event-item-cont list-item-cont';
  const { id, label, date } = eventInfo;

  const [isFollowing, setIsFollowing] = useState(following);

  const handleFollowClicked = async () => {
    if (!isFollowing) {
      const res = await followUser(id, loggedInUserInfo.id);
      if(res.status === "success"){
        setIsFollowing(true);
      }
    }
  };

  const getInfoView = () => {
    return <div className="">

    </div>;
  };

  return <div className={className}>
    <div className="list-item-image" />
    <div className="list-item-text-section">
      <div className="list-item-title">{label}</div>
      {getInfoView()}
    </div>
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
