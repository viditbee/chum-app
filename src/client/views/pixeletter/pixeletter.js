import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './pixeletter.scss';
import { getPixDim, PixelMap } from '../../utils/utils';

const pixDim = getPixDim();
const pixDimWMargin = pixDim + 4;
const margin = Math.floor(-(pixDim + 4) / 2);

function Pixel({ isSelected }) {
  const className = `pxlt-px-cont pxlt-px-${isSelected ? "selected" : ""}`;

  return <div className={className} style={{ height: pixDim, width: pixDim }} />;
}


function Pixeletter({ word, className, userInfo }) {

  const defSubText = "while(date >= 22nd March 2021 && date <= 11th April 2021)";
  const [liveCells, setLiveCells] = useState([]);
  const [text, setText] = useState(word);
  const [showingName, setShowingName] = useState(false);
  const [subText, setSubText] = useState(defSubText);

  useEffect(() => {
    let characters = text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    characters = characters.toLocaleUpperCase();
    let liveCells = [];

    for (let i = 0; i < characters.length; i += 1) {
      let indent = i * 4;
      let letterLiveCells = PixelMap[characters[i]];

      for (let j = 0; j < letterLiveCells.length; j += 1) {
        let [row, col] = letterLiveCells[j].split("_");
        liveCells.push(`${+row}_${indent + (+col)}`);
      }
    }
    setLiveCells(liveCells);
  }, [text]);

  const getView = () => {

    const rowDoms = [];
    const colLength = text.length * 4 - 1;

    for (let i = 0; i < 3; i += 1) {
      const cells = [];
      for (let j = 0; j < colLength; j += 1) {
        const key = `${i}_${j}`;
        cells.push(<Pixel
          key={key}
          isSelected={liveCells.indexOf(key) !== -1}
        />)
      }
      rowDoms.push(<div key={i} className="pxlt-row">{cells}</div>);
    }

    return rowDoms;
  };

  const toggleWord = () => {
    if (showingName) {
      setText(word);
      setSubText(defSubText);
      setShowingName(false);
    } else {
      setText(userInfo.firstName);
      setSubText("Kudos! Thanks for being inquisitive about this app :)");
      setShowingName(true);
    }
  };

  const leftPos = ((Math.floor(window.innerWidth / pixDimWMargin / 2) - ((text.length * 2) - 1)) * pixDimWMargin) + margin;
  const topPos = (pixDimWMargin * 9) + margin;
  const width = ((text.length * 4) - 1) * pixDimWMargin;
  const footerClassname = liveCells.length ? "pxlt-footer live" : "pxlt-footer";

  return <div className="pxlt-cont" style={{ left: leftPos, width: width, top: topPos }}>
    {getView()}
    <div className={footerClassname}>{subText}</div>
    {userInfo && userInfo.firstName ? <div className="text-toggler" style={{ height: pixDim, width: pixDim, top: -pixDim-4 }} onClick={() => {toggleWord()}}/> : null}
  </div>;
}

Pixeletter.propTypes = {
  word: PropTypes.string,
  className: PropTypes.string,
};

Pixeletter.defaultProps = {
  word: "HACKATHON",
  className: "",
};

export default Pixeletter;

