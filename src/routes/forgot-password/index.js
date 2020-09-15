import React, { Component } from 'react';
import { Form, FormGroup, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
// app config
import AppConfig from 'Constants/AppConfig';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// components
import {
	SessionSlider
} from 'Components/Widgets';

// api
import api from 'Api';
import Tooltip from '@material-ui/core/Tooltip';
import LanguageProvider from 'Components/header/LanguageProvider';
import { checkPath } from "Helpers/helpers";

class Forgotpasswd extends Component {
  state = {
    email: '',
    loading:false,
    bg_image:''
  }



  onUserForgotPassword = e => {
    e.preventDefault();
    const { email } = this.state;
    if (this.state.email !== '' ) {
      if(/.+@.+\.[A-Za-z]+$/.test(email)) { 
         this.setState({ loading: true });
          api.post('forgot-password',{'email':email})
          .then((response) => {
            this.setState({ loading: false });
            if(response.data.error){
               NotificationManager.error(response.data.error);
             } else {
               NotificationManager.success(response.data.success);
             }
          })
          .catch(error => {
            // error hanlding
         })
       }else{
        NotificationManager.error('Please enter valid email');
       }
     // this.props.signinUserInDB(this.state, this.props.history);
    }else{
        NotificationManager.error('Please enter email');
    }
  }

  	/**
	 * On User Sign Up
	 */
	onUserSignUp() {
		this.props.history.push('/signup');
  }
  
  	/**
	 * On User Sign In
	 */
	onUserSignIn() {
		this.props.history.push('/signin');
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
 
    const { loading ,bg_image} = this.state;
    var Background = checkPath('image')+bg_image
    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper" key="1"  style={{backgroundImage: `url(${Background})`}}>
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
									
										<Button variant="raised" className="btn-light" onClick={() => this.onUserSignUp()}>{<IntlMessages id="widgets.signUp" />}</Button>
										<Button variant="raised" className="btn-light ml-2" onClick={() => this.onUserSignIn()}>{<IntlMessages id="widgets.signIn" />}</Button>
                    <span className="ml-2"><LanguageProvider /></span>
                  </div>
                  {/* <div className="session-social-icon">
                    <IconButton className="text-white" aria-label="facebook">
                      <i className="zmdi zmdi-facebook"></i>
                    </IconButton>
                    <IconButton className="text-white" aria-label="twitter">
                      <i className="zmdi zmdi-twitter"></i>
                    </IconButton>
                    <IconButton className="text-white" aria-label="google">
                      <i className="zmdi zmdi-google"></i>
                    </IconButton>
                  </div> */}
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
          <div className="session-inner-wrapper ">
          <div className="container">
            <div className="row t">
              <div className="col-sm-7 col-md-7 col-lg-8">
                <div className="session-body text-center">
                  <div className="session-head mb-30">
                    <h2>{<IntlMessages id="widgets.getStarted" />} {AppConfig.brandName}</h2>
                    <p className="mb-0">{<IntlMessages id="widgets.adminSubTitle" />}</p>
                  </div>
                  <Form  onSubmit={(e) => this.onUserForgotPassword(e)}>
                    <FormGroup className="has-wrapper">
                      <Input type="mail" name="user-mail" id="user-mail" className="has-input input-lg" placeholder="Enter Email Address" onChange={(event) => this.setState({ email: event.target.value })} />
                      <span className="has-icon"><i className="ti-email"></i></span>
                    </FormGroup>
                    <FormGroup>
                      <Button type='submit' variant="raised" className="btn-primary text-white btn-block  w-100"
                      ><IntlMessages id="button.resetPassword" /></Button>
                    </FormGroup>
                    {/* <Button component={Link} to="/signin" className="btn-dark btn-block btn-large text-white w-100">Already having account?  Login</Button> */}
                  </Form>
                </div>
              </div>
              <div className="col-sm-5 col-md-5 col-lg-4" >
									<SessionSlider />
								</div>

            </div>
            </div>
          </div>
        </div>
         {loading &&
                  <RctSectionLoader />
               }
      </QueueAnim>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading }
}


export default Forgotpasswd;