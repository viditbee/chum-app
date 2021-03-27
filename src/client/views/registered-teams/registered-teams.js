import React, { useEffect, useState } from 'react';
import './registered-teams.scss';
import { getAllTeams } from "../../interface/interface";
import { problemStatements } from "../../mock/mock-data-for-problems";

function RegisteredTeams() {

  const [teamInfo, setTeamsInfo] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const challengeMap = problemStatements.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

  useEffect(() => {
    async function getInfo() {
      const res = await getAllTeams();
      setTeamsInfo(res);
      setLoaded(true);
    }

    getInfo();
  }, []);

  const getTeamsView = () => {
    let views = null;
    if (teamInfo && teamInfo.length) {
      views = [];
      for (let i = 0; i < teamInfo.length; i += 1) {
        let { id, name, members, problemId } = teamInfo[i];
        let memberViews = [];
        let challenge = challengeMap[problemId];
        let challengeName = challenge ? challenge.label : "-";

        for (let j = 0; j < members.length; j += 1) {
          memberViews.push(<div key={j}
                                className="rt-sub-item">{`• ${members[j].firstName} ${members[j].lastName}`}</div>);
        }
        views.push(<div key={id} className="rt-item-container">
          <div
            className="rt-item-header">{(i + 1) + ". " + name + " (" + members.length + ")"}</div>
          <div className="rt-item-body">{memberViews}</div>
          <div className="rt-item-problem-id">- {challengeName}</div>
        </div>);
      }
    }
    return views;
  };

  return <div className="reg-teams-container">
    <div className="rt-header">Registered Teams {teamInfo ? "(" + teamInfo.length + ")" : ""}</div>
    {loaded ? getTeamsView() || <div className="rt-no-registrations">No registrations yet</div> :
      <div className="rt-no-registrations">Loading...</div>}
  </div>;
}

RegisteredTeams.propTypes = {};

RegisteredTeams.defaultProps = {};

export default RegisteredTeams;
