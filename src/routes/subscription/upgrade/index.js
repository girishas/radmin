/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Redirect, Route, Link } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
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

import { NotificationManager } from 'react-notifications';
import {get_plan_id_by_name ,pathForxml,user_id,get_category_type_name_by_id ,get_plan_name_by_id} from "Helpers/helpers";
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

//import Stripe from 'stripe';
//import 'Assets/page-assets/bundle.js.download';
//import stripe from 'tipsi-stripe';
export default class Upgrade extends Component {
   constructor(props) {
      super(props);
      console.log('this.props.location.state',this.props.location.state)
      this.state = {
            user_data:[],
            loading: false, // loading activity
            subs_data:[],
            countries:[],
            plan_data: this.props.location.state,
            device_name:this.props.location.state.device_name,
            browser_name:this.props.location.state.browser_name,
            plan_type:this.props.location.state.plan_type,
            serial_number:this.props.location.state.serial_number,

            strip_plan_price:0,
            redirectToAppPage:false,
            
            STRIPE_PLAN_ID:[],
            STRIPE_PLAN_ID_YEAR:[],
            STRIPE_KEY:"",
            PAYPAL_EMAIL:"",
            PAYPAL_URL:"",
         };
   }
   //strip payment token
   onToken = (token, addresses) => {

      $("#stripeToken").val(token.id);
      $("#emailOfUser").val(token.email);
      $("#amountInCents").val(Math.floor($("#amountInDollars").val() * 100));
      
      var paymentData = $('#payment').serialize() ;
         this.setState({ loading: true });
      api.post('api-checkout-subscription',paymentData ).then((response) => {
         const data =  response;
        console.log('data',data);
         if(data.data.status = 1){
            this.setState({ loading: false });
            NotificationManager.success(data.data.message);
            if( window.IsChameleon){
              
					
				}
            setTimeout(() => {
              // localStorage.setItem("locationReaload",true);
					this.setState({redirectToAppPage:true});
              // location.reload()
            }, 2000);  
          
         }else{
            NotificationManager.error(data.data.message);
         }
      }).catch(error => {
         // error hanlding
      })
    };
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

