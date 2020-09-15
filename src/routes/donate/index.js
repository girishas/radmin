/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Redirect, Route, Link } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import Checkbox from '@material-ui/core/Checkbox';
import {
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Badge
} from 'reactstrap';
import { Form, FormGroup, Label,FormText, Col } from 'reactstrap';
import moment from "moment";

import { NotificationManager } from 'react-notifications';
import {get_plan_id_by_name ,pathForxml ,checkPath,user_id} from "Helpers/helpers";
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
export default class Donate extends Component {
constructor(props) {
super(props);
this.state = {
      loading: false, // loading activity
      subs_data:[],
      countries:[],
      user_data:[],
      plan_data: [],
      campaign:[],
   // slug:$(location).attr("href").split('/').pop(),
   
   };
}
//strip payment token
onToken = (token, addresses) => {

$("#stripeToken").val(token.id);
$("#emailOfUser").val(token.email);
$("#amountInCents").val(Math.floor($("#amountInDollars").val() * 100));
// console.log('react-stripe-token', token)
// console.log('react-stripe-addresses', addresses)
var paymentData = $('#payment').serialize() ;
   this.setState({ loading: true });
api.post('api-checkout',paymentData ).then((response) => {
   const data =  response;
   // console.log('response',response)
   // console.log('dataaa',data)
   if(data.data.status = 1){
      this.setState({ loading: false });
      NotificationManager.success(data.data.message);
      setTimeout(() => {
         document.getElementById("profile-btn").click();
         location.reload()
         //<Redirect to={'/app/dashboard'} />
      }, 2000);  
   // window.location.replace('/cadmin/app/user/user-profile-1');
   }else{
      NotificationManager.error(data.data.message);
   }
}).catch(error => {
   // error hanlding
})
};

getInfo() {
// console.log('this.props.location.state.transaction', this.props.location.state.transaction)
const  currentPathArray  =  $(location).attr("href").split('/');
const  slug  =  currentPathArray[currentPathArray.length - 2];
const  amount  =  currentPathArray[currentPathArray.length - 1];

api.get('get-donation-type-by-slug', {
      params: {
         slug: slug,
         user_id:user_id(),
      }
   })
   .then((response) => {
      const data =  response.data;
      
      this.setState({
         subs_data: {
               ...this.state.subs_data,
               amount: amount
            }
         });
      this.setState({campaign:data.campaign , countries : data.countries,user_data:data.userdata});
   }) 
   .catch(error => {
      // error hanlding
   })
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
componentDidMount() {
this.getInfo();

}

/**
 * On Update User Details
 */
onUpdateUserDetail2(key, value, e) {
this.setState({
subs_data: {
      ...this.state.subs_data,
      [key]: value
   }
});
}
onUpdateUserDetail(key, value, e) {
this.setState({
   user_data: {
      ...this.state.user_data,
      [key]: value
   }
});
}
paypalButton(){
var _this = this;
api.post('save-donation-payment-data',$("#payment").serialize()  ).then((response) => {
   const data =  response;
   
   $('#item_number').val(response.data.id);
   $('#payment').attr('action' ,'https://www.sandbox.paypal.com/cgi-bin/webscr' );
   $("#payment").submit();
}).catch(error => {
   // error hanlding
})
}

stripButtonClick(){
$(".stripbutton").click()
}

updateUserdetail(){
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
         location.reload();
      }else{
         alert(message);
      }
   }).catch(error => {
   // error hanlding
   })
}
render() {
// const stripe = Stripe('pk_test_3Kktp6mQ9b9cZKiLDOHwTWTl');

const {countries ,subs_data, loading , plan_data ,campaign,user_data } = this.state;

return (
   <div className="user-management">
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
<div className="py-20 px-10 border-bottom"> 
   <div className="">
   
      <div className="container">
         <div className="row">
            <div className="col-lg-8">
            <div  id="showButton" style={{padding: '20px'}}>
					<div className="row">
						<p><b>{user_data.full_name}</b><br/>
						{user_data.street_1 =! '' ? 
						user_data.street_1:""}{" "}
						{user_data.street_2 =! '' ? 
						user_data.street_2:""}<br/>
						{user_data.city!='' ? 
						user_data.city:""}{" "}
						{user_data.state!='' ? 
						user_data.state:""}{" - "}
						{user_data.zip!='' ? 
						user_data.zip:""}<br/>
						{user_data.country_id!='' ? 
						user_data.country_id:""}<br/>
						<IntlMessages id="components.phoneNo"/> : {user_data.mobile!='' ? 
						user_data.mobile:""}<br/>
						<Button type="button"  onClick={() => this.editAddress('show')} variant="raised" color="primary" className="text-white"  >Edit</Button>
						</p>
						</div>
							 
					</div>
               <div className="contact-box " >
               
            
                  <form action="https://www.sandbox.paypal.com/cgi-bin/webscr" className="p-0" id="payment" method="post">
            
              
                     <div className="contact-form mt-4 addressbox" style={{display:'none'}}>
                     <input type="hidden" name="business" value="gis@test.com"/>
               <input type="hidden" name="cmd" value="_xclick"/>
               {/* <input type="hidden" name="item_name" value={plan_data.plan_name}/>
               <input type="hidden" name="item_number" id="item_number" /> */}
               <input type="hidden" name="item_name" value="donation"/>
               <input type="hidden" name="item_number" id="item_number" value="14"/>
               {/* <input type="hidden" name="a3" id="paypalAmt" value={plan_data.plan_amount}/>
               <input type="hidden" name="p3" id="paypalValid" value="1"/>
               <input type="hidden" name="t3" value="M"/> */}
               <input type="hidden" name="cancel_return" value={pathForxml()+"api/payment_cancel"}/>
               <input type="hidden" name="return" value={pathForxml()+"api/api-checkout-paypal"}/>

               <input type="hidden" name="currency_code" value="USD"/>   
               {/* <input type="hidden" name="cancel_return" value="{!! url('/') !!}/payment_cancel"/>
               <input type="hidden" name="return" value="{!! url('/') !!}/checkout-sub-paypal"/> */}
            

                  <input type="hidden" name="_token" value=""/>
                        <div className="row">
                           {/* <input type="hidden" name="amount" className="form-control" id="amountInDollars" value ={1000} required/> */}
                           <input type="hidden" name="padmin_browser_id" className="form-control" id="padmin_browser_id" value ={plan_data.browser_id} required/>
                           <input type="hidden" name="campaign_id" value={campaign.id}/> 
                           

                           
                           <div className="col-lg-6 col-sm-12 mb-3">
                              <div className="form-group">
                                 <label className="mb-2"><IntlMessages id='components.fullName'></IntlMessages></label>
                                 <input type="text" name="full_name"  className="form-control" id="fullName" value={user_data.full_name} onChange={(e) => this.onUpdateUserDetail('full_name', e.target.value)} placeholder='Name' required/>
                              
                              </div>
                           </div>
                        
                        
                           <input type="hidden" name="email" className="form-control" id="emailOfUser"  value={user_data.email} onChange={(e) => this.onUpdateUserDetail('email', e.target.value)} placeholder='email' required/>
                           
                           <div className="col-lg-6 col-sm-12 mb-3">
                              <div className="form-group">
                                 <label className="mb-2"><IntlMessages id='components.phoneNo'></IntlMessages></label>
                                 <input type="text"  name="phone" className="form-control" id="phone" value={user_data.mobile} onChange={(e) => this.onUpdateUserDetail('mobile', e.target.value)} placeholder='phone' required/>
                              </div>
                           </div>
                           <div className="col-lg-6 col-sm-12 mb-3">
                              <div className="form-group">
                                 <label className="mb-2"><IntlMessages id='components.street1'></IntlMessages></label>
                                 <input type="text" name="address_1" className="form-control" id="address_1" value={user_data.street_1} onChange={(e) => this.onUpdateUserDetail('street_1', e.target.value)} placeholder='address 1'/>
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
                                 <select className="form-control" name="country_id" id="country_id" value={user_data.country_id} onChange={(e) => this.onUpdateUserDetail('country_id', e.target.value)}>
                                       { countries && countries.map((country, key) => (
                                          <option key={key} value={country.code}>{country.name}</option>
                                       )) }
                                 </select>
                              </div>
                           </div>
                           <div className="col-lg-6 col-sm-12 mb-3">
                              <div className="form-group">
                                 <label className="mb-2"><IntlMessages id='components.zipCode'></IntlMessages></label>
                                 <input type="text" name="zip" className="form-control" id="zip"   value={user_data.zip} onChange={(e) => this.onUpdateUserDetail('zip', e.target.value)} placeholder='zip'/>
                              </div>
                           </div>
                           <div class="col-lg-6 col-sm-12">
										<div class="form-group">
											<Button  onClick={() => this.updateUserdetail()} type="button" variant="raised" color="primary" className="text-white">
											<IntlMessages id='button.update'></IntlMessages></Button>
											<Button  onClick={() => this.editAddress('hide')} type="button" variant="raised" color="primary" className="text-white ml-15">
											<IntlMessages id='button.cancel'></IntlMessages></Button>
										</div>
									</div>	
                           <div className="col-lg-12 col-sm-12 mb-3">
                           
                           <input type="hidden" name="plan_id" value=''/> 
                        
                           <input type="hidden" id="stripeToken" name="stripeToken" />
                           <input type="hidden" id="amountInCents" name="amountInCents" />
                              <div className="donate-button" >
                              {/* <Button type="submit" className="button wow fadeInUp mt-3"></Button> */}
                           
                           

                        
                           </div> 
                              
                           </div>
                        
                        </div>
                     </div>
                     <div className="col-lg-6 col-sm-12 mb-3">
                              <div className="form-group">
                                 <label className="mb-2">Donation Amount</label>
                                <br/>
							<Input
								id="amountInDollars"
                        value={subs_data.amount}
                        name="amount"
                        type="text"
								onChange={(e) => this.onUpdateUserDetail2('amount', e.target.value)}
								startAdornment={<InputAdornment position="start">$</InputAdornment>}
							/>
                                {/* <input type="text" name="amount"  className="form-control" id="amountInDollars"  value={subs_data.amount} onChange={(e) => this.onUpdateUserDetail('amount', e.target.value)} placeholder='Donation Amount' required/>
                   */}
                              </div>
                           </div>
                     <div className="paymentBtns">
      <Button type="button" id="paypalButton" onClick={this.stripButtonClick.bind(this)}
                     variant="raised" color="primary" className="text-white"  >Pay by Credit Card</Button>

               <StripeCheckout

                  stripeKey="pk_test_3Kktp6mQ9b9cZKiLDOHwTWTl"
                  image= {require('Assets/img/chameleon_forum-small.png')}
                  token={this.onToken}
                  label="Pay with Strip"
                  amount= {subs_data.amount * 100}
                  description= {'Donation'}
                  email= {subs_data.email}
                  variant="raised" color="primary" className="hidden stripbutton" 
                  style={{display:"none"}}
               />  
               
                  <Button type="button" id="paypalButton" onClick={this.paypalButton.bind(this)}
                     variant="raised" color="primary" className="text-white ml-15"  >Pay with Paypal</Button>
            </div>
                  </form>
               </div>
            </div>
            <div className="col-lg-3 r-mt3">
                  <div className="row pb-4">
                     <div className="col-sm-12">
                        <div className="contents">
                           <h3  className="mb-2 mt-4">{campaign.name}</h3>
                              <img style={{width:"100%"}} src={checkPath('campaign')+campaign.image} title={campaign.name} />
                        
                              <p dangerouslySetInnerHTML={{__html:campaign.desciption}} />
                        
                           {
                           //  raised_percent = ((campaign.raised_amount)?campaign.raised_amount:0)/((campaign.goal_amount)?campaign.goal_amount:1)*100
                           
                           }
                           ${campaign.raised_amount} donated of ${campaign.goal_amount} Goal
               
                  
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
