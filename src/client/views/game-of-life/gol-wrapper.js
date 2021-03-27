import React, { useState, useEffect } from 'react';
import './gol-wrapper.scss';
import { getAliveMatCentered, PixelMap } from "./../../utils/utils";
import GameOfLife from './game-of-life';
import AboutGOL from "./about-gol";

const FORMATIONS = {
  a: {
    label: "Thunderbird",
    alive: ["0_0", "0_1", "0_2", "2_1", "3_1", "4_1"]
  }, b: {
    label: "Double Barrelled Gun",
    alive: ["8_0", "9_0", "8_1", "9_1", "0_17", "1_17", "1_18", "2_18", "2_19", "3_17", "3_18", "7_17", "7_18", "8_18", "8_19", "9_17", "9_18", "10_17", "4_32", "5_31", "5_32", "6_30", "6_31", "7_31", "7_32", "11_31", "11_32", "12_30", "12_31", "13_31", "13_32", "14_32", "5_48", "5_49", "6_48", "6_49"]
  }, c: {
    label: "R-pentomino",
    alive: ["9_10", "9_11", "10_9", "10_10", "11_10"]
  }, d: {
    label: "Pi Ship",
    alive: ["30_30", "30_31", "31_30", "31_31", "30_40", "30_41", "30_43", "30_44", "29_41", "28_42", "29_43", "30_53", "30_54", "31_53", "31_54"]
  }, /*e: {
    label: "E",
    alive: ["1_1", "2_2", "3_3", "4_4", "5_5", "6_6", "7_7", "8_8", "9_9", "10_10", "11_10", "10_11", "11_11", "1_19", "2_18", "3_17", "4_16", "5_15", "6_14", "7_13", "8_12", "9_11"]
  },*/ f: {
    label: "Diamond",
    alive: ["0_4", "0_5", "0_6", "0_7", "2_2", "2_3", "2_4", "2_5", "2_6", "2_7", "2_8", "2_9", "4_0", "4_1", "4_2", "4_3", "4_4", "4_5", "4_6", "4_7", "4_8", "4_9", "4_10", "4_11", "6_2", "6_3", "6_4", "6_5", "6_6", "6_7", "6_8", "6_9", "8_4", "8_5", "8_6", "8_7"]
  }
};

function GOLWrapper({ userInfo }) {

  const [formation, setFormation] = useState(FORMATIONS.a);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [customFormation, setCustomFormation] = useState([]);

  useEffect(() => {

  }, [userInfo]);

  useEffect(() => {
    if(userInfo && userInfo.firstName) {
      const firstNameFiltered = userInfo.firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const characters = firstNameFiltered.toLocaleUpperCase().split("");
      let liveCells = [];

      for (let i = 0; i < characters.length; i += 1) {
        let indent = i * 4;
        let letterLiveCells = PixelMap[characters[i]];

        for (let j = 0; j < letterLiveCells.length; j += 1) {
          let [row, col] = letterLiveCells[j].split("_");
          liveCells.push(`${+row}_${indent + (+col)}`);
        }
      }
      setCustomFormation(liveCells);
    }
  }, [userInfo]);

  const handleFormationItemClicked = (id) => {
    if(id === "custom"){
      setFormation({
        label: "Custom",
        alive: customFormation
      })
    } else {
      setFormation(FORMATIONS[id]);
    }
  };

  const getMenu = () => {
    const formationMenuItems = Object.keys(FORMATIONS).map((key) => (
      <div className="gw-menu-item" onClick={() => {
        handleFormationItemClicked(key)
      }}>{FORMATIONS[key].label}</div>
    ));

    return <div className="gol-wrapper-menu-cont">
      {formationMenuItems}
      {userInfo && userInfo.firstName ? <div className="gw-menu-item" onClick={() => {
        handleFormationItemClicked("custom")
      }}>Try with my name</div> : null}
      <div className="gw-menu-item" onClick={() => {setAboutVisible(true)}}>About Convoy's Game of Life</div>
    </div>
  };

  const handleClose = () => {
    setAboutVisible(false);
  };

  return <div className="gol-wrapper-container">
    <GameOfLife alive={getAliveMatCentered(formation.alive)} />
    {getMenu()}
    {aboutVisible ? <AboutGOL handleClose={() => {handleClose()}}/> : null}
  </div>;
}

GOLWrapper.propTypes = {};

GOLWrapper.defaultProps = {};

export default GOLWrapper;


