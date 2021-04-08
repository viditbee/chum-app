import React, {useState} from 'react';
import './info-dialog.scss';
import Button from "../misc/button";

function ChannelInfoDialog({ defLabel, onSave, handleCloseClicked }) {

  const [label, setLabel] = useState(defLabel);
  const [description, setDescription] = useState("");

  const labelChanged = (event) => {
    setLabel(event.target.value);
  };

  const descriptionChanged = (event) => {
    setDescription(event.target.value);
  };

  const isValid = () => {
    return label.trim() && description.trim();
  };

  return <div className="dialog-onion">
    <div className="dialog-cont">
      <div className="dialog-closer" onClick={() => {
        handleCloseClicked()
      }} />
      <div className="dialog-header">About channel</div>
      <div className="dialog-body">
        <div className="dialog-field-cont">
          <div className="dialog-field-label">Name</div>
          <div className="dialog-field-input">
            <input value={label} autoComplete="chrome-off" type="text"
                   onChange={(e) => labelChanged(e)} />
          </div>
        </div>
        <div className="dialog-field-cont">
          <div className="dialog-field-label">About this channel (you may mention about the purpose, who should join etc.)</div>
          <div className="dialog-field-input">
            <textarea value={description} autoComplete="chrome-off" type="text"
                   onChange={(e) => descriptionChanged(e)} />
          </div>
        </div>
      </div>
      <div className="error-box">{isValid() ? "" : "Please enter details"}</div>
      <div className="dialog-footer">
        <Button disabled={!isValid()} text="Save" onClick={() => {
          onSave(label, description)
        }} />
      </div>
    </div>
  </div>;
}

ChannelInfoDialog.propTypes = {};

ChannelInfoDialog.defaultProps = {};

export default ChannelInfoDialog;


