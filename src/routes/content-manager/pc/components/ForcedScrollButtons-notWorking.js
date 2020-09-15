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
   Badge,
   FormGroup, Label, Input
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
import { Link } from 'react-router-dom';

import {
	timeAgo, getTheDate, checkRoleAuth, get_lang_name_by_id,
	get_category_type_name_by_id, get_plan_id_by_name, print_tr_id,
	hubCheckPaths, getOsNamesByIds, user_id, convertDateToTimeStamp, get_plan_name_by_id, dateMonthsDiff,h_not_in_array
} from "Helpers/helpers";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SweetAlert from 'react-bootstrap-sweetalert';
import Switch from 'react-toggle-switch';
// import { Button } from 'reactstrap';
function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

class ForcedScrollButtons extends Component {

    state = {
        loading: false,
        activeIndex: 0,
        addNewUserModal: false,
        addClassicModal:false,
        xmlResult:null,
        icon_size:{
            height:512,
            width:512,
            browser_unique_id:'',
         },
    //new pop up plans
        subs_success: false,
        show_key_alert : false,
        sub_success_data: [],
        browserKeyDetail: [],
        openViewUserDialog: false,

         extra_month:1,
         yearlyPlan: false,
         silverPlan: 4.99,
         goldPlan: 14.99,
         diamondPlan: 24.99,
         
         silverPlanYM:4.99,
         goldPlanYM:14.99,
         diamondPlanYM:24.99,
         planDuration:<IntlMessages id="download.planmonth" /> 
    }

    // os_type={this.props.os_type} 
    // subs_id={this.props.subs_id} 
    // subs_type={this.props.subs_type}
    // child_name={this.props.child_name} 
    // login_user_id={this.props.login_user_id} 
    // browser_id={this.props.browser_id} 
    // icon_size ={this.state.icon_size}

