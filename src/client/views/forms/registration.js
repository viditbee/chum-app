import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import { useLoading, Audio } from '@agney/react-loading';
import './form-styles.scss';
import Button from "../misc/button";
import { problemStatements } from "../../mock/mock-data-for-problems";
import {
  getAllAvailableEmployees,
  requestRegisterTeam,
  getRegisteredTeam
} from "../../interface/interface";

function RegistrationForm({ userInfo, teamIdSetter }) {

  const [teamName, setTeamName] = useState("");
  const [problemId, setProblemId] = useState("");
  const [availableEmps, setAvailableEmps] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [error, setError] = useState("");
  const [teamInfo, setTeamInfo] = useState(null);
  const [congratulations, setCongratulations] = useState(false);
  const [teamInfoLoaded, setTeamInfoLoaded] = useState(false);
  const challengeMap = problemStatements.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

  useEffect(() => {
    async function getEmps() {
      const res = await getAllAvailableEmployees();
      setAvailableEmps(res);
    }

    getEmps();
  }, []);

  useEffect(() => {
    async function getTeam() {
      const res = await getRegisteredTeam(userInfo.id);
      if (res && res.status === "yay") {
        setTeamInfo(res.teamInfo);
      }
      setTeamInfoLoaded(true);
    }

    userInfo && getTeam();
  }, [userInfo]);

  const registerTeam = async () => {
    const { status, alreadyAssignedUsers, teamInfo } = await requestRegisterTeam(userInfo.id, selectedTeamMembers, teamName, problemId);

    if (status === "yay") {
      setError("");
      setTeamInfo(teamInfo);
      setCongratulations(true);
      teamIdSetter(teamInfo.id)
    } else if (status === "nay") {
      setError("You are already a part of some other team!");
    } else if (status === "alreadyassigned") {
      const str = alreadyAssignedUsers.reduce((acc, user) => (acc + (acc ? ", " : "") + user.firstName), "");
      setError("Looks like some of your team-mates have already teamed up with others. Here they" +
        " are: " + str);
    } else if (status === "noteam") {
      setError("Are you sure your team consists of at-least 2 members?");
    } else {
      setError("Oops! Looks like you have found a bug, or this edge case is not" +
        " handled. :(");
    }
  };

  const teamNameChanged = (event) => {
    setTeamName(event.target.value);
  };

  const problemChanged = (event) => {
    setProblemId(event.target.value);
  };

  const teamMemberAdded = (id) => {
    if (id) {
      setSelectedTeamMembers([...selectedTeamMembers, id]);
    }
  };

  const teamMemberRemoved = (id) => {
    const res = selectedTeamMembers.filter(empId => empId !== id);
    setSelectedTeamMembers(res);
  };

  const teamMemberChanged = (from, to) => {
    const index = selectedTeamMembers.indexOf(from);
    let res = [];
    if (to) {
      res = [...selectedTeamMembers];
      res.splice(index, 1, to);
    } else {
      res = selectedTeamMembers.filter(empId => empId !== from);
    }
    setSelectedTeamMembers(res);
  };

  const userDropdownChanged = (e, prevValue) => {
    const empId = e.target.value;
    if (!prevValue) {
      teamMemberAdded(empId);
    } else {
      teamMemberChanged(prevValue, empId);
    }
  };

  const getUserDropdown = (selectedId, key) => {
    const options = [<option key="empty" value="">-</option>];
    for (let i = 0; i < availableEmps.length; i += 1) {
      let { id, firstName, lastName } = availableEmps[i];
      if (id !== userInfo.id && (selectedTeamMembers.indexOf(id) === -1 || id === selectedId)) {
        options.push(<option key={id} value={id}>{`${firstName} ${lastName}`}</option>)
      }
    }

    return <select key={key} onChange={(e) => userDropdownChanged(e, selectedId)}
                   value={selectedId}>{options}</select>
  };

  const getTeamListView = () => {
    const views = [];

    for (let i = 0; i < selectedTeamMembers.length; i += 1) {
      views.push(<div className="field-input">{getUserDropdown(selectedTeamMembers[i], i)}</div>);
    }
    if (selectedTeamMembers.length < 6) {
      views.push(<div className="field-input">{getUserDropdown("")}</div>);
    }

    return <div className="team-list">{views}</div>;
  };

  const getView = () => {
    if (!teamInfoLoaded) {
      return <div className="team-info-cont form-cont">
        <div className="loading">Loading...</div>
      </div>;
    }
    if (teamInfo) {
      const greeting = congratulations ? "Congratulations" : "Hi";
      return (<div className="team-builder-wrapper">
          <div className="team-info-cont form-cont">
            <div className="greeting">{`${greeting} ${userInfo.firstName}!`}</div>
            <div className="header">
              <span>You are a proud member of the team </span>
              <span className="team-label">{teamInfo.label}</span>
            </div>
            <div className="team-members">{
              teamInfo.team.map((user, i) => <div
                className="team-member">{`• ${user.firstName} ${user.lastName}`}</div>)
            }</div>
            <div className="team-challenge">Challenge
              - {challengeMap[teamInfo.problemId].label}</div>
            <div className="team-help">For any assistance, feel free to contact us on
              hackathon@contentserv.com <br />
              Wish you the best! 👍
            </div>
          </div>
        </div>
      )
    } else {
      return (<div className="team-builder-wrapper">
        <div className="form-cont login">
          <div className="form-header">Register your team</div>
          <div className="field-cont">
            <div className="field-label">Give your team a catchy name</div>
            <div className="field-input">
              <input value={teamName} autoComplete="off" type="text"
                     onChange={(e) => teamNameChanged(e)} />
            </div>
          </div>
          <div className="field-cont">
            <div className="field-label">Select your challenge</div>
            <div className="field-input">
              <select value={problemId} onChange={(e) => problemChanged(e)}>
                <option key="empty" value="">-</option>
                {problemStatements.map(({ id, label }) => <option value={id}>{label}</option>)}
              </select>
            </div>
            <Link to="/challenges">
              <div className="field-help">Need help selecting the challenge?</div>
            </Link>
            <div className="you-may-change">You may change the selection afterwards</div>
          </div>
          <div className="field-cont">
            <div className="field-label">Select your team</div>
            {getTeamListView()}
          </div>
          {teamName && problemId && selectedTeamMembers.length ?
            <Button className="enter-now-button" text="REGISTER" onClick={() => {
              registerTeam()
            }} /> : null}
          <div className="error-box">{error}</div>
        </div>
      </div>)
    }
  };

  return getView();
}

RegistrationForm.propTypes = {};

RegistrationForm.defaultProps = {};

export default RegistrationForm;

