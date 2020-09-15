/**
 * Sign Up With Firebase
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
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
// components
import { SessionSlider } from 'Components/Widgets';
import { timeAgo, textTruncate, checkPath } from "Helpers/helpers";
// app config
import AppConfig from 'Constants/AppConfig';
import { Redirect } from 'react-router-dom';
// redux action
import {
	signupUserWithDB,
	signupUserInFirebase,
	signinUserWithFacebook,
	signinUserWithGoogle,
	signinUserWithGithub,
	signinUserWithTwitter
} from 'Actions';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Tooltip from '@material-ui/core/Tooltip';
// api
import api from 'Api';
import SweetAlert from 'react-bootstrap-sweetalert';
import LanguageProvider from 'Components/header/LanguageProvider';
class SignupFirebase extends Component {

	state = {
		name: '',
		email: '',
		password: '',
		redirect_app:false,
		SignInSuccess:false,
		popUpText:'',
	}

	/**
	 * On User Signup
	 */
	onUserSignUp() {
		const { email, password } = this.state;
		if (email !== '' && password !== '') {
			this.props.signupUserInFirebase({ email, password }, this.props.history);
		}
	}



	onUserSignUpWithDB = e => {
		e.preventDefault();
		
		this.setState({ loading: true });
		const { email, password, name } = this.state;
		if (email !== '' && password !== '') {
			let params = new URLSearchParams(this.props.location.search)
			let lang =	localStorage.getItem("current_lang");
			this.props.signupUserWithDB( { email, password, name,lang }, this.props.history);
			setTimeout(() => {
				
				api.post('user/check_user_is_registerd', {
					'email': email,
					},
					).then((response) => {
						const data = response.data.response;
						console.log('data',data)
							if(data == 'success'){
								var message =response.data.message;
								this.setState({  SignInSuccess:true ,loading: false, popUpText :message});
							}
						
					}).catch(error => {
						// error hanlding
					})
			   }, 500);	
	

		}
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
	const userDetails = window.localStorage.getItem('user_id');
    const authUser = JSON.parse(userDetails);
    if( authUser != null && authUser.role_id == 2){
		this.setState({  redirect_app:true });
    }
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

onGoBackClick(){
	this.setState({ redirect_app:true})

}
	render() {
		const { name, email, password , bg_image,SignInSuccess } = this.state;
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
						<LinearProgress />
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
										<Link to="/signin" className="mr-15 text-white">Already have an account?</Link>
										<Button
											component={Link}
											to="/signin"
											variant="raised"
											className="btn-light"
										>
											{<IntlMessages id="compenets.signIn" />}
										</Button>
										<span className="ml-2"><LanguageProvider current_lang={current_lang?current_lang:null} /></span>
									</div>
								</div>
							</div>
							<ul className="navbar-right list-inline mb-0" style={{ marginTop: "-2%", marginRight: "1%"}}>
						{window.IsChameleon &&
							<li className="list-inline-item ">
							
								<Button variant="raised" className="btn-light" onClick={() =>window.minimizeChameleon()}><i className="zmdi zmdi-window-minimize"></i>
								</Button>
							
						</li>
						}
						{window.IsChameleon &&
						<li className="list-inline-item ">
							
							
								<Button variant="raised" className="btn-light" onClick={() =>window.closeChameleon()}>
								<i className="zmdi zmdi-close"></i>
								</Button>
							
						</li>
						}
						</ul>
						</Toolbar>
					</AppBar>
					<div className="session-inner-wrapper">
						<div className="container">
							<div className="row row-eq-height">
								<div className="col-sm-7 col-md-7 col-lg-8">
									<div className="session-body text-center">
										<div className="session-head mb-15">
											<h2>{<IntlMessages id="widgets.getStarted" />} {AppConfig.brandName}</h2>
										</div>
										<Form autoComplete="off" onSubmit={(e) => this.onUserSignUpWithDB(e)}>
									
											<FormGroup className="has-wrapper">
												<Input
													required
													type="text"
													value={name}
													name="user-name"
													id="user-name"
													className="has-input input-lg"
													placeholder="Enter Your Name"
													onChange={(e) => this.setState({ name: e.target.value })}
												/>
												<span className="has-icon"><i className="ti-user"></i></span>
											</FormGroup>
											<FormGroup className="has-wrapper">
												<Input
												required
													type="mail"
													value={email}
													name="user-mail"
													id="user-mail"
													className="has-input input-lg"
													placeholder="Enter Email Address"
													onChange={(e) => this.setState({ email: e.target.value })}
												/>
												<span className="has-icon"><i className="ti-email"></i></span>
											</FormGroup>
											<FormGroup className="has-wrapper">
												<Input
												required
													value={password}
													type="Password"
													name="user-pwd"
													id="pwd"
													className="has-input input-lg"
													placeholder="Password"
													onChange={(e) => this.setState({ password: e.target.value })}
												/>
												<span className="has-icon"><i className="ti-lock"></i></span>
											</FormGroup>
											<FormGroup className="mb-15">
												<Button
												type="submit"
												color="primary"
													className=" text-white  w-100"
													variant="raised"
													size="large"
													//onClick={() => this.onUserSignUpWithDB()}
													>
													Sign Up
                            					</Button>
											</FormGroup>
											{/*<FormGroup className="mb-15">
												<Button
													className="btn-info text-white btn-block w-100"
													variant="raised"
													size="large"
													onClick={() => this.onUserSignUp()}>
													Sign Up
                            			</Button>
											</FormGroup>*/}
										</Form>
										{/* <p className="mb-20">or sign in with</p>
										<Button
											mini
											variant="fab"
											className="btn-facebook mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithFacebook(this.props.history)}
										>
											<i className="zmdi zmdi-facebook"></i>
										</Button>
										<Button
											mini
											variant="fab"
											className="btn-google mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithGoogle(this.props.history)}
										>
											<i className="zmdi zmdi-google"></i>
										</Button>
										<Button
											mini
											variant="fab"
											className="btn-twitter mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithTwitter(this.props.history)}
										>
											<i className="zmdi zmdi-twitter"></i>
										</Button>
										<Button
											mini
											variant="fab"
											className="btn-instagram mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithGithub(this.props.history)}
										>
											<i className="zmdi zmdi-github-alt"></i>
										</Button> */}
										<p className="text-muted"><IntlMessages id="widgets.agreeSignup" /> {AppConfig.brandName}</p>
										<p className="mb-0"> <FullScreenDialog /></p>
									</div>
								</div>
								<div className="col-sm-5 col-md-5 col-lg-4">
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

				<SweetAlert
                success
                show={SignInSuccess}
                title={<IntlMessages id="wedgit.signUpPopUpTitle" />}
                btnSize="sm"
                btnText={<IntlMessages id="button.close"/>}
                //onConfirm={() =>  window.history.push('/')}
                onConfirm={() => this.onGoBackClick()}
                >
					<p dangerouslySetInnerHTML={{ __html: this.state.popUpText }} />
			
            </SweetAlert>
			</QueueAnim>
		);
	}
}

// map state to props
const mapStateToProps = ({ authUser }) => {
	const { loading } = authUser;
	return { loading };
};

export default connect(mapStateToProps, {
	signupUserInFirebase,
	signinUserWithFacebook,
	signinUserWithGoogle,
	signinUserWithGithub,
	signinUserWithTwitter,
	signupUserWithDB
})(SignupFirebase);
