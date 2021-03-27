import React from 'react';
import PropTypes from 'prop-types';
import './cell.scss';
import { getPixDim } from "../../utils/utils";
const pixDim = getPixDim();

function Cell({ row, col, alive, random }) {
  const className = `cell-container px-${random} ${alive ? 'alive' : ''}`;

  return <div className={className} style={{ height: pixDim, width: pixDim }} />;
}

Cell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  alive: PropTypes.number,
  neighbours: PropTypes.number,
  random: PropTypes.number,
};

Cell.defaultProps = {
  alive: false,
  neighbours: 0,
};

export default Cell;


