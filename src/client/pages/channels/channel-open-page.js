import React, { useEffect, useState } from 'react';
import './channel-open-page.scss';
import AddAFeed from "../../views/add-a-feed/add-a-feed";
import FeedItem from "../../views/feed-item/feed-item";
import { getFeeds } from "../../interface/interface";

function ChannelOpenPage({ userInfo, userMasterData, channelMasterData, channelId }) {

  const [feeds, setFeeds] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setDataLoaded(false);
      const userId = userInfo.id;
      let { status: bSt, response: bRs } = await getFeeds(userId, channelId);

      if (bSt === "success") {
        setFeeds(bRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, [channelId]);

  const handleOnFeedAdded = (feed) => {
    setFeeds([feed, ...feeds]);
  };

  const getFeedViews = () => {
    const feedViews = [];
    for (let i = 0; i < feeds.length; i += 1) {
      feedViews.push(<FeedItem
        userInfo={userInfo}
        feedInfo={feeds[i]}
        channelLabels={channelMasterData.channelLabels}
        userLabels={userMasterData.userLabels}
      />)
    }

    return <div className="feed-wrapper">{feedViews}</div>
  };

  return <div className="page-specific-view-cont channel-open-page">
    {(!dataLoaded) ? <div className="page-loading">Loading...</div> : null}
    <div className="gen-page-header">Channel: {channelMasterData.channelLabels[channelId]}</div>
    <div className="gen-page-body">
      {dataLoaded ? <AddAFeed userInfo={userInfo} channelId={channelId} onFeedAdded={(feed) => {
        handleOnFeedAdded(feed)
      }} /> : null}
      {getFeedViews()}
    </div>
  </div>;
}

ChannelOpenPage.propTypes = {};

ChannelOpenPage.defaultProps = {};

export default ChannelOpenPage;

