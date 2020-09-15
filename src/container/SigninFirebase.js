/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Redirect, Route, Link } from 'react-router-dom';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import FullScreenDialog from './component/FullScreenDialog';
import { timeAgo, textTruncate, checkPath } from "Helpers/helpers";
// components
import {
	SessionSlider
} from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
	signinUserInFirebase,
	signinUserWithFacebook,
	signinUserWithGoogle,
	signinUserWithGithub,
	signinUserWithTwitter,
	signinUserInDB
} from 'Actions';

//Auth File
import Auth from '../Auth/Auth';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Tooltip from '@material-ui/core/Tooltip';

// api
import api from 'Api';
//import queryString from 'query-string';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import LanguageProvider from 'Components/header/LanguageProvider';

import { setLanguage } from 'Actions';
const auth = new Auth();

class Signin extends Component {



	state = {
		loading2:true,
		email: '',
		password: '',
		termsViewModel:false,
		slider:[],
		bg_image:'',
		redirect_app:false,
		script:''
	}

	/**
	 * On User Login
	 */
	onUserLogin() {
		if (this.state.email !== '' && this.state.password !== '') {
			this.props.signinUserInFirebase(this.state, this.props.history);
		}
	}

	/**
	 * On User Login With DB
	 */

	onUserLoginWithDB = e => {
		e.preventDefault();
		if (this.state.email !== '' && this.state.password !== '') {
			this.props.signinUserInDB(this.state, this.props.history);
		}
	  }


	/**
	 * On User Sign Up
	 */
	onUserSignUp() {
		this.props.history.push('/signup');
	}

