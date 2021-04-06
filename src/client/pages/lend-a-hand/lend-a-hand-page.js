import React, { useEffect, useState } from 'react';
import './lend-a-hand-page.scss';
import LeftPanel from "../../views/left-panel/left-panel";
import RightPanel from "../../views/right-panel/right-panel";
import AddAFeed from "../../views/add-a-feed/add-a-feed";
import FeedItem from "../../views/feed-item/feed-item";
import { getFeeds } from "../../interface/interface";
import DefChannels from "../../../facts/def-channels";

function LendAHandPage({ userInfo, logoutSetter, userMasterData, channelMasterData }) {

  const [feeds, setFeeds] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

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
        userInfo={userInfo}
        feedInfo={feeds[i]}
        channelLabels={channelMasterData.channelLabels}
        userLabels={userMasterData.userLabels}
      />)
    }

    return <div className="feed-wrapper">{feedViews}</div>
  };

  const getView = () => {
    return <div className="page-specific-view-cont">
      {(!dataLoaded || loading) ? <div className="page-loading">Loading...</div> : null}
      <div className="gen-page-header">Postings</div>
      <div className="gen-page-body">
        {dataLoaded ? <AddAFeed userInfo={userInfo} channel={{id: DefChannels.lend}} onFeedAdded={(feed) => {
          handleOnFeedAdded(feed)
        }} /> : null}
        {getFeedViews()}
      </div>
    </div>
  };

  return <div className="lend-a-hand-page gen-page">
    <LeftPanel userInfo={userInfo} logoutSetter={logoutSetter} />
    {getView()}
    <RightPanel userInfo={userInfo} />
  </div>;
}

LendAHandPage.propTypes = {};

LendAHandPage.defaultProps = {};

export default LendAHandPage;

