/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import Avatar from '@material-ui/core/Avatar';
// components
import SupportPage from '../Support/Support';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// redux action
import { logoutUserFromFirebase } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { hubCheckPaths , user_id } from "Helpers/helpers";
import api from 'Api';

class UserBlock extends Component {

	state = {
		userDropdownMenu: false,
		isSupportModal: false,
	}

	componentDidMount() {
		api.post('user-info',{
			'id':user_id(),
		},{
			headers: {'User-Id':user_id()}
			},
			).then((response) => {
				localStorage.setItem('user_id',JSON.stringify(response.data.data));
				
		})
		
		let self = this;
		api.post('forum/get-user-badges', { id: user_id() })
			.then((response) => {
				self.setState({ badges: response.data.badges });
				var  created_badge_array  = response.data.created_badge_array
				created_badge_array.map((headers, key) => {
					self.setState({ isSound: true});
					
					//var newaa = <IntlMessages id={headers} />+"headers has been assign to you.";
					var newaa = headers;
					//newaa =  <IntlProvider locale={'en'} messages={headers}/>
					NotificationManager.success(newaa);
				})
			
			})
			.catch(error => {
				// error hanlding
			})



	}
	

	/**
	 * Logout User
	 */
	logoutUser() {
		localStorage.clear();
		window.IsChameleon && window.closeChameleon()
		this.props.logoutUserFromFirebase();
	}
	/**
	 * logoutUserUninstall User
	 */
	logoutUserUninstall() {
		this.refs.deleteConfirmationDialogUninstallAll.close();
		if(window.IsChameleon ){
			//window.logoutChameleon()
			api.post('cancelUserAllPlans',{
				'user_id':user_id(),
				'serial_number':window.localStorage.getItem('f_deviceId'),
			}).then((response) => {	
				chameleonEngine.disconnectDevice()
				window.closeChameleon()
			})
		}			
		this.props.logoutUserFromFirebase();
	}
	logoutUserUninstallAlert(){
		this.refs.deleteConfirmationDialogUninstallAll.open();
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}

	/**
	 * Open Support Modal
	 */
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}

	/**
	 * On Close Support Page
	 */
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}

	/**
	 * On Submit Support Page
	 */
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
	}

	render() {
		const { authUser } = this.props;
	
		return (
			<div className="top-sidebar">
				<div className="sidebar-user-block" style={{minWidth:'190px'}}>
					<Dropdown
						isOpen={this.state.userDropdownMenu}
						toggle={() => this.toggleUserDropdownMenu()}
						className="rct-dropdown"
					>
						<DropdownToggle
							tag="div"
							className="d-flex align-items-center"
						>
							
							<div className="media ">
                                    {authUser.photo !== '' && authUser.photo !== null ?
                                       <img src={hubCheckPaths('images')+authUser.photo} alt="user prof" alt="user profile"
									className="img-fluid rounded-circle"
									width="45"
									height="100" />
                                       : <Avatar className="" >{authUser.full_name.charAt(0)}</Avatar>
                                    }
                                 </div>
							<div className="user-info hide-mobile-all">
								<span className="user-name ml-4">{authUser.full_name}</span>
								<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
							</div>
						</DropdownToggle>
						<DropdownMenu>
							<ul className="list-unstyled mb-0 nav-item" style={{fontSize:'small'}}>
								<li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
									{/* <p className="text-white mb-0 fs-14">{authUser.full_name}</p> */}
									<span className="text-white fs-14">{ authUser
										.email }</span>
								</li>
								{/* <li className="border-top nav-item">
								<Link  className="nav-link no-arrow" to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 0 ,
                                         }
                                    }}>
                                        <i className="ti-user text-info mr-3"></i><span><IntlMessages id="components.generalInfo" /></span>
                                    </Link> 
									</li>
								<li className="border-top nav-item">
									<Link className="nav-link no-arrow"  to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 1 ,
                                        }
                                    }}>
                                        <i className="ti-camera text-secondary mr-3"></i><span><IntlMessages id="components.profilePicture" /></span>
                                    </Link>
                            	</li>
								<li className="border-top nav-item">
								<Link className="nav-link no-arrow" to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 2 ,
                                        }
                                    }}>
                                        <i className="ti-home  text-success mr-3"></i><span><IntlMessages id="components.address" /></span>
                                    </Link> 
                            	</li>
								<li className="border-top nav-item">
								<Link className="nav-link no-arrow" to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 3 ,
                                        }
                                    }}>
                                        <i className="ti-lock  text-primary mr-3"></i><span><IntlMessages id="widgets.password" /></span>
                                    </Link> 
									</li>
									<li className="border-top nav-item">
								<Link className="nav-link no-arrow"  to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 4 ,
                                         }
                                    }}>
                                        <i className="ti-medall  mr-3"style={{color:'brown'}} ></i><span><IntlMessages id="sidebar.badges" /></span>
                                    </Link> 
								</li>  */}
								<li className="border-top nav-item">
								<Link className="nav-link no-arrow"  to={{
                                        pathname: '/app/user/user-profile-1',
                                        state: { activeTab: 0 ,
                                         }
                                    }}>
                                        <i className="ti-settings text-warning mr-3"></i><span><IntlMessages id="components.manageAccount" /></span>
                                    </Link> 
								</li> 
							
								
								{window.IsChameleon &&
								<li className="border-top">
									<a href="javascript:void(0)" className="" onClick={() => this.logoutUserUninstallAlert()}>
										<i className="zmdi zmdi-sign-in text-secondary mr-3"></i>
										<IntlMessages id="widgets.disconnectAccount" />
									</a>
								</li>
								}
								<li className="border-top">
									<a href="javascript:void(0)" onClick={() => this.logoutUser()}>
										<i className="zmdi zmdi-power text-danger mr-3"></i>
										<IntlMessages id="widgets.logOut" />
									</a>
								</li>
							</ul>
						</DropdownMenu>
					</Dropdown>
				</div>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>

		{window.IsChameleon &&
			<DeleteConfirmationDialog
               ref="deleteConfirmationDialogUninstallAll"
               title={<IntlMessages id="widgets.disconnectDeviceConfirmationMsg" />}
               //message={"Are sure they want to cancel "+this.state.upgradepopupdetal.transactionss.plan_name}
               onConfirm={() => this.logoutUserUninstall()}
               btnCancel={<IntlMessages id="button.no" />}
               btnYes={<IntlMessages id="button.yes" />}
            />
		}
			</div>
		);
	}
}



// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
}

export default connect(mapStateToProps, {
	logoutUserFromFirebase
})(UserBlock);
