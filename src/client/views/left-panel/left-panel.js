import React, { useState, useEffect } from 'react';
import './left-panel.scss';
import { MenuItems } from './menu-items';
import { useLocation, Link } from 'react-router-dom';
import {
  getFollowInfo,
  getUserBasicInfo,
  getSubscribedChannels
} from './../../interface/interface';
import Paths from './../../../facts/paths';
import { manageSuccessfulLogout } from "../../utils/utils";

function LeftPanel({ userInfo, logoutSetter, channelIdSetter, followStaler }) {

  const selectedItemURL = useLocation().pathname;
  const [dataLoaded, setDataLoaded] = useState(false);
  const [followInfo, setFollowInfo] = useState(null);
  const [basicInfo, setBasicInfo] = useState({});
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const userId = userInfo.id;
      let { status: fSt, response: fRs } = await getFollowInfo(userId);
      let { status: bSt, response: bRs } = await getUserBasicInfo(userId);
      let { status: cSt, response: cRs } = await getSubscribedChannels(userId);

      if (fSt === "success") {
        setFollowInfo(fRs);
      }
      if (bSt === "success") {
        setBasicInfo(bRs);
      }
      if (cSt === "success") {
        setChannels(cRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, [userInfo]);

  useEffect(() => {
    async function fetchData() {
      const userId = userInfo.id;
      let { status: fSt, response: fRs } = await getFollowInfo(userId);

      if (fSt === "success") {
        setFollowInfo(fRs);
      }
      setDataLoaded(true);
    }

    userInfo && followInfo && fetchData();
  }, [followStaler]);

  const handleChannelItemClicked = (id) => {
    channelIdSetter(id);
  };

  const getUserProfileView = () => {
    const { firstName, lastName } = userInfo;
    const { followedBy, followerOf } = followInfo;
    const { interests } = basicInfo;

    return (<div className="user-profile-cont">
      <div className="user-profile-image" />
      <div className="user-name">{firstName + " " + lastName}</div>
      <div className="user-profile-stats">
        <div className="stat-item">
          <div className="stat-number">{interests.length}</div>
          <div className="stat-label">Interests</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{followedBy.length}</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{followerOf.length}</div>
          <div className="stat-label">Following</div>
        </div>
      </div>
    </div>);
  };

  const getChannelListView = () => {
    const channelItemViews = [];
    for (let i = 0; i < channels.length; i += 1) {
      let { id, label } = channels[i];
      channelItemViews.push(<Link to={Paths.channels}>
        <div key={id} onClick={() => {
        handleChannelItemClicked(id)
      }} className="channel-item">
        <div className="channel-item-icon"/>
        <div className="channel-item-label">{label}</div>
      </div>
      </Link>);
    }

    return <div className="channel-list-cont">{channelItemViews}</div>
  };

  const getMenuView = () => {
    const menuItemViews = [];
    for (let i = 0; i < MenuItems.length; i += 1) {
      const { id, label, className, path } = MenuItems[i];
      const isSelected = selectedItemURL === path;
      menuItemViews.push(<Link to={path} key={id}>
        <div key={id} onClick={() => channelIdSetter("")}
             className={`menu-item ${className} ${isSelected ? "selected" : ""}`}>
          <div className="mi-icon" />
          <div className="mi-label">{label}</div>
        </div>
      </Link>);
      if (id === "channels") {
        menuItemViews.push(<div key="channel-list"
                                className="channel-list">{getChannelListView()}</div>)
      }
    }

    return (<div className="lp-menu-cont">
      <div className="">{menuItemViews}</div>
    </div>);
  };

  const handleLogoutClicked = () => {
    manageSuccessfulLogout();
    logoutSetter();
  };

  const getSignOutView = () => {
    return <Link to={Paths.root}>
      <div className="sign-out-cont" onClick={() => {
        handleLogoutClicked()
      }}>
        <div className="so-icon" />
        <div className="so-label">Sign out</div>
      </div>
    </Link>
  };

  return <div className="left-panel-container">
    <div className="chum-logo" />
    {dataLoaded ? getUserProfileView() : <div className="loading">Loading...</div>}
    {getMenuView()}
    {getSignOutView()}
  </div>;
}

LeftPanel.propTypes = {};

LeftPanel.defaultProps = {};

export default LeftPanel;


