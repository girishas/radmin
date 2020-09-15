import React, { Component, Fragment } from 'react';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
  deleteIcon:{
    
  }
};

class CustomToolbar extends Component {
  
  handleClick = () => {
    console.log("clicked on icon!");
  }

  render() {
    console.log(this.props);
    console.log(defaultToolbarStyles);
    const { classes } = this.props;

    return (
      <Fragment>
        <Tooltip title={"custom icon"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);
