import React from 'react';
import './footer.scss';
import { Link } from "react-router-dom";

function Footer() {

  return (
    <div className="footer-container">
      <div className="made-with">import</div>
      <div className="ico-react" title="React" />
      <div className="ico-node" title="NodeJS" />
      <div className="ico-mongo" title="MongoDB" />
      <div className="ico-aws" title="AWS" />
      <div className="ico-bug" title="Bugs :P" />
      <div className="with">with</div>
      <div className="ico-love" title="Love ♥" />
      <div className="footer-pipe">|</div>
      <Link to="/feedback">
        <div className="feedback-button">Feedback</div>
      </Link>
    </div>
  );
}

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;


