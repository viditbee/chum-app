import React, { useState } from 'react';
import './search-channel.scss';
import Button from "../misc/button";
import { createChannel } from "../../interface/interface";
import DefChannels from '../../../facts/def-channels';
import ChannelInfoDialog from "../info-dialog/channel-info-dialog";

function SearchChannel({ userInfo, onChannelAdded, onTextChanged }) {

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

  const onSave = async (label, description) => {
    const { status, response } = await createChannel(userInfo.id, label, description);
    if (status === "success") {
      setDialogOpen(false);
      onChannelAdded(response);
      setText("");
    }
  };

  const getDialog = () => {
    return <ChannelInfoDialog defLabel={text} onSave={(label, description) => {
      onSave(label, description)
    }} />
  };

  const getButtonView = () => {
    return <Button onClick={() => {
      handleButtonClicked()
    }} disabled={!text.trim()} text="Create" />
  };

  return <div className="search-channel-cont">
    <input placeholder="Search or create channel..." value={text} autoComplete="chrome-off"
           onChange={(e) => textChanged(e)} />
    {getButtonView()}
    {dialogOpen ? getDialog() : null}
  </div>;
}

SearchChannel.propTypes = {};

SearchChannel.defaultProps = {
  channel: DefChannels.post
};

export default SearchChannel;


