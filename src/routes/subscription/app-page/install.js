/**
	* User Management Page
*/
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Button from '@material-ui/core/Button';
import { Button } from 'reactstrap';
import Switch from 'react-toggle-switch';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import SweetAlert from 'react-bootstrap-sweetalert'
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Badge
} from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { NotificationManager } from 'react-notifications';
import Avatar from '@material-ui/core/Avatar';
// rct card
import { Link } from 'react-router-dom';
import { RctCard } from 'Components/RctCard/index';
import { connect } from 'react-redux';
// api
import api from 'Api';
import {
	timeAgo, getTheDate, checkRoleAuth, get_lang_name_by_id,
	get_category_type_name_by_id, get_plan_id_by_name, print_tr_id,
	hubCheckPaths, getOsNamesByIds, user_id, convertDateToTimeStamp, get_plan_name_by_id, dateMonthsDiff ,inArray
} from "Helpers/helpers";
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import ReactTooltip from 'react-tooltip';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import AppConfig from 'Constants/AppConfig';

import $ from 'jquery';

import UpgradePlan from './UpgradePlan';
import Plans from './plans';

import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';

// add new user form

class Install extends Component {

	constructor() {
		super();
		this.state = {
			device_images: [],
			purchasePageDetails: [],
			redirectToSub: false,
			redirectToPurchase: false,
			redirectToAppPage: false,
			plan_price: null,
			plan_name: null,
			pop_plan_id: null,
			pop_language_id: null,
			editUser: null,
			broswser: null,
			upgradePlanModal: false,
			upgradepopupdetal: {
				subs_ids: null,
				child_names: null,
				browser_ids: null,
				browser_names: null,
				transactionss: null,
				browser_language: null,
			},
			plans: null,
			pricePlan: null,
			device_id: null,
			loading: false, // loading activity
			loadings: false,
			totalRecords: null,
			currentPage: null,
			totalPages: null,
			selectedTransaction: null,
			anchorEl: null,
			selectedIndex: 1,
			subs_success: false,
			sub_success_data: [],
			openViewUserDialog: false,

			yearlyPlan: false,
			silverPlan: 4.99,
			goldPlan: 14.99,
			diamondPlan: 24.99,
			
			silverPlanYM:4.99,
			goldPlanYM:14.99,
			diamondPlanYM:24.99,
			planDuration:<IntlMessages id="download.planmonth" /> ,
			user_has_active_device:[],
			user_has_active_device_data:[]


		};
		this.onPageChanged = this.onPageChanged.bind(this);
	}
	handleClose = () => {
		this.setState({ anchorEl: null });
	};
	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};


	onDelete(data) {
		this.refs.deleteConfirmationDialog.open();
		this.setState({ selectedUser: data });
	}


	cancelTransactionPermanently() {
		const { selectedUser } = this.state;
		// if(selectedUser.plan_name == 'Classic'){
		// this.refs.deleteConfirmationDialog.close();               
		// NotificationManager.error('Classic plan not to be cancel !');
		// return false;
		// }
		let users = this.state.currentpagedataSub;

		this.refs.deleteConfirmationDialog.close();
		this.setState({ loading: true });
		let self = this;
		api.post('cancle-subscription', {
			'id': selectedUser.id,
		}).then((response) => {
			console.log(response.data);

			/* users.splice(indexOfDeleteUser, 1);*/

			setTimeout(() => {
				self.setState({ loading: false, currentpagedataSub: response.data, selectedUser: null });
				NotificationManager.success(<IntlMessages id="note.SubscriptionUninstalled"/>);
				location.reload();
			}, 2000);
		})
			.catch(error => {
				// error hanlding
			})
	}


	onChangeUpgradePopupDetail(pop_plan_id, plan_name, plan_price) {
		var pop_language_id = localStorage.getItem("current_lang");

		if (this.state.upgradepopupdetal.transactionss.plan_name == plan_name) {
			return
		}

		// var pop_plan_id = $("#pop_plan_id").val();
		// // var plan_name = get_category_type_name_by_id(AppConfig.plans_array, pop_plan_id);
		// // var plan_price = get_category_type_name_by_id(AppConfig.plan_price_array, pop_plan_id);
		// var plan_name = $('#pop_plan_id option:selected').attr('plan_name');
		// var plan_price =$('#pop_plan_id option:selected').attr('plan_price');
		//return;
		this.setState({
			pop_language_id: pop_language_id,
			pop_plan_id: pop_plan_id,
			plan_name: plan_name,
			plan_price: plan_price,
			redirectToSub: true,
		});

	}

	onUpgradePlanModalClose() {
		this.setState({ upgradePlanModal: false })
	}
	componentWillReceiveProps(newProps, oldPorps) {
		this.setState({ loading: true })

		console.log('componentWillReceiveProps', newProps);
		setTimeout(() => {
			this.getBrowsers();
			this.setState({ loading: false })
		}, 500);

	}

	getBrowsers() {

		api.post('getBrowsers', {
				//'serial_number': this.props.location.state ? this.props.location.state.serial_number : 1,
				'serial_number':localStorage.getItem("f_deviceId"),
				'user_id': user_id(),
				'os_type': localStorage.getItem("f_os")
		},{headers: {'User-Id':user_id()}}).then((response) => {
			const data = response.data.data;
			const offset = 0;
			const currentpagedata = data.slice(offset, offset + AppConfig.paginate);

			//console.log(this.props.location.state.device);
			this.setState({
				broswser: data, currentpagedata, totalRecords: response.data.totalRecord,
				serial_number: this.props.location.state ? this.props.location.state.serial_number : 1,
				plans: response.data.plans, pricePlan: response.data.price_plans
			});
		

		}).catch(error => {
			// error hanlding
		})
	}
	installAppPopup(key ,user_has_active_device = 0, user_has_active_device_data=[]) {
		console.log('user_has_active_device',user_has_active_device)
		console.log('user_has_active_device_data',user_has_active_device_data)
		//console.log('aksaa',user_has_active_device_data[2].id)

		this.setState({
			openViewUserDialog: true,
			popupBrowserId: key,
			upgradepopupdetal: [],
			user_has_active_device:user_has_active_device,
			user_has_active_device_data:user_has_active_device_data
		});
	}
	installApp(key, plan_id) {
		if (key == "regcode") {
			var registrationCode = $("#registrationCode").val();
		}
		this.setState({ loading: true });
		var browser_id = $("#browser_id" + key).attr('rel');

		var browser_name = $("#browser_id" + key).attr('rel_name');
		var browser_language = localStorage.getItem("current_lang");
		var browser_plan = plan_id;

		let serial_number = 	localStorage.getItem("f_deviceId");
		let os = 	localStorage.getItem("f_os");
		let device = 	localStorage.getItem("f_deviceType");

		var device_name = $(".device_" + key).val();
		var yearlyPlanType = 1;
		if(this.state.yearlyPlan){
			 yearlyPlanType = 2;
		}
		// if( window.IsChameleon){
		
		// }
	

		let self = this;
		if (key == "regcode") {
			api.post('checkRegistrationCodeInstall',{
				params: {
					'promocode': registrationCode,
					'user_id': user_id(),
					'serial_number': serial_number,
					'child_name': this.props.location.state.child_name,
					'device': device,
					'os_type': os
				}
			},{headers: {'User-Id':user_id()}}).then((response) => {
				const data = response.data.status;
				const message = response.data.message;
				if (data == 0) {
					self.setState({loading: false})
					alert(message);
				} else {

					self.setState({
						loading: false,
						subs_success: true,
						sub_success_data: {
							...this.state.sub_success_data,
							app_name: response.data.app_name,
							plan_name: response.data.plan_name,
							stripe_end_date: response.data.stripe_end_date,

							device: response.data.device,
							serial_number: response.data.serial_number,
							child_name: response.data.child_name,
							os_type: response.data.os_type,
							user_id: response.data.user_id,
						}
					})
					if( window.IsChameleon){
						
						chameleonEngine.installBrowser(response.data.browser_unique_id)
					}
					//location.reload();
				}
			}).catch(error => {
				// error hanlding
			})
		} else if (browser_plan == '0') {
			api.post('checkRegistrationCodeInstall', {
				params: {
					'browser_id': browser_id,
					'plan_id': browser_plan,
					'user_id': user_id(),
					'browser_language': browser_language,

					'serial_number': serial_number,
					'child_name': this.props.location.state.child_name,
					'device': device,
					'os_type': os
				}
			},{headers: {'User-Id':user_id()}}).then((response) => {
				const data = response.data.status;
				const message = response.data.message;
				if (data == 0) {
					self.setState({loading: false})
					alert(message);
				} else {


					self.setState({
						loading: false,
						subs_success: true,
						sub_success_data: {
							...this.state.sub_success_data,
							app_name: response.data.app_name,
							plan_name: response.data.plan_name,
							stripe_end_date: response.data.stripe_end_date,

							device: response.data.device,
							serial_number: response.data.serial_number,
							child_name: response.data.child_name,
							os_type: response.data.os_type,
							user_id: response.data.user_id,
						}
					})
					if( window.IsChameleon){
					
						chameleonEngine.installBrowser(response.data.browser_unique_id)
					}
					//location.reload();
				}
			}).catch(error => {
				// error hanlding
			})
		} else {
			
			self.setState({
				loading: false,
				redirectToPurchase:true,
				purchasePageDetails: {
					...this.state.purchasePageDetails,
					plan_type:yearlyPlanType,
					browser_id:browser_id,
					browser_language:browser_language,
					browser_plan:browser_plan,
					browser_name:browser_name,
					device:device,
					os_type:os,
					serial_number:serial_number
				}
				
			})
			//location.href = "purchase/" + yearlyPlanType + "/" + browser_id + "/" + browser_language + "/" + browser_plan + "/" + encodeURIComponent(browser_name) + '/' + this.props.location.state.device;
		}

	}
	componentDidMount() {

		this.getBrowsers();
	}
	onReloadSuccess() {
		location.reload();

	}
	redirectToAppPage(){
		localStorage.setItem("locationReaload",true);
		this.setState({ redirectToAppPage: true });
	}
	


	onReload() {
		
		this.setState({ loading: true });
		let self = this;
		setTimeout(() => {
			self.setState({ loading: false });
		}, 2000);
	}

	onReloads() {
		this.setState({ loadings: true });
		let self = this;
		setTimeout(() => {
			self.setState({ loadings: false });
		}, 2000);
	}

	onPageChanged = data => {
		const { broswser } = this.state;
		const { currentPage, totalPages, pageLimit } = data;

		const offset = (currentPage - 1) * pageLimit;

		const currentpagedata = broswser.slice(offset, offset + pageLimit);

		this.setState({ currentpagedata, currentPage, totalPages });
	};


	// on plan change
	onPlanChange(isMonthly) {
		this.setState({ yearlyPlan: !isMonthly });
	
	

		if (isMonthly) {
			this.setState({ silverPlan: 4.99, goldPlan: 14.99, diamondPlan: 24.99,
				silverPlanYM: 4.99, goldPlanYM: 14.99, diamondPlanYM: 24.99,
				planDuration:<IntlMessages id="download.planmonth" /> 
				
			});
			
		} else {
			this.setState({ silverPlan: 4.16, goldPlan: 12.50, diamondPlan: 20.83,
				silverPlanYM: 49.99, goldPlanYM: 149.99, diamondPlanYM: 249.99,
				planDuration:<IntlMessages id="components.year" /> 
			});
		}
	}

	//on click quick activate btn
	installAppWhenhasDevice(regCode){
		$('#registrationCode').val(regCode);
		this.installApp("regcode")
	}
	render() {
		const { anchorEl, subs_success, loadings, currentpagedata, loading, broswser, 
			totalRecords, selectedTransaction, plans, pricePlan, friendlyName, 
			redirectToSub,redirectToPurchase ,redirectToAppPage , browser_plan, device_images } = this.state;
		let yearlyPlanType = 1
		if(this.state.yearlyPlan){
			 yearlyPlanType = 2
		}
		if (!broswser)
			return null;
		return (

			<div class="container">
			<PageTitleBar
               title=""
			   match={this.props.match}
			   enableBreadCrumb=""
            />
				{(redirectToPurchase == true) &&
					<Redirect
						to={{
							pathname: '/app/subscription/purchase',
							state: {
								purchasePageDetails:this.state.purchasePageDetails,
								child_name: this.props.location.state && this.props.location.state.child_name
							}
						}}
					/>
				}

				{(redirectToAppPage == true) &&
				
						<Redirect 
							from='install'
							to={{
								pathname: '/app/subscription/app-page',
								state: {
									device: this.state.sub_success_data.device,
									serial_number: this.state.sub_success_data.serial_number,
									child_name: this.state.sub_success_data.child_name,
									os_type: this.state.sub_success_data.os_type,
									user_id: this.state.sub_success_data.user_id,
								}
						}}
					/>
				}

				<div class="row" style={{ height: '100px' }}>
					<div class="col-sm-12 col-lg-12 col-md-12">
						<div class="text-center">
							<h2><IntlMessages id="welcome.chameleon" /> {this.props.location.state && this.props.location.state.child_name}</h2>
							<p><IntlMessages id="chameleon.installbrowser" /></p>
						</div>
					</div>
				</div>
				<div class="col-sm-12 row rct-page-content">

					{currentpagedata && currentpagedata.map((broswser, key) => (

						<div class="col-xs-12 col-sm-4 bottom-margin">
							<div class="product type-3 white-bg z-depth-1 text-center rct-block">
								<figure class="thumb relative ov-hidden">
									{broswser.image !== '' && broswser.image !== null ?
										<img src={hubCheckPaths('images') + broswser.image} alt="Browser" width="100%" />
										: <Avatar className="mr-15">{broswser.padmin !== null && broswser.browser_name !== null ? broswser.padmin.browser_name.charAt(0) : 'B'.charAt(0)}</Avatar>
									}
								</figure>
								<div class="desc pt-0" style={{ padding: '15px' }}>
									<h2 className="UpperCase">
										<a href="#" id={"browser_id" + key} rel={broswser.id} rel_name={broswser.name}>{broswser.name}
											{broswser.is_install == 1 ?
												" " + broswser.transaction_data.plan_name : ""}
										</a>
									</h2>
									<div class="form-group">
										
												<div class="price form-group">
													{broswser.description &&
														<IntlMessages id={broswser.description} />
													}
												</div>
												<div class="price form-group">
													<button class="btn btn-primary" style={{ width: '56%' }} onClick={() => this.installAppPopup(key ,broswser.user_has_active_device, broswser.user_has_active_device_data)}  ><IntlMessages id="widgets.Install" /></button>
												</div>
											
									</div>
								</div>
							</div>
						</div>
					))}
					{loading &&
						<RctSectionLoader />
					}
				</div>

				<div className="row col-sm-12 product rct-footer d-flex" style={{ marginBottom: "9%", width: "95.2%", marginLeft: "1%" }}>
					<div class="col-xs-4 col-sm-4 bottom-margin" style={{ textAlign: "right" }}><label><IntlMessages id="browser.receivedARegistrationCode" /></label></div>
					<div class="col-xs-4 col-sm-4 bottom-margin" style={{ textAlign: "center" }}>
						<input type="text" placeholder="Enter Registration Code" name="registration_code" id="registrationCode" className="registrationCode form-control" />
					</div>
					<div class="col-xs-4 col-sm-4 bottom-margin"><button type="button" onClick={() => this.installApp("regcode")} className="text-white ml-15 btn" variant="raised" color="primary" style={{ background: '#5D92F4' }}><IntlMessages id="sidebar.register" /></button></div>
				</div>
				<br />
				<Modal isOpen={this.state.upgradePlanModal} toggle={() => this.onUpgradePlanModalClose()}>
					<ModalHeader toggle={() => this.onUpgradePlanModalClose()}>
					</ModalHeader>
					<ModalBody>

						<div class="price form-group">
							<select class="form-control language4" id="pop_language_id">
								{this.state.upgradepopupdetal.browser_language && this.state.upgradepopupdetal.browser_language.map((language, key) => (
									<option selected={language.name.toLowerCase() == "english" ? true : false} value={language.id}>{language.name}</option>
								))}
							</select>
						</div>
						<div class="price form-group">
							<select class="form-control plan_type4" id="pop_plan_id">
								{plans && plans.map((plan, key1) => (
									<option plan_name={plan} plan_price={pricePlan[key1]} value={key1}>{plan}{' ( $' + pricePlan[key1] + '/month ) '}</option>
								))}
							</select>
						</div>
						<div class="price form-group">
							<button class="btn btn-primary" onClick={() => this.onChangeUpgradePopupDetail()}  ><IntlMessages id="widgets.upgrade" /></button>
						</div>
					</ModalBody>
				</Modal>

				<DeleteConfirmationDialog
					ref="deleteConfirmationDialog"
					title={<IntlMessages id="wedgit.sureToCancelSubs" />}
					message={<IntlMessages id="wedgit.sureToCancelSubsNote" />}
					onConfirm={() => this.cancelTransactionPermanently()}
					btnCancel={<IntlMessages id="button.noCancelSubs" />}
					btnYes={<IntlMessages id="button.yesCancelSubs" />}
				/>
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
										<h2 className="mb-20"><IntlMessages id="widgets.planHeading"/>.</h2>
										<div>
											<span><IntlMessages id="widgets.monthly"/></span>
											<Switch onClick={() => this.onPlanChange(this.state.yearlyPlan)} on={this.state.yearlyPlan} />
											<span><IntlMessages id="widgets.yearly"/> ( <IntlMessages id="widgets.get"/> 1 <IntlMessages id="widgets.monthExtra"/>)</span>
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
										<span>Connect up to 1 device</span>
										</div>
										<div className="pricing-body text-left text-primary">
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
										<Button color={"primary"}
										onClick={()=> this.onChangeUpgradePopupDetail(0 ,get_plan_name_by_id(AppConfig.plans_array, 0),get_plan_name_by_id(AppConfig.plan_price_array, 0))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
											{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 0)?

											<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
											:
											<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 0)} <IntlMessages id="widgets.for"/> ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span></small>
											}
										</Button>
										:
										<Button color={"primary"}  onClick={()=> this.installApp(this.state.popupBrowserId,0)} 
										className="btn-block btn-lg" style={{ width: "113%"}}  >
											<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 0)} <IntlMessages id="widgets.for"/> ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span></small>
										
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
													<li className="d-flex justify-align-start" key={'2'+i}>
													<i className="ti-check-box"></i>
													<a ><IntlMessages id={"plan.silver.m"+i} /></a>
												</li>);
												}
												return options;
												})()}
											</ul>
										</div>

					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						<Button color={"warning"}
						onClick={()=> this.onChangeUpgradePopupDetail(1 ,get_plan_name_by_id(AppConfig.plans_array, 1),get_plan_name_by_id(AppConfig.plan_price_array, 1))} 
						className="btn-block btn-lg" style={{ width: "113%"}} >
							{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 1)?

							<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
							:
							<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 1)} <IntlMessages id="widgets.for"/> ${this.state.silverPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							}
						</Button>
						:
						inArray(1 , this.state.user_has_active_device)  && this.state.user_has_active_device_data[1].plan_name == get_plan_name_by_id(AppConfig.plans_array, 1) ?
						
							<Button color={"warning"}  onClick={()=> this.installAppWhenhasDevice(this.state.user_has_active_device_data[1].code)} 
								className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.quickActivate" /></small>
							</Button>
						:
							<Button color={"warning"}  onClick={()=> this.installApp(this.state.popupBrowserId,1)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 1)} <IntlMessages id="widgets.for"/> ${this.state.silverPlanYM}/<span class="month">{this.state.planDuration}</span></small>
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
													<li className="d-flex justify-align-start" key={'3'+i}>
													<i className="ti-check-box"></i>
													<a ><IntlMessages id={"plan.gold.m"+i} /></a>
												</li>);
												}
												return options;
												})()}
											</ul>
										</div>

					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						<Button color={"info"}
						onClick={()=> this.onChangeUpgradePopupDetail(2 ,get_plan_name_by_id(AppConfig.plans_array, 2),get_plan_name_by_id(AppConfig.plan_price_array, 2))} 
						className="btn-block btn-lg" style={{ width: "113%"}} >
							{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 2)?

							<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
							:
							<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 2)} <IntlMessages id="widgets.for"/> ${this.state.goldPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							}
						</Button>
						:
						inArray(2 , this.state.user_has_active_device)  && this.state.user_has_active_device_data[2].plan_name == get_plan_name_by_id(AppConfig.plans_array, 2) ?
						
							<Button color={"info"}  onClick={()=> this.installAppWhenhasDevice(this.state.user_has_active_device_data[2].code)} 
								className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.quickActivate" /></small>
							</Button>
						:
							<Button color={"info"}  onClick={()=> this.installApp(this.state.popupBrowserId,2)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 2)} <IntlMessages id="widgets.for"/> ${this.state.goldPlanYM}/<span class="month">{this.state.planDuration}</span></small>
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
													<li className="d-flex justify-align-start" key={'4'+i}>
														<i className="ti-check-box"></i>
														<a ><IntlMessages id={"plan.diamond.m"+i} /></a>
													</li>);
												}
												return options;
												})()}
											</ul>
										</div>

										
					{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
						<Button color={"zac"}
						onClick={()=> this.onChangeUpgradePopupDetail(3 ,get_plan_name_by_id(AppConfig.plans_array, 3),get_plan_name_by_id(AppConfig.plan_price_array, 3))} 
						className="btn-block btn-lg" style={{ width: "113%"}} >
							{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 3)?

							<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
							:
							<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 3)} <IntlMessages id="widgets.for"/> ${this.state.diamondPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							}
						</Button>
						:
						inArray(3 , this.state.user_has_active_device)  && this.state.user_has_active_device_data[3].plan_name == get_plan_name_by_id(AppConfig.plans_array, 3) ?
						
							<Button color={"zac"}  onClick={()=> this.installAppWhenhasDevice(this.state.user_has_active_device_data[3].code)} 
								className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.quickActivate" /></small>
							</Button>
						:
							<Button color={"zac"}  onClick={()=> this.installApp(this.state.popupBrowserId,3)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 3)} <IntlMessages id="widgets.for"/> ${this.state.diamondPlanYM}/<span class="month">{this.state.planDuration}</span></small>
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
					title={<IntlMessages id="note.SubscriptionaAddedPopUpHeading"/>}
					btnSize="sm"
					btnText={<IntlMessages id="button.GoBack"/>}
					//onConfirm={() => location.reload()}>
					onConfirm={	() => this.redirectToAppPage(this.state.sub_success_data)}>
					{this.state.sub_success_data &&
						<div>
							<p><IntlMessages id="widgets.AppName"/>: <span className="fw-bold">{this.state.sub_success_data.app_name}</span></p>
							<p><IntlMessages id="widgets.SubscriptionType"/>: <span className="fw-bold">{this.state.sub_success_data.plan_name}</span></p>
							{this.state.sub_success_data.plan_name == 'Classic' ?
								<p><span className="fw-bold">{<IntlMessages id="widgets.free" />}</span></p>
								:
								<p><IntlMessages id="widgets.expiryDate"/>: <span className="fw-bold">{getTheDate(this.state.sub_success_data.stripe_end_date, 'MMM D,YYYY')}</span></p>
							}

						</div>
					}
				</SweetAlert>
			</div>

		);
	}

}


const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};

export default connect(mapStateToProps)(Install);
