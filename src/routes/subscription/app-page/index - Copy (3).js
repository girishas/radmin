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
	hubCheckPaths, getOsNamesByIds, user_id, convertDateToTimeStamp, get_plan_name_by_id, dateMonthsDiff,h_not_in_array
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

class AppPage extends Component {

	constructor() {
		super();
		this.state = {
			openPopupOnLoad:false,
			not_expired_plans:[],
			device_images: [],
			purchasePageDetails: [],
			propState: [],
			redirectToSub: false,
			redirectToPurchase:false,
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
		};
	


	}
	handleClose = () => {
		this.setState({ anchorEl: null });
	};
	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};


	onDelete(data ,is_child_subscription) {
		console.log('onDelete data',data)
		this.setState({ selectedUser: data });
		if(is_child_subscription == 0){
			this.refs.deleteConfirmationDialog.open();
		}else{
			this.cancelTransactionPermanently(data.subscription_id)
		}
	
		
	}

	installClassicAlertApp(data) {
		this.refs.deleteConfirmationDialogInstallClassic.open();
		//this.setState({ selectedUser: data });
	}
	
	installClassicAlertFunction(){
		this.refs.deleteConfirmationDialogInstallClassic.close();
		this.installApp(this.state.popupBrowserId,0)
	}

	cancelTransactionPermanently(subscription_id=null) {
		const { selectedUser } = this.state;
		// if(selectedUser.plan_name == 'Classic'){
		// this.refs.deleteConfirmationDialog.close();               
		// NotificationManager.error('Classic plan not to be cancel !');
		// return false;
		// }
		var fun_subscription_id =0;
		if(subscription_id){
			fun_subscription_id =subscription_id;
		}else{
			fun_subscription_id =selectedUser.subscription_id;
		}
		let users = this.state.currentpagedataSub;
		
		this.refs.deleteConfirmationDialog.close();
		this.setState({ loading: true });
		let self = this;
		api.post('cancle-subscription', {
			'id': fun_subscription_id,
			'serial_number': localStorage.getItem("f_deviceId"),
		}).then((response) => {
			// console.log('aaa',response);
			// console.log('aaa',response.data.browser_unique_id);
			/* users.splice(indexOfDeleteUser, 1);*/
			if( window.IsChameleon ){
				chameleonEngine.uninstallBrowser(response.data.browser_unique_id)
			}
			// chameleonEngine.installBrowser(response.data.unique_id)
			setTimeout(() => {
				self.setState({ loading: false,  selectedUser: null });
				NotificationManager.success(<IntlMessages id="note.SubscriptionUninstalled"/>);
				//location.href = AppConfig.chameleon_web_admin_url;
				self.getBrowsers();
				//location.reload();
			}, 2000);
		})
			.catch(error => {
				// error hanlding
			})
	}
	openUpgradePlanModal(key, sub_transaction, browser_language ,not_expired_plans=[],serial_data) {
		this.setState({ openViewUserDialog: true, popupBrowserId: key });
		//this.setState({ upgradePlanModal: true}); 
		var subscri_id = $('.subscri_id' + key).val();
		var sub_child_name = $('.sub_child_name' + key).val();
		var sub_transaction = sub_transaction;
		var sub_br_id = $("#browser_id" + key).attr('rel');
		var sub_browser_name = $("#browser_id" + key).attr('rel_name');
		var browser_language = browser_language;

		//console.log(sub_transaction);
		this.setState({
			openViewUserDialog: true,
			popupBrowserId: key,
			upgradepopupdetal: {
				...this.state.upgradepopupdetal,
				subs_ids: subscri_id,
				child_names: sub_child_name,
				browser_ids: sub_br_id,
				browser_names: sub_browser_name,
				transactionss: sub_transaction,
				browser_language: browser_language,
				serial_data:serial_data
			},
			not_expired_plans:not_expired_plans,
			
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
		console.log('componentWillReceiveProps location.state',newProps);
		if(newProps.location.state ){
			localStorage.setItem("appPage.user_id", newProps.location.state.user_id)
			localStorage.setItem("appPage.serial_number", newProps.location.state.serial_number)
			localStorage.setItem("appPage.child_name", newProps.location.state.child_name)
			localStorage.setItem("appPage.device", newProps.location.state.device)
			localStorage.setItem("appPage.os_type", newProps.location.state.os_type)
		}
		
		var  user_id = localStorage.getItem("appPage.user_id");
		var  serial_number = localStorage.getItem("appPage.serial_number");
		var  child_name = localStorage.getItem("appPage.child_name");
		var  device = localStorage.getItem("appPage.device");
		var  os_type = localStorage.getItem("appPage.os_type");
		
		this.setState({
			propState: {
				...this.state.propState,
				user_id: user_id,
				serial_number: serial_number,
				child_name: child_name,
				device: device,
				os_type: os_type,
			}
		})

		this.setState({ loading: true })
	
		setTimeout(() => {
			this.getBrowsers();
			this.setState({ loading: false })
		}, 500);

	}
	
	componentDidUpdate(){
		//document.getElementById("ModifySubscription3aa").click()
		//$('#ModifySubscription3').trigger('click');
	}
	componentDidMount() {
		//window.scrollTo(0, 0)
		//document.getElementById("ModifySubscription3").click()
		
		//$('.sasasasas').click();

		
		console.log('componentDidMount app-pagedevice out',this.props.location);

		if(this.props.location.state ){
			console.log('componentDidMount app-pagedevice in',this.props.location);
			localStorage.setItem("appPage.user_id",this.props.location.state.user_id)
			localStorage.setItem("appPage.serial_number", this.props.location.state.serial_number)
			localStorage.setItem("appPage.child_name", this.props.location.state.child_name)
			localStorage.setItem("appPage.device", this.props.location.state.device)
			localStorage.setItem("appPage.os_type", this.props.location.state.os_type)
		}else{
			this.setState({ loading: false })
		}
		
		var  user_id = localStorage.getItem("appPage.user_id");
		var  serial_number = localStorage.getItem("appPage.serial_number");
		var  child_name = localStorage.getItem("appPage.child_name");
		var  device = localStorage.getItem("appPage.device");
		var  os_type = localStorage.getItem("appPage.os_type");
		
		this.setState({
			openPopupOnLoad:true,
			propState: {
				...this.state.propState,
				user_id: user_id,
				serial_number: serial_number,
				child_name: child_name,
				device: device,
				os_type: os_type,
			}
		})

		 if(localStorage.getItem("locationReaload")){
			localStorage.removeItem("locationReaload")
			location.reload();
			return
		}
		this.getBrowsers();
		
	}
	onGoBackClick(){
		this.setState({ loading: false , subs_success :false,openViewUserDialog: false,upgradepopupdetal: []})
		this.getBrowsers();
	}
	showKeyAlert(broswser){
		this.setState({show_key_alert :true, browserKeyDetail:broswser});
	
		//this.getBrowsers();
	}
	closeKeyAlert(){
		this.setState({loading:true})
		api.get('update_status_is_launched', {
			params: {
				'transection_id': this.state.browserKeyDetail.transaction_data.id ,
			}
		}).then((response) => {
			
			
			
		})
		chameleonEngine.launchBrowser(this.state.browserKeyDetail.unique_id);
		this.setState({loading:false , show_key_alert :false, browserKeyDetail:[]})
		this.getBrowsers();
		
	}
	getBrowsers() {
		console.log('appPage.serial_number' ,localStorage.getItem("appPage.serial_number"));
		api.post('getBrowsers', {
				'serial_number': localStorage.getItem("appPage.serial_number"),
				'user_serial_number': localStorage.getItem("f_deviceId"),
				'user_id': user_id(),
				'os_type': localStorage.getItem("appPage.os_type")
		},{
			headers: {'User-Id':user_id()}
			},
		).then((response) => {
			const data = response.data.data;
			const extra_month = response.data.extra_month;
			const offset = 0;
			const currentpagedata = data.slice(offset, offset + AppConfig.paginate);
			console.log('data',data)
			//console.log(this.state.propState.device);
			this.setState({
				broswser: data, currentpagedata, totalRecords: response.data.totalRecord,
				serial_number: this.state.propState ? this.state.propState.serial_number : 1,
				plans: response.data.plans, pricePlan: response.data.price_plans , extra_month:extra_month
			});
			if( localStorage.getItem("popup_browser_id") > 0 ){
				var popup_browser_id =localStorage.getItem("popup_browser_id") ;
				localStorage.removeItem("popup_browser_id")
				data && data.map((broswser, key) => (
					(broswser.id == popup_browser_id)?
						this.openUpgradePlanModal(key, broswser.transaction_data, broswser.language , broswser.not_expired_plans ,broswser.serial_data)
					:''
				))
			}
			
		}).catch(error => {
			// error hanlding
		})
	}
	installAppPopup(key,not_expired_plans=[]) {
		console.log('not_expired_plans',not_expired_plans)
		this.setState({
			openViewUserDialog: true,
			popupBrowserId: key,
			upgradepopupdetal: [],
			not_expired_plans: not_expired_plans
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

		var def_sub_id = $(".def_sub_id" + key).val();
		var device_name = $(".device_" + key).val();
		var yearlyPlanType = 1;
		if(this.state.yearlyPlan){
			 yearlyPlanType = 2;
		}
		//alert(device_name);
		let self = this;
		if (key == "regcode") {
			api.post('checkRegistrationCodeInstall', {
				params: {
					'promocode': registrationCode,
					'user_id': this.state.propState.user_id,
					'serial_number': this.state.propState.serial_number,

					'child_name': this.state.propState.child_name,
					'device': this.state.propState.device,
					'os_type': this.state.propState.os_type,
				
				}
			},{headers: {'User-Id':user_id()}}
				).then((response) => {
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
						}
					})
					if( window.IsChameleon){
						
						chameleonEngine.installBrowser(response.data.browser_unique_id);
						console.log('installBrowser');
					}
					//location.reload();
				}
			}).catch(error => {
				// error hanlding
			})
		} else if (browser_plan == '0') {
			api.post('checkRegistrationCodeInstall',{
				params: {
					'browser_id': browser_id,
					'plan_id': browser_plan,
					'user_id': this.state.propState.user_id,
					'serial_number': this.state.propState.serial_number,
					'browser_language': browser_language,
					'child_name': this.state.propState.child_name,
					'device': this.state.propState.device,
					'os_type': this.state.propState.os_type,
				
				}
			},{headers: {'User-Id':user_id()}} ).then((response) => {
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
						}
					})

					if( window.IsChameleon){
						
						chameleonEngine.installBrowser(response.data.browser_unique_id)
						console.log('installBrowser Classic');
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
					device:this.state.propState.device,
					os_type:this.state.propState.os_type,
					serial_number:this.state.propState.serial_number,
				}
				
			})
			//location.href = "purchase/" + yearlyPlanType + "/" + browser_id + "/" + browser_language + "/" + browser_plan + "/" + encodeURIComponent(browser_name) + '/' + def_sub_id + '/' + this.state.propState.device;
		}

	}
