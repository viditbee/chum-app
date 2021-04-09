import React from 'react';
import './go-live.scss';

function UserMiniList({ list }) {

  const getListView = () => {
    const itemViews = [];

    for (let i = 0; i < list.length; i += 1) {
      let { firstName, lastName, id } = list[i];
      itemViews.push(<div key={id} className="uml-item-cont">
        <div className="item-image">{firstName[0] + lastName[0]}</div>
        <div className="item-text">{firstName + " " + lastName}</div>
      </div>)
    }

    if(!itemViews.length){
      itemViews.push(<div key="no-ol-ch" className="nothing-found">No chum is online right now :(</div>);
    }

    return <div className="uml-list-cont">
      {itemViews}
    </div>
  };

  return <div className="user-mini-list-cont">
    <div className="uml-header">Online Chums</div>
    {getListView()}
  </div>;
}

UserMiniList.propTypes = {};

UserMiniList.defaultProps = {};

export default UserMiniList;


