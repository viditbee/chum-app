import React, {useEffect, useState} from 'react';
import { employees } from './data';
import './fixer.scss';

function Fixer() {
  const className = `fixer-container`;

  const [map, setMap] = useState({});

  const getDefMap = () => {
    return employees.reduce((ac, it) => ({...ac, [it.id]: false}), {});
  };

  useEffect(() => {
    setMap(getDefMap());
  }, [employees]);

  const clicked = (e, f) => {
    setMap({...map, [e]: !map[e]});
  };

  const printRes = () => {
    let res = [];
    for (let key in map){
      if(!map[key]){
        res.push(key);
      }
    }
    console.log(JSON.stringify(res));
  };

  const getView = () => {
    let views = [];
    for(let i=0; i<employees.length; i+=1){
      let emp = employees[i];
      views.push(<div className="" key={emp.id}>
        <input type="checkbox" value={map[emp.id]} checked={map[emp.id]} onChange={() => {clicked(emp.id)}}/>
        <label>{emp.firstName + " " + emp.lastName}</label>
      </div>);
    }
    return views;
  };

  return <div className={className} >
    {getView()}
    <button onClick={() => {printRes()}}>CLICK</button>
  </div>;
}

Fixer.propTypes = {};

Fixer.defaultProps = {};

export default Fixer;


