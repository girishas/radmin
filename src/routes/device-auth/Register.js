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

// api
import api from 'Api';
class Register extends Component {

	state = {
		name: '',
		email: '',
		password: ''
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

	onUserSignUpWithDB() {
		const { email, password, name } = this.state;
		if (email !== '' && password !== '') {
			this.props.signupUserWithDB( { email, password, name }, this.props.history);
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
		const { name, email, password , bg_image } = this.state;
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
									<a href="javascript:void(0)">
											<img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
										</a>
									</div>
									<div>
										<Link to="/login" className="mr-15 text-white">Already have an account?</Link>
										<Button
											component={Link}
											to="/login"
											variant="raised"
											className="btn-light"
										>
											{<IntlMessages id="compenets.signIn" />}
										</Button>
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
										<div className="session-head mb-15">
											<h2>Get started with {AppConfig.brandName}</h2>
										</div>
										<Form>
											<FormGroup className="has-wrapper">
												<Input
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
												color="primary"
													className=" text-white  w-100"
													variant="raised"
													size="large"
													onClick={() => this.onUserSignUpWithDB()}>
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
										<p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>
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
})(Register);