   stripButtonClick(){
		var validateField = this.validateField(this.state.user_data);
		if(validateField){
			this.updateUserdetail();
			$(".stripbutton").click();
		}
	}
   getInfo() {
 
      api.get('user-get-subscription-by-id', {
            params: {
              subs_id: this.props.location.state.subs_id,
              user_id:user_id(),
            },
            headers: {'User-Id':user_id()},

          })
         .then((response) => {
           
            const data =  response.data;
           
         //   this.setState({subs_data:data.subscription , countries : data.countries,
         //    user_data:data.user_data});
           
          this.setState({
            STRIPE_PLAN_ID:data.STRIPE_PLAN_ID,
				STRIPE_PLAN_ID_YEAR:data.STRIPE_PLAN_ID_YEAR,
				STRIPE_KEY:data.STRIPE_KEY,
				PAYPAL_EMAIL:data.PAYPAL_EMAIL,
            PAYPAL_URL:data.PAYPAL_URL,
            
            subs_data:data.subscription , 
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



         }) 
         .catch(error => {
            // error hanlding
         })
   }

   componentDidMount() {
      $("#TrialFrequency").hide();
      $("#TrialAmount").hide();
      $("#TrialPeriod").hide(); 
      console.log('new props',this.props.location.state);
      this.getInfo();
      var plan_id = this.props.location.state.subs_type;
      var plan_type = this.props.location.state.plan_type;

      let	plan_price = get_plan_name_by_id(AppConfig.plan_price_array, plan_id);
      if(plan_type == 2){
            plan_price = get_plan_name_by_id(AppConfig.plan_price_year_array, plan_id);
      }
      this.setState({strip_plan_price: plan_price});
     
   }

   /**
    * On Update User Details
    */
   onUpdateUserDetail(key, value, e) {
      this.setState({
         user_data: {
            ...this.state.user_data,
            [key]: value
         }
      });
     }
     applyPromocodeButton(){
		var promocode = $('#promocode').val();
		var amount =$("#amountPlan").html();
		var browser_id = this.props.location.state.browser_id;
		var plan_id = this.props.location.state.subs_type;
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
            this.setState({strip_plan_price: amount});
            $("#promocodeaaplied").val('');
				$(".is_promo_applied").val(status);
				$(".discount").val(0);
				$("#amountInDollars").val(amount);
				$("#paypalAmt").val(amount);
				$('.promocode-success').text('');
				$('.promocode-error').text(response.data.message);
            $('.after-discount').html(' ');  
            $('.showAmountData').hide();   
           
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
paypalButton(){
   var validateField = this.validateField(this.state.user_data);
   if(validateField){
      this.updateUserdetail();
      var _this = this;
      api.post('save-payment-data',$("#payment").serialize()  ).then((response) => {
         const data =  response;
         
         $('#item_number').val(response.data.id);
         $('#payment').attr('action' ,this.state.PAYPAL_URL );
         $("#payment").submit();
      }).catch(error => {
         // error hanlding
      })
   
   }


}


   render() {
     // const stripe = Stripe('pk_test_3Kktp6mQ9b9cZKiLDOHwTWTl');
     const {countries ,subs_data, loading , plan_data,user_id,user_data,
      device_name,browser_name,plan_type,redirectToAppPage,
      STRIPE_PLAN_ID,
      STRIPE_PLAN_ID_YEAR,
      STRIPE_KEY,
      PAYPAL_EMAIL,
      PAYPAL_URL,
   } = this.state;
     let plan_id = plan_data.subs_type;

     let	plan_price = get_plan_name_by_id(AppConfig.plan_price_array, plan_id);
     let	plan_Yr_Mont = 'Month';
     if(plan_type == 2){
           plan_price = get_plan_name_by_id(AppConfig.plan_price_year_array, plan_id);
           plan_Yr_Mont = 'Year';
     }

     let have_address = false;
		if(user_data.street_1 == '' || user_data.street_1 == null){
			 have_address  = true;
		}



// $('#paypalButton').on('click', function (e) {
//    var validateField = this.validateField(user_data);
		
//    if(validateField){
//       this.updateUserdetail();
//       var _this = this;
//       api.post('save-payment-data',$("#payment").serialize()  ).then((response) => {
//          const data =  response;
         
//          $('#item_number').val(response.data.id);
//          $('#payment').attr('action' ,'https://www.sandbox.paypal.com/cgi-bin/webscr' );
//          $("#payment").submit();
//       }).catch(error => {
//          // error hanlding
//       })
//    }
// })


      return (
         <div className="user-management">
         {(redirectToAppPage == true) &&
				<Redirect 
					from='upgrade'
					to={{
						pathname: '/app/subscription/app-page',
						state: {
							device: this.state.device_name,
							serial_number: this.state.serial_number,
							child_name: subs_data.child_name,
							os_type: plan_data.os_type,
							user_id: plan_data.login_user_id,
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
         <div className="">
           
            <div className="container">
           
               <div className="row">
                  <div className="col-lg-8">
                  <div className="contact-box" id="showButton"  style={{padding: '20px'}} style={have_address ? {padding: '20px',display:'none'} : {padding: '20px',display:'block'}}>
					<div className="row">
						<p><b>{user_data.full_name}</b><br/>
						{user_data.street_1 =! '' ? user_data.street_1:""}{" "}
						{user_data.street_2 =! '' ? user_data.street_2:""}<br/>
						{user_data.city!='' ? user_data.city:""}{" "}
						{user_data.state!='' ? user_data.state:""}{" - "}
						{user_data.zip!='' ? user_data.zip:""}<br/>
						{user_data.country_id!='' ? user_data.country_id:""}<br/>
						<IntlMessages id="components.phoneNo"/> : {user_data.mobile!='' ? user_data.mobile:""}<br/>
						<Button type="button"  onClick={() => this.editAddress('show')} variant="raised" color="primary" className="text-white"  >Edit</Button>
						</p>
					</div>
							 
					</div>
                     <div className="contact-box addressbox" style={have_address ? {display:'block'} : {display:'none'}}>
                     
                    
                        <form action={PAYPAL_URL} className="p-0" id="payment" method="post">
                   
                      <input type="hidden" name="business" value={PAYPAL_EMAIL}/>
                      <input type="hidden" name="cmd" value="_xclick-subscriptions"/>
                      <input type="hidden" name="plan_name" value={plan_data.plan_name}/>
                      <input type="hidden" name="item_number" id="item_number" />
                      <input type="hidden" name="a3" id="paypalAmt" value={plan_price}/>
                     
							
                     

                  {plan_type==2 ? 
							<input type="hidden" name="item_name" value={get_plan_name_by_id(AppConfig.plans_year_array, get_plan_id_by_name(plan_data.plan_name))}/>
							:<input type="hidden" name="item_name" value={get_plan_name_by_id(AppConfig.plans_monthly_array, get_plan_id_by_name(plan_data.plan_name))}/>
						}

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
                        <input type="hidden" name="cancel_return" value={pathForxml()+"api/payment_cancel"}/>
                        <input type="hidden" name="return" value={pathForxml()+"api/api-checkout-sub-paypal"}/>

                        <input type="hidden" name="plan_type"  value={plan_type} />
                        <input type="hidden" name="notify_url" value={pathForxml()+"api/sub_upgrade_notify"}/>
                        <input type="hidden" name="rm"  value={2} />

                        <input type="hidden" name="currency_code" value="USD"/>   
                        <input type="hidden" name="_token" value=""/>
                        
                           <div className="contact-form mt-4">
                              <div className="row">
                                 <input type="hidden" name="amount" className="form-control" id="amountInDollars" value ={plan_price} required/>
                                 <input type="hidden" name="padmin_browser_id" className="form-control" id="padmin_browser_id" value ={plan_data.browser_id} required/>

								          <input type="hidden" name="subid"   value ={plan_data.subs_id}/>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.fullName'></IntlMessages></label>
                                       <input type="text" name="full_name"  className="form-control" id="fullName" value={user_data.full_name} onChange={(e) => this.onUpdateUserDetail('full_name', e.target.value)} placeholder='Name' required/>
                                      
                                    </div>
                                 </div>
								         <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.DevicefriendlyName'></IntlMessages></label>
                                       <input type="text" readOnly name="child_name"  className="form-control" id="child_name"  value={subs_data.child_name} onChange={(e) => this.onUpdateUserDetail('child_name', e.target.value)} placeholder='Child name' required/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.email'></IntlMessages></label>
                                       <input type="text" readOnly name="email" className="form-control" id="emailOfUser"  value={user_data.email} onChange={(e) => this.onUpdateUserDetail('email', e.target.value)} placeholder='email' required/>
                                       
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.phoneNo'></IntlMessages></label>
                                       <input type="text"  name="phone" className="form-control" id="phone" value={user_data.mobile} onChange={(e) => this.onUpdateUserDetail('mobile', e.target.value)} placeholder='phone' required/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.street1'></IntlMessages></label>
                                       <input type="text" name="address_1" className="form-control" value={user_data.street_1_temp} id="address_1" placeholder='address 1' onChange={(e) => this.onUpdateUserDetail('street_1_temp', e.target.value)} />
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.address2Optional'></IntlMessages></label>
                                       <input type="text" name="address_2" className="form-control" id="address_2"  value={user_data.street_2} onChange={(e) => this.onUpdateUserDetail('street_2', e.target.value)} placeholder='address 2'/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.city'></IntlMessages></label>
                                       <input type="text" name="city" className="form-control" id="city"   value={user_data.city} onChange={(e) => this.onUpdateUserDetail('city', e.target.value)} placeholder='city'/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.state'></IntlMessages></label>
                                       <input type="text" name="state" className="form-control" id="state"   value={user_data.state} onChange={(e) => this.onUpdateUserDetail('state', e.target.value)} placeholder='state'/>
                                    </div>
                                 </div>

                 
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.country'></IntlMessages></label>
                                        <Input type="select" name="country_id" id="country_id" value={user_data.country_id} onChange={(e) => this.onUpdateUserDetail('country_id', e.target.value)}>
                                             { countries && countries.map((country, key) => (
                                                <option key={key} value={country.code}>{country.name}</option>
                                             )) }
                                       </Input>
                                    </div>
                                 </div>
                                 <div className="col-lg-6 col-sm-12 mb-3">
                                    <div className="form-group">
                                       <label className="mb-2"><IntlMessages id='components.zipCode'></IntlMessages></label>
                                       <input type="text" name="zip" className="form-control" id="zip"   value={user_data.zip} onChange={(e) => this.onUpdateUserDetail('zip', e.target.value)} placeholder='zip'/>
                                    </div>
                                 </div>
                                            
                              {!have_address &&
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
                                 
                                 {plan_type == 1 ?
                                    <input type="hidden" name="plan_id" value={STRIPE_PLAN_ID[get_plan_id_by_name(plan_data.plan_name)] }/>
                                    :
                                    <input type="hidden" name="plan_id" value={STRIPE_PLAN_ID_YEAR[get_plan_id_by_name(plan_data.plan_name)] }/>
                                 }

                                  {/* <input type="hidden" name="plan_id" value={AppConfig.PLAN_ID[get_plan_id_by_name(plan_data.plan_name)]}/>  */}
                                  <input type="hidden" id="stripeToken" name="stripeToken" />
                                  <input type="hidden" id="amountInCents" name="amountInCents" />
                                  <input type="hidden" name="device" value={subs_data.device}/>              
                                 <input type="hidden" name="promocode" class="form-control" id="promocodeaaplied" />             
                                 <input type="hidden" class="is_promo_applied" name="is_promo_applied" />
                                 <input type="hidden" class="discount" name="discount" />
                                 <input type="hidden" class="before_discount" name="before_discount" value={plan_price } />
                                    <div className="donate-button" >
                                    {/* <Button type="submit" className="button wow fadeInUp mt-3"></Button> */}
                                    {/* <Button variant="raised" color="primary" id="customButton"  className="text-white" >Donate By strip</Button> */}
                                    {/* <a href="javascript:void(0);" id="customButton" className="button wow fadeInUp mt-3"  data-wow-duration="1.0s">Strip </a> */}
                                   </div> 
                                    {/* <div className="donate-button"   >
                                         <a href="javascript:void(0);" id="paypalButton" className="button wow fadeInUp mt-3" data-wow-duration="1.0s">paypal</a>
                                   </div>  */}
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
								<label className="mb-2"><IntlMessages id="widgets.NameOfTheDevice"/> : {subs_data.device}</label>
												
							</div>
							</div>
							<div className="col-lg-12 col-sm-12">
							<div className="form-group">
								<label className="mb-2"><IntlMessages id="widgets.NameOfTheApp"/> : {browser_name}</label>
							
							</div>
							</div>	
						<div className="col-lg-12 col-sm-12">
							<div class="form-group">
								<label className="mb-2"><IntlMessages id='components.planType'></IntlMessages> : {this.props.location.state.plan_name}</label>					
							</div>	
						</div>					
						<div className="col-lg-12 col-sm-12">
							<div class="form-group">
								<label className="mb-2"><IntlMessages id="widgets.SubscriptionAmount"/> : $<span id="amountPlan">{plan_price}</span>/{plan_Yr_Mont} </label>
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
                     <Button type="button"  onClick={this.stripButtonClick.bind(this)}
                           variant="raised" color="primary" className="text-white"><IntlMessages id="button.PayWithCreditCard"/></Button>
                           {console.log("stripe amount",Math.floor(this.state.strip_plan_price * 100))}
                    { STRIPE_KEY &&
                     <StripeCheckout
                        stripeKey={STRIPE_KEY}
                        image= {require('Assets/img/chameleon-stripe.png')}
                        token={this.onToken}
                        label="Pay with Credit Card"
                        amount= {Math.floor(this.state.strip_plan_price * 100)}
                        description= {plan_data.plan_name}
                        email= {subs_data.email}
                        className="hidden stripbutton" 
                        style={{display:"none"}}
                     /> 
                    }
							</div> 
						</div> 
						<div class="col-lg-6 col-sm-12">
							<div class="form-group">
                     <Button type="button" id="paypalButton" onClick={() => this.paypalButton()} variant="raised" color="primary" className="text-white ml-15"  ><IntlMessages id="button.PayWithPaypal"/></Button>
                     {/* <Button type="button" id="paypalButton" variant="raised" color="primary" className="text-white ml-15"  >Pay with Paypal</Button> */}
                      
							</div> 
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
