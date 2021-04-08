import React, { useEffect, useState } from 'react';
import './events-page.scss';
import { getAllEvents } from "../../interface/interface";
import EventTile from "../../views/event-tile/event-tile";
import SearchEvent from "../../views/search-event/search-event";

function EventsPage({ userInfo, userMasterData }) {

  const [events, setEvents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchData() {
      let { status: bSt, response: bRs } = await getAllEvents();

      if (bSt === "success") {
        setEvents(bRs);
      }

      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, []);

  const handleEventAdded = (event) => {
    setSearchText("");
    setEvents([event, ...events]);
  };

  const getEventTiles = () => {
    const tileViews = [];
    for (let i = 0; i < events.length; i += 1) {
      let event = events[i];

      if (!searchText || event.label.toLocaleLowerCase().indexOf(searchText) !== -1) {
        tileViews.push(<EventTile
          key={event.id}
          eventInfo={events[i]}
          userInfo={userInfo}
          userLabels={userMasterData.userLabels}
        />)
      }
    }

    if(!tileViews.length){
      tileViews.push(<div key="nothing-found" className="nothing-found"/>)
    }

    return <div className="tile-wrapper">{tileViews}</div>
  };

  const handleSearchTextChanged = (text) => {
    setSearchText(text.toLocaleLowerCase());
  };

  const getView = () => {
    return <div className="page-specific-view-cont">
      {(!dataLoaded) ? <div className="page-loading">Loading...</div> : null}
      <div className="gen-page-header">Events</div>
      <div className="gen-page-body">
        {dataLoaded ? <SearchEvent onTextChanged={(txt) => {
          handleSearchTextChanged(txt)
        }} userInfo={userInfo} onEventAdded={(event) => {
          handleEventAdded(event)
        }} /> : null}
        {getEventTiles()}
      </div>
    </div>
  };

  return getView();
}

EventsPage.propTypes = {};

EventsPage.defaultProps = {};

export default EventsPage;
