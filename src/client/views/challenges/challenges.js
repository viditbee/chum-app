import React from 'react';
import './challenges.scss';

function Challenges() {

  return <div className="challenges-container">
    <div className="sec-header">Challenges</div>
    <div className="sec-item">
      <div className="sec-sub-header">1. JIRA Chatbot</div>
      <div className="sec-item-point">•  Considerable amount of Support ticket lacks details needed for troubleshooting and lot of time is spent in collecting those details from Customer before any troubleshooting actually starts.</div>
      <div className="sec-item-point">•  Chatbot can be integrated with Support KEDB's to provide verified solution for known issues and help in cutting down recurring issues by 20-30%. Also it can be used to get CSAT scores from Customer.</div>
    </div>
    <div className="sec-item">
      <div className="sec-sub-header">2. Simply Hire</div>
      <div className="sec-item-point">•  We are aware of the increasingly competitive nature of finding, hiring and securing great talent.</div>
      <div className="sec-item-point">•  Most of the recruitment process requires us to invest a lot of time and resources.</div>
      <div className="sec-item-point">•  A lengthy interview process along with assessments for skills and personality becomes a problem. Some candidates lose interest & end up abandoning the process early.</div>
      <div className="sec-item-point">•  PR and recognisability - if candidates don’t know who we are or what we do, they’re more likely to choose a tech giant over us, even if we are offering better terms and more exciting work.</div>
      <div className="sec-item-point">•  We could find the best candidate we possibly could, but keeping the candidate engaged for the notice period of 60 or 90 days could ruin any progress we might have made during the recruiting process.</div>
      <div className="sec-item-point">•  With recruitment portals comes vast number of applications. Many a times we receive applications from candidates who are not at all suited for the job ad given at our career site even after sharing a detailed and accurate job description, making the process inefficient and long.</div>
      <div className="sec-item-point">•  It is difficult to determine cultural fit through a traditional CV.</div>
      <div className="sec-item-point">•  Maintaining the information throughout the process is done manually.</div>
      <div className="sec-item-point">•  There isn't any single platform where the organisation can post the job openings and promote them, candidates can apply for the right positions, get themselves screened, and proceed for further rounds.</div>
    </div>
    <div className="sec-item">
      <div className="sec-sub-header">3. Hey Buddy!</div>
      <div className="sec-item-point">•  Have you ever felt how awesome your world would be had you known more about your colleagues? We have grown swiftly and sometime we do not even recognise our work-mates, let alone knowing about them.</div>
      <div className="sec-item-point">•  Many times we need things for a certain period or for one-time, equally, we may want to give some things away.</div>
      <div className="sec-item-point">•  Apart from the profession, people do have many hobbies, interests of which others are unaware of.</div>
      <div className="sec-item-point">•  People do need a healthy social life, form groups, organise events like treks, jamming sessions, donation drives etc., but they have no platform to do so.</div>
      <div className="sec-item-point">•  The scope of this challenge is not bound or limited to aforementioned points. You are free to incorporate your awesome ideas.</div>
    </div>
  </div>;
}

Challenges.propTypes = {};

Challenges.defaultProps = {};

export default Challenges;

