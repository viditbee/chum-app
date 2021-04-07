import React, { useEffect, useState } from 'react';
import './channels-page.scss';
import { getAllChannels } from "../../interface/interface";
import SearchChannel from "../../views/search-channel/search-channel";
import ChannelTile from "../../views/channel-tile/channel-tile";

function ChannelsPage({ userInfo, logoutSetter, userMasterData, selectedChannelId }) {

  const [channels, setChannels] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchData() {
      let { status: bSt, response: bRs } = await getAllChannels();

      if (bSt === "success") {
        setChannels(bRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, []);

  const handleChannelAdded = (channel) => {
    setSearchText("");
    setChannels([channel, ...channels]);
  };

  const getChannelTiles = () => {
    const channelTileViews = [];
    for (let i = 0; i < channels.length; i += 1) {
      let channel = channels[i];

      if (!searchText || channel.label.toLocaleLowerCase().indexOf(searchText) !== -1) {
        channelTileViews.push(<ChannelTile
          key={channel.id}
          userInfo={userInfo}
          channelInfo={channels[i]}
          userLabels={userMasterData.userLabels}
        />)
      }
    }

    return <div className="tile-wrapper">{channelTileViews}</div>
  };

  const handleSearchTextChanged = (text) => {
    setSearchText(text.toLocaleLowerCase());
  };

  return <div className="page-specific-view-cont">
    {(!dataLoaded) ? <div className="page-loading">Loading...</div> : null}
    <div className="gen-page-header">Channels</div>
    <div className="gen-page-body">
      {dataLoaded ? <SearchChannel onTextChanged={(txt) => {
        handleSearchTextChanged(txt)
      }} userInfo={userInfo} onChannelAdded={(channel) => {
        handleChannelAdded(channel)
      }} /> : null}
      {getChannelTiles()}
    </div>
  </div>
}

ChannelsPage.propTypes = {};

ChannelsPage.defaultProps = {};

export default ChannelsPage;


//'id', 'label', 'description', 'createdBy', 'createdOn', 'followedBy'
