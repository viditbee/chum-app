import React, { useEffect, useState } from 'react';
import './gen-widget.scss';
import './user-list.scss';
import { getUpcomingEvents } from "../../interface/interface";
import EventItem from "../list-items/event-item";

function EventList({ userInfo }) {

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { status: uSt, response: uRs} = await getUpcomingEvents();
      if(uSt === "success"){
        setEventList(uRs);
      }
    }

    userInfo && fetchData();
  }, [userInfo]);

  const getListView = () => {
    const listView = [];
    for(let i=0; i<eventList.length; i+=1){
      const event = eventList[i];
      listView.push(<EventItem key={event.id} userInfo={userInfo} eventInfo={event} />)
    }

    return listView;
  };

  return <div className="user-list-to-follow-cont widget-cont">
    <div className="widget-header">Upcoming Events</div>
    <div className="widget-body">{getListView()}</div>
  </div>;
}

EventList.propTypes = {};

EventList.defaultProps = {};

export default EventList;
