import React from "react";
import InputFIles from "../viz_InputFiles/comp_InputFiles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const InputPlaceholder = props => {

  return (
    <React.Fragment>
      <InputFIles />
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {},
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputPlaceholder);
