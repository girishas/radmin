/**
	* User Management Page
*/
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
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
	hubCheckPaths, getOsNamesByIds, user_id, convertDateToTimeStamp, get_plan_name_by_id, dateMonthsDiff
} from "Helpers/helpers";
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import AppConfig from 'Constants/AppConfig';

import $ from 'jquery';

import UpgradePlan from './UpgradePlan';

import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
// add new user form

class AppPage extends Component {

	constructor() {
		super();
		this.state = {
			device_images: [],
			redirectToSub: false,
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
			openViewUserDialog: false
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
				NotificationManager.success('Subscription uninstalled!');
				location.reload();
			}, 2000);
		})
			.catch(error => {
				// error hanlding
			})
	}
	openUpgradePlanModal(key, sub_transaction, browser_language) {
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
			}
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

		api.get('getBrowsers', {
			params: {
				'serial_number': this.props.location.state ? this.props.location.state.serial_number : 1,
				'user_id': user_id(),
			}
		}).then((response) => {
			const data = response.data.data;
			const offset = 0;
			const currentpagedata = data.slice(offset, offset + AppConfig.paginate);

			console.log(this.props.location.state.device);
			this.setState({
				broswser: data, currentpagedata, totalRecords: response.data.totalRecord,
				serial_number: this.props.location.state ? this.props.location.state.serial_number : 1,
				plans: response.data.plans, pricePlan: response.data.price_plans
			});

		}).catch(error => {
			// error hanlding
		})
	}
	installAppPopup(key) {

		this.setState({
			openViewUserDialog: true,
			popupBrowserId: key,
			upgradepopupdetal: []
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
		//alert(device_name);

		let self = this;
		if (key == "regcode") {
			api.post('checkRegistrationCodeInstall', {
				params: {
					'promocode': registrationCode,
					'user_id': this.props.location.state.user_id,
					'serial_number': this.props.location.state.serial_number
				}
			}).then((response) => {
				const data = response.data.status;
				const message = response.data.message;
				if (data == 0) {
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
					'user_id': this.props.location.state.user_id,
					'serial_number': this.props.location.state.serial_number,
					'device_name': device_name,
					'browser_language': browser_language
				}
			}).then((response) => {
				const data = response.data.status;
				const message = response.data.message;
				if (data == 0) {
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
					//location.reload();
				}
			}).catch(error => {
				// error hanlding
			})
		} else {


			location.href = "purchase/" + browser_id + "/" + browser_language + "/" + browser_plan + "/" + encodeURIComponent(browser_name) + '/' + def_sub_id + '/' + this.props.location.state.device;
		}

	}
	componentDidMount() {

		this.getBrowsers();
	}
	onReloadSuccess() {



		location.reload();

	}


	onReload() {
		alert()
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
	render() {
		const { anchorEl, subs_success, loadings, currentpagedata, loading, broswser, totalRecords, selectedTransaction, plans, pricePlan, friendlyName, redirectToSub, browser_plan, device_images } = this.state;

		if (!broswser)
			return null;
		return (

			<div class="container">
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
								device_name: this.props.location.state.device


							}
						}}
					/>
				}

				<div class="row" style={{ height: '100px' }}>
					<div class="col-sm-12 col-lg-12 col-md-12">
						<div class="text-center">
							<h2><IntlMessages id="welcome.chameleon" /> {this.props.location.state.child_name}</h2>
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
										{broswser.is_install != 1 ?
											<div>

												{/* <div class="price form-group">
							<select class="form-control language4" id={"browser_language"+key}>
							{broswser.language && broswser.language.map((language, key)=> (
								<option selected={language.name.toLowerCase() == "english" ? true:false} value={language.id}>{language.name}</option>
							))}
							</select>
							</div> */}
												{/* <div class="price form-group">
							
							<select class="form-control plan_type4" id={"browser_plan"+key}>
							{plans && plans.map((plan,key1)=>(                                   
								<option value={key1}>{plan}{' ( $' +pricePlan[key1]+'/month ) '}</option>
							))}                             
							</select>
							</div> */}
												<input type="hidden" name="sub_id" value={broswser.default_subsc_id.subscription_id} className={"def_sub_id" + key} />
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
											<div>

												<input type="hidden" name="subscri_id" value={broswser.serial_data.subscription_id} className={"subscri_id" + key} />
												<input type="hidden" name="sub_child_name" value={broswser.transaction_data.child_name} className={"sub_child_name" + key} />
												<input type="hidden" name="sub_transaction" value={broswser.transaction_data} className={"sub_transaction" + key} />
												{broswser.transaction_data.plan_name == 'Classic' ?
													<div style={{
														height: "70px",
														verticalAlign: "middle",
														width: "320px",
														display: "table-cell"
													}}>
														<Label> <b>Free Subscription</b></Label>
													</div>
													:
													<div style={{
														height: "70px",
														verticalAlign: "middle",
														width: "320px",
														display: "table-cell"
													}}>
														<Label> <b>Sub Renew Date:</b> {getTheDate(broswser.transaction_data.stripe_end_date, 'MMM D, YYYY')}
															{' '}({timeAgo(getTheDate(broswser.transaction_data.stripe_end_date, 'MMMM D,YY'))})</Label>
														<Label> <b>Total Months Subscribed:</b> {dateMonthsDiff(getTheDate(broswser.transaction_data.stripe_start_date, 'MMMM D,YY'))}</Label>
													</div>
												}

												<div className="form-group">
													<Link style={{ width: '75%' }} to={{
														pathname: '/app/content-manager/' + getOsNamesByIds(AppConfig.os_types_array, broswser.serial_data.os_type).toLowerCase(),
														state: {
															os_type: broswser.serial_data.os_type,
															os_name: getOsNamesByIds(AppConfig.os_types_array, broswser.serial_data.os_type),
															subs_id: broswser.serial_data.subscription_id,
															subs_type: get_plan_id_by_name(broswser.transaction_data.plan_name),
															child_name: broswser.transaction_data.child_name,
															login_user_id: user_id(),
															browser_id: broswser.id,
															browser_name: broswser.name,
														}
													}}> <span><button class="btn btn-white" style={{ backgroundColor: "#5D92F4", color: "white", width: '75%' }}  ><IntlMessages id="welcome.contentmanager" /></button></span></Link>


												</div>
												<div className="form-group">
													<span><button class="btn btn-white" onClick={() => this.openUpgradePlanModal(key, broswser.transaction_data, broswser.language)} style={{ backgroundColor: "#5D92F4", color: "white", width: '56%' }}><IntlMessages id="widgets.ModifyPlan" /></button></span>
												</div>
												<div class="price form-group">

													{/* {broswser.transaction_data.is_subscription_canceled == 0 &&                                   */}
													<a href="javascript:void(0)" style={{ width: '75%' }} onClick={() => this.onDelete(broswser.transaction_data)}><button class="btn btn-danger install-btn" style={{ width: '75%' }} ><IntlMessages id="widgets.Uninstall" /></button></a>
													{/* } */}
												</div>
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

					fullWidth={true}
					maxWidth="xl"
				>
					<DialogContent  >

						<div>
							<div className="clearfix d-flex">
								<div className="media-body">
									<div class="row no-gutters mt-5">
										<div class="col-lg-4 col-sm-12">
											<div class="pricing-box text-center ">
												<div class="price-head mt-2 mb-2 purple">{<IntlMessages id="download.classic" />}</div>
												<div class="price-blog pt-4 pb-4">
													<div class="price"> <span class="currency">$</span><strong>{get_plan_name_by_id(AppConfig.plan_price_array, 0)}/</strong><span class="month">{<IntlMessages id="download.planfree" />}</span> </div>
												</div>
												<div class="listing purple_list">
													<ul class="mt-5">

														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.icondrivenmenu" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.mostengaging" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.besthand" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.securehundred" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.thousandsofhours" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.massiverange" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.educationaltours" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.multiplelanguages" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.multipledevices" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.regularsupport" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year">
																{<IntlMessages id="download.autoupdateweekly" />}
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>
														<li>
															<span class="time-of-year">
																<br />
															</span>
														</li>


													</ul>
												</div>
												<div class="form-group">
													{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
														<button onClick={() => this.onChangeUpgradePopupDetail(0, get_plan_name_by_id(AppConfig.plans_array, 0), get_plan_name_by_id(AppConfig.plan_price_array, 0))}
															class="btn btn-primary" style={{ width: " 90%" }} >
															{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 0) ?

																<span>Your Current Subscription</span>
																:
																<span>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 0)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span></span>
															}
														</button>
														:
														<button onClick={() => this.installApp(this.state.popupBrowserId, 0)}
															class="btn btn-primary" style={{ width: " 90%" }} >
															Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 0)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 0)}/<span class="month">{<IntlMessages id="download.planfree" />}</span>

														</button>
													}
												</div>
											</div>
										</div>
										<div class="col-lg-4 col-sm-12 r-mt3">
											<div class="pricing-box text-center ">
												<div class="price-head mt-2 mb-2 blue">{<IntlMessages id="download.homepremium" />}</div>
												<div class="price-blog pt-4 pb-4">
													<div class="price"> <span class="currency">$</span><strong>{get_plan_name_by_id(AppConfig.plan_price_array, 1)}/</strong><span class="month">{<IntlMessages id="download.planmonth" />}</span> </div>
												</div>
												<div class="listing ">
													<ul class="mt-5">
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.icondrivenmenu" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.mostengaging" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.besthand" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.securehundred" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.thousandsofhours" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.massiverange" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.educationaltours" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.multiplelanguages" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.multipledevices" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.prioritysupport" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.autoupdatedaily" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.controlpanel" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.exitbutton" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.scheduler" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.zacacademy" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.addowncontent" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.premiumcontent" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.personalizehomecontent" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.personalizethelogo" />}
															</span>
														</li>
														<li class="blue_bg" >
															<span class="time-of-year blue">
																{<IntlMessages id="download.singlelicence" />}
															</span>
														</li>


													</ul>
												</div>

												{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
													<button onClick={() => this.onChangeUpgradePopupDetail(1, get_plan_name_by_id(AppConfig.plans_array, 1), get_plan_name_by_id(AppConfig.plan_price_array, 1))}
														class="btn btn-primary" style={{ width: " 90%" }} >
														{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 1) ?

															<span>Your Current Subscription</span>
															:
															<span>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 1)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 1)}/<span class="month">{<IntlMessages id="download.planmonth" />}</span></span>
														}
													</button>
													:
													<button onClick={() => this.installApp(this.state.popupBrowserId, 1)}
														class="btn btn-primary" style={{ width: " 90%" }} >
														Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 1)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 1)}/<span class="month">{<IntlMessages id="download.planmonth" />}</span>

													</button>
												}





											</div>
										</div>
										<div class="col-lg-4 col-sm-12 r-mt3">
											<div class="pricing-box text-center ">
												<div class="price-head mt-2 mb-2 green">{<IntlMessages id="download.academicpremium" />}</div>
												<div class="price-blog pt-4 pb-4">
													<div class="price"> <span class="currency">$</span><strong>{get_plan_name_by_id(AppConfig.plan_price_array, 2)}/</strong><span class="month">{<IntlMessages id="download.planmonth" />}</span> </div>
												</div>
												<div class="listing ">
													<ul class="mt-5">
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.icondrivenmenu" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.mostengaging" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.besthand" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.securehundred" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.thousandsofhours" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.massiverange" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.educationaltours" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.multiplelanguages" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.multipledevices" />}
															</span>
														</li>
														<li class="purple_bg">
															<span class="time-of-year purple">
																{<IntlMessages id="download.prioritysupport" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.autoupdatedaily" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.controlpanel" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.exitbutton" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.scheduler" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.zacacademy" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.addowncontent" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.premiumcontent" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.personalizehomecontent" />}
															</span>
														</li>
														<li class="blue_bg">
															<span class="time-of-year blue">
																{<IntlMessages id="download.personalizethelogo" />}
															</span>
														</li>
														<li class="green_bg">
															<span class="time-of-year green">
																{<IntlMessages id="download.unlimitedlicence" />}
															</span>
														</li>
													</ul>
												</div>
												{this.state.upgradepopupdetal && this.state.upgradepopupdetal.subs_ids ?
													<button onClick={() => this.onChangeUpgradePopupDetail(2, get_plan_name_by_id(AppConfig.plans_array, 2), get_plan_name_by_id(AppConfig.plan_price_array, 2))}
														class="btn btn-primary" style={{ width: " 90%" }} >
														{this.state.upgradepopupdetal.transactionss.plan_name == get_plan_name_by_id(AppConfig.plans_array, 2) ?

															<span>Your Current Subscription</span>
															:
															<span>Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 2)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 2)}/<span class="month">{<IntlMessages id="download.planmonth" />}</span></span>
														}
													</button>
													:
													<button onClick={() => this.installApp(this.state.popupBrowserId, 2)}
														class="btn btn-primary" style={{ width: " 90%" }} >
														Subscribe to {get_plan_name_by_id(AppConfig.plans_array, 2)} for ${get_plan_name_by_id(AppConfig.plan_price_array, 2)}/<span class="month">{<IntlMessages id="download.planmonth" />}</span>

													</button>
												}


											</div>
										</div>
									</div>

								</div>




							</div>
							<button class="btn btn-white m-15" style={{ float: 'right' }} onClick={() => this.setState({ openViewUserDialog: false })}   >Close</button>

						</div>

					</DialogContent>
				</Dialog>
				<SweetAlert
					success
					show={subs_success}
					title="Your Subscription was added successfully!"
					btnSize="sm"
					btnText="Go Back"
					onConfirm={() => location.reload()}>
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


const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};

export default connect(mapStateToProps)(AppPage);