//install again plans
installAppAgain(key, plan_id , serial_data=null ) {
	let serial_data_id = '';
	if(serial_data){
		serial_data_id = serial_data.id;
	}
	this.setState({ loading: true });
	let self = this;
		api.post('activate_not_expired_plan_again', {
				'browser_id': key,
				'plan_id': plan_id,
				'user_id': this.state.propState.user_id,
				'serial_number': this.state.propState.serial_number,
				'user_serial_number': localStorage.getItem("f_deviceId"),
				'serial_data_id': serial_data_id,
		},
		{headers: {'User-Id':user_id()}}
		).then((response) => {
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
					}
				})

				if(window.IsChameleon){
					
					chameleonEngine.installBrowser(response.data.browser_unique_id)
					console.log('installBrowser Old');
				}
				//location.reload();
			}
		}).catch(error => {
			// error hanlding
		})

}


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
	render() {
		const { anchorEl, subs_success,show_key_alert , loadings, currentpagedata, loading, 
			broswser, totalRecords, selectedTransaction, plans, pricePlan, friendlyName, 
			redirectToSub, redirectToPurchase,browser_plan, device_images , extra_month,openPopupOnLoad} = this.state;
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
				{(redirectToSub == true) &&
					<Redirect
						to={{
							pathname: '/app/subscription/upgrade',
							state: {
								subs_id: this.state.upgradepopupdetal.subs_ids,
								subs_type: this.state.pop_plan_id,
								plan_name: this.state.plan_name,
								plan_amount: this.state.plan_price,
								child_name: this.state.upgradepopupdetal.child_names,
								login_user_id: user_id(),
								browser_id: this.state.upgradepopupdetal.browser_ids,
								browser_name: this.state.upgradepopupdetal.browser_names,
								transaction: this.state.upgradepopupdetal.transactionss,
								device_name: this.state.propState.device,
								plan_type: yearlyPlanType,
								serial_number:this.state.propState.serial_number,
								os_type:this.state.propState.os_type,

							}
						}}
					/>
				}

				{(redirectToPurchase == true) &&
					<Redirect
						to={{
							pathname: '/app/subscription/purchase',
							state: {
								purchasePageDetails:this.state.purchasePageDetails,
								child_name: this.state.propState && this.state.propState.child_name
							}
						}}
					/>
				}

				<div class="row" style={{ height: '100px' }}>
					<div class="col-sm-12 col-lg-12 col-md-12">
						<div class="text-center">
							<h2><IntlMessages id="welcome.chameleon" /> {this.state.propState && this.state.propState.child_name}</h2>
							<p><IntlMessages id="chameleon.installbrowser" /></p>
						</div>
					</div>
				</div>
				<div class="col-sm-12 row rct-page-content ">

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
										<Label  id={"browser_id" + key} rel={broswser.id} rel_name={broswser.name}>{broswser.name}
											{broswser.is_install == 1 && broswser.serial_data.is_expired == 0 ?
												" " + broswser.transaction_data.plan_name : ""}
										</Label>
									</h2>
									<div class="form-group">
								{broswser.is_install != 1 ?
											<div>
												<div class="price form-group">
													{broswser.description &&
														<IntlMessages id={broswser.description} />
													}
												</div>
												<div class="price form-group">
													<button class="btn btn-primary" style={{ width: '56%' }} onClick={() => this.installAppPopup(key)}  ><IntlMessages id="widgets.Install" /></button>
												</div>
											</div>
											:
											broswser.serial_data.is_expired == 1 ?
												<div>
													<div class="price form-group">
														{broswser.description &&
															<IntlMessages id={broswser.description} />
														}
													</div>
													<div class="price form-group">
														<button class="btn btn-primary" style={{ width: '56%' }} onClick={() => this.installAppPopup(key,broswser.not_expired_plans)}  ><IntlMessages id="widgets.Install" /></button>
													</div>
												</div>
											:
											<div>
												<input type="hidden" name="subscri_id" value={broswser.serial_data.subscription_id} className={"subscri_id" + key} />
												<input type="hidden" name="sub_child_name" value={this.state.propState && this.state.propState.child_name} className={"sub_child_name" + key} />
												<input type="hidden" name="sub_transaction" value={broswser.transaction_data} className={"sub_transaction" + key} />
												{broswser.transaction_data.plan_name == 'Classic' ?
													<div style={{
														height: "70px",
														verticalAlign: "middle",
														width: "320px",
														display: "table-cell"
													}}>
														<Label> <b><IntlMessages id="widgets.FreeSubscription"/></b></Label>
													</div>
													:
													<div style={{
														height: "70px",
														verticalAlign: "middle",
														width: "320px",
														display: "table-cell"
													}}>
														<Label> <b><IntlMessages id="widgets.SubRenewDate"/>:</b> {getTheDate(broswser.transaction_data.stripe_end_date, 'MMM D, YYYY')}
															{' '}({timeAgo(getTheDate(broswser.transaction_data.stripe_end_date, 'MMMM D,YY'))})</Label>
														<Label> <b><IntlMessages id="widgets.TotalMonthsSubscribed"/>:</b> {dateMonthsDiff(getTheDate(broswser.transaction_data.stripe_start_date, 'MMMM D,YY'))}</Label>
													</div>
												}
											{broswser.is_child_subscription == 0 &&
												<div className="form-group">
													<Link style={{ width: '75%' }} to={{
														pathname: '/app/content-manager/' + getOsNamesByIds(AppConfig.os_types_array, broswser.serial_data.os_type).toLowerCase(),
														state: {
															device: this.state.propState && this.state.propState.device,
															serial_number: this.state.propState && this.state.propState.serial_number,
															os_type: broswser.serial_data.os_type,
															os_name: getOsNamesByIds(AppConfig.os_types_array, broswser.serial_data.os_type),
															subs_id: broswser.serial_data.subscription_id,
															subs_type: get_plan_id_by_name(broswser.transaction_data.plan_name),
															child_name: this.state.propState && this.state.propState.child_name,
															login_user_id: user_id(),
															browser_id: broswser.id,
															browser_name: broswser.name,
															
														}
													}}> <span><button class="btn btn-white" style={{ backgroundColor: "#5D92F4", color: "white", width: '75%' }}  ><IntlMessages id="welcome.contentmanager" /></button></span></Link>

												</div>
										 	} 

												<div className="form-group">
													<span><button id={"modifySubscription"+broswser.id} class={"btn btn-white modifySubscription"} onClick={() => this.openUpgradePlanModal(key, broswser.transaction_data, broswser.language , broswser.not_expired_plans ,broswser.serial_data)} style={{ backgroundColor: "#5D92F4", color: "white", width: '56%' }}><IntlMessages id="widgets.ModifySubscription" /></button></span>
												</div>

												<div class="price form-group" >

													{/* {broswser.transaction_data.is_subscription_canceled == 0 &&                                   */}
													<a href="javascript:void(0)" style={{ width: '75%' }} onClick={() => this.onDelete(broswser.serial_data , broswser.is_child_subscription)}><button class="btn btn-danger install-btn" style={{ width: '75%' }} ><IntlMessages id="widgets.Uninstall" /></button></a>
													{/* } */}
												</div>
												{(window.IsChameleon && broswser.transaction_data.is_launched == 1 ) &&
													<div  class="price form-group" 
														onClick={() => chameleonEngine.launchBrowser(broswser.unique_id)}
													 >
														 <a href="javascript:void(0)" style={{ width: '75%' }} >
														 <button class="btn btn-success " style={{ width: '75%' }} ><IntlMessages id="widgets.LaunchTheApp" /></button></a> 
														{ broswser.user_xml_os ?
															<Label>{ broswser.user_xml_os.setting_exit_key ? broswser.user_xml_os.setting_exit_key : 'Ctrl + L'} <IntlMessages id="widgets.toQuit"/></Label>
															:
															//window.IsChameleon &&
															<Label>Ctrl + L <IntlMessages id="widgets.toQuit"/></Label>
														}
													</div>
												}
												{(window.IsChameleon && broswser.transaction_data.is_launched == 0) &&
													<div  class="price form-group" onClick={() => this.showKeyAlert(broswser)} >
														 <a href="javascript:void(0)" style={{ width: '75%' }} >
														 <button class="btn btn-success " style={{ width: '75%' }} ><IntlMessages id="widgets.LaunchTheApp" /></button></a> 
														{ broswser.user_xml_os ?
															<Label>{ broswser.user_xml_os.setting_exit_key ? broswser.user_xml_os.setting_exit_key : 'Ctrl + L'} <IntlMessages id="widgets.toQuit"/></Label>
															:
															<Label>Ctrl + L <IntlMessages id="widgets.toQuit"/></Label>
														}
													</div>
												}
											</div>

										}
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
					<div class="col-xs-4 col-sm-4 bottom-margin" style={{ textAlign: "right" }}>
						<label><IntlMessages id="browser.receivedARegistrationCode" /></label>
					</div>
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
										<h2 className="mb-20"><IntlMessages id="widgets.planHeading"/></h2>
										<div>
											<Label><b><IntlMessages id="widgets.monthly"/></b></Label>
											<Switch onClick={() => this.onPlanChange(this.state.yearlyPlan)} on={this.state.yearlyPlan} />
											<Label><b><IntlMessages id="widgets.yearly"/> ( <IntlMessages id="widgets.get"/> {extra_month} <IntlMessages id="widgets.monthExtra"/>)</b></Label>
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
							//onClick={()=> this.installApp(this.state.popupBrowserId,0)}  
							className="btn-block btn-lg" style={{ width: "113%"}} >
								<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
							</Button>
						:
							<Button color={"primary"}
								onClick={()=> this.installClassicAlertApp(this.state.popupBrowserId,0)}  
								className="btn-block btn-lg" style={{ width: "113%"}} >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 0)} <IntlMessages id="widgets.for"/> ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span></small>
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
								<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
								</Button>
							:
								h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 1) ,this.state.not_expired_plans)?
									<Button color={"warning"}
										onClick={()=> this.onChangeUpgradePopupDetail(1 ,get_plan_name_by_id(AppConfig.plans_array, 1),get_plan_name_by_id(AppConfig.plan_price_array, 1))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
										<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 1)} <IntlMessages id="widgets.for"/> ${this.state.silverPlanYM}/<span class="month">{this.state.planDuration}</span></small>
								
									</Button>
								:
									<Button color={"warning"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,1,this.state.upgradepopupdetal.serial_data)} 
									className="btn-block btn-lg" style={{ width: "113%"}}  >
										<small><IntlMessages id="widgets.activateAgain"/></small>
									</Button>
						
					:
						h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 1) ,this.state.not_expired_plans)?
							<Button color={"warning"}  onClick={()=> this.installApp(this.state.popupBrowserId,1)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 1)} <IntlMessages id="widgets.for"/> ${this.state.silverPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							</Button>
						:
							<Button color={"warning"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,1)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.activateAgain"/></small>
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
								<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
								</Button>
							:
								h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 2) ,this.state.not_expired_plans)?
									<Button color={"info"}
										onClick={()=> this.onChangeUpgradePopupDetail(2 ,get_plan_name_by_id(AppConfig.plans_array, 2),get_plan_name_by_id(AppConfig.plan_price_array, 2))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
										<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 2)} <IntlMessages id="widgets.for"/> ${this.state.goldPlanYM}/<span class="month">{this.state.planDuration}</span></small>
								
									</Button>
								:
									<Button color={"info"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,2,this.state.upgradepopupdetal.serial_data)} 
									className="btn-block btn-lg" style={{ width: "113%"}}  >
										<small><IntlMessages id="widgets.activateAgain"/></small>
									</Button>
						
					:
						h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 2) ,this.state.not_expired_plans)?
							<Button color={"info"}  onClick={()=> this.installApp(this.state.popupBrowserId,2)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 2)} <IntlMessages id="widgets.for"/> ${this.state.goldPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							</Button>
						:
							<Button color={"info"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,2)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.activateAgain"/></small>
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
								<small><IntlMessages id="widgets.YourCurrentSubscription"/></small>
								</Button>
							:
								h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 3) ,this.state.not_expired_plans)?
									<Button color={"zac"}
										onClick={()=> this.onChangeUpgradePopupDetail(3 ,get_plan_name_by_id(AppConfig.plans_array, 3),get_plan_name_by_id(AppConfig.plan_price_array, 3))} 
										className="btn-block btn-lg" style={{ width: "113%"}} >
										<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 3)} <IntlMessages id="widgets.for"/> ${this.state.diamondPlanYM}/<span class="month">{this.state.planDuration}</span></small>
								
									</Button>
								:
									<Button color={"zac"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,3,this.state.upgradepopupdetal.serial_data)} 
									className="btn-block btn-lg" style={{ width: "113%"}}  >
										<small><IntlMessages id="widgets.activateAgain"/></small>
									</Button>
						
					:
						h_not_in_array(get_plan_name_by_id(AppConfig.plans_array, 3) ,this.state.not_expired_plans)?
							<Button color={"zac"}  onClick={()=> this.installApp(this.state.popupBrowserId,3)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.SubscribeTo"/> {get_plan_name_by_id(AppConfig.plans_array, 3)} <IntlMessages id="widgets.for"/> ${this.state.diamondPlanYM}/<span class="month">{this.state.planDuration}</span></small>
							</Button>
						:
							<Button color={"zac"}  onClick={()=> this.installAppAgain(this.state.popupBrowserId,3)} 
							className="btn-block btn-lg" style={{ width: "113%"}}  >
								<small><IntlMessages id="widgets.activateAgain"/></small>
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
					//onConfirm={() => location.reload()}
					onConfirm={() => this.onGoBackClick()}
					>
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
				{this.state.browserKeyDetail.user_xml_os &&
				<SweetAlert
					alert
					show={show_key_alert}
				//	title="To Exit Zac Browser you need to click on CTRL+L Please type CTRL+L on your keyboard to confirm."
					btnSize="sm"
					confirmBtnText={"Press "+(this.state.browserKeyDetail.user_xml_os.setting_exit_key ? this.state.browserKeyDetail.user_xml_os.setting_exit_key : 'Ctrl + L') +" to confirm"}
					//onConfirm={() => location.reload()}
					onConfirm={() => this.closeKeyAlert()}
					>
					
						<div>
						<h2 className="text-dark">
						<IntlMessages id="widgets.ToExit" /> {this.state.browserKeyDetail.name} <IntlMessages id="widgets.infoExitBrowser" /> {this.state.browserKeyDetail.user_xml_os.setting_exit_key ? this.state.browserKeyDetail.user_xml_os.setting_exit_key : ' Ctrl + L'}</h2>
						
						</div>
						
					
						{/* <div>
							<p>App Name:dfgdfg</p>
							<p><IntlMessages id="widgets.SubscriptionType"/>: fdgdfg</p>
								<p><IntlMessages id="widgets.expiryDate"/>: <span className="fw-bold"></span></p>
						</div> */}
					
				</SweetAlert>
					}

		{this.state.upgradepopupdetal.transactionss &&
			<DeleteConfirmationDialog
               ref="deleteConfirmationDialogInstallClassic"
               title={"Are you sure you want to cancel '"+this.state.upgradepopupdetal.transactionss.plan_name+"' subscription ?"}
               //message={"Are sure they want to cancel "+this.state.upgradepopupdetal.transactionss.plan_name}
               onConfirm={() => this.installClassicAlertFunction()}
               btnCancel={<IntlMessages id="button.noCancelSubs" />}
               btnYes={<IntlMessages id="button.yesCancelSubs" />}
            />
		}
		
			</div>

		

);
	}

}


const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};

export default connect(mapStateToProps)(AppPage);
