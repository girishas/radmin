/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
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
import Auth from '../../Auth/Auth';
// intl messages
import IntlMessages from 'Util/IntlMessages';

// api
import api from 'Api';

const auth = new Auth();

class Login extends Component {



	state = {
		email: '',
		password: '',
		termsViewModel:false,
		slider:[],
		bg_image:''
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
	onUserLoginWithDB() {


		// if (this.state.email !== '' && this.state.password !== '') {
		// 	this.props.signinUserInDB(this.state, this.props.history);
		// }


		api.post('user/device-auth-login',{
			'email':this.state.email,
			'password':this.state.password,
		}).then((response) => {
			const data =  response.data;
					console.log(data);
		       
		 })
		 .catch(error => {
			// error hanlding
		 })

	}

	/**
	 * On User Sign Up
	 */
	onUserSignUp() {
		this.props.history.push('/register');
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
	this.getSessionUsersData();
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
	
			
		const { email, password  ,bg_image} = this.state;
		const { loading } = this.props;
		var Background = checkPath('image')+bg_image
	
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper" style={{backgroundImage: `url(${Background})`}} >
					{loading &&
						<LinearProgress />
					}
					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<a href="javascript:void(0)" >
											<img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
										</a>
									</div>
									<div>
										<a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
										<Button variant="raised" className="btn-light" onClick={() => this.onUserSignUp()}>{<IntlMessages id="widgets.signUp" />}</Button>
									</div>
								</div>
							</div>
						</Toolbar>
					</AppBar>
					<div className="session-inner-wrapper">
						<div className="container">
							<div className="row row-eq-height">
								<div className="col-sm-7 col-md-7 col-lg-8">
									<div className="session-body text-center">
										<div className="session-head mb-30">
											<h2 className="font-weight-bold">{<IntlMessages id="widgets.getStarted" />} {AppConfig.brandName}</h2>
											<p className="mb-0">{<IntlMessages id="widgets.adminSubTitle" />}</p>
										</div>
										<Form>
											<FormGroup className="has-wrapper">
												<Input
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
													color="primary"
													className=" text-white w-100"
													variant="raised"
													size="large"
													onClick={() => this.onUserLoginWithDB()}
													
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
										<p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>
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
})(Login);
