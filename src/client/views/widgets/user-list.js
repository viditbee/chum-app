import React, { useEffect, useState } from 'react';
import './gen-widget.scss';
import './user-list.scss';
import { getInterestsList, getUsersToFollow } from "../../interface/interface";
import UserItem from "../list-items/user-item";

function UserList({ loggedInUserInfo, resetFollowStaler }) {

  const [userList, setUserList] = useState([]);
  // const [interestsMasterList, setInterestsMasterList] = useState([]);
  const [interestsLabelMap, setInterestsLabelMap] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { status: uSt, response: uRs} = await getUsersToFollow(loggedInUserInfo.id);
      const { status: iSt, response: iRs} = await getInterestsList();
      if(uSt === "success"){
        setUserList(uRs);
      }
      if (iSt === "success") {
        setLabelsMap(iRs);
        // setInterestsMasterList(iRs);
      }
    }

    loggedInUserInfo && fetchData();
  }, [loggedInUserInfo]);

  const setLabelsMap = (list) => {
    setInterestsLabelMap(list.reduce((acc, item) => ({ ...acc, [item.id]: item.label }), {}));
  };

  const getListView = () => {
    const listView = [];
    for(let i=0; i<userList.length; i+=1){
      const user = userList[i];
      listView.push(<UserItem resetFollowStaler={resetFollowStaler} key={user.userId} loggedInUserInfo={loggedInUserInfo} userInfo={user} interestLabels={interestsLabelMap} />)
    }

    return listView;
  };

  return <div className="user-list-to-follow-cont widget-cont">
    <div className="widget-header">Chums to follow</div>
    <div className="widget-body">{getListView()}</div>
  </div>;
}

UserList.propTypes = {};

UserList.defaultProps = {};

export default UserList;
