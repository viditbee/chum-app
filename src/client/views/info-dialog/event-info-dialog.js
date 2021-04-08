import React, { useState } from 'react';
import './info-dialog.scss';
import Button from "../misc/button";

function EventInfoDialog({ defLabel, onSave, handleCloseClicked }) {

  const [label, setLabel] = useState(defLabel);
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const labelChanged = (event) => {
    setLabel(event.target.value);
  };

  const descriptionChanged = (event) => {
    setDescription(event.target.value);
  };

  const fromChanged = (event) => {
    setFrom(event.target.value);
  };

  const toChanged = (event) => {
    setTo(event.target.value);
  };

  const isValid = () => {
    return label.trim() && description.trim() && from;
  };

  return <div className="dialog-onion">
    <div className="dialog-cont">
      <div className="dialog-closer" onClick={() => {
        handleCloseClicked()
      }} />
      <div className="dialog-header">About event</div>
      <div className="dialog-body">
        <div className="dialog-field-cont">
          <div className="dialog-field-label">Title</div>
          <div className="dialog-field-input">
            <input value={label} autoComplete="chrome-off" type="text"
                   onChange={(e) => labelChanged(e)} />
          </div>
        </div>
        <div className="dialog-field-cont">
          <div className="dialog-field-label">About this event</div>
          <div className="dialog-field-input">
            <textarea value={description} autoComplete="chrome-off"
                      onChange={(e) => descriptionChanged(e)} />
          </div>
        </div>
        <div className="dialog-field-cont">
          <div className="dialog-field-label">From</div>
          <div className="dialog-field-input">
            <input type="date" value={from} autoComplete="chrome-off" max={to ? to : null}
                   onChange={(e) => fromChanged(e)} />
          </div>
        </div>
        <div className="dialog-field-cont">
          <div className="dialog-field-label">To</div>
          <div className="dialog-field-input">
            <input type="date" value={to} autoComplete="chrome-off" min={from ? from : null}
                   placeholder="Keep this empty for a full day event"
                   onChange={(e) => toChanged(e)} />
          </div>
        </div>
      </div>
      <div className="error-box">{isValid() ? "" : "Please enter details"}</div>
      <div className="dialog-footer">
        <Button disabled={!isValid()} text="Save" onClick={() => {
          onSave(label, description, from, to)
        }} />
      </div>
    </div>
  </div>;
}

EventInfoDialog.propTypes = {};

EventInfoDialog.defaultProps = {};

export default EventInfoDialog;


