import React, { useEffect, useState } from 'react';
import './channels-page.scss';
import { getAllChannels } from "../../interface/interface";
import SearchChannel from "../../views/search-channel/search-channel";
import ChannelTile from "../../views/channel-tile/channel-tile";
import ChannelOpenPage from "./channel-open-page";

function ChannelsPage({ userInfo, channelMasterData, userMasterData, selectedChannelId, channelIdSetter, resetChannelFollowStaler }) {

  const [channels, setChannels] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchData() {
      if(!selectedChannelId){
        let { status: bSt, response: bRs } = await getAllChannels();

        if (bSt === "success") {
          setChannels(bRs);
        }
      }

      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, [selectedChannelId, userInfo]);

  const handleChannelAdded = (channel) => {
    setSearchText("");
    setChannels([channel, ...channels]);
    resetChannelFollowStaler();
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
          channelIdSetter={channelIdSetter}
          resetChannelFollowStaler={resetChannelFollowStaler}
        />)
      }
    }

    if(!channelTileViews.length){
      channelTileViews.push(<div key="nothing-found" className="nothing-found"/>)
    }

    return <div className="tile-wrapper">{channelTileViews}</div>
  };

  const handleSearchTextChanged = (text) => {
    setSearchText(text.toLocaleLowerCase());
  };

  const getView = () => {
    if(selectedChannelId){
      return <ChannelOpenPage channelId={selectedChannelId} userInfo={userInfo} channelMasterData={channelMasterData} userMasterData={userMasterData}/>
    } else {
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
  };

  return getView();
}

ChannelsPage.propTypes = {};

ChannelsPage.defaultProps = {};

export default ChannelsPage;
