import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";
import * as uiActions from "./../../actions/ui";
import { compose, bindActionCreators } from "redux";
import { connect } from "react-redux";
import cn from "classnames";
class Dashboard extends Component {
  handleToggleSidebar = value => {
    const { uiActionCreators } = this.props;
    const { showSidebar, hideSidebar } = uiActionCreators;
    if (value === true) {
      showSidebar();
    } else {
      hideSidebar();
    }
  };

  render() {
    const { children, classes, name, showSidebar } = this.props;
    return (
      <div className={classes.dashboard}>
        <Header
          name={name}
          showSidebar={showSidebar}
          onToggleSidebar={this.handleToggleSidebar}
        />
        <div className={classes.wrapper}>
          <Sidebar
            showSidebar={showSidebar}
            onToggleSidebar={this.handleToggleSidebar}
          />
          <div
            className={cn(classes.wrapperContent, {
              [classes.shiftLeft]: showSidebar === false
            })}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  children: PropTypes.object,
  classes: PropTypes.object,
  name: PropTypes.string,
  showSidebar: PropTypes.bool,
  uiACtionCreators: PropTypes.shape({
    showSidebar: PropTypes.func,
    hideSidebar: PropTypes.func
  })
};

const mapStateToProps = state => {
  return {
    showSidebar: state.ui.showSidebar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uiActionCreators: bindActionCreators(uiActions, dispatch)
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, withStyles(styles))(Dashboard);
