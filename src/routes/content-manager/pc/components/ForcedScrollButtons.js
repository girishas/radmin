/**
 * Forced Scroll Buttons
 */
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { NotificationManager } from 'react-notifications';
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
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import Profile from './profile';
import Category from './category';
import Website from './website';
import Home from './home/index';
import Schedule from './schedule';
import Setting from './setting';
import Device from './device';
// api
import api from 'Api';
import AppConfig from 'Constants/AppConfig';
//toggle btn
import {Redirect, Link } from 'react-router-dom';
import {
	 get_plan_name_by_id
} from "Helpers/helpers";


function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

class ForcedScrollButtons extends Component {

    state = {
        redirectToAppPage: false,
        loading: false,
        activeIndex: 0,
        addNewUserModal: false,
        addClassicModal:false,
        xmlResult:null,
        icon_size:{
            height:512,
            width:512,
            browser_unique_id:'',
         }
    }

    // os_type={this.props.os_type} 
    // subs_id={this.props.subs_id} 
    // subs_type={this.props.subs_type}
    // child_name={this.props.child_name} 
    // login_user_id={this.props.login_user_id} 
    // browser_id={this.props.browser_id} 
    // icon_size ={this.state.icon_size}

    componentDidMount() {
        console.log('this.propsaa',this.props)
        if(this.props.subs_type == 0){
            this.setState({ activeIndex: 5 });
        }
        api.get('get-browser-icon-size', {
            params: {
              os_type: this.props.os_type,
              browser_id: this.props.browser_id
            }
          })
        .then((response) => {
              const data =  response.data;
              this.setState({
               icon_size: {
                  height: data.height,
                  width: data.width,
                  browser_unique_id: data.browser_unique_id,
               }
            });
        }) 
      
     }
     //for change props only url is same
     componentWillReceiveProps(newProps){
        this.props = newProps;
        console.log('newProps',newProps)
        if(this.props.subs_type == 0){
            this.setState({ activeIndex: 5 });
        }else{
            this.setState({ activeIndex: 0 });
        }

      } 
    handleChange(value) {
        this.setState({ activeIndex: value });
    }

    handleChangePopup(value) {
        // this.setState({ activeIndex: value });
        this.setState({ addClassicModal: true}) 
    }

    onAddUpdateUserModalClose() {
      this.setState({ addNewUserModal: false})
   }

   onClassicModalClose() {
      this.setState({ addClassicModal: false})
   }

    generateXml(){
        this.setState({ loading: true})
        api.get('user-generate-xml', {
            params: {
              os_type: this.props.os_type,
              subs_id: this.props.subs_id,
            }
          })
         .then((response) => {
            //this.setState({ addNewUserModal: true, xmlResult: response.data}) 
            this.setState({ loading: false})
            NotificationManager.success(<IntlMessages id="components.Published" />);
                console.log(response);
                if( window.IsChameleon){
                    chameleonEngine.installBrowser(this.state.icon_size.browser_unique_id)
                }
                
            })
         .catch(error => {
            // error hanlding
         })
    }

