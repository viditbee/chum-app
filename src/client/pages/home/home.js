import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AboutInfo } from "./about-info";
import './home.scss';
import Button from "../../views/misc/button";
// import { Socket } from "../../interface/socket";

function Home() {
  const className = `home-container`;
  const clouds = useRef(null);
  const history = useHistory();

  const getAboutView = () => {
    const res = [];
    for (let i = 0; i < AboutInfo.length; i += 1) {
      const { id, label, description, className } = AboutInfo[i];
      const clsNm = `abt-info-item-container ${i % 2 ? "odd" : "even"} ${className}`;
      res.push(<div className={clsNm} key={id}>
        <div className="abt-info-item-text">
          <div className="abt-info-item-text-header">{label}</div>
          <div className="abt-info-item-text-body">{description}</div>
        </div>
        <div className="abt-info-item-img" />
      </div>)
    }

    return res;
  };

  const getClouds = () => {
    return <div className="chum-clouds" ref={clouds}>
      <div className="cld-rt-1" />
      <div className="cld-rt-2" />
      <div className="cld-rt-3" />
      <div className="cld-lt-1" />
      <div className="cld-lt-2" />
      <div className="cld-lt-3" />
    </div>
  };

  const handleScroll = (el) => {
    clouds.current.style.top = -el.target.scrollTop / 3 + "px";
  };

  const handleGetStartedClicked = () => {
    history.push('/sign-up')
    // Socket.emit("hello", { a: "b", c: [] });
  };

  return <div className={className} onScroll={(e) => {
    handleScroll(e)
  }}>
    {getClouds()}
    <div className="banner" />
    <div className="chum-logo" />
    <div className="chum-desc">Have you ever thought how awesome your world would be had you known
      more about your work-mates? Chum lets you discover people around you, connect, engage,
      and have fun.
    </div>
    <Button className="get-started-button" onClick={() => {
      handleGetStartedClicked()
    }} text="Get Started" />
    <div className="home-info-separator" />
    {getAboutView()}
  </div>;
}

Home.propTypes = {};

Home.defaultProps = {};

export default Home;


