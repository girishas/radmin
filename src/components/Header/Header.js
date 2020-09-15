/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

// actions
import { collapsedSidebarAction } from 'Actions';

// helpers
import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from './Notifications';
import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import LanguageProvider from './LanguageProvider';
import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm';
import Cart from './Cart';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import UserBlock from '../Sidebar/UserBlock';
import zIndex from '@material-ui/core/styles/zIndex';


class Header extends Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()   // Create a ref object 
	}
	state = {
		customizer: false,
		isMobileSearchFormVisible: false
	}

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		const val = !this.props.navCollapsed;
		this.props.collapsedSidebarAction(val);
	}

	// open dashboard overlay
	openDashboardOverlay() {
		$('.dashboard-overlay').toggleClass('d-none');
		$('.dashboard-overlay').toggleClass('show');
		if ($('.dashboard-overlay').hasClass('show')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
	}

	// close dashboard overlay
	closeDashboardOverlay() {
		$('.dashboard-overlay').removeClass('show');
		$('.dashboard-overlay').addClass('d-none');
		$('body').css('overflow', '');
	}

	// toggle screen full
	toggleScreenFull() {
		screenfull.toggle();
		
	}

	// mobile search form
	openMobileSearchForm() {
		this.setState({ isMobileSearchFormVisible: true });
	}

	
	
	// When the user clicks on the button, scroll to the top of the document
	 topFunction() {
		//	$("div").scrollTop(0);
		$('div').animate({scrollTop:0}, 'slow');
	  return false;
	}

	 scrollFunction() {
		
	  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		//document.getElementById("myBtn").style.display = "block";
		$("#myBtn").css("display", "block");
	  } else {
		$("#myBtn").css("display", "none");
		//document.getElementById("myBtn").style.display = "none";
	  }
	}
	ffonscroll(){
		
		window.onscroll = this.scrollFunction();
	}

	render() {
		const { isMobileSearchFormVisible } = this.state;
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		const { horizontalMenu, agencyMenu, location } = this.props;
		const userDetails = window.localStorage.getItem('user_id');
	  const authUser = JSON.parse(userDetails);
	  this.ffonscroll()


	 



		return (
			<div>
			<AppBar position="static" className="rct-header">
			
			<div ref={this.myRef}></div> 
				<Toolbar className="d-flex justify-content-between w-100 pl-0">
					<div className="d-flex align-items-center">
						{(horizontalMenu || agencyMenu) &&
						
							<div className="site-logo">
							{/*<Link to="/" className="logo-mini">
									<img src={require('Assets/img/appLogo.png')} className="mr-15" alt="site logo" width="35" height="35" />
							</Link> */}
								<Link to="/app/dashboard" className="logo-normal">
									<img src={require('Assets/img/chameleon.png')} className="img-fluid" alt="site-logo" width="150" height="40" />
								</Link>
							</div>

							
							
							 
						}
						{/* {(horizontalMenu || agencyMenu) &&
							// <div className="headerDownload text-dark"> Download</div>
							<div className="headerDownload">
								<Link to="/app/download"  >
									<Button variant="raised" color="primary" className="text-white">
											<i className="zmdi zmdi-download"></i>
										<span className="menu-title"><IntlMessages id="sidebar.download" /></span>
									</Button>
								</Link>
								<Link to="/app/forum/topics"  className="ml-15">
									<Button variant="raised" color="primary" className="text-white">
								
											<i className="zmdi zmdi-comments"></i>
										<span className="menu-title"><IntlMessages id="sidebar.Forum" /></span>
									</Button>
								</Link>
							</div>
							

						} */}
						{!agencyMenu &&
							<ul className="list-inline mb-0 navbar-left">
								{!horizontalMenu ?
									<li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
										<Tooltip title="Sidebar Toggle" placement="bottom">
											<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
												<MenuIcon />
											</IconButton>
										</Tooltip>
									</li> :
									<li className="list-inline-item">
										<Tooltip title="Sidebar Toggle" placement="bottom">
											<IconButton color="inherit" aria-label="Menu" className="humburger p-0" component={Link} to="/">
												<i className="ti-layout-sidebar-left"></i>
											</IconButton>
										</Tooltip>
									</li>
									 
								}
								{/*{!horizontalMenu && <QuickLinks />}
									<li className="list-inline-item search-icon d-inline-block">
									<SearchForm />
									<IconButton mini="true" className="search-icon-btn" onClick={() => this.openMobileSearchForm()}>
										<i className="zmdi zmdi-search"></i>
									</IconButton>
									<MobileSearchForm
										isOpen={isMobileSearchFormVisible}
										onClose={() => this.setState({ isMobileSearchFormVisible: false })}
									/>
									</li>*/}
										<li></li>
									<li className="list-inline-item show-mobile-all">
										<UserBlock authUser={authUser} />
									</li>	
									
									<li></li>
							</ul>
						}
					</div>
					<ul className="navbar-right list-inline mb-0">
					{ /*<li className="list-inline-item summary-icon">
							<Tooltip title="Summary" placement="bottom">
								<a href="javascript:void(0)" className="header-icon " onClick={() => this.openDashboardOverlay()}>
									<i className="zmdi zmdi-info-outline"></i>
								</a>
							</Tooltip>
						</li>
						{!horizontalMenu &&
							<li className="list-inline-item">
								<Tooltip title="Upgrade" placement="bottom">
								<Button component={Link} to={`/${getAppLayout(location)}/pages/pricing`} variant="raised" className="upgrade-btn tour-step-4 text-white" color="primary">
										<IntlMessages id="widgets.upgrade" />
									</Button>
								</Tooltip>
							</li>
					} */}
					
				
						<LanguageProvider />
					
						<Notifications /> 
						
						{/* <Cart />  */}
					
						{window.IsChameleon &&
							<li className="list-inline-item ">
							
								<IconButton aria-label="minimize"  onClick={() => window.minimizeChameleon()}>
									<i className="zmdi zmdi-window-minimize"></i>
								</IconButton>
							
						</li>
						}
						{window.IsChameleon &&
						<li className="list-inline-item ">
							
								<IconButton aria-label="close"  onClick={() => window.closeChameleon()}>
									<i className="zmdi zmdi-close"></i>
								</IconButton>
							
						</li>
						}
						{/* {window.IsChameleon &&
						<li className="list-inline-item">
							<Tooltip title="Log Out" placement="bottom">
								<IconButton aria-label="logout" onClick={() => window.logoutChameleon()}>
									<i className="zmdi zmdi-power text-danger"></i>
								</IconButton>
							</Tooltip>
						</li>
						} */}
				
						{!window.IsChameleon &&
						<li className="list-inline-item">
							<Tooltip title="Full Screen" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.toggleScreenFull()}>
									<i className="zmdi zmdi-crop-free"></i>
								</IconButton>
							</Tooltip>
						</li>
						}
				
					</ul>
					
					{/* <Drawer
						anchor={'right'}
						open={this.state.customizer}
						onClose={() => this.setState({ customizer: false })}
					>
						<ChatSidebar />
					</Drawer> */}
				</Toolbar>
				<DashboardOverlay
					onClose={() => this.closeDashboardOverlay()}
				/>
				 {/* <ScrollButton scrollStepInPx="50" delayInMs="16.66"/> */}
			

			</AppBar>
			{/* <button id="myBtn" title='Back to top' className='scroll' style={{zIndex:9999}}
				onClick={ () => { this.topFunction(); }}>
			 	<span className='arrow-up material-icons'>arrow_upward</span>
		   </button> */}
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
};

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction
})(Header));