    redirectToAppPage(){
        localStorage.setItem("popup_browser_id",this.props.browser_id);
        this.setState({redirectToAppPage:true})
    }
    render() {
        const { activeIndex , loading ,redirectToAppPage } = this.state;
        
        return (
        <div>
            
{(redirectToAppPage == true) &&
   
    <Redirect 
        from='content-manager'
        to={{
            pathname: '/app/subscription/app-page',
            state: {
                device: this.props.device,
                serial_number: this.props.serial_number,
                child_name: this.props.child_name,
                os_type: this.props.os_type,
                user_id: this.props.login_user_id
            }
    }}
/>
}
            <RctCollapsibleCard>
                <div className="table-responsive">
                    <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                    <h4><span style={{    textTransform: "uppercase"}}>{this.props.os_name} </span> </h4>
                        <div> 
                            {this.props.subs_type == 0 ?                       
                                <a href="javascript:void(0)" onClick={() =>this.handleChangePopup(0)} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="components.generatexml" />}</a>
                            :
                            activeIndex != 5 &&
                            <button href="javascript:void(0)" onClick={() => this.generateXml()} color="primary" className="caret btn-sm ml-10 mr-10 btn btn-primary" ><IntlMessages id="components.Publish" /></button>

                                // <a href="javascript:void(0)" onClick={() => this.generateXml()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="components.generatexml" />}</a>
                            }       
                        </div>
                    </div>
                </div>

                <AppBar position="static" color="primary" className='tabbar-class'>
                {this.props.subs_type == 0 ?
                    <Tabs
                        value={activeIndex}
                        onChange={(e, value) => this.handleChangePopup(value)}
                        scrollable
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="inherit">
                        <Tab label={<IntlMessages id="sidebar.intro" />} icon={<i className="zmdi-hc-lg zmdi zmdi-account"></i>} />
                        <Tab label={<IntlMessages id="sidebar.home" />} icon={<i className="zmdi-hc-lg zmdi zmdi-home"></i>} />
                        <Tab label={<IntlMessages id="widgets.category" />} icon={<i className="zmdi-hc-lg zmdi zmdi-label"></i>} />
                        <Tab label={<IntlMessages id="sidebar.website" />} icon={<i className="zmdi-hc-lg zmdi zmdi-globe"></i>} />
                        <Tab label={<IntlMessages id="sidebar.schedule" />} icon={<i className="zmdi-hc-lg zmdi zmdi-alarm"></i>} />
                        <Tab label={<IntlMessages id="components.settings" />} icon={<i className="zmdi-hc-lg zmdi zmdi-settings"></i>} />
                    </Tabs>
                :
                    <Tabs
                        value={activeIndex}
                        onChange={(e, value) => this.handleChange(value)}
                        scrollable
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="inherit">
                        <Tab label={<IntlMessages id="sidebar.intro" />} icon={<i className="zmdi-hc-lg zmdi zmdi-account"></i>} />
                        <Tab label={<IntlMessages id="sidebar.home" />} icon={<i className="zmdi-hc-lg zmdi zmdi-home"></i>} />
                        <Tab label={<IntlMessages id="widgets.category" />} icon={<i className="zmdi-hc-lg zmdi zmdi-label"></i>} />
                        <Tab label={<IntlMessages id="sidebar.website" />} icon={<i className="zmdi-hc-lg zmdi zmdi-globe"></i>} />
                        <Tab label={<IntlMessages id="sidebar.schedule" />} icon={<i className="zmdi-hc-lg zmdi zmdi-alarm"></i>} />
                        <Tab label={<IntlMessages id="components.settings" />} icon={<i className="zmdi-hc-lg zmdi zmdi-settings"></i>} />
                        <Tab label={<IntlMessages id="components.ConnectedDevice" />} icon={<i className="zmdi zmdi-cast-connected"></i>} />
                    </Tabs>
                }
                </AppBar>
               
                {activeIndex === 0 && <TabContainer><Profile os_type={this.props.os_type}  subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name} login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size} /></TabContainer>}
                {activeIndex === 1 && <TabContainer><Home  os_type={this.props.os_type} subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name}   login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size}/></TabContainer>}
                {activeIndex === 2 && <TabContainer><Category  os_type={this.props.os_type} subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name}   login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size}/></TabContainer>}
                {activeIndex === 3 && <TabContainer><Website   os_type={this.props.os_type} subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name}   login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size}/></TabContainer>}
                {activeIndex === 4 && <TabContainer><Schedule   os_type={this.props.os_type} subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name}   login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size}/></TabContainer>}
                {activeIndex === 5 && <TabContainer><Setting   os_type={this.props.os_type} subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name}   login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size}/></TabContainer>}
                {activeIndex === 6 && <TabContainer><Device   os_type={this.props.os_type} subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name}   login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size}/></TabContainer>}
                
                </RctCollapsibleCard>
            <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {<IntlMessages id="components.generatexml" /> }
               </ModalHeader>
               <ModalBody className='xml-body'>
                  {this.state.xmlResult}
               </ModalBody>
               <ModalFooter>
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}>Cancel</Button>
               </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.addClassicModal} toggle={() => this.onClassicModalClose()}>
               <ModalHeader toggle={() => this.onClassicModalClose()}>
                  {<IntlMessages id="components.upgradePlan" /> }
               </ModalHeader>
               <ModalBody className='xml-body'>
                  <p> <IntlMessages id="components.YouNeedToBeASubscriberToEnableAllFeature" />
                      <a href="javascript:void(0)" onClick={() => this.redirectToAppPage(this.props.browser_id)}  > <IntlMessages id="components.ClickHereForMoreDetails" /></a></p>

               </ModalBody>
               <ModalFooter>
                   
               {/* subs_id: this.state.upgradepopupdetal.subs_ids,
								subs_type: this.state.pop_plan_id,
								plan_name: ,
								plan_amount: this.state.plan_price,
								child_name: this.state.upgradepopupdetal.child_names,
								login_user_id: user_id(),
								browser_id: this.state.upgradepopupdetal.browser_ids,
								browser_name: this.state.upgradepopupdetal.browser_names,
								transaction: this.state.upgradepopupdetal.transactionss,
								device_name: this.props.location.state.device,
								plan_type: yearlyPlanType
                        */}
               {/* <Link  className="" to={{
                            pathname: '/app/subscription/upgrade',
                            state: { 
                                subs_id:  this.props.subs_id,
                                subs_type : 1 ,
                                plan_name : get_plan_name_by_id(AppConfig.plans_array, 1),
                                plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 1),
                                child_name: this.props.child_name,
                                login_user_id: this.props.login_user_id,
                                browser_id: this.props.browser_id, 
                                browser_name:this.props.browser_name,
                                plan_type: 1
                            }
                        }}> <Button variant="raised" className="text-white btn-warning">{get_plan_name_by_id(AppConfig.plans_array, 1)}</Button></Link>

                    <Link  className="" to={{
                                pathname: '/app/subscription/upgrade',
                                state: { 
                                    subs_id:  this.props.subs_id,
                                    subs_type : 2 ,
                                    plan_name : get_plan_name_by_id(AppConfig.plans_array, 2),
                                    plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 2),
                                    child_name: this.props.child_name,
                                    login_user_id: this.props.login_user_id,
                                    browser_id: this.props.browser_id, 
                                    browser_name:this.props.browser_name,
                                    plan_type: 1
                                }
                            }}>  <Button variant="raised" className="text-white btn-info">{get_plan_name_by_id(AppConfig.plans_array, 2)}</Button></Link>
                
                    <Link  className="" to={{
                                pathname: '/app/subscription/upgrade',
                                state: { 
                                    subs_id:  this.props.subs_id,
                                    subs_type : 3 ,
                                    plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                    plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                    child_name: this.props.child_name,
                                    login_user_id: this.props.login_user_id,
                                    browser_id: this.props.browser_id, 
                                    browser_name:this.props.browser_name,
                                    plan_type: 1
                                }
                            }}>  <Button variant="raised" className="btn btn-zac">{get_plan_name_by_id(AppConfig.plans_array, 3)}</Button></Link> */}
                <Button variant="raised"  onClick={() => this.redirectToAppPage(this.props.browser_id)}  className="text-white btn-warning">{get_plan_name_by_id(AppConfig.plans_array, 1)}</Button>
                <Button variant="raised"  onClick={() => this.redirectToAppPage(this.props.browser_id)}  className="text-white btn-info">{get_plan_name_by_id(AppConfig.plans_array, 2)}</Button>
                <Button variant="raised"  onClick={() => this.redirectToAppPage(this.props.browser_id)}  className="btn btn-zac">{get_plan_name_by_id(AppConfig.plans_array, 3)}</Button>

                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onClassicModalClose()}>Cancel</Button>
               </ModalFooter>
            </Modal>
            {loading &&
                <RctSectionLoader />
            }
        </div>
        );
    }
}

export default ForcedScrollButtons;
