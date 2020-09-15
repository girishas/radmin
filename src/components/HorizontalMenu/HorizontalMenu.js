/**
	* Horizontal Menu
*/
import React, { Component } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import IntlMessages from 'Util/IntlMessages';
import SweetAlert from 'react-bootstrap-sweetalert'
import navLinks from './NavLinks';
import LinearProgress from '@material-ui/core/LinearProgress';
import NavMenuItem from './NavMenuItem';
// redux action
import { logoutUserFromFirebase } from 'Actions';
import { connect } from 'react-redux';
import { get_plan_id_by_name, hubCheckPaths, user_id } from "Helpers/helpers";
import Avatar from '@material-ui/core/Avatar';
//link
import { Link } from 'react-router-dom';
import api from 'Api';
import UserBlock from '../Sidebar/UserBlock';
import AppConfig from 'Constants/AppConfig';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import $ from 'jquery';
import { getTheDate } from "Helpers/helpers";
class HorizontalMenu extends Component {
	constructor() {
		super();
		this.state = {
			openDialogeModalBox: false,
			userSubcriptions: null,
			registerpromocode: '',
			subs_success: false,
			loading: false,
			sub_success_data: [],
			plan_name: '',
			stripe_end_date: '',
			app_name: ''
		}
	}
	componentDidMount() {
		
		const userDetails = window.localStorage.getItem('user_id');
		const authUser = JSON.parse(userDetails);
		const serial_number = localStorage.getItem("f_deviceId")
		api.get('user-get-subscriptions', {
			params: {
				user_id: authUser.id,
				serial_number: serial_number,
			},
			headers: { 'User-Id': user_id() },
		})
			.then((response) => {
				this.setState({ userSubcriptions: response.data });
				// console.log('response.data',response.data)
			})
			.catch(error => {
				console.log(error);
			})

	}
	onGoBackClick() {
		this.setState({ loading: false, subs_success: false, openDialogeModalBox: false })
		window.location.reload();
	}
	handleChange = () => {
		this.setState({ registerpromocode: event.target.value });
	}
	installApp = () => {
		this.setState({loading:true});
		var registrationCode = this.state.registerpromocode;
		var serial_number = localStorage.getItem("f_deviceId");
		var os = localStorage.getItem("f_os");
		var device = localStorage.getItem("f_deviceType");
		var child_name = localStorage.getItem("child_name");
		api.post('checkRegistrationCodeInstall', {
			params: {
				'promocode': registrationCode,
				'user_id': user_id(),
				'serial_number': serial_number=='null'?localStorage.getItem("appPage.serial_number"):serial_number,
				'child_name': child_name=='null'?localStorage.getItem('appPage.child_name'):child_name,
				'device': device=='null'?localStorage.getItem('appPage.device'):device,
				'os_type': os=='null'?localStorage.getItem('appPage.os_type'):os,
			}
		}, { headers: { 'User-Id': user_id() } }
		).then((response) => {
			const data = response.data.status;
			const message = response.data.message;

			if (data == 0) {
				this.setState({ loading: false })
				alert(message);
			} else {
				this.setState({
					loading: false,
					subs_success: true,
					sub_success_data: {
						...this.state.sub_success_data,
						app_name: response.data.app_name,
						plan_name: response.data.plan_name,
						stripe_end_date: response.data.stripe_end_date,
					}
				})
				if (window.IsChameleon) {
					chameleonEngine.installBrowser(response.data.browser_unique_id);
					console.log('installBrowser');
				}

			}
		}).catch(error => {
			// error hanlding
		})
	}
	openDialogeModal = () => {
		this.setState({ openDialogeModalBox: true });
	}


