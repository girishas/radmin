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
import AppConfig from '../../../constants/AppConfig';

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
	   	}
	   	proceed(){
			console.log('navigator.userAgent',navigator );
		
			let fullOsString = navigator.userAgent;
			//let fullOsString = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
			var start = fullOsString.indexOf("(");
			var end = fullOsString.indexOf(";");
			var OSFull =  fullOsString.substring(start+1, end);
			start = fullOsString.indexOf("; Win");
			var OSBit = navigator.platform;
			// if(start != -1){
			// 	 OSBit =  fullOsString.substring(start+1, start+7);
			// }
			
			// document.getElementById("os_details").innerHTML = OSFull +" "+OSBit ;
			var os = 'windows';
			if(fullOsString.indexOf("Windows") != -1 ){
				os = 'windows';
				OSFull = 'Windows' ;
				if(start != -1){
					OSBit =  fullOsString.substring(start+1, start+7);
				}
			}else if(fullOsString.indexOf("Macintosh") != -1){
				os = 'macintosh';
			}else if(fullOsString.indexOf("Linux") != -1){
				if(fullOsString.indexOf("Android") != -1 ){
					//alert()
					os = 'android';
					start = fullOsString.indexOf("Android");
					remaining_string = fullOsString.substr(start);
					end = remaining_string.indexOf(";");
					OSFull =  remaining_string.substring(0, end);
					OSFull = 'Android' ;
					OSBit= "";
					
				}else{
					os = 'linux';
					start = fullOsString.indexOf("Linux");
					remaining_string = fullOsString.substr(start);
					end = remaining_string.indexOf(";");
					OSFull =  remaining_string.substring(0, end);
					OSFull = 'Linux' ;
					OSBit= "";
				}
			}else if(fullOsString.indexOf("Android") != -1){
					os = 'android';
					start = fullOsString.indexOf("Android");
					remaining_string = fullOsString.substr(start);
					end = remaining_string.indexOf(";");
					OSFull =  remaining_string.substring(0, end);
					OSFull = 'Android' ;
					OSBit= "";
			}else if(fullOsString.indexOf("iPhone") != -1){
					os = 'ios';
					OSFull = 'iPhone' ;
					OSBit= "";
			}
			console.log('OSFull',OSFull)


			//here start
			$.ajax({
				type:"POST",
				url:AppConfig.chameleon_web_url+"api/increase_count",
				data :  { 'os': os},
				//datatype : "json",
				success:function(response){	
					
						$('.osPopUpData').html(response.message) ;
						$('#os_details').html(OSFull ) ;

						$('.yesBtn').attr('href',response.url) ;
						
						//console.log(message)
					if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1 ){
						//alert("This is a 64 bit OS");
						location.href = "https://chameleon.technology/download/latest/chameleon-win-x64.exe";
					} else {
					//alert("Not a 64 bit OS");
						location.href = "https://chameleon.technology/download/latest/chameleon-win-x86.exe";		
					}				
				}
			});	
	   	}
	render() {
		const { child_name ,redirectToInstall} = this.state;
		
	
		return (

			<div class="container" style={{height:'1200px'}}>
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
					<div class="col-xs-12 col-sm-12 bottom-margin text-center mb-5" ><h1><IntlMessages id="installWeb.heading" /></h1></div>
					
					<div class=" col-xs-4 col-sm-4 text-center"></div>
					<div class=" col-xs-4 col-sm-4 text-center"><button type="button" onClick={() => this.proceed()} 
					 className="proceed-btn text-white ml-15 btn" variant="raised" color="primary"
					  style={{ background: '#5D92F4' }}   ><IntlMessages id="chameleon.download" /></button></div>
				</div>
				<br/>
				
			</div>

		);
	}

}


const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};

export default connect(mapStateToProps)(Friendlyname);
