import React, { useState } from 'react';
import './search-chum.scss';

function SearchChum({ onTextChanged }) {

  const [text, setText] = useState("");

  const textChanged = (event) => {
    const val = event.target.value;
    setText(val);
    onTextChanged(val);
  };

  return <div className="search-chum-cont">
    <input placeholder="Search chums..." value={text} autoComplete="chrome-off"
           onChange={(e) => textChanged(e)} />
  </div>;
}

SearchChum.propTypes = {};

SearchChum.defaultProps = {};

export default SearchChum;


