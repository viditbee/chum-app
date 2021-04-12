import React, { useEffect, useState } from 'react';
import './about-me-page.scss';
import {
  getUserBasicInfo,
  updateUserBasicInfo
} from "../../interface/interface";
import AboutYouOne from "../../views/about-you/about-you-1";
import AboutYouTwo from "../../views/about-you/about-you-2";
import Button from "../../views/misc/button";

function AboutMePage({ userInfo }) {

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
  }, [userInfo]);

  const handleButtonClicked = async () => {
    setLoading(true);
    await updateUserBasicInfo(userInfo.id, basicInfo);
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
  </div>;
}

AboutMePage.propTypes = {};

AboutMePage.defaultProps = {};

export default AboutMePage;

