import React from 'react';

function Button({ onClick, text, className, disabled }) {
  return <div className={className + " button" + (disabled ? " disabled" : "")} onClick={() => {
    !disabled && onClick()
  }}>{text}</div>;
}

Button.propTypes = {};

Button.defaultProps = {
  className: ""
};

export default Button;


