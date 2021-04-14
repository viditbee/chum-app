import React, { useEffect, useState } from 'react';
import './user-home-page.scss';
import AddAFeed from "../../views/add-a-feed/add-a-feed";
import FeedItem from "../../views/feed-item/feed-item";
import { getFeeds } from "../../interface/interface";

function UserHomePage({ userInfo, userMasterData, channelMasterData, followStaler }) {

  const [feeds, setFeeds] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userId = userInfo.id;
      let { status: bSt, response: bRs } = await getFeeds(userId);

      if (bSt === "success") {
        setFeeds(bRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, [userInfo, followStaler]);

  const handleOnFeedAdded = (feed) => {
    setFeeds([feed, ...feeds]);
  };

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

    return <div className="feed-wrapper">{feedViews}</div>
  };

  return <div className="page-specific-view-cont">
    {(!dataLoaded) ? <div className="page-loading">Loading...</div> : null}
    <div className="gen-page-header">Feeds</div>
    <div className="gen-page-body">
      {dataLoaded ? <AddAFeed userInfo={userInfo} onFeedAdded={(feed) => {
        handleOnFeedAdded(feed)
      }} /> : null}
      {getFeedViews()}
    </div>
  </div>;
}

UserHomePage.propTypes = {};

UserHomePage.defaultProps = {};

export default UserHomePage;

