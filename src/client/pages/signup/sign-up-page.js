import React from 'react';
import { Link } from "react-router-dom";
import './sign-up-page.scss';
import SignUpForm from "../../views/forms/signup";
import DecoFooter from "../../views/deco-footer/deco-footer";

function SignUpPage() {

  return <div className="sign-up-page-cont">
    <Link to={"/"}><div className="chum-logo" /></Link>
    <SignUpForm />
    <DecoFooter />
  </div>;
}

SignUpPage.propTypes = {};

SignUpPage.defaultProps = {};

export default SignUpPage;

