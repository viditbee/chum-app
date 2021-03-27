import React, { useEffect, useState } from 'react';
import './feedback-list.scss';
import { getAllFeedback } from "../../interface/interface";

function FeedbackList() {

  const [feedbackInfo, setFeedbackInfo] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getInfo() {
      const res = await getAllFeedback();
      setFeedbackInfo(res);
      setLoaded(true);
    }

    getInfo();
  }, []);

  const getFeedbackView = () => {
    let views = null;
    if (feedbackInfo && feedbackInfo.length) {
      views = [];
      for (let i = 0; i < feedbackInfo.length; i += 1) {
        let { createdOn, name, text } = feedbackInfo[i];

        views.push(<div className="fb-item">
          <div className="fb-item-text">{text}</div>
          <div className="fb-item-sub-text">- {name || "Anonymous"} on {new Date(+createdOn).toLocaleString()}</div>
        </div>);
      }
    }
    return views;
  };

  return <div className="fb-container">
    <div className="fb-header">Feedback {feedbackInfo ? "(" + feedbackInfo.length + ")" : ""}</div>
    {loaded ? getFeedbackView() || <div className="fb-no-feedback">No feedback yet</div> : <div className="fb-no-feedback">Loading...</div>}
  </div>;
}

FeedbackList.propTypes = {};

FeedbackList.defaultProps = {};

export default FeedbackList;
