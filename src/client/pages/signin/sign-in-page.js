import React from 'react';
import { Link } from "react-router-dom";
import './sign-in-page.scss';
import SignInForm from "../../views/forms/signin";
import DecoFooter from "../../views/deco-footer/deco-footer";

function SignInPage({loginSetter}) {

  return <div className="sign-in-page-cont">
    <Link to={"/"}><div className="chum-logo" /></Link>
    <SignInForm loginSetter={loginSetter} />
    <DecoFooter />
  </div>;
}

SignInPage.propTypes = {};

SignInPage.defaultProps = {};

export default SignInPage;