	//Auth0 Login
	loginAuth0() {
		auth.login();
	}
	   /**
    * On Terms view 
    */
   termsView(){
	this.setState({ termsViewModel: true,  });
   
 }
 ontermsViewClose() {
	this.setState({ termsViewModel: false,  })
 }
 componentDidMount() {
	var BotStar={appId:"s0e18cb10-5990-11ea-9cf2-3d68fb1069df",mode:"popup"};!function(t,a){var e=function(){(e.q=e.q||[]).push(arguments)};e.q=e.q||[],t.BotStarApi=e;!function(){var t=a.createElement("script");t.type="text/javascript",t.async=1,t.src="https://widget.botstar.com/static/js/widget.js";var e=a.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();}(window,document)
	this.setState({script:BotStar});
	setLanguage();
	$('.langclass_fr').trigger('click')
	this.setState({  loading2:true });
	let params = new URLSearchParams(this.props.location.search)
	//let params = queryString.parse(this.props.location.search)
	const deviceId = params.get('deviceId')
	const os = params.get('os')
	const deviceType = params.get('deviceType')

	if(deviceId){
		localStorage.setItem("f_deviceId", deviceId);
		localStorage.setItem("f_os", os);
		localStorage.setItem("f_deviceType", deviceType);
	 }else{
		localStorage.setItem("f_deviceId", localStorage.getItem("f_deviceId"));
		localStorage.setItem("f_os", localStorage.getItem("f_os"));
		localStorage.setItem("f_deviceType", localStorage.getItem("f_deviceType"));
		// localStorage.removeItem('f_deviceId');
		// localStorage.removeItem('f_os');
		// localStorage.removeItem('f_deviceType');
	 }
	
	 //for display active tab at user profile
	 localStorage.setItem("userProfilePage.activeTab",0)
	 this.getSessionUsersData();
	
	const userDetails = window.localStorage.getItem('user_id');
    const authUser = JSON.parse(userDetails);
    if( authUser != null && authUser.role_id == 2){
		this.setState({  redirect_app:true });
    }
	
		
		$('.loader').hide();

}

 	// session users data
	 getSessionUsersData() {
		api.get('auth-bg-image')
			.then((response) => {
				this.setState({  bg_image:response.data.bg_image  });
			})
			.catch(error => {
				// error handling
			})
	}


	render() {
	
			
		const { email, password  ,bg_image, loading2} = this.state;
		const { loading } = this.props;
		var Background = checkPath('image')+bg_image
		if(this.state.redirect_app){
			return (<Redirect to={'/'} />);	
		}

		let params = new URLSearchParams(this.props.location.search)
		let current_lang = params.get('ln')
		if(current_lang){
			current_lang = current_lang;
			localStorage.setItem("current_lang", current_lang);
		 }
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper" style={{backgroundImage: `url(${Background})`}} >
				
					{loading &&
						<RctSectionLoader />
					}
					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<a href={AppConfig.chameleon_web_url} >
										{/* <a href="javascript:void(0)" > */}
											<img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
										</a>
									</div>
									<div>
										<a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
										<Button variant="raised" className="btn-light" onClick={() => this.onUserSignUp()}>{<IntlMessages id="widgets.signUp" />}</Button>
										<span className="ml-2"><LanguageProvider current_lang={current_lang?current_lang:null} /></span>
									</div>
									
								</div>
							</div>
						<ul className="navbar-right list-inline mb-0" style={{ marginTop: "-2%", marginRight: "1%"}}>
						
						{window.IsChameleon &&
							<li className="list-inline-item ">
							
								<Button variant="raised" className="btn-light" onClick={() =>window.minimizeChameleon()}> <i className="zmdi zmdi-window-minimize"></i>
								</Button>
							
						</li>
						}
						{window.IsChameleon &&
						<li className="list-inline-item ">
							<Button variant="raised" className="btn-light" onClick={() =>window.closeChameleon()}> <i className="zmdi zmdi-close"></i>
							</Button>
							
						</li>
						}
						</ul>
						</Toolbar>
					</AppBar>
				
					<div className="session-inner-wrapper">
						<div className="container">
							<div className="row row-eq-height t">
								<div className="col-sm-7 col-md-7 col-lg-8">
									<div className="session-body text-center">
										<div className="session-head mb-30">
											<h2 className="font-weight-bold">{<IntlMessages id="widgets.getStarted" />} {AppConfig.brandName}</h2>
											<p className="mb-0">{<IntlMessages id="widgets.adminSubTitle" />}</p>
										</div>
										<Form autoComplete="off" onSubmit={(e) => this.onUserLoginWithDB(e)}>
											<FormGroup className="has-wrapper">
												<Input
													required
													type="mail"
													value={null}
													name="user-mail"
													id="user-mail"
													className="has-input input-lg"
													placeholder="Enter Email Address"
													onChange={(event) => this.setState({ email: event.target.value })}
												/>
												<span className="has-icon"><i className="ti-email"></i></span>
											</FormGroup>
											<FormGroup className="has-wrapper">
												<Input
												required
													value={null}
													type="Password"
													name="user-pwd"
													id="pwd"
													className="has-input input-lg"
													placeholder="Password"
													onChange={(event) => this.setState({ password: event.target.value })}
												/>
												<span className="has-icon"><i className="ti-lock"></i></span>
											</FormGroup>
											{/*<FormGroup className="mb-15">
												<Button
													color="primary"
													className="btn-block text-white w-100"
													variant="raised"
													size="large"
													onClick={() => this.onUserLogin()}
												>
													Sign In
                            			        </Button>
											</FormGroup>*/}
											<FormGroup className="mb-15">
												<Button
													type='submit'
													color="primary"
													className=" text-white w-100"
													variant="raised"
													size="large"
												
													
												>
													{<IntlMessages id="compenets.signIn" />}
                            			        </Button>
											</FormGroup>
											{/*<FormGroup className="mb-15">
												<Button
													variant="raised"
													className="btn-info btn-block text-white w-100"
													size="large"
													onClick={() => this.loginAuth0()}
												>
													Sign In With Auth0
                            			</Button>
											</FormGroup>*/}
										</Form>
										<p><Link to="/forgot-password" className="text-muted"> {<IntlMessages id="sidebar.forgotPassword" />}</Link></p>

										{/* <p className="mb-20">or sign in with</p>
										<Button
											variant="fab"
											mini
											className="btn-facebook mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithFacebook(this.props.history)}
										>
											<i className="zmdi zmdi-facebook"></i>
										</Button>
										<Button
											variant="fab"
											mini
											className="btn-google mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithGoogle(this.props.history)}
										>
											<i className="zmdi zmdi-google"></i>
										</Button>
										<Button
											variant="fab"
											mini
											className="btn-twitter mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithTwitter(this.props.history)}
										>
											<i className="zmdi zmdi-twitter"></i>
										</Button>
										<Button
											variant="fab"
											mini
											className="btn-instagram mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithGithub(this.props.history)}
										>
											<i className="zmdi zmdi-github-alt"></i>
										</Button> */}
										<p className="text-muted"><IntlMessages id="widgets.agreeSignin" /> {AppConfig.brandName}</p>
										<p className="mb-0"> <FullScreenDialog /></p>
									</div>
									
								</div>
								<div className="col-sm-5 col-md-5 col-lg-4" >
									<SessionSlider />
								</div>
							</div>
						</div>
					</div>
				
				</div>
			<Modal size='lg' isOpen={this.state.termsViewModel} toggle={() => this.ontermsViewClose()} style={{width:'100%',height:'100%'}}>
            	<ModalHeader toggle={() => this.ontermsViewClose()}> {<IntlMessages id="sidebar.terms&Conditions" />}
               	</ModalHeader>                 
               	<ModalBody>
			   		<iframe width='100%' height='500px' src={AppConfig.front_web_url+"legal-agreements-frame"} frameborder="0" allowfullscreen></iframe>
               	</ModalBody>
            </Modal>
			{this.state.BotStar}
			</QueueAnim>
			
		);
	}
}

// map state to props
const mapStateToProps = ({ authUser }) => {
	const { user, loading } = authUser;
	return { user, loading }
}

export default connect(mapStateToProps, {
	signinUserInFirebase,
	signinUserWithFacebook,
	signinUserWithGoogle,
	signinUserWithGithub,
	signinUserWithTwitter,
	signinUserInDB
})(Signin);
