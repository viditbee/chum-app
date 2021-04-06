import React, { useEffect, useState } from 'react';
import './about-me-page.scss';
import LeftPanel from "../../views/left-panel/left-panel";
import RightPanel from "../../views/right-panel/right-panel";
import {
  getUserBasicInfo,
  updateUserBasicInfo
} from "../../interface/interface";
import AboutYouOne from "../../views/about-you/about-you-1";
import AboutYouTwo from "../../views/about-you/about-you-2";
import Button from "../../views/misc/button";

function AboutMePage({ userInfo, logoutSetter }) {

  const [basicInfo, setBasicInfo] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [buttonActive, setButtonActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userId = userInfo.id;
      let { status: bSt, response: bRs } = await getUserBasicInfo(userId);

      if (bSt === "success") {
        setBasicInfo(bRs);
      }
      setDataLoaded(true);
    }

    userInfo && fetchData();
  }, []);

  const handleButtonClicked = async () => {
    setLoading(true);
    await updateUserBasicInfo(basicInfo);
    setLoading(false);
    setDataChanged(false);
  };

  const handleFormValidityChanged = (val) => {
    setButtonActive(val);
  };

  const handleStepOneDataChanged = (key, val) => {
    setBasicInfo({ ...basicInfo, [key]: val });
    setDataChanged(true);
  };

  const getView = () => {
    return <div className="page-specific-view-cont">
      {(!dataLoaded || loading) ? <div className="page-loading">Loading...</div> : null}
      <div className="gen-page-header">About me</div>
      <div className="gen-page-body">
        {dataLoaded ? <><AboutYouOne
          dataChanged={(key, val) => {
            handleStepOneDataChanged(key, val)
          }}
          validityChanged={(val) => {
            handleFormValidityChanged(val)
          }}
          defLocation={basicInfo.location || ""}
          defDepartment={basicInfo.department || ""}
          defLanguages={basicInfo.languages || []}
          defAboutYou={basicInfo.aboutYou || ""} />
          <div className="int-header">Interests</div>
        <AboutYouTwo
          dataChanged={(data) => {
            setBasicInfo({ ...basicInfo, interests: data });
            setDataChanged(true);
          }}
          defInterests={basicInfo.interests}
        /></> : null}
        {dataChanged ? <Button disabled={!buttonActive} onClick={() => {
          handleButtonClicked()
        }} text="Save" /> : null}
      </div>
    </div>
  };

  return <div className="about-me-page gen-page">
    <LeftPanel userInfo={userInfo} logoutSetter={logoutSetter} />
    {getView()}
    <RightPanel userInfo={userInfo} />
  </div>;
}

AboutMePage.propTypes = {};

AboutMePage.defaultProps = {};

export default AboutMePage;

