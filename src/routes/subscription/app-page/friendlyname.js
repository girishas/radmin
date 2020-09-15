/**
	* User Management Page
*/
import React, { Component } from 'react';

import { NotificationManager } from 'react-notifications';

import { connect } from 'react-redux';
// api
import api from 'Api';
import {
	 dateMonthsDiff
} from "Helpers/helpers";

// intl messages
import IntlMessages from 'Util/IntlMessages';
import {user_id} from "Helpers/helpers";

import { Redirect } from 'react-router-dom';

// add new user form

class Friendlyname extends Component {

	constructor() {
		super();
		this.state = {
			child_name:'',
			redirectToInstall: false,
		};
	
	}
	onUpdateUserDetail(key, value, e) {
		this.setState({child_name: value});
		localStorage.setItem("child_name",value)
	   	}
	   	proceed(){
			if(this.state.child_name == '' || this.state.child_name == null){
				NotificationManager.error(<IntlMessages id="validation.FriendlyNameRequired"/>);
				return false;
			} 
			if( window.IsChameleon ){
				chameleonEngine.registerToken(this.props.location.state.serial_number+'--'+user_id());
			}
			this.setState({redirectToInstall: true});

			
			return (<Redirect 
						to={{
							pathname: '/app/subscription/install',
							state: {
								child_name: this.state.child_name,
							}
						}}
						/>)
	   	}
	render() {
		const { child_name ,redirectToInstall} = this.state;
		
	
		return (

			<div class="container">
				{(redirectToInstall == true) &&
					<Redirect 
						to={{
							pathname: '/app/subscription/install',
							state: {
								child_name: this.state.child_name,
							}
						}}
					/>
				}


				<div className="row col-sm-12 product rct-footer d-flex" >
					<div class="col-xs-12 col-sm-12 bottom-margin text-center mb-5" ><h1><IntlMessages id="browser.addFriendlyName" /></h1></div>
					<div class="col-xs-12 col-sm-12 mb-5" style={{ textAlign: "center" }}>
						<input type="text" placeholder="Name" name="child_name" className="form-control"
							value={child_name}
							onChange={(e) => this.onUpdateUserDetail('child_name', e.target.value)} 
						/>
					</div>
					<div class=" col-xs-4 col-sm-4 text-center"></div>
					<div class=" col-xs-4 col-sm-4 text-center"><button type="button" onClick={() => this.proceed()}  className="proceed-btn text-white ml-15 btn" variant="raised" color="primary" style={{ background: '#5D92F4' }}><IntlMessages id="button.proceed" /></button></div>
				</div>
				<br />
				
			</div>

		);
	}

}


const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};

export default connect(mapStateToProps)(Friendlyname);
