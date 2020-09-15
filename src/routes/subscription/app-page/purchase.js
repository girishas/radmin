/**
* User Management Page
*/
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Redirect, Route, Link } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import Checkbox from '@material-ui/core/Checkbox';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Badge
} from 'reactstrap';
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import moment from "moment";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { NotificationManager } from 'react-notifications';
import {get_plan_id_by_name ,pathForxml ,get_plan_name_by_id,user_id} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import api from 'Api';


// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import StripeCheckout from 'react-stripe-checkout';
import PaypalExpressBtn from 'react-paypal-express-checkout';




export default class Upgrade extends Component {
	constructor(props) {
		super(props);

	

		const  plan_type  =  this.props.location.state ? this.props.location.state.purchasePageDetails.plan_type:'';
		const  browser_id  = this.props.location.state ? this.props.location.state.purchasePageDetails.browser_id:'';
		const  browser_language  =  this.props.location.state ? this.props.location.state.purchasePageDetails.browser_language:'';
		const  browser_plan  =  this.props.location.state ? this.props.location.state.purchasePageDetails.browser_plan:'';
		const  browser_name  = this.props.location.state ? this.props.location.state.purchasePageDetails.browser_name:'';
		const  device_name  = this.props.location.state ? this.props.location.state.purchasePageDetails.device:'';
		const  os_type  = this.props.location.state ? this.props.location.state.purchasePageDetails.os_type:'';
		const  serial_number  = this.props.location.state ? this.props.location.state.purchasePageDetails.serial_number:'';

		const  child_name  = this.props.location.state ? this.props.location.state.child_name:'';


		//alert(device_name);
		this.state = { 
			loading: false, // loading activity,
			redirectToAppPage:false,
			countries:[],
			user_data:[],
			browser_id:browser_id,
			browser_language:browser_language,
			browser_plan:browser_plan,
			browser_name:browser_name,
			//def_sub_id:def_sub_id,
			serial_number:serial_number,
			os_type:os_type,
			device_name:device_name,
			plan_type:plan_type,
			child_name:child_name,
			

			strip_plan_price:0,

			STRIPE_PLAN_ID:[],
			STRIPE_PLAN_ID_YEAR:[],
			STRIPE_KEY:"",
			PAYPAL_EMAIL:"",
			PAYPAL_URL:"",
		}
	}

