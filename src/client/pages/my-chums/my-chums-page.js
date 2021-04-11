import React, { useEffect, useState } from 'react';
import './my-chums-page.scss';
import {
  getInterestsList,
  getUserBasicInfo,
  getUsersWithBasicInfo
} from "../../interface/interface";
import UserItem from "../../views/list-items/user-item";
import RCFlowGraph from "./../../views/rc-flow-graph/rc-flow-graph";

const POSITION = { x: 0, y: 0 };
const EDGE_TYPE = 'default';
const CONNECTABLE = false;
const ANIMATED = true;

function MyChumsPage({ userInfo, resetFollowStaler }) {

  const [userList, setUserList] = useState([]);
  const [interestsLabelMap, setInterestsLabelMap] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { status: uSt, response: uRs } = await getUsersWithBasicInfo(userInfo.id);
      const { status: bSt, response: bRs } = await getUserBasicInfo(userInfo.id);
      const { status: iSt, response: iRs } = await getInterestsList();
      if (uSt === "success") {
        setUserList(uRs.filter((item) => item.userId !== userInfo.id).sort((a, b) => a.firstName > b.firstName ? 1 : -1));
      }
      if (iSt === "success") {
        setLabelsMap(iRs);
      }
      if (bSt === "success") {
        setUserBasicInfo(bRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, [userInfo]);

  const setLabelsMap = (list) => {
    setInterestsLabelMap(list.reduce((acc, item) => ({ ...acc, [item.id]: item.label }), {}));
  };

  const getListView = () => {
    const listView = [];
    for (let i = 0; i < userList.length; i += 1) {
      const user = userList[i];
      listView.push(<UserItem resetFollowStaler={resetFollowStaler}
                              key={user.userId}
                              loggedInUserInfo={userInfo}
                              userInfo={user}
                              following={user.following}
                              showBig={true}
                              interestLabels={interestsLabelMap} />)
    }

    return listView;
  };

  const prepareDataForMap = () => {
    const elements = [{
      id: userInfo.id,
      type: 'input',
      data: { label: userInfo.firstName + " " + userInfo.lastName },
      position: POSITION,
      connectable: CONNECTABLE,
      className: "mcp-g-self"
    }];
    const loggedUserInterests = userBasicInfo.interests.reduce((acc, it) => [...acc, it.id], []);
    const addedInterests = [];

    for (let i = 0; i < userList.length; i += 1) {
      const { userId, firstName, lastName, interests } = userList[i];
      let userNodeAdded = false;

      for (let j = 0; j < interests.length; j += 1) {
        let { id } = interests[j];
        if (loggedUserInterests.indexOf(id) !== -1) {
          addedInterests.push(id);

          if(!userNodeAdded) {
            elements.push({
              id: userId,
              data: { label: firstName + " " + lastName },
              type: 'output',
              position: POSITION,
              connectable: CONNECTABLE,
              className: "mcp-g-users"
            });
            userNodeAdded = true;
          }

          elements.push({
            id: id + "_" + userId,
            source: id,
            target: userId,
            type: EDGE_TYPE,
            animated: ANIMATED
          })
        }
      }
    }

    for (let q = 0; q < addedInterests.length; q += 1) {
      let id = addedInterests[q];
      elements.push({
        id: id,
        data: { label: interestsLabelMap[id] },
        position: POSITION,
        connectable: CONNECTABLE,
        className: "mcp-g-interest"
      });

      elements.push({
        id: userInfo.id + "_" + id,
        source: userInfo.id,
        target: id,
        type: EDGE_TYPE,
        animated: ANIMATED
      })
    }

    return elements;
  };

  const getMapView = () => {
    const data = prepareDataForMap();
    return <RCFlowGraph initialElements={data} />
  };

  const getView = () => {
    if (viewMode === "list") {
      return getListView();
    } else {
      return getMapView();
    }
  };

  return <div className="page-specific-view-cont my-chums-page">
    {(!dataLoaded) ? <div className="page-loading">Loading...</div> : null}
    <div className="gen-page-header">Your Chums
      <div className={"list-opt " + (viewMode === "list" ? "selected" : "")}
           onClick={() => setViewMode("list")}>List</div>
      <div className={"map-opt " + (viewMode !== "list" ? "selected" : "")}
           onClick={() => setViewMode("map")}>Map
      </div>
    </div>
    <div className="gen-page-body">
      {getView()}
    </div>
  </div>;
}

MyChumsPage.propTypes = {};

MyChumsPage.defaultProps = {};

export default MyChumsPage;

