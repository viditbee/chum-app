import React from 'react';
import PropTypes from 'prop-types';

function SocialSignIns({ informLoginStatus }) {

  return <div className="social-sign-ins-container">
    <img style={{display:"none"}} onLoad={() => {informLoginStatus("Google", true)}}
         onError={() => {informLoginStatus("Google", false)}}
         src="https://accounts.google.com/CheckCookie?continue=https://www.google.com/intl/en/images/logos/accounts_logo.png" />
    <img style={{display:"none"}}
         src="https://m.facebook.com/login/?next=https://m.facebook.com/images/litestand/bookmarks/sidebar/icons/mobile/icon-instagram-gray.png"
         onLoad={() => {informLoginStatus("Facebook", true)}}
         onError={() => {informLoginStatus("Facebook", false)}} />
  </div>;
}

SocialSignIns.propTypes = {
  informLoginStatus: PropTypes.func
};

SocialSignIns.defaultProps = {
  informLoginStatus: () => {}
};

export default SocialSignIns;


