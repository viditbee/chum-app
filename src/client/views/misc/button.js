import React from 'react';

function Button({ onClick, text, className }) {
  return <div className={className + " button"} onClick={() => {
    onClick()
  }}>{text}</div>;
}

Button.propTypes = {};

Button.defaultProps = {
  className: ""
};

export default Button;


