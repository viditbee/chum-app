import React, { useState } from 'react';
import './add-a-feed.scss';
import Button from "../misc/button";
import { addFeed } from "../../interface/interface";
import DefChannels from '../../../facts/def-channels';

function AddAFeed({ userInfo, channelId, onFeedAdded }) {

  const [text, setText] = useState("");

  const handleButtonClicked = async () => {
    const {status, response} = await addFeed(userInfo.id, text, channelId);
    if(status === "success"){
      onFeedAdded(response);
      setText("");
    }
  };

  const textChanged = (event) => {
    const val = event.target.value;
    setText(val);
  };

  const getButtonView = () => {
    return <Button onClick={() => {
      handleButtonClicked()
    }} disabled={!text.trim()} text="Post" />
  };

  return <div className="aaf-cont">
     <textarea placeholder={`What's on your mind, ${userInfo.firstName}?`} value={text} autoComplete="chrome-off"
               onChange={(e) => textChanged(e)} />
    {getButtonView()}
  </div>;
}

AddAFeed.propTypes = {};

AddAFeed.defaultProps = {
  channel: DefChannels.post
};

export default AddAFeed;


