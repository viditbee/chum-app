import React from 'react';
import './go-live.scss';

function RoomList({ list, roomUserMap, onJoinClicked, onRoomCreateRequest, joinedRoom }) {

  const getListView = () => {
    const itemViews = [];

    for (let i = 0; i < list.length; i += 1) {
      let { label, id } = list[i];
      let joinView = joinedRoom === id ? <div className="item-joined" /> :
        <div className="item-join" onClick={() => onJoinClicked(id)} />;
        let usersTitle = (roomUserMap[id] || []).join("\n");

          itemViews.push(<div key={id} className="rl-item-cont">
        <div className="item-image">{label[0] + (label[1] || "")}</div>
        <div className="item-text">{label}</div>
        <div className="item-cnt" title={usersTitle}>{roomUserMap[id] ? roomUserMap[id].length : 0}</div>
        {joinView}
      </div>)
    }

    if (!itemViews.length) {
      itemViews.push(<div key="no-ol-rm" className="nothing-found">No live rooms found. You may
        create your own.</div>);
    }

    return <div className="rl-list-cont">
      {itemViews}
    </div>
  };

  return <div className="room-list-cont">
    <div className="rl-add" onClick={() => {
      onRoomCreateRequest()
    }} />
    <div className="rl-header">Live Rooms</div>
    {getListView()}
  </div>;
}

RoomList.propTypes = {};

RoomList.defaultProps = {};

export default RoomList;


