import React, { useState, useEffect } from 'react';
import './about-you.scss';
import { getInterestsList, addNewInterest } from "../../interface/interface";

function AboutYouTwo({ defInterests }) {

  const [interests, setInterests] = useState(defInterests);
  const [interestsMasterList, setInterestsMasterList] = useState([]);
  const [interestsLabelMap, setInterestsLabelMap] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function getInfo() {
      const { status, response } = await getInterestsList();
      if (status === "success") {
        setLabelsMap(response);
        setInterestsMasterList(response);
      }
      setDataLoaded(true);
    }

    getInfo();
  }, []);

  const setLabelsMap = (list) => {
    setInterestsLabelMap(list.reduce((acc, item) => ({ ...acc, [item.id]: item.label }), {}));
  };

  const handleSearchTextChanged = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddTextClicked = async () => {
    const { status, response } = await addNewInterest(searchText);
    if (status === "success") {
      setInterestsLabelMap({ ...interestsLabelMap, [response.id]: response.label });
      setInterestsMasterList([response, ...interestsMasterList]);
      handleInterestClicked(response.id);
    } else if (status === "duplicate") {
      handleInterestClicked(response.id);
    }
  };

  const handleInterestClicked = (id) => {
    setInterests([{ id, level: 3, otm: false }, ...interests]);
  };

  const handleInterestLevelClicked = (id, level) => {
    const intDup = [...interests];
    for (let i = 0; i < intDup.length; i += 1) {
      if (intDup[i].id === id) {
        intDup[i].level = level;
        break;
      }
    }
    setInterests(intDup);
  };

  const handleInterestOTMToggled = (id) => {
    const intDup = [...interests];
    for (let i = 0; i < intDup.length; i += 1) {
      if (intDup[i].id === id) {
        intDup[i].otm = !intDup[i].otm;
        break;
      }
    }
    setInterests(intDup);
  };

  const isInterestSelected = (id) => {
    let selected = false;
    for (let i = 0; i < interests.length; i += 1) {
      if (interests[i].id === id) {
        selected = true;
        break;
      }
    }
    return selected;
  };

  const getInterestCapules = () => {
    const caps = interestsMasterList.map((int) => {
      const classNm = "interest-capsule " + (isInterestSelected(int.id) ? "selected " : "");
      return <div className={classNm}>{int.label}</div>
    });

    return <div className="interest-caps-cont">{caps}</div>
  };

  const getIntLevelView = (id, level) => {
    return <div className="int-level-cont">
      <div className={"int-level-circle " + (0 < level ? "selected" : "")} onClick={() => {
        handleInterestLevelClicked(id, 1)
      }} />
      <div className={"int-level-circle " + (1 < level ? "selected" : "")} onClick={() => {
        handleInterestLevelClicked(id, 2)
      }} />
      <div className={"int-level-circle " + (2 < level ? "selected" : "")} onClick={() => {
        handleInterestLevelClicked(id, 3)
      }} />
      <div className={"int-level-circle " + (3 < level ? "selected" : "")} onClick={() => {
        handleInterestLevelClicked(id, 4)
      }} />
      <div className={"int-level-circle " + (4 < level ? "selected" : "")} onClick={() => {
        handleInterestLevelClicked(id, 5)
      }} />
    </div>
  };

  const getIntOTMView = (id, otm) => {
    return <div className={"int-otm-cont " + (otm ? "selected" : "")} onClick={() => {
      handleInterestOTMToggled(id)
    }} />
  };

  const getSelectedInterests = () => {
    const listViews = [];
    for (let i = 0; i < interests.length; i += 1) {
      let { id, level, otm } = interests[i];
      listViews.push(<div className="sel-int-item-cont">
        <div className="sel-int-label">{interestsLabelMap[id]}</div>
        {getIntLevelView(id, level)}
        {getIntOTMView(id, otm)}
      </div>);
    }

    return <div className="sel-int-cont">
      <div className="sel-int-header">
        <div className="sel-int-emp"/>
        <div className="sel-int-amateur">Amateur</div>
        <div className="sel-int-pro">Pro</div>
        <div className="sel-int-otm">OTM?</div>
      </div>
      <div className="sel-int-body">
        {listViews}
      </div>
    </div>;
  };

  return <div className="about-you-two-cont">
    <div className="field-cont">
      <div className="field-input">
        <input className="interest-search" placeholder="Search/add interests" onChange={(e) => {
          handleSearchTextChanged(e)
        }} />
      </div>
    </div>
    {searchText.length > 2 ?
      <div className="field-cant-find"
           onClick={() => handleAddTextClicked()}>{`Can't find what you're looking for? Add ${searchText} to the list.`}</div> : null}
    {getInterestCapules()}
    {getSelectedInterests()}
  </div>;
}

AboutYouTwo.propTypes = {};

AboutYouTwo.defaultProps = {
  defInterests: [],
};

export default AboutYouTwo;
