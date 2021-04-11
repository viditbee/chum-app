import React, { useEffect, useState } from 'react';
import "./user-profile.scss";
import Locations from "./../../../facts/locations";
import Departments from "./../../../facts/departments";
import Languages from "./../../../facts/languages";
import {
  followUser,
  getFollowInfo,
  getInterestsList,
  getUserProfileInfo, unFollowUser
} from "../../interface/interface";
import Button from "../misc/button";

function UserProfile({ userInfo, userId, resetFollowStaler }) {

  const [dataLoaded, setDataLoaded] = useState(false);
  const [followInfo, setFollowInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [interestsLabelMap, setInterestsLabelMap] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let { status: fSt, response: fRs } = await getFollowInfo(userId);
      let { status: bSt, response: bRs } = await getUserProfileInfo(userId);

      if (fSt === "success") {
        setFollowInfo(fRs);
        if (fRs.followedBy && fRs.followedBy.length) {
          setIsFollowing(fRs.followedBy.indexOf(userInfo.id) !== -1)
        }
      }
      if (bSt === "success") {
        setProfileInfo(bRs);
      }
      setDataLoaded(true);
    }

    userId && fetchData();
  }, [userId]);

  useEffect(() => {
    async function getInfo() {
      const { status, response } = await getInterestsList();
      if (status === "success") {
        setLabelsMap(response);
      }
    }

    getInfo();
  }, []);

  const handleFollowClicked = async () => {
    if (!isFollowing) {
      const res = await followUser(userId, userInfo.id);
      if (res.status === "success") {
        setIsFollowing(true);
        resetFollowStaler();
      }
    }
  };

  const handleUnFollowClicked = async () => {
    if (isFollowing) {
      const res = await unFollowUser(userId, userInfo.id);
      if (res.status === "success") {
        setIsFollowing(false);
        resetFollowStaler();
      }
    }
  };

  const setLabelsMap = (list) => {
    setInterestsLabelMap(list.reduce((acc, item) => ({ ...acc, [item.id]: item.label }), {}));
  };

  const getIntLevelView = (id, level) => {
    return <div className="int-level-cont">
      <div className={"int-level-circle " + (0 < level ? "selected" : "")} />
      <div className={"int-level-circle " + (1 < level ? "selected" : "")} />
      <div className={"int-level-circle " + (2 < level ? "selected" : "")} />
      <div className={"int-level-circle " + (3 < level ? "selected" : "")} />
      <div className={"int-level-circle " + (4 < level ? "selected" : "")} />
    </div>
  };

  const getIntOTMView = (id, otm) => {
    return <div className={"int-otm-cont " + (otm ? "selected" : "")}>
      <div className="int-otm-circle" />
    </div>
  };

  const getSelectedInterests = (interests) => {
    const listViews = [];
    for (let i = 0; i < interests.length; i += 1) {
      let { id, level, otm } = interests[i];
      listViews.push(<div className="sel-int-item-cont">
        <div className="sel-int-label">{interestsLabelMap[id]}</div>
        {getIntLevelView(id, level)}
        {getIntOTMView(id, otm)}
      </div>);
    }

    return <div className="sel-int-cont">
      {interests.length ?
        <>
          <div className="sel-int-abt">Interests</div>
          <div className="sel-int-otm">OTM: Open to mentor</div>
          <div className="sel-int-header">
            <div className="sel-int-emp" />
            <div className="sel-int-amateur">Amateur</div>
            <div className="sel-int-pro">Pro</div>
            <div className="sel-int-otm">OTM</div>
          </div>
          < div className="sel-int-body">
            {listViews}
          </div>
        </> : null}
    </div>;
  };

  const getFollowButtonView = () => {
    const { firstName } = profileInfo;

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
  };

  if (dataLoaded) {
    const { firstName, lastName, location, languages, department, aboutYou, interests } = profileInfo;
    const { followedBy, followerOf } = followInfo;
    const { label: locationLabel } = Locations.find(itm => itm.id === location);
    const { label: deptLabel } = Departments.find(itm => itm.id === department);
    const languageLabels = Languages.reduce((acc, itm) => languages.indexOf(itm.id) !== -1 ? [...acc, itm.label] : acc, []);

    return <div className="user-profile-cont">
      {getFollowButtonView()}
      <div className="up-basic-section">
        <div className="up-image">{firstName[0] + lastName[0]}</div>
        <div className="up-info-cont">
          <div className="upi-name">{firstName + " " + lastName}</div>
          <div className="upi-other-cont">
            <div className="upi-other-left">
              <div className="upi-info-item location">
                <div className="upi-info-item-icon" />
                <div className="upi-info-item-text">{locationLabel}</div>
              </div>
              <div className="upi-info-item department">
                <div className="upi-info-item-icon" />
                <div className="upi-info-item-text">{deptLabel}</div>
              </div>
              <div className="upi-info-item language">
                <div className="upi-info-item-icon" />
                <div className="upi-info-item-text">{languageLabels.join(", ")}</div>
              </div>
            </div>
            <div className="upi-other-right">
              <div className="upi-info-item followed-by">
                <div className="upi-info-item-text">{followedBy.length + " Followers"}</div>
              </div>
              <div className="upi-info-item follower-of">
                <div className="upi-info-item-text">{followerOf.length + " Following"}</div>
              </div>
            </div>
          </div>
          <div className="about-you-cont">{aboutYou}</div>
        </div>
      </div>
      <div className="up-interests-section">{getSelectedInterests(interests)}</div>
    </div>;
  }

  return <div className="user-profile-cont">
    <div className="loading">Loading...</div>
  </div>;

}

UserProfile.propTypes = {};

UserProfile.defaultProps = {};

export default UserProfile;


