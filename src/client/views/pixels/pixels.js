import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './pixels.scss';
import useInterval from "../../utils/hooks/use-interval";
import { getPixDim } from '../../utils/utils';

const pixDim = getPixDim();
const margin = Math.floor(-(pixDim + 4) / 2);

function Pixel({ row, col }) {
  let random = Math.floor(Math.random() * 10);
  const brightness = (row < 4) ? (row < 2) ? random : random - 2 : random;
  const className = `px-cont px-${brightness}`;

  return <div className={className} style={{ height: pixDim, width: pixDim }} />;
}

function Pixels({ rows, cols }) {

  const [toggler, setToggler] = useState(false);

  useInterval(() => {
    setToggler(!toggler);
  }, 30000);

  const getView = () => {

    const rowDoms = [];

    for (let i = 0; i < rows; i += 1) {
      const cells = [];
      for (let j = 0; j < cols; j += 1) {
        const key = `${i}_${j}`;
        cells.push(<Pixel
          key={key}
          row={i}
          col={j}
        />)
      }
      rowDoms.push(<div key={i} className="px-row">{cells}</div>);
    }

    return rowDoms;
  };

  return <div className="pxs-cont" style={{ left: margin, top: margin }}>{getView()}</div>;
}

Pixels.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
};

Pixels.defaultProps = {
  rows: window.innerHeight * 1.03 / (pixDim + 2),
  cols: window.innerWidth * 1.03 / (pixDim + 2)
};

export default Pixels;


