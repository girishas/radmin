/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Link } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { NotificationManager } from 'react-notifications';
// rct theme provider
import RctThemeProvider from './RctThemeProvider';

//Horizontal Layout
import HorizontalLayout from './HorizontalLayout';

//Agency Layout
import AgencyLayout from './AgencyLayout';

//Main App
import RctDefaultLayout from './DefaultLayout';

// boxed layout
import RctBoxedLayout from './RctBoxedLayout';

// app signin
import AppSignIn from './SigninFirebase';
import AppSignUp from './SignupFirebase';
// helpers
import { IsChameleon } from "Helpers/helpers";
// async components
// api
import api from 'Api';

import {
	AsyncSessionLoginComponent,
	AsyncSessionRegisterComponent,
	AsyncSessionLockScreenComponent,
	AsyncSessionForgotPasswordComponent,
	AsyncSessionPage404Component,
	AsyncSessionPage500Component,
	AsyncTermsConditionComponent,
	AsyncForgotPasswordComponent,

	AsyncDeviceAuthLogin,
	AsyncDeviceAuthRegister,
	AsyncDeviceAuthForgotPassword

} from 'Components/AsyncComponent/AsyncComponent';

//Auth0
import Auth from '../Auth/Auth';

// callback component
import Callback from "Components/Callback/Callback";

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';


//Auth0 Handle Authentication
const auth = new Auth();

const handleAuthentication = ({ location }) => {
	if (/access_token|id_token|error/.test(location.hash)) {
		auth.handleAuthentication();
	}
}

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, ...rest, authUser }) => {
	return <Route
				{...rest}
				render={props =>
					authUser
						? <Component {...props} />
						: <Redirect
							to={{
								pathname: '/signin',
								state: { from: props.location }
							}}
						/>}
			/>;
}
const initialState = {
	redirectTofirst:false,
	redirectToAppPage:false,
	userSubcription:[],
	loading:true,
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			initialState
		};
	
	}
	reset() {
        this.setState(initialState);
    }
	componentDidUpdate() {
		//console.log('this.props' , this.props)
		$('.loader').hide();
		
	  }
	  componentDidMount(){
		this.reset();
	  }


	render() {
		const { location, match, user ,loading} = this.props;
		let users = JSON.parse(user);
		const userDetails = window.localStorage.getItem('user_id');
		let have_user = 0; 
		if(userDetails){
			const authUser = JSON.parse(userDetails);
			have_user = 1
		}

		
		if( users != null && users.role_id != 2){
			auth.logoutDirect(); 
		}
		if (location.pathname === '/') {
			let params = new URLSearchParams(this.props.location.search)
			//let params = queryString.parse(this.props.location.search)
			const serial_number = params.get('serial_number');
			const payment_status = params.get('payment_status');
			const browser_unique_id = params.get('browser_unique_id');
			if( window.IsChameleon && payment_status == 1){
				chameleonEngine.installBrowser(browser_unique_id);
			}
			if (users === null || have_user == 0) {
				return (<Redirect to={'/signin'} />);
			} else if(users.role_id == 1) {	
				return (<Redirect to={'/signin'} />);
			} else if(window.IsChameleon && have_user == 1 ){
				
				let deviceId = 	localStorage.getItem("f_deviceId");
				let os = 	localStorage.getItem("f_os");
				let deviceType = 	localStorage.getItem("f_deviceType");

				if( window.IsChameleon){
					chameleonEngine.registerToken(deviceId+'--'+users.id);
				}
				api.post('check-have-subscription',{
						'deviceId':deviceId,
						'os':os,
						'deviceType':deviceType,
						'user_id':users.id,
				}).then((response) => {
						var	res = response.data;
						//console.log('app js res.have_name',res )
						
						if(res.have_name == 0){
							//console.log('app js res.have_name',res.have_name )
							this.setState({ redirectTofirst: true });
							return false;
						}
						if(res.have_name == 1){
							
							this.setState({ redirectToAppPage: true ,userSubcription:res.data });
							return false;
						}
				})

				
				if(this.state.redirectTofirst){
					return (<Redirect 
							to={{
								pathname: '/app/subscription/friendlyname',
								state: {
									serial_number: localStorage.getItem("f_deviceId"),
								}
							}}
						/>);	
				}
				console.log("redirect page",this.state.redirectToAppPage)
				if(this.state.redirectToAppPage){
				return (<Redirect 
					from="/"
						to={{
							pathname: '/app/subscription/app-page',
							state: {
								device: this.state.userSubcription.device,
								serial_number: this.state.userSubcription.serial_number,
								child_name: this.state.userSubcription.friendly_name,
								os_type: this.state.userSubcription.os_type,
								user_id: this.state.userSubcription.user_id
							}
						}}
					/>);
					//return (<Redirect to={'/app/dashboard'} activeTab='0' />);
				}
			}else{
				
				api.post('check-have-subscription-for-web',{
					'user_id':users.id,
				}).then((response) => {
						var	res = response.data;
						//console.log('app js res.have_name',res )
						
						if(res.have_name == 0){
							//console.log('app js res.have_name',res.have_name )
							this.setState({ redirectTofirst: true });
							return false;
						}
						if(res.have_name == 1){
							
							this.setState({ redirectToAppPage: true ,userSubcription:res.data });
							return false;
						}
				})

			
				if(this.state.redirectTofirst){
					return (<Redirect to={'/app/subscription/installweb'}  />);
					
				}

				if(this.state.redirectToAppPage){
				
					return (<Redirect to={'/app/dashboard'} activeTab='0' />);
				}


			}
		}
	

		return (

			<RctThemeProvider>
				

				<NotificationContainer />
				<InitialPath
					path={`${match.url}app`}
					authUser={users}
					//component={RctDefaultLayout}
					component={HorizontalLayout}
				/>
				<Route path="/horizontal" component={HorizontalLayout} />
				<Route path="/agency" component={AgencyLayout} />
				<Route path="/boxed" component={RctBoxedLayout} />
				<Route path="/signin" component={AppSignIn} />
				<Route path="/signup" component={AppSignUp} />
				<Route path="/session/login" component={AsyncSessionLoginComponent} />
				<Route path="/session/register" component={AsyncSessionRegisterComponent} />
				<Route path="/session/lock-screen" component={AsyncSessionLockScreenComponent} />
				<Route
					path="/session/forgot-password"
					component={AsyncSessionForgotPasswordComponent}
				/>
				<Route
					path="/forgot-password"
					component={AsyncForgotPasswordComponent}
				/>
				<Route path="/session/404" component={AsyncSessionPage404Component} />
				<Route path="/session/500" component={AsyncSessionPage500Component} />
				<Route path="/terms-condition" component={AsyncTermsConditionComponent} />
				{/* Extra for device use only */}
				<Route path="/login" component={AsyncDeviceAuthLogin} />
				<Route path="/register" component={AsyncDeviceAuthRegister} />
				<Route path="/forgotpassword" component={AsyncDeviceAuthForgotPassword} />

				<Route path="/callback" render={(props) => {
					handleAuthentication(props);
					return <Callback {...props} />
				}} />
			</RctThemeProvider>
		);
	}
}

// map state to props
const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return {user };
};

export default connect(mapStateToProps)(App);