	render() {
		const userDetails = window.localStorage.getItem('user_id');
		const {loading} = this.state;

		const authUser = JSON.parse(userDetails);

		return (
			<div className="horizontal-menu" >
				<ul className="list-unstyled nav">
					{/*                    
			<li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-file-text"></i>
			<span className="menu-title"><span>Content Manager  </span></span>
			</a>
			<ul className="list-unstyled sub-menu">
			<li className="nav-item">
			<a className="nav-link no-arrow" href="/app/subscription/your"><i></i><span>Your subscriptions</span></a>
			</li>
			<li className="nav-item"><a className="nav-link no-arrow" href="/app/subscription/expired"><i></i><span>Expired subscriptions</span></a></li>
			</ul>
		</li> */}

					<li className="nav-item remove-arrow">
			<Link to="/app/dashboard" >
				<i className="zmdi zmdi-home"></i>
				<span className="menu-title"><IntlMessages id="sidebar.home" /></span>
			</Link>
		</li>
		
					<li className="nav-item">
						<a href="javascript:void(0);" className="nav-link"><i className="zmdi zmdi-shopping-basket"></i><span className="menu-title"><span>{<IntlMessages id="sidebar.contentManager" />}</span></span></a>
						<ul className="list-unstyled sub-menu">
							{this.state.userSubcriptions != null && this.state.userSubcriptions.length > 0 ?
								// window.IsChameleon ?
								// 		this.state.userSubcriptions.map((userSubcription, key) => (
								// 		<li key={userSubcription.id} className="nav-item customBrowserNavBitem">
								// 		<Link  className="nav-link no-arrow" to={{
								// 						pathname: '/app/subscription/app-page',
								// 						state: {
								// 							device: userSubcription.device,
								// 							serial_number: userSubcription.serial_number,
								// 							child_name: userSubcription.friendly_name,
								// 							os_type: userSubcription.os_type,
								// 							user_id:userSubcription.user_id

								// 						}
								// 					}}>
								// 		<span className="browserDataName">
								// 			<div>
								// 				<img src={hubCheckPaths('images') + userSubcription.browser_image} alt="user prof" className="rounded-circle mr-15" width="40" height="40" />
								// 			</div> 

								// 			<span className="span_nav_browser_name " style={{margin: 'auto'}}>{userSubcription.browser_name +" "+ userSubcription.plan_name}</span>   
								// 		</span>
								// 		</Link>

								// 		</li>
								// 	)) 

								// :

								this.state.userSubcriptions.map((userSubcription, key) => (
									<li key={userSubcription.id} className="nav-item customBrowserNavBitem">
										<Link className="nav-link no-arrow" to={{
											pathname: '/app/subscription/app-page',
											state: {
												device: userSubcription.device,
												serial_number: userSubcription.serial_number,
												child_name: userSubcription.friendly_name,
												os_type: userSubcription.os_type,
												user_id: userSubcription.user_id

											}
										}}>
											<span className="browserDataName">
												<div>
													{userSubcription.device != null && userSubcription.device.toLowerCase() == "computer" ?
														<img src={require('Assets/img/desktop.png')} alt="user prof" className="rounded-circle mr-15" width="40" height="40" />

														: ""}
													{userSubcription.device != null && userSubcription.device.toLowerCase() == "phone" ?
														<img src={require('Assets/img/phone.png')} alt="user prof" className="rounded-circle mr-15" width="40" height="40" />

														: ""}
													{userSubcription.device != null && userSubcription.device.toLowerCase() == "tablet" ?
														<img src={require('Assets/img/tablet.png')} alt="user prof" className="rounded-circle mr-15" width="40" height="40" />

														: ""}
													{userSubcription.device != null && userSubcription.device.toLowerCase() == "box" ?
														<img src={require('Assets/img/box.png')} alt="user prof" className="rounded-circle mr-15" width="40" height="40" />

														: ""}


												</div>
												{/* { get_plan_id_by_name(userSubcription.plan_name)> 1?
				<span className="span_nav_browser_name " style={{margin: 'auto'}}>{userSubcription.browser_name +" "+ userSubcription.plan_name}</span>
				:
				<span className="span_nav_browser_name " style={{margin: 'auto'}}>{userSubcription.friendly_name}</span>
			} */}
												<span className="span_nav_browser_name " style={{ margin: 'auto' }}>{userSubcription.friendly_name}</span>
											</span>
										</Link>

									</li>
								)) :
								<ul className="list-unstyled sub-menu">
									<li className="nav-item">
										<Link className="nav-link no-arrow" to={'/app/subscription/installweb'} >
											<i></i><span>You don't have any active subscription.</span>
										</Link>
									</li>

								</ul>

							}
						</ul>
					</li>

					<li className="nav-item">
						<a href="javascript:void(0);" className="nav-link">
							<i className="zmdi zmdi-shopping-basket"></i>
							<span className="menu-title"><IntlMessages id="sidebar.transactions" /></span>
						</a>
						<ul className="list-unstyled sub-menu">
							{navLinks.category8.map((menu, key) => (
								<NavMenuItem
									menu={menu}
									key={key}
								/>
							))}
						</ul>
					</li>
					{/* 		
		<li className="nav-item">
		<a href="javascript:void(0);" className="nav-link">
		<i className="zmdi zmdi-card-membership"></i>
		<span className="menu-title"><IntlMessages id="sidebar.givingback" /></span>
		</a>
		<ul className="list-unstyled sub-menu">
		{navLinks.category5.map((menu, key) => (
			<NavMenuItem
			menu={menu}
			key={key}
			/>
		))}
		</ul>
		</li>              */}
					{/*                     
			<li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-group"></i>
			<span className="menu-title"><IntlMessages id="sidebar.top-supporters" /></span>
			</a>
			<ul className="list-unstyled sub-menu">
			{navLinks.category7.map((menu, key) => (
			<NavMenuItem
			menu={menu}
			key={key}
			/>
			))}
			</ul>
		</li> */}
					{/* 		
		<li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
				<i className="zmdi zmdi-blogger"></i>
				<span className="menu-title"><IntlMessages id="sidebar.whats-new" /></span>
			</a>
			<ul className="list-unstyled sub-menu">
				{navLinks.category9.map((menu, key) => (
					<NavMenuItem
					menu={menu}
					key={key}
					/>
				))}
			</ul>
		</li> */}
<li className="nav-item remove-arrow">
			<Link to="/app/forum/topics" >
				<i className="zmdi zmdi-comments"></i>
				<span className="menu-title"><IntlMessages id="widgets.SupportForum" /></span>
			</Link>
		</li>

					<li className="nav-item remove-arrow">
			<Link to="/app/ideas-incubator" >
				<i className="zmdi zmdi-pin-help"></i>
				<span className="menu-title"><IntlMessages id="sidebar.ideasIncubator" /></span>
			</Link>
		</li>

					<li className="nav-item remove-arrow">
						<a href="javascript:void(0)" onClick={this.openDialogeModal}>
							<i className="zmdi zmdi-shopping-basket"></i>
							<span className="menu-title"><IntlMessages id="sidebar.registrationCode" /></span>
						</a>
					</li>



					


					{/* <li className="nav-item">
		<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-paypal-alt"></i>
			<span className="menu-title"><span>{<IntlMessages id="project.donate" />}</span></span></a>
		<ul className="list-unstyled sub-menu">
			<li className="nav-item">
				<a target="_blank"  className="nav-link no-arrow" href={AppConfig.front_web_url+'pay-it-forward'} >
				<i></i><span>{<IntlMessages id="sidebar.makeADonation" />}</span>
				</a>
			</li>
			<li className="nav-item">
			<Link className="nav-link no-arrow"  to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 6 ,
                                         }
                                    }}>
				
				<i></i><span>{<IntlMessages id="sidebar.myDonation" />}</span>
				</Link>
			</li>
		</ul>
		</li> */}


					{/* <li className="nav-item">
		<a href="javascript:void(0);" className="nav-link">
		<i className="zmdi zmdi-help"></i>
		<span className="menu-title"><IntlMessages id="sidebar.support" /></span>
		</a>
		<ul className="list-unstyled sub-menu">
		{navLinks.category13.map((menu, key) => (
			<NavMenuItem
			menu={menu}
			key={key}
			/>
		))}
		</ul>
		</li> */}
					{ /*<li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-satellite"></i>
			<span className="menu-title"><IntlMessages id="sidebar.misc" /></span>
			</a>
			<ul className="list-unstyled sub-menu">
			{navLinks.category14.map((menu, key) => (
			<NavMenuItem
			menu={menu}
			key={key}
			/>
			))}
			</ul>
		</li> */ }





					{/* 
			<li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-chart-donut"></i>
			<span className="menu-title"><IntlMessages id="sidebar.changelogs" /></span>
			</a>
			<ul className="list-unstyled sub-menu">
			{navLinks.category10.map((menu, key) => (
			<NavMenuItem
			menu={menu}
			key={key}
			/>
			))}
			</ul>
		</li> */}
					{/* <li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-group"></i>
			<span className="menu-title"><IntlMessages id="sidebar.support" /></span>
			</a>
			<ul className="list-unstyled sub-menu">
			{navLinks.category11.map((menu, key) => (
			<NavMenuItem
			menu={menu}
			key={key}
			/>
			))}
			</ul>
			</li>
		*/}
					{/* <Link to={{
			pathname: '/app/user/user-profile-1',
			state: { activeTab: 0,
			user: authUser }
			}}>
			<div className="MuiListItemIcon-root-20 menu-icon"><i className="zmdi zmdi-accounts"></i><span className="menu" style={{marginLeft:'10px'}}><IntlMessages id="sidebar.userManager" /></span></div>
			
			
		</Link> */}
					{/* 
			<li className="nav-item">
			<a href="javascript:void(0);" className="nav-link">
			<i className="zmdi zmdi-widgets"></i>
			<span className="menu-title"><span><IntlMessages id="sidebar.userProfile" /></span></span>
			</a>
			<ul className="list-unstyled sub-menu">
			<li className="nav-link no-arrow" className="nav-item">
			<Link  className="nav-link no-arrow" to={{
			pathname: '/app/user/user-profile-1',
			state: { activeTab: 0 ,
			}
			}}>
			<i className="ti-user"></i><span><IntlMessages id="components.generalInfo" /></span>
			</Link> 
			</li>
			<li className="nav-item">
			<Link className="nav-link no-arrow"  to={{
			pathname: '/app/user/user-profile-1',
			state: { activeTab: 1 ,
			}
			}}>
			<i className="ti-camera"></i><span><IntlMessages id="components.profilePicture" /></span>
			</Link> 
			</li>
			
			<li className="nav-item">
			<Link className="nav-link no-arrow" to={{
			pathname: '/app/user/user-profile-1',
			state: { activeTab: 2 ,
			}
			}}>
			<i className="ti-home"></i><span><IntlMessages id="components.address" /></span>
			</Link> 
			</li>
			
			<li className="nav-item">
			<Link className="nav-link no-arrow" to={{
			pathname: '/app/user/user-profile-1',
			state: { activeTab: 3 ,
			}
			}}>
			<i className="ti-lock"></i><span><IntlMessages id="widgets.password" /></span>
			</Link> 
			</li>
			
			<li className="nav-item">
			<Link className="nav-link no-arrow"  to={{
			pathname: '/app/user/user-profile-1',
			state: { activeTab: 4 ,
			}
			}}>
			<i className="ti-settings"></i><span><IntlMessages id="components.manageAccount" /></span>
			</Link> 
			</li>
			
			
			
			
			</ul>
		</li> */}


					<div className="hide-mobile-all"><UserBlock authUser={authUser} /></div>
				</ul>

				<Dialog
					onClose={() => this.setState({ openDialogeModalBox: false })}
					open={this.state.openDialogeModalBox}
					maxWidth="lg"
					
					
				>
					<DialogTitle><IntlMessages id="sidebar.registrationCode" /><button class="btn btn-white m-15" style={{ float: 'right' }} onClick={() => this.setState({ openDialogeModalBox: false })}   ><i className="ti-close"></i></button></DialogTitle>
					<DialogContent>
					{loading &&
            <LinearProgress />
          }
						<div className="row col-sm-12 product rct-footer d-flex" style={{ marginBottom: "9%", width: "95.2%", marginLeft: "1%" }}>
							<div class="col-xs-4 col-sm-6 bottom-margin" style={{ textAlign: "right" }}>
								<label><IntlMessages id="browser.receivedARegistrationCode" /></label>
							</div>
							<div class="col-xs-4 col-sm-3 bottom-margin" style={{ textAlign: "center" }}>
								<input type="text" placeholder="Enter Code" name="registration_code" onChange={this.handleChange} id="registrationCode" className="registrationCode form-control" />
							</div>
							<div class="col-xs-4 col-sm-3 bottom-margin"><button type="button" onClick={() => this.installApp()} className="text-white ml-15 btn" variant="raised" color="primary" style={{ background: '#5D92F4' }}><IntlMessages id="sidebar.register" /></button></div>
						</div>
					</DialogContent>
				</Dialog>
				<SweetAlert
					success
					show={this.state.subs_success}
					title={<IntlMessages id="note.SubscriptionaAddedPopUpHeading" />}
					btnSize="sm"
					btnText={<IntlMessages id="button.GoBack" />}
					//onConfirm={() => location.reload()}
					onConfirm={() => this.onGoBackClick()}
				>
					{this.state.sub_success_data &&
						<div>
							<p><IntlMessages id="widgets.AppName" />: <span className="fw-bold">{this.state.sub_success_data.app_name}</span></p>
							<p><IntlMessages id="widgets.SubscriptionType" />: <span className="fw-bold">{this.state.sub_success_data.plan_name}</span></p>
							{this.state.sub_success_data.plan_name == 'Classic' ?
								<p><span className="fw-bold">{<IntlMessages id="widgets.free" />}</span></p>
								:
								<p><IntlMessages id="widgets.expiryDate" />: <span className="fw-bold">{getTheDate(this.state.sub_success_data.stripe_end_date, 'MMM D,YYYY')}</span></p>
							}

						</div>
					}
				</SweetAlert>

			</div>

		);
	}
}

//export default HorizontalMenu;

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
}

export default connect(mapStateToProps, {
	logoutUserFromFirebase
})(HorizontalMenu);
