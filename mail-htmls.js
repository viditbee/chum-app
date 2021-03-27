const getHTMLforAddedToTeamMail = (name, team, addedBy) => `<div style="
    font-family: monospace;
    width: 700px;
    text-align: center;
    background: #061165;
    color: #c6ccff;
    box-sizing: border-box;
    font-size: 13px;
    position: relative;
    border: 1px solid #061165;
    border-radius: 4px;
    overflow: hidden;
">
    <img src="cid:mail-bg.png" style="
    width: 100%;
"><div style="
    font-size: 14px;
    margin-bottom: 11px;
    margin-top: 30px;
">Hi ${name}</div>
    <div style="
    font-size: 20px;
    margin-bottom: 20px;
">Congratulations!</div>
    <div>You've been added to the team</div>
    <div style="
    margin: 20px 0;
    font-size: 20px;
    color: #fe0074;
">${team}</div>
    <div style="
    /* font-size: 16px; */
    margin-bottom: 10px;
">by ${addedBy}</div>
    <a href="https://hackathon.contentserv.com/register" style="
    width: 200px;
    height: 40px;
    margin: 0 auto;
    background: #fe0074;
    line-height: 39px;
    font-size: 16px;
    border-radius: 4px;
    color: #fff;
    margin: 30px auto;
    cursor: pointer;
    display: block;
">SEE YOUR TEAM</a>
    <div style="
    font-size: 12px;
    color: #9ea7ff;
    font-style: italic;
    margin-bottom: 15px;
">Feel free to reply to this email, for any queries or assistance - Team Hackathon</div>
</div>`;

const getTextforAddedToTeamMail = (name, team, addedBy) => `Hi ${name}
Congratulations!
You've been added to the team
${team}
by ${addedBy}
Feel free to reply to this email, for any queries or assistance - Team Hackathon`;

const getHTMLforTeamCreatedMail = (name, team, teamMates) => `<div style="
    font-family: monospace;
    width: 700px;
    text-align: center;
    background: #061165;
    color: #c6ccff;
    box-sizing: border-box;
    font-size: 13px;
    position: relative;
    border: 1px solid #061165;
    border-radius: 4px;
    overflow: hidden;
">
    <img src="cid:mail-bg.png" style="
    width: 100%;
"><div style="
    font-size: 14px;
    margin-bottom: 11px;
    margin-top: 30px;
">Hi ${name}</div>
    <div style="
    font-size: 20px;
    margin-bottom: 20px;
">Congratulations!</div>
    <div>Your team is successfully registered
</div>
    <div style="
    margin: 20px 0;
    font-size: 20px;
    color: #fe0074;
">${team}</div>
    <div style="
    /* font-size: 16px; */
    margin-bottom: 10px;
">${teamMates}</div>
    <a href="https://hackathon.contentserv.com/register" style="
    width: 200px;
    height: 40px;
    margin: 0 auto;
    background: #fe0074;
    line-height: 39px;
    font-size: 16px;
    border-radius: 4px;
    color: #fff;
    margin: 30px auto;
    cursor: pointer;
    display: block;
">SEE YOUR TEAM</a>
    <div style="
    font-size: 12px;
    color: #9ea7ff;
    font-style: italic;
    margin-bottom: 15px;
">Feel free to reply to this email, for any queries or assistance - Team Hackathon</div>
</div>`;


const getTextforTeamCreatedMail = (name, team, teamMates) => `Hi ${name}
Congratulations!
Your team is successfully registered
${team}
${teamMates}
Feel free to reply to this email, for any queries or assistance - Team Hackathon`;

module.exports = {
  getHTMLforAddedToTeamMail, getTextforAddedToTeamMail, getHTMLforTeamCreatedMail, getTextforTeamCreatedMail
};
