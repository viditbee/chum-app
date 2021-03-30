import React from 'react';
import './sign-up-page.scss';
import SignUpForm from "../../views/forms/signup";
import DecoFooter from "../../views/deco-footer/deco-footer";

function SignUpPage() {

  return <div className="sign-up-page-cont">
    <div className="chum-logo" />
    <SignUpForm />
    <DecoFooter />
  </div>;
}

SignUpPage.propTypes = {};

SignUpPage.defaultProps = {};

export default SignUpPage;

