/**
 * Forced Scroll Buttons
 */
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Badge
} from 'reactstrap';
import Button from '@material-ui/core/Button';
// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import Profile from './Profile';
import Home from './Home';


// api
import api from 'Api';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

class ForcedScrollButtons extends Component {

    state = {
        activeIndex: 0,
        addNewUserModal: false,
        xmlResult:null
    }

    handleChange(value) {
        this.setState({ activeIndex: value });
    }

    onAddUpdateUserModalClose() {
      this.setState({ addNewUserModal: false})
   }

    generateXml(){
        api.get('generate-xml', {
            params: {
              os_type: 1
            }
          })
         .then((response) => {
            this.setState({ addNewUserModal: true,
                xmlResult: response.data
            })
                console.log(response);
            })
         .catch(error => {
            // error hanlding
         })
    }

    render() {
        const { activeIndex } = this.state;
        return (
        <div>
            <RctCollapsibleCard>
                 <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <h4><span>PC</span> </h4>
                     <div>                        
                        <a href="javascript:void(0)" onClick={() => this.generateXml()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="components.generatexml" />}</a>
                     </div>
                  </div>
                </div>

                <AppBar position="static" color="primary">
                    <Tabs
                        value={activeIndex}
                        onChange={(e, value) => this.handleChange(value)}
                        scrollable
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="inherit">
                        <Tab label="Intro" icon={<i className="zmdi-hc-lg zmdi zmdi-phone"></i>} />
                        <Tab label="Home" icon={<i className="zmdi-hc-lg zmdi zmdi-favorite"></i>} />
                        <Tab label="Categories" icon={<i className="zmdi-hc-lg zmdi zmdi-pin-account"></i>} />
                        <Tab label="Websites" icon={<i className="zmdi-hc-lg zmdi zmdi-pin-help"></i>} />
                    </Tabs>
                </AppBar>
        
            </RctCollapsibleCard>
            <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {<IntlMessages id="sidebar.updatecategory" /> }
               </ModalHeader>
               <ModalBody>
                  {this.state.xmlResult}
               </ModalBody>
               <ModalFooter>
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}>Cancel</Button>
               </ModalFooter>
            </Modal>
        </div>
        );
    }
}

export default ForcedScrollButtons;
