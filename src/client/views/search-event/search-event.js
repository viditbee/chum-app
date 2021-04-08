import React, { useState } from 'react';
import './search-event.scss';
import Button from "../misc/button";
import { createEvent } from "../../interface/interface";
import EventInfoDialog from "../info-dialog/event-info-dialog";

function SearchEvent({ userInfo, onEventAdded, onTextChanged }) {

  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClicked = async () => {
    setDialogOpen(true);
  };

  const textChanged = (event) => {
    const val = event.target.value;
    setText(val);
    onTextChanged(val);
  };

  const onSave = async (label, description, from, to) => {
    const { status, response } = await createEvent(userInfo.id, label, description, from, to);
    if (status === "success") {
      setDialogOpen(false);
      onEventAdded(response);
      setText("");
    }
  };

  const getDialog = () => {
    return <EventInfoDialog
      defLabel={text}
      onSave={(label, description, from, to) => {
        onSave(label, description, from, to)
      }}
      handleCloseClicked={() => {setDialogOpen(false)}}
    />
  };

  const getButtonView = () => {
    return <Button onClick={() => {
      handleButtonClicked()
    }} text="Create" />
  };

  return <div className="search-event-cont">
    <input placeholder="Search or create event..." value={text} autoComplete="chrome-off"
           onChange={(e) => textChanged(e)} />
    {getButtonView()}
    {dialogOpen ? getDialog() : null}
  </div>;
}

SearchEvent.propTypes = {};

SearchEvent.defaultProps = {};

export default SearchEvent;