    componentDidMount() {
        if(this.props.subs_type == 0){
            this.setState({ activeIndex: 5 });
        }
        console.log('this.props',this.props)
        api.get('get-browser-icon-size', {
            params: {
              os_type: this.props.os_type,
              browser_id: this.props.browser_id

            //   browser_id: this.props.browser_id
            //   browser_id: this.props.browser_id
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
            NotificationManager.success('Published!');
                console.log(response);
                if( window.IsChameleon){
                    chameleonEngine.installBrowser(this.state.icon_size.browser_unique_id)
                }
                
            })
         .catch(error => {
            // error hanlding
         })
    }
    render() {
        const { activeIndex , loading,extra_month ,subs_success} = this.state;
        
        return (
        <div>
            <RctCollapsibleCard>
                <div className="table-responsive">
                    <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                    <h4><span>{this.props.os_name} </span> </h4>
                        <div> 
                            {this.props.subs_type == 0 ?                       
                                <a href="javascript:void(0)" onClick={() =>this.handleChangePopup(0)} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="components.generatexml" />}</a>
                            :
                            <button href="javascript:void(0)" onClick={() => this.generateXml()} color="primary" className="caret btn-sm ml-10 mr-10 btn btn-primary" >Publish</button>
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
               
                {activeIndex === 0 && <TabContainer><Profile os_type={this.props.os_type} subs_idwww={this.props.subs_id}   subs_id={this.props.subs_id} subs_type={this.props.subs_type}  child_name={this.props.child_name} login_user_id={this.props.login_user_id} browser_id={this.props.browser_id} icon_size ={this.state.icon_size} /></TabContainer>}
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
                  <p> You need to be a subscriber to enable all feature. <a onClick={() => this.openUpgradePlanModal(key, broswser.transaction_data, broswser.language , broswser.not_expired_plans ,broswser.serial_data)} > Click here for more details</a></p>

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
               <Link  className="" to={{
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
                            }}>  <Button variant="raised" className="btn btn-zac">{get_plan_name_by_id(AppConfig.plans_array, 3)}</Button></Link>
                
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onClassicModalClose()}>Cancel</Button>
               </ModalFooter>
            </Modal>
            {loading &&
                <RctSectionLoader />
            }









<Dialog
					onClose={() => this.setState({ openViewUserDialog: false })}
					open={this.state.openViewUserDialog}
					//fullScreen={true}
					fullWidth={true}
					maxWidth="xl"
				>
					<DialogContent  >
					<button class="btn btn-white m-15" style={{ float: 'right' }} onClick={() => this.setState({ openViewUserDialog: false })}   ><i className="ti-close"></i></button>
						{/* ======================================================================================= */}
						<div className="pricing-wrapper">
							<div className="pricing-top mb-50">
								<div className="row">
									<div className="col-sm-12 col-md-9 col-lg-7 mx-auto text-center">
										<h2 className="mb-20">Choose the plan that works for you.</h2>
										<div>
											<Label><b>Monthly</b></Label>
											<Switch onClick={() => this.onPlanChange(this.state.yearlyPlan)} on={this.state.yearlyPlan} />
											<Label><b>Yearly ( get {extra_month} month extra)</b></Label>
										</div>
									</div>
								</div>
							</div>
							<div className="price-list mb-0">
								<div className="row row-eq-height">
								
									<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
										<div className="pricing-icon mb-40">
											<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
										</div>
										<h2 className={`text-primary pricing-title`}><IntlMessages id="plan.Classic" /></h2>
										{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
										<div className="mb-25">
											<h2 className="amount-title"><IntlMessages id="widgets.free" /></h2>
											{/*  <h2 className="amount-title">${price}<sub>/mo</sub></h2> */}
										</div>
										<div className="plan-info">
											<span><IntlMessages id="widgets.connect1device" /></span>
										</div>
										<div className="pricing-body text-left text-primary"  >
											<ul className="list-unstyled plan-info-listing">
										
											{(() => {
												const options = [];
												for (let i = 1; i <= 5; i++) {
													options.push(
													<li className="d-flex justify-align-start" key={'1'+i}>
													<i className="ti-check-box"></i>
													<a ><IntlMessages id={"plan.classic.m"+i} /></a>
												</li>);
												}
												return options;
												})()}
											</ul>
										</div>

					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 0)?
							<Button color={"primary"}
							onClick={()=> this.installApp(this.state.popupBrowserId,0)}  
							className="btn-block btn-lg" style={{ width: "113%"}} >
								<small>Your Current Subscription</small>
							</Button>
						:
							<Button color={"primary"}
								onClick={()=> this.installClassicAlertApp(this.state.popupBrowserId,0)}  
								className="btn-block btn-lg" style={{ width: "113%"}} >
								<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 0)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span></small>
							</Button>
					:
						<Button color={"primary"}  onClick={()=> this.installApp(this.state.popupBrowserId,0)} 
						className="btn-block btn-lg" style={{ width: "113%"}}  >
							<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 0)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span></small>
						</Button>
					}

									
									</RctCollapsibleCard>
									{/*===================================== plan 2 start ==========================================*/}
									<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
										<div className="pricing-icon mb-40">
											<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
										</div>
										<h2 className={`text-warning pricing-title`}><IntlMessages id="plan.Silver" /></h2>
										
										{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
										<div className="mb-25">
											<h2 className="amount-title">${this.state.silverPlan}<sub>/mo</sub></h2>
											{/* <span className="text-muted small">Connect 1 device</span> */}
										</div>
										<div className="plan-info">
											<span><IntlMessages id="widgets.connect1device" /></span>
										</div>
										<div className="pricing-body text-left text-warning">
											<ul className="list-unstyled plan-info-listing">

											{(() => {
												const options = [];
												for (let i = 1; i <= 10; i++) {
													options.push(
													<li className="d-flex justify-align-start" key={'1'+i}>
													<i className="ti-check-box"></i>
													<a ><IntlMessages id={"plan.silver.m"+i} /></a>
												</li>);
												}
												return options;
												})()}
											</ul>
										</div>


			
					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 1)?
								<Button color={"warning"}
								className="btn-block btn-lg" style={{ width: "113%"}} >
								<small>Your Current Subscription</small>
								</Button>
							:
								h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 1) ,this.state.not_expired_plans)?
									<Button color={"warning"}
										onClick={()=> this.onChangeUpgradePopupDetail(1 ,get_plan_name_by_id(AppConfig.plans_array, 1),get_plan_name_by_id(AppConfig.plan_price_array, 1))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
										<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 1)} for ${this.state.silverPlanYM}/<span class="month">{this.state.planDuration}</span></small>
								
									</Button>
								:
									<Button color={"warning"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,1,this.state.upgradepopupdetal.serial_data)} 
									className="btn-block btn-lg" style={{ width: "113%"}}  >
										<small>activate again</small>
									</Button>
						
					:
						h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 1) ,this.state.not_expired_plans)?
							<Button color={"warning"}  onClick={()=> this.installApp(this.state.popupBrowserId,1)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 1)} for ${this.state.silverPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							</Button>
						:
							<Button color={"warning"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,1)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small>activate again</small>
							</Button>
					}	


									
									</RctCollapsibleCard>
									{/*===================================== plan 3 start ==========================================*/}

									<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
										<div className="pricing-icon mb-40">
											<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
										</div>
										<h2 className={`text-info pricing-title`}><IntlMessages id="plan.Gold" /></h2>
										
										{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
										<div className="mb-25">
											<h2 className="amount-title">${this.state.goldPlan}<sub>/mo</sub></h2>
											{/* <span className="text-muted small">Connect 1 device</span> */}
										</div>
										<div className="plan-info">
											<span><IntlMessages id="widgets.connect10devices" /></span>
										</div>
										<div className="pricing-body text-left text-info">
											<ul className="list-unstyled plan-info-listing">

											{(() => {
												const options = [];
												for (let i = 1; i <= 7; i++) {
													options.push(
												<li className="d-flex justify-align-start" key={'1'+i}>
													<i className="ti-check-box"></i>
													<a ><IntlMessages id={"plan.gold.m"+i} /></a>
												</li>);
												}
												return options;
												})()}
												
											</ul>
										</div>

					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 2)?
								<Button color={"info"}
								className="btn-block btn-lg" style={{ width: "113%"}} >
								<small>Your Current Subscription</small>
								</Button>
							:
								h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 2) ,this.state.not_expired_plans)?
									<Button color={"info"}
										onClick={()=> this.onChangeUpgradePopupDetail(2 ,get_plan_name_by_id(AppConfig.plans_array, 2),get_plan_name_by_id(AppConfig.plan_price_array, 2))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
										<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 2)} for ${this.state.goldPlanYM}/<span class="month">{this.state.planDuration}</span></small>
								
									</Button>
								:
									<Button color={"info"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,2,this.state.upgradepopupdetal.serial_data)} 
									className="btn-block btn-lg" style={{ width: "113%"}}  >
										<small>activate again</small>
									</Button>
						
					:
						h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 2) ,this.state.not_expired_plans)?
							<Button color={"info"}  onClick={()=> this.installApp(this.state.popupBrowserId,2)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 2)} for ${this.state.goldPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							</Button>
						:
							<Button color={"info"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,2)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small>activate again</small>
							</Button>
					}	

					</RctCollapsibleCard>
									{/*===================================== plan 4 start ==========================================*/}
									<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
										<div className="pricing-icon mb-40">
											<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
										</div>
										<h2 style={{ color: "#953CC0" }} className={` pricing-title`}><IntlMessages id="plan.Diamond" /></h2>
								
										{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
										<div className="mb-25">
											<h2 className="amount-title">${this.state.diamondPlan}<sub>/mo</sub></h2>
											{/* <span className="text-muted small">Connect 1 device</span> */}
										</div>
										<div className="plan-info">
										<span><IntlMessages id="widgets.connect25devices" /></span>
										</div>
										<div className="pricing-body text-left" style={{ color: "#953CC0" }}>
											<ul className="list-unstyled plan-info-listing">

											{(() => {
												const options = [];
												for (let i = 1; i <= 6; i++) {
													options.push(
												<li className="d-flex justify-align-start" key={'1'+i}>
													<i className="ti-check-box"></i>
													<a ><IntlMessages id={"plan.diamond.m"+i} /></a>
												</li>);
												}
												return options;
												})()}
											</ul>
										</div>

								
					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 3)?
						<Button color={"zac"} className="btn-block btn-lg" style={{ width: "113%"}} >
								<small>Your Current Subscription</small>
								</Button>
							:
								h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 3) ,this.state.not_expired_plans)?
									<Button color={"zac"}
										onClick={()=> this.onChangeUpgradePopupDetail(3 ,get_plan_name_by_id(AppConfig.plans_array, 3),get_plan_name_by_id(AppConfig.plan_price_array, 3))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
										<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 3)} for ${this.state.diamondPlanYM}/<span class="month">{this.state.planDuration}</span></small>
								
									</Button>
								:
									<Button color={"zac"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,3,this.state.upgradepopupdetal.serial_data)} 
									className="btn-block btn-lg" style={{ width: "113%"}}  >
										<small>activate again</small>
									</Button>
						
					:
						h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 3) ,this.state.not_expired_plans)?
							<Button color={"zac"}  onClick={()=> this.installApp(this.state.popupBrowserId,3)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 3)} for ${this.state.diamondPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							</Button>
						:
							<Button color={"zac"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,3)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small>activate again</small>
							</Button>
					}	
										
									</RctCollapsibleCard>
								</div>
							</div>

						</div>



						{/* ======================================================================================= */}
						{/* <Plans /> */}
						
					</DialogContent>
				</Dialog>
				<SweetAlert
					success
					show={subs_success}
					title="Your Subscription was added successfully!"
					btnSize="sm"
					btnText="Go Back"
					//onConfirm={() => location.reload()}
					onConfirm={() => this.onGoBackClick()}
					>
					{this.state.sub_success_data &&
						<div>
							<p>App Name: <span className="fw-bold">{this.state.sub_success_data.app_name}</span></p>
							<p>Subscription Type: <span className="fw-bold">{this.state.sub_success_data.plan_name}</span></p>
							{this.state.sub_success_data.plan_name == 'Classic' ?
								<p><span className="fw-bold">{<IntlMessages id="widgets.free" />}</span></p>
								:
								<p>Expiration Date: <span className="fw-bold">{getTheDate(this.state.sub_success_data.stripe_end_date, 'MMM D,YYYY')}</span></p>
							}

						</div>
					}
				</SweetAlert>



        </div>
        );
    }
}

export default ForcedScrollButtons;
