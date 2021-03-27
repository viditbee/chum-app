import React from 'react';
import './about-gol.scss';

function AboutGOL({handleClose}) {
  return <div className="about-gol-container">
    <div className="about-goal-dialog">
      <video className="about-video-1" controls autoPlay loop onError={(e) => {console.log(e)}}>
        <source src="https://vp.nyt.com/video/2020/12/23/90802_1_00SCI-CONWAY-zucconi_wg_1080p.mp4" />
      </video>
      <div className="video-about">“Life in Life,” from a short documentary on the Game of Life by Alan Zucconi, a London-based lecturer and science communicator.</div>
      <div className="about-para">Among the tragic losses to the current coronavirus pandemic is the brilliant mathematician John Conway, who passed away on April 11th. He made major contributions to group theory and game theory, but is probably best known in the wider world for his Game of Life. The Game of Life is a simple, yet fascinating, cellular automata exercise that ended up developing something of a life of its own, far beyond what Conway expected. The Game of Life (or simply Life) is not a game in the conventional sense. There are no players, and no winning or losing. Once the "pieces" are placed in the starting position, the rules determine everything that happens later. Nevertheless, Life is full of surprises! In most cases, it is impossible to look at a starting position (or pattern) and see what will happen in the future. The only way to find out is to follow the rules of the game.</div>
      <div className="about-header">Rules</div>
      <div className="about-para">The Game of Life takes place on a grid, with certain cells being marked ‘alive’ or ‘active’ and others being marked ‘dead’ or ‘inactive’.</div>
      <div className="about-para">The initial condition of the grid is set by the player, but after that, the grid evolves according to set rules:</div>
      <div className="about-para para-list para-list-first">1. If a dead cell has exactly three live neighbors, it is revived as if by reproduction, in the next turn</div>
      <div className="about-para para-list">2. If a live cell has fewer than two live neighbors, it dies as if by underpopulation</div>
      <div className="about-para para-list">3. If a live cell has more than three live neighbors, it dies as if by overpopulation</div>
      <div className="about-para para-list para-list-last">4. A live cell with two or three live neighbors persists into the next turn</div>
      <div className="about-para">Simple as the Game of Life is — Conway chose the rules specifically with keeping them as simple as possible while satisfying other conditions in mind — it has proven to be an enduringly fascinating framework, basically launching the field of cellular automatons. Of the interesting, even incredible, features of the Game is that it can be proven to be Turing Complete, and accordingly people have ‘programmed’ things in the Game — a digital clock, a working version of Tetris, the Game of Life itself.</div>
      <div className="about-gol-img"/>
      <div className="about-header">Why is Life So Interesting?</div>
      <div className="about-para">Life is one of the simplest examples of what is sometimes called "emergent complexity" or "self-organizing systems." This subject area has captured the attention of scientists and mathematicians in diverse fields. It is the study of how elaborate patterns and behaviors can emerge from very simple rules. It helps us understand, for example, how the petals on a rose or the stripes on a zebra can arise from a tissue of living cells growing together. It can even help us understand the diversity of life that has evolved on earth.</div>
      <div className="about-para">In Life, as in nature, we observe many fascinating phenomena. Nature, however, is complicated and we aren't sure of all the rules. The game of Life lets us observe a system where we know all the rules. Just like we can study simple animals (like worms) to discover things about more complex animals (like humans), people can study the game of Life to learn about patterns and behaviors in more complex systems.</div>
      <div className="about-para">The rules described above are all that's needed to discover anything there is to know about Life, and we'll see that this includes a great deal. Unlike most computer games, the rules themselves create the patterns, rather than programmers creating a complex set of game situations.</div>
    </div>
    <div className="about-gol-close" onClick={() => {handleClose()}}/>
  </div>;
}

AboutGOL.propTypes = {};

AboutGOL.defaultProps = {};

export default AboutGOL;
