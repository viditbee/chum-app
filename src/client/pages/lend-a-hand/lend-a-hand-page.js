import React, { useEffect, useState } from 'react';
import './lend-a-hand-page.scss';
import AddAFeed from "../../views/add-a-feed/add-a-feed";
import FeedItem from "../../views/feed-item/feed-item";
import { getFeeds } from "../../interface/interface";
import DefChannels from "../../../facts/def-channels";

function LendAHandPage({ userInfo, userMasterData, channelMasterData }) {

  const [feeds, setFeeds] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userId = userInfo.id;
      let { status: bSt, response: bRs } = await getFeeds(userId, DefChannels.lend);

      if (bSt === "success") {
        setFeeds(bRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, []);

  const handleOnFeedAdded = (feed) => {
    setFeeds([feed, ...feeds]);
  };

  const getFeedViews = () => {
    const feedViews = [];
    for (let i = 0; i < feeds.length; i += 1) {
      feedViews.push(<FeedItem
        key={feeds[i].id}
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
    <div className="gen-page-header">Postings</div>
    <div className="gen-page-body">
      {dataLoaded ?
        <AddAFeed placeholder="Want help or want to help? This is the right place :)" userInfo={userInfo} channelId={DefChannels.lend} onFeedAdded={(feed) => {
          handleOnFeedAdded(feed)
        }} /> : null}
      {getFeedViews()}
    </div>
  </div>;
}

LendAHandPage.propTypes = {};

LendAHandPage.defaultProps = {};

export default LendAHandPage;

