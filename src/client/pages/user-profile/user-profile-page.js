import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './user-profile-page.scss';
import FeedItem from "../../views/feed-item/feed-item";
import { getActivity } from "../../interface/interface";
import UserProfile from "../../views/user-profile/user-profile";

function UserProfilePage({ userInfo, userMasterData, channelMasterData, resetFollowStaler }) {

  const [feeds, setFeeds] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    async function fetchData() {
      let { status: bSt, response: bRs } = await getActivity(userId);

      if (bSt === "success") {
        setFeeds(bRs);
      }
      setDataLoaded(true);
    }
    setDataLoaded(false);
    userInfo && fetchData();
  }, [userInfo, userId]);

  const getFeedViews = () => {
    const feedViews = [];
    for (let i = 0; i < feeds.length; i += 1) {
      feedViews.push(<FeedItem
        showWherePosted={true}
        userInfo={userInfo}
        feedInfo={feeds[i]}
        channelLabels={channelMasterData.channelLabels}
        userLabels={userMasterData.userLabels}
      />)
    }

    if(!feedViews.length){
      feedViews.push(<div key="nothing-found" className="nothing-found"/>)
    }

    return <div className="feed-wrapper">{feedViews}</div>
  };

  return <div className="page-specific-view-cont">
    {(!dataLoaded) ? <div className="page-loading">Loading...</div> : null}
    <div className="gen-page-body">
      <UserProfile userId={userId} userInfo={userInfo} userMasterData={userMasterData} resetFollowStaler={resetFollowStaler} />
      <div className="up-feed-header">Timeline</div>
      {getFeedViews()}
    </div>
  </div>;
}

UserProfilePage.propTypes = {};

UserProfilePage.defaultProps = {};

export default UserProfilePage;