	onToken = (token, addresses) => {
		$("#stripeToken").val(token.id);
		$("#emailOfUser").val(token.email);
		$("#amountInCents").val(Math.floor($("#amountInDollars").val() * 100));
		var paymentData = $('#payment').serialize() ;
		this.setState({ loading: true });
		api.post('checkout_subscription_api',paymentData ).then((response) => {
			const data =  response;
			if(data.data.status = 1){
				this.setState({ loading: false });
				NotificationManager.success(data.data.message);console.log(data.data.browser_unique_id)
				if( window.IsChameleon){
					
					chameleonEngine.installBrowser(data.data.browser_unique_id)
				}
				setTimeout(() => {
					localStorage.setItem("locationReaload",true);
					this.setState({redirectToAppPage:true});
				//	location.reload()
				}, 2000);  
			}else{
				NotificationManager.error(data.data.message);
			}
		}).catch(error => {

		})
	};
	stripButtonClick(){
		var validateField = this.validateField(this.state.user_data);
		if(validateField){
			this.updateUserdetail();
			$(".stripbutton").click();
		}
	}
	paypalButton(){
		var amount = $("#amountInDollars").val();
		var fullName = $("#fullName").val();
		var email = $("#emailOfUser").val();

		var numericExpression = /^[1-9]\d{9}$/;
		var emailExp = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
	
		var validateField = this.validateField(this.state.user_data);
		
		if(validateField){
			this.updateUserdetail();
			$('#payment').attr('action' ,this.state.PAYPAL_URL );
			if(amount == 0){
				$('#payment').attr('action' ,'{!! url("/checkout-subscription") !!}' );
				$("#payment").submit();
				return;
			}
			var _this = this;
			api.post('ajax_save_data_in_session_api',$("#payment").serialize()  ).then((response) => {
				const data1 =  response.data;
				$('.item_number').val(data1.id);
				$('#payment').attr('action' ,this.state.PAYPAL_URL );

				$("#payment").submit();
			}).catch(error => {
			// error hanlding
			})
		}
	}
	updateUserdetail(){
		var validateField = this.validateField(this.state.user_data);

		if(validateField){
			var fullname = $("#fullName").val();
			var street_1 = $("#address_1").val();
			var street_2 = $("#address_2").val();
			var city = $("#city").val();
			var state = $("#state").val();
			var country = $("#country_id").val();
			var zipcode = $("#zip").val();
			var phonneno = $("#phone").val();
			api.post('update_user_details', {
				params: {
					fullname:fullname,
					street_1:street_1,
					street_2:street_2,
					city:city,
					state:state,
					country:country,
					zipcode:zipcode,
					phonneno:phonneno,
					user_id:user_id()
				}
			}).then((response) => {
				var status = response.data.status;
				var message = response.data.message;

				if(status == 'success'){
					//location.reload();
					NotificationManager.success(<IntlMessages id="note.DetailsUpdated"/>);
				}else{
					alert(message);
				}
			}).catch(error => {
			// error hanlding
			})
		}
	}
	applyPromocodeButton(){
		var promocode = $('#promocode').val();
		var amount =$("#amountPlan").html();
		var browser_id = this.state.browser_id;
		var plan_id = this.state.browser_plan;
		api.post('promocode_apply_api', {
			params: {
				promocode:promocode,
				amount:amount,
				browser_id:browser_id,
				plan_id:plan_id,
			}
		}).then((response) => {
			var status = response.data.status;
			if(status == 1){   
				this.setState({strip_plan_price: response.data.discounted_amount});   
				// $("#promocodeaaplied").val(promocode);     
				// $(".is_promo_applied").val(status);
				// $(".discount").val(response.data.discount);
				// $("#amountInDollars").val(amount);
				// $("#paypalAmt").val(amount);
				// $('.promocode-error').text('');
				// $('.promocode-success').text(response.data.message);
				// $('#discounted').html(response.data.discount);
				// $("#finalAmount").html(response.data.discounted_amount);  
				// $('.showAmountData').show();

				$("#promocodeaaplied").val(promocode);     
				$(".is_promo_applied").val(status);
				$(".discount").val(response.data.discount);
				$("#amountInDollars").val(response.data.discounted_amount);
				$("#paypalAmt").val(response.data.discounted_amount);
				$('.promocode-error').text('');
				$('.promocode-success').text(response.data.message);
				$('#discounted').html(response.data.discount);
				$("#finalAmount").html(response.data.discounted_amount);  
				$('.showAmountData').show();    
				        
			}else{
				this.setState({strip_plan_price:amount});
				$("#promocodeaaplied").val('');
				$(".is_promo_applied").val(status);
				$(".discount").val(0);
				$("#amountInDollars").val(amount);
				$("#paypalAmt").val(amount);
				$('.promocode-success').text('');
				$('.promocode-error').text(response.data.message);
				$('.after-discount').html(' ');  
				   
			}
		}).catch(error => {
		// error hanlding
		})
	}



