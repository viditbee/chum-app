import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './about-you-page.scss';
import DecoFooter from "../../views/deco-footer/deco-footer";
import AboutYouOne from "../../views/about-you/about-you-1";
import AboutYouTwo from "../../views/about-you/about-you-2";
import Button from "../../views/misc/button";
import { updateUserBasicInfo } from "../../interface/interface";
import Paths from './../../../facts/paths';

function AboutYouPage({ userInfo, gotStartedSetter }) {

  const [activeStep, setActiveStep] = useState("1");
  const [buttonActive, setButtonActive] = useState(false);
  const [stepOneData, setStepOneData] = useState({});
  const [stepTwoData, setStepTwoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleButtonClicked = async () => {
    if (activeStep === "1") {
      setActiveStep("2");
    } else {
      setLoading(true);
      await updateUserBasicInfo({ ...stepOneData, interests: stepTwoData, userId: userInfo.id });
      setLoading(false);
      gotStartedSetter(true);
      history.replace(Paths.home);
    }
  };

  const handleStepOneDataChanged = (key, val) => {
    setStepOneData({ ...stepOneData, [key]: val });
  };

  const handlePrevButtonClicked = () => {
    setActiveStep("1");
  };

  const handleFormValidityChanged = (val) => {
    setButtonActive(val);
  };

  const getView = () => {
    let headerText = "";
    let formView = null;
    let buttonText = "";
    let prevButtonView = null;

    if (activeStep === "1") {
      headerText = "This information helps your chums know about you.";
      formView = <AboutYouOne
        dataChanged={(key, val) => {
          handleStepOneDataChanged(key, val)
        }}
        validityChanged={(val) => {
          handleFormValidityChanged(val)
        }}
        defLocation={stepOneData.location || ""}
        defDepartment={stepOneData.department || ""}
        defLanguages={stepOneData.languages || []}
        defAboutYou={stepOneData.aboutYou || ""} />;
      buttonText = "Next";
    } else {
      headerText = "Tell us about things you enjoy doing, or eager to learn about.";
      formView = <AboutYouTwo
        dataChanged={(data) => {
          setStepTwoData(data)
        }}
        defInterests={stepTwoData}
      />;
      buttonText = "Finish";
      prevButtonView = <div className="prev-button" onClick={() => {
        handlePrevButtonClicked()
      }} />
    }

    return <div className="about-you-scroller">
      <div className="about-you-stepper">
        <div className="getting-started">Getting started</div>
        <div className="step-info">{`Step ${activeStep}/2`}</div>
        <div className="float-paper">
          {loading ? <div className="loading">Getting you to your chums...</div> :
            <>
              <div className="header-text">{headerText}</div>
              {formView}
              <div className="button-cont">
                {prevButtonView}
                <Button disabled={!buttonActive} onClick={() => {
                  handleButtonClicked()
                }} text={buttonText} />
              </div>
            </>}
        </div>
      </div>
    </div>
  };

  return <div className="about-you-page-cont">
    <div className="chum-logo" />
    {getView()}
    <DecoFooter />
  </div>;
}

AboutYouPage.propTypes = {};

AboutYouPage.defaultProps = {};

export default AboutYouPage;

