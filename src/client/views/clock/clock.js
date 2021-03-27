import React from "react";
import './clock.scss';
import { getPixDim } from "../../utils/utils";

const pixDim = getPixDim();
const pixDimWMargin = pixDim + 4;
const margin = Math.floor(-(pixDim + 4) / 2);

const Pip = ({ isOn }) =>
  <div className={`pip ${isOn && 'pip--on'}`} style={{width: pixDim, height: pixDim}}/>

const BinaryDigit = ({ base2NumberAsArray }) =>
  <div className="binary-digit">
    {
      base2NumberAsArray.map((pip, idx) => <Pip key={idx} isOn={pip === 1} />)
    }
  </div>;

const BinaryDigitGroup = ({ group }) =>
  <div className="binary-digit-group" style={{marginRight: pixDimWMargin/2, marginLeft: pixDimWMargin/2}}>
    {
      group.map((binaryDigit, idx) => <BinaryDigit base2NumberAsArray={binaryDigit} key={idx} />)
    }
  </div>;

class Clock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      digits: [[[0,0,0,0],[0,0,0,0]], [[0,0,0,0],[0,0,0,0]], [[0,0,0,0],[0,0,0,0]], [[0,0,0,0],[0,0,0,0]]],
      evDateInMilli: Date.parse(props.evDate)
    }
  }

  getRemainingTime() {
    const currentDate = new Date();
    let remMillis = this.state.evDateInMilli - currentDate.getTime();
    const days = Math.floor(remMillis / (24 * 60 * 60 * 1000));
    remMillis = remMillis % (24 * 60 * 60 * 1000);
    const hours = Math.floor(remMillis / (60 * 60 * 1000));
    remMillis = remMillis % (60 * 60 * 1000);
    const minutes = Math.floor(remMillis / (60 * 1000));
    remMillis = remMillis % (60 * 1000);
    const seconds = Math.floor(remMillis / 1000);

    return {
      days, hours, minutes, seconds
    }
  }

  componentDidMount() {
    let intervalId = setInterval(function () {
      const { days, hours, minutes, seconds } = this.getRemainingTime();
      const newDigits = [
        numberAsBinaryArrayPair(days),
        numberAsBinaryArrayPair(hours),
        numberAsBinaryArrayPair(minutes),
        numberAsBinaryArrayPair(seconds)
      ];
      this.setState({
        digits: newDigits
      });
    }.bind(this), 1000);

    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    const leftPos = ((Math.floor(window.innerWidth / pixDimWMargin / 2) - 5) * pixDimWMargin) + margin - (pixDimWMargin/2);
    // const leftPos = ((Math.floor(window.innerWidth / pixDimWMargin / 2) - (word.length * 2)) * pixDimWMargin) + margin;
    const topPos = (pixDimWMargin * 16) + margin -3;

    return (
      <div className="clock-container" style={{left: leftPos, top: topPos}}>
        <div className="begins-in" style={{lineHeight: (pixDim+4)+"px"}}>starts in...</div>
        {this.state.digits.map((digit, idx) => <BinaryDigitGroup group={digit} key={idx}/>)}
        <div className="clock-labels" style={{lineHeight: (pixDim+4)+"px"}}>
          <div>DAYS</div>
          <div>HOURS</div>
          <div>MINUTES</div>
          <div>SECONDS</div>
        </div>
        <div className="clock-hint">base-2</div>
      </div>
    );
  }
}

function numberToBinary(base10Number) {
  const base2Values = [8, 4, 2, 1];
  let output = [0, 0, 0, 0];
  let remainder = base10Number;

  base2Values.forEach((val, idx) => {
    const left = remainder - val;

    if (left >= 0) {
      output[idx] = 1;
      remainder = left
    }
  });

  return output;
}

function numberAsBinaryArrayPair(number) {
  const pair = [];
  if (number < 10) {
    pair[0] = numberToBinary();
    pair[1] = numberToBinary(number);
  } else {
    const numberAsArray = String(number).split('');
    pair[0] = numberToBinary(parseInt(numberAsArray[0], 10));
    pair[1] = numberToBinary(parseInt(numberAsArray[1], 10));
  }

  return pair;
}

export default Clock;
