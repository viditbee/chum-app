import React, { useState } from 'react';
import './about-you-page.scss';
import DecoFooter from "../../views/deco-footer/deco-footer";
import AboutYouOne from "../../views/about-you/about-you-1";
import AboutYouTwo from "../../views/about-you/about-you-2";
import Button from "../../views/misc/button";

function AboutYouPage() {

  const [activeStep, setActiveStep] = useState("1");
  const [buttonActive, setButtonActive] = useState(false);

  const handleButtonClicked = () => {
    if (activeStep === "1") {
      setActiveStep("2");
    } else {
      alert("Ho gaya");
    }
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
      formView = <AboutYouOne validityChanged={(val) => {
        handleFormValidityChanged(val)
      }} />;
      buttonText = "Next";
    } else {
      headerText = "Tell us about things you enjoy doing, or eager to learn about.";
      formView = <AboutYouTwo />;
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
          <div className="header-text">{headerText}</div>
          {formView}
          <div className="button-cont">
            {prevButtonView}
            <Button disabled={!buttonActive} onClick={() => {
              handleButtonClicked()
            }} text={buttonText} />
          </div>
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

