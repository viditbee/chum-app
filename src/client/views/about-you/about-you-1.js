import React, { useState, useEffect } from 'react';
import './about-you.scss';
import Languages from "../../../facts/languages";
import Locations from "../../../facts/locations";
import Departments from "../../../facts/departments";

function AboutYouOne({ defLocation, defDepartment, defLanguages, defAboutYou, validityChanged, dataChanged }) {

  const [location, setLocation] = useState(defLocation);
  const [department, setDepartment] = useState(defDepartment);
  const [languages, setLanguages] = useState(defLanguages);
  const [aboutYou, setAboutYou] = useState(defAboutYou);

  useEffect(() => {
    validityChanged(location && department && languages.length && aboutYou);
  }, [location, department, languages, aboutYou, validityChanged]);

  const locationChanged = (event) => {
    const val = event.target.value;
    dataChanged('location', val);
    setLocation(val);
  };

  const departmentChanged = (event) => {
    const val = event.target.value;
    dataChanged('department', val);
    setDepartment(val);
  };

  const aboutYouChanged = (event) => {
    const val = event.target.value;
    dataChanged('aboutYou', val);
    setAboutYou(val);
  };

  const languageAdded = (id) => {
    if (id) {
      const val = [...languages, id];
      dataChanged('languages', val);
      setLanguages(val);
    }
  };

  const languageChanged = (from, to) => {
    const index = languages.indexOf(from);
    let res = [];
    if (to) {
      res = [...languages];
      res.splice(index, 1, to);
    } else {
      res = languages.filter(empId => empId !== from);
    }
    dataChanged('languages', res);
    setLanguages(res);
  };

  const languageDropdownChanged = (e, prevValue) => {
    const empId = e.target.value;
    if (!prevValue) {
      languageAdded(empId);
    } else {
      languageChanged(prevValue, empId);
    }
  };

  const getLanguageDropdown = (selectedId, key) => {
    const options = [<option key="empty" value="">-</option>];
    for (let i = 0; i < Languages.length; i += 1) {
      let { id, label } = Languages[i];
      if (languages.indexOf(id) === -1 || id === selectedId) {
        options.push(<option key={id} value={id}>{label}</option>)
      }
    }

    return <select key={key} onChange={(e) => languageDropdownChanged(e, selectedId)}
                   value={selectedId}>{options}</select>
  };

  const getLanguagesView = () => {
    const views = [];

    for (let i = 0; i < languages.length; i += 1) {
      views.push(<div key={i} className="field-input">{getLanguageDropdown(languages[i], i)}</div>);
    }
    views.push(<div key="empty" className="field-input">{getLanguageDropdown("")}</div>);

    return <div className="team-list">{views}</div>;
  };


  const getLocationView = () => {
    const options = [<option key="empty" value="">-</option>];
    for (let i = 0; i < Locations.length; i += 1) {
      let { id, label } = Locations[i];
      options.push(<option key={id} value={id}>{label}</option>)
    }

    return <select onChange={(e) => locationChanged(e)}
                   value={location}>{options}</select>
  };


  const getDepartmentView = () => {
    const options = [<option key="empty" value="">-</option>];
    for (let i = 0; i < Departments.length; i += 1) {
      let { id, label } = Departments[i];
      options.push(<option key={id} value={id}>{label}</option>)
    }

    return <select onChange={(e) => departmentChanged(e)}
                   value={department}>{options}</select>
  };


  return <div className="about-you-one-cont about-you-cont">
    <div className="field-cont">
      <div className="field-label">Location</div>
      <div className="field-input">
        {getLocationView()}
      </div>
    </div>
    <div className="field-cont">
      <div className="field-label">Function</div>
      <div className="field-input">
        {getDepartmentView()}
      </div>
    </div>
    <div className="field-cont">
      <div className="field-label">Languages you know</div>
      <div className="field-input">
        {getLanguagesView()}
      </div>
    </div>
    <div className="field-cont">
      <div className="field-label">About you</div>
      <div className="field-input">
        <textarea value={aboutYou} autoComplete="chrome-off"
                  onChange={(e) => aboutYouChanged(e)} />
      </div>
    </div>
  </div>;
}

AboutYouOne.propTypes = {};

AboutYouOne.defaultProps = { defLocation: "", defDepartment: "", defLanguages: [], defAboutYou: "" };

export default AboutYouOne;

