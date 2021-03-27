import React, { useState, useEffect } from 'react';
import Cell from '../cell/cell';
import PropTypes from 'prop-types';
import useInterval from '../../utils/hooks/use-interval';
import './game-of-life.scss';
import { getPixDim, getWidthInPix, getHeightInPix } from "../../utils/utils";

const MIN_SRV = 2;
const MAX_SRV = 3;
const REVIVE_IF = 3;

const pixDim = getPixDim();
const margin = Math.floor(-(pixDim + 4) / 2);

function GameOfLife({ rows, cols, alive, interval }) {

  let [lifeMatrix, setLifeMatrix] = useState([]);
  let [randomisedMatrix, setRandomisedMatrix] = useState([]);
  let [ready, setReady] = useState(false);
  let [int, setInt] = useState(interval);

  const setLifeMat = (m) => {
    setLifeMatrix(m);
  };

  useEffect(() => {
    setTimeout(() => {
      const { lifeMat, randomisedMat } = getPreparedMatrices(getDefaultCellState, !ready);
      setLifeMat(lifeMat);
      !ready && setRandomisedMatrix(randomisedMat);
      setReady(true);
      setInt(int + 1500);
      setTimeout(()=>{setInt(interval)}, 1500);
    }, 100);
  }, [rows, cols, alive]);

  useInterval(() => {
    tik();
  }, ready ? int : null);

  const getDefaultCellState = (r, c) => {
    const neighbourCount = (alive.indexOf(`${r - 1}_${c - 1}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r - 1}_${c}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r - 1}_${c + 1}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r}_${c - 1}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r}_${c + 1}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r + 1}_${c - 1}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r + 1}_${c}`) === -1 ? 0 : 1) +
      (alive.indexOf(`${r + 1}_${c + 1}`) === -1 ? 0 : 1);

    return {
      neighbourCount,
      isAlive: alive.indexOf(`${r}_${c}`) !== -1 ? 1 : 0
    }
  };

  const getCellState = (r, c) => {
    if (r < 0 || c < 0 || r === rows || c === cols) return 0;

    return lifeMatrix[r][c];
  };

  const getCalculatedCellState = (r, c) => {
    const myState = getCellState(r, c);
    let neighbourCount = getCellState(r - 1, c - 1) +
      getCellState(r - 1, c) +
      getCellState(r - 1, c + 1) +
      getCellState(r, c - 1) +
      getCellState(r, c + 1) +
      getCellState(r + 1, c - 1) +
      getCellState(r + 1, c) +
      getCellState(r + 1, c + 1);

    return {
      neighbourCount,
      isAlive: myState ? (neighbourCount >= MIN_SRV && neighbourCount <= MAX_SRV ? 1 : 0) : (neighbourCount === REVIVE_IF ? 1 : 0)
    }
  };

  const getPreparedMatrices = (getState, makeRandomised) => {
    const newLifeMatrix = [];
    const randomisedMat = [];
    let population = 0;

    for (let i = 0; i < rows; i += 1) {
      newLifeMatrix.push([]);

      for (let j = 0; j < cols; j += 1) {
        const { isAlive } = getState(i, j);
        population += alive;
        newLifeMatrix[i][j] = isAlive;
        if (makeRandomised) {
          const random = Math.floor(Math.random() * 10);
          randomisedMat[i] = randomisedMat[i] || [];
          randomisedMat[i][j] = (i < 4) ? (i < 2) ? random : random - 2 : random;
        }
      }
    }
    return {
      lifeMat: newLifeMatrix,
      randomisedMat: randomisedMat,
      population
    }
  };

  const tik = () => {
    const { lifeMat } = getPreparedMatrices(getCalculatedCellState);
    setLifeMat(lifeMat);
  };

  const getView = () => {
    const rowDoms = [];
    if (ready && randomisedMatrix.length) {
      for (let i = 0; i < rows; i += 1) {
        const cells = [];
        for (let j = 0; j < cols; j += 1) {
          const key = `${i}_${j}`;
          cells.push(<Cell
            key={key}
            row={i}
            col={j}
            alive={lifeMatrix[i][j]}
            random={randomisedMatrix[i][j]}
          />)
        }
        rowDoms.push(<div key={i} className="row">{cells}</div>);
      }
    }

    return rowDoms;
  };

  return (
    <div className="game-of-life-container" style={{ left: margin, top: margin }}>
      {getView()}
    </div>
  );
}

GameOfLife.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
  alive: PropTypes.array,
  interval: PropTypes.number,
};

GameOfLife.defaultProps = {
  rows: Math.ceil(getHeightInPix() * 1.1),
  cols: Math.ceil(getWidthInPix() * 1.1),
  alive: [],
  interval: 250,
};

export default GameOfLife;