	validateField(str){
		let formIsValid = true;
	 for (var key in str) {
			switch(key) {
				case 'full_name':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.NameShouldNotBeEmpty"/>);
					}
				break;
				case 'street_1_temp':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.AddressShouldNotBeEmpty"/>);
					}
				break;
				case 'city':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.CityShouldNotBeEmpty"/>);
					}
				break;
				case 'state':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.StateShouldNotBeEmpty"/>);
					}
				break;
				case 'country_id':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.SelectCountryFirst"/>);
					}
				break;
				case 'mobile':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.PhoneNumberShouldNotBeEmpty"/>);
					}
				break;
				case 'zip':
					if(str[key] == '' || str[key] == null){
						formIsValid = false;
						NotificationManager.error(<IntlMessages id="validation.ZipcodeShouldNotBeEmpty"/>);
					}
				break;
				
				 default:
					 break;
			 }
	 }
		
		 return formIsValid;
		 
	}

	getInfo() {  
		let self = this;
		api.get('user-get-subscription-by-id', {
			params: {
				user_id:user_id(),
			},
			headers: {'User-Id':user_id()},

		}).then((response) => {
			const data =  response.data;
			self.setState({ 

				STRIPE_PLAN_ID:data.STRIPE_PLAN_ID,
				STRIPE_PLAN_ID_YEAR:data.STRIPE_PLAN_ID_YEAR,
				STRIPE_KEY:data.STRIPE_KEY,
				PAYPAL_EMAIL:data.PAYPAL_EMAIL,
				PAYPAL_URL:data.PAYPAL_URL,

				countries : data.countries,	
				user_data: {
					...this.state.user_data,
					"street_1_temp": data.user_data.street_1,
					"email": data.user_data.email,
					"full_name": data.user_data.full_name,
					"street_1": data.user_data.street_1,
					"street_2": data.user_data.street_2,
					"city": data.user_data.city,
					"state": data.user_data.state,
					"zip": data.user_data.zip,
					"country_id": data.user_data.country_id,
					"mobile": data.user_data.mobile,
				
				 }
			});
		}).catch(error => {
		// error hanlding
		})
	}
	onUpdateUserDetail(key, value, e) {
		this.setState({
			user_data: {
			  ...this.state.user_data,
			  [key]: value
		   }
		});
	   }
	componentDidMount() {
		$("#TrialFrequency").hide();
		$("#TrialAmount").hide();
		$("#TrialPeriod").hide();
		this.getInfo();
		var plan_id = this.state.browser_plan;
		var plan_type = this.state.plan_type
  
		let	plan_price = get_plan_name_by_id(AppConfig.plan_price_array, plan_id);
		if(plan_type == 2){
			plan_price = get_plan_name_by_id(AppConfig.plan_price_year_array, plan_id);
		}
	

		this.setState({strip_plan_price: plan_price});
	   
	}
	editAddress(key){
		if(key=='show'){
			$(".addressbox").show();
			$("#hideButton").show();
			$("#showButton").hide();
		}else if(key=='hide'){
			$("#showButton").show();
			$("#hideButton").hide();
			$(".addressbox").hide();
		}
	
	}
	render() {

		const{plan_type, browser_id,browser_language,browser_plan,loading , 
			countries,browser_name,os_type,serial_number,user_data,device_name , redirectToAppPage,
			STRIPE_PLAN_ID,
			STRIPE_PLAN_ID_YEAR,
			STRIPE_KEY,
			PAYPAL_EMAIL,
			PAYPAL_URL,
		} = this.state;
		var	plan_price = get_plan_name_by_id(AppConfig.plan_price_array, this.state.browser_plan)
		if(plan_type == 2){
				plan_price = get_plan_name_by_id(AppConfig.plan_price_year_array, this.state.browser_plan)
		}
		let have_address = false;
		if(user_data.street_1 == '' || user_data.street_1 == null){
			 have_address  = true;
		}

		return (
			<div class="user-management" style={{minHeight:'420px'}}>

{(redirectToAppPage == true) &&
		<Redirect 
			from='purchase'
			to={{
				pathname: '/app/subscription/app-page',
				state: {
					device: this.state.device_name,
					serial_number: this.state.serial_number,
					child_name: this.state.child_name,
					os_type: this.state.os_type,
					user_id: user_id(),
				}
		}}
	/>
}

			<IntlMessages id='sidebar.subscriptions' defaultMessage='Chameleon | Subscriptions'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
				   <meta name="description" content="Chameleon | Subscriptions" />
                 </Helmet>
               )}
            </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.thankuforyousupport" />}
               match={this.props.match}
            />
				
			<RctCollapsibleCard fullBlock>
			<div className="table-responsive">
			
			
			<div className=" py-20 px-10 border-bottom"> 
		
	<div className="container">

			<div className="row  p-15">
				<div className="col-lg-8">
				
						<div className="contact-box" id="showButton" style={{padding: '20px'}} style={have_address ? {padding: '20px',display:'none'} : {padding: '20px',display:'block'}}>
							<div className="row">
								<p><b>{user_data.full_name}</b><br/>
								{user_data.street_1 =! '' ? 	user_data.street_1:""}{" "}
								{user_data.street_2 =! '' ? user_data.street_2:""}<br/>
								{user_data.city!='' ? user_data.city:""}{" "}
								{user_data.state!='' ? user_data.state:""}{" - "}
								{user_data.zip!='' ? user_data.zip:""}<br/>
								{user_data.country_id!='' ? 	user_data.country_id:""}<br/>
								<IntlMessages id="components.phoneNo"/> : {user_data.mobile!='' ? 	user_data.mobile:""}<br/>
								<Button type="button"  onClick={() => this.editAddress('show')} variant="raised" color="primary" className="text-white"  >Edit</Button>
								</p>
							</div>	 
						</div>
					
			
					<div className="contact-box addressbox"  style={have_address ? {display:'block'} : {display:'none'}}>
						<form action={PAYPAL_URL} className="p-0" id="payment" method="post">
							<input type="hidden" class="serial_number" name="serial_number" value={serial_number} />
							<input type="hidden" class="os_type"  name="os_type" value={os_type} />
							<input type="hidden" class="browser_id"  name="browser_id" value={browser_id} />
							<input type="hidden" class="language_id"  name="language_id" value={browser_language} />
							<input type="hidden" name="business" value={PAYPAL_EMAIL}/>
							<input type="hidden" name="cmd" value="_xclick-subscriptions"/>
							
							{plan_type==2 ? 
							<input type="hidden" name="item_name" value={get_plan_name_by_id(AppConfig.plans_year_array, this.state.browser_plan)}/>
							:<input type="hidden" name="item_name" value={get_plan_name_by_id(AppConfig.plans_monthly_array, this.state.browser_plan)}/>
						}

					
							<input type="hidden" name="plan_name" value={get_plan_name_by_id(AppConfig.plans_array, this.state.browser_plan)}/>
							
							<input type="hidden" name="item_number" class="item_number" />
							<input type="hidden" name="plan_type"  value={plan_type} />
							
							<input type="hidden" name="a3" id="paypalAmt" value={plan_price}/>
							
							
							{plan_type == 2 ?
							<div>
								<input type="hidden" name="p3" id="paypalValid" value="1"/>
								</div>
							:
							<div>
								<input type="hidden" name="p3" id="paypalValid" value="1"/>
								</div>
							}
						
							{plan_type == 2 ?
								<input type="hidden" name="t3" value="Y"/>
							:
								<input type="hidden" name="t3" value="M"/>
							}
								<input type="hidden" name="src" value="1"/>
								<input type="hidden" name="sra" value="1"/>
							<input type="hidden" name="custom" value={serial_number+","+os_type+","+browser_id+","+browser_language} />
							<input type="hidden" name="cancel_return" value={pathForxml()+"api/payment_cancel"}/>
							<input type="hidden" name="return" value={pathForxml()+"api/checkout_sub_paypal_api"}/>
							
							<input type="hidden" name="currency_code" value="USD"/>
							<input type="hidden" name="notify_url" value={pathForxml()+"api/sub_purchase_notify"}/>
							<input type="hidden" name="rm"  value={2} />   
							<input type="hidden" name="_token" value=""/>
							<div className="contact-form">
								<div className="row">
								
									<input type="hidden" name="amount" className="form-control" id="amountInDollars" value ={plan_price} required/>
								
									<input type="hidden" name="padmin_browser_id" className="form-control" id="padmin_browser_id" value ={browser_id} required/>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.fullName'></IntlMessages></label>
											<input type="text" name="full_name"  className="form-control" id="fullName" placeholder='Name' value={user_data.full_name} onChange={(e) => this.onUpdateUserDetail('full_name', e.target.value)} required/>
										</div>
									</div>
									<input type="hidden" name="child_name" value={this.state.child_name}/> 
									<input type="hidden" name="email" className="form-control" id="emailOfUser" value={user_data.email}  placeholder='email' required/>
									<input type="hidden" name="device" value={device_name}/> 
									
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.street1'></IntlMessages></label>
											<input type="text" name="address_1" className="form-control" value={user_data.street_1_temp} id="address_1" placeholder='address 1' onChange={(e) => this.onUpdateUserDetail('street_1_temp', e.target.value)} />
										</div>
									</div>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.address2Optional'></IntlMessages></label>
											<input type="text" name="address_2" className="form-control" value={user_data.street_2} id="address_2" placeholder='address 2' onChange={(e) => this.onUpdateUserDetail('street_2', e.target.value)} />
										</div>
									</div>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.city'></IntlMessages></label>
											<input type="text" name="city" className="form-control" value={user_data.city} id="city" placeholder='city' onChange={(e) => this.onUpdateUserDetail('city', e.target.value)} />
										</div>
									</div>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.state'></IntlMessages></label>
											<input type="text" name="state" className="form-control" value={user_data.state} id="state" placeholder='state' onChange={(e) => this.onUpdateUserDetail('state', e.target.value)} />
										</div>
									</div>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.country'></IntlMessages></label>
											<Input type="select" name="country_id" id="country_id" value={user_data.country_id} onChange={(e) => this.onUpdateUserDetail('country_id', e.target.value)} >
											{ countries && countries.map((country, key) => (
												<option key={key} value={country.code}>{country.name}</option>
											)) }
											</Input>
										</div>
									</div>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.zipCode'></IntlMessages></label>
											<input type="text" name="zip" className="form-control" id="zip" value={user_data.zip} placeholder='zip' onChange={(e) => this.onUpdateUserDetail('zip', e.target.value)}/>
										</div>
									</div>
									<div className="col-lg-6 col-sm-12 mb-3">
										<div className="form-group">
											<label className="mb-2"><IntlMessages id='components.phoneNo'></IntlMessages></label>
											<input type="text"  name="phone" className="form-control" value={user_data.mobile} id="phone" placeholder='phone' required onChange={(e) => this.onUpdateUserDetail('mobile', e.target.value)} />
										</div>
									</div>
									{!have_address  &&
										<div class="col-lg-6 col-sm-12">
											<div class="form-group">
												<Button  onClick={() => this.updateUserdetail()} type="button" variant="raised" color="primary" className="text-white">
												<IntlMessages id='button.update'></IntlMessages></Button>
												<Button  onClick={() => this.editAddress('hide')} type="button" variant="raised" color="primary" className="text-white ml-15">
												<IntlMessages id='button.cancel'></IntlMessages></Button>
											</div>
										</div>	
									}					
									<div className="col-lg-12 col-sm-12 mb-3">
									{	console.log('STRIPE_PLAN_ID',STRIPE_PLAN_ID)}
									{plan_type == 1 ?
								
										<input type="hidden" name="plan_id" value={STRIPE_PLAN_ID[this.state.browser_plan] }/>
										:
										<input type="hidden" name="plan_id" value={STRIPE_PLAN_ID_YEAR[this.state.browser_plan] }/>
									}
										<input type="hidden" id="stripeToken" name="stripeToken" />
										<input type="hidden" id="amountInCents" name="amountInCents" />
										
										<input type="hidden" name="promocode" class="form-control" id="promocodeaaplied" />             
										<input type="hidden" class="is_promo_applied" name="is_promo_applied" />
										<input type="hidden" class="discount" name="discount" />
										<input type="hidden" class="before_discount" name="before_discount" value={plan_price } />

										<div className="donate-button" ></div>
									</div> 
								</div> 
							</div> 
						</form>
					</div>
						
				</div>
							
				<div className="col-lg-4">
					<div className="row" style={{height:'470px'}}>
					<div className="col-lg-12 col-sm-12">
						<div className="form-group">
								<label className="mb-2"><IntlMessages id="widgets.NameOfTheDevice"/> : {device_name}</label>
												
							</div>
							</div>
							<div className="col-lg-12 col-sm-12">
							<div className="form-group">
								<label className="mb-2"><IntlMessages id="widgets.NameOfTheApp"/> : {browser_name}</label>
							
							</div>
							</div>	
						<div className="col-lg-12 col-sm-12">
							<div class="form-group">
								<label className="mb-2"><IntlMessages id='components.planType'></IntlMessages> : {get_plan_name_by_id(AppConfig.plans_array, this.state.browser_plan)}</label>					
							</div>	
						</div>					
						<div className="col-lg-12 col-sm-12">
							<div class="form-group">
							
								<label className="mb-2"><IntlMessages id="widgets.SubscriptionAmount"/> : $<span id="amountPlan">{plan_price}</span>/<IntlMessages id="download.planmonth" /></label>
							
							</div>
						</div>
						<div className="col-lg-12 col-sm-12 " >
							<div class="form-group">
                     <label className="mb-2"><IntlMessages id='payment.termsAndConditionsText'></IntlMessages>   </label>
							</div>
						</div>
						<div className="col-lg-12 col-sm-12 showAmountData" style={{display:'none'}}>
							<div class="form-group">
								<label className="mb-2"><IntlMessages id="widgets.discount"/> : $<span id="discounted"></span></label>
							</div>
						</div>
						<div className="col-lg-12 col-sm-12 showAmountData" style={{display:'none'}}>
							<div class="form-group">
								<label className="mb-2"><IntlMessages id="widgets.FinalAmount"/> : $<span id="finalAmount"></span></label>
							</div>
						</div>
										
						<div class="col-lg-6 col-sm-12">				
							<div class="form-group">
								<input type="text" name="promocode" class="form-control" id="promocode" placeholder='Promocode' />
								
								<span class="error-block promocode-error"> </span>
								<span class="success-block promocode-success"> </span>
							</div>					
						</div>
						<div class="col-lg-6 col-sm-12">
							<div class="form-group">
								<Button  onClick={() => this.applyPromocodeButton()} type="button" variant="raised" color="primary" className="text-white ml-15">
								<IntlMessages id='components.apply_promocode'></IntlMessages></Button>
							</div>
						</div>
					
						<div class="col-lg-6 col-sm-12">
							<div class="form-group">
						
								<Button type="button" onClick={this.stripButtonClick.bind(this)} variant="raised" color="primary" className="text-white"  ><IntlMessages id="button.PayWithCreditCard"/></Button>
								{ STRIPE_KEY &&
									<StripeCheckout
									stripeKey={STRIPE_KEY}
								  //stripeKey={AppConfig.STRIPE_KEY}
									image= {require('Assets/img/chameleon-stripe.png')}
									token={this.onToken}
									label="Pay with Credit Card"
									amount= {Math.floor(this.state.strip_plan_price * 100)}
									description= {get_plan_name_by_id(AppConfig.plans_monthly_array, this.state.browser_plan)}
									email= {user_data.email}
									className="hidden stripbutton" 
									style={{display:"none"}}
									/>
								} 
							</div> 
						</div> 
						<div class="col-lg-6 col-sm-12">
							<div class="form-group">
							
								<Button type="button" id="paypalButton" onClick={() => this.paypalButton()} variant="raised" color="primary" className="text-white ml-15"  ><IntlMessages id="button.PayWithPaypal"/></Button>
							</div> 
						</div> 
									
					</div>
				</div>
			</div>
			</div>
			</div>
			   


			</div>
			{loading &&
			<RctSectionLoader />
			}
			</RctCollapsibleCard>
			</div>
		);
	}
}
