import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { manageSuccessfulLogout } from "../../utils/utils";
import './header.scss';

const Menus = [
  {
    id: "home",
    label: "Home",
    link: "/"
  }, {
    id: "about",
    label: "About",
    link: "/about"
  }, {
    id: "challenges",
    label: "Challenges",
    link: "/challenges"
  }, {
    id: "gol",
    label: "Game of Life",
    link: "/gameoflife"
  }, {
    id: "security",
    label: "Security",
    link: "/security"
  }, {
    id: "signout",
    label: "Sign out",
    link: "/"
  }, {
    id: "signin",
    label: "Sign in",
    link: "/login"
  }
];

function Header({ userInfo, logoutSetter }) {
  const selectedItemURL = useLocation().pathname;

  const getView = () => {
    const menuItems = [];

    for (let i = 0; i < Menus.length; i += 1) {
      let { id, label, link } = Menus[i];
      let className = (id !== "signout" && link === selectedItemURL) ? "menu-item selected" : "menu-item";

      if (id === "signout") {
        if (userInfo) {
          menuItems.push(<Link to={link} key={id}>
            <div className={className} onClick={() => {
              manageSuccessfulLogout();
              logoutSetter();
            }}>{label}</div>
          </Link>)
        }
      } else if (id === "signin") {
        if (!userInfo) {
          menuItems.push(<Link to={link} key={id}>
            <div className={className}>{label}</div>
          </Link>)
        }
      } else {
        menuItems.push(<Link to={link} key={id}>
          <div className={className}>{label}</div>
        </Link>)
      }
    }

    return menuItems;
  };

  return (
    <div className="header-container">
      <div className="cs-logo" />
      <div className="menu-container">
        {getView()}
      </div>
      {userInfo ? <div
          className="user-info">{`${userInfo.organiser ? "Organiser" : "Hacker"}: ${userInfo.firstName} ${userInfo.lastName}`}</div> :
        null}
    </div>
  );
}

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
