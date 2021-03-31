import React from 'react';
import './dev-secret-page.scss';
import { resetInterests } from "../../interface/dev-interface";

function DevSecPage() {

  const resetInts = async () => {
    await resetInterests();
    alert("Done!");
  };

  return <div className="dev-secret-page">
    <div className="gen-button reset-interests" onClick={() => {
      resetInts();
    }}>RESET INTERESTS
    </div>
  </div>;
}

DevSecPage.propTypes = {};

DevSecPage.defaultProps = {};

export default DevSecPage;

