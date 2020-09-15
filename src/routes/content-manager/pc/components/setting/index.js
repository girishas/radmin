/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
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

import { Form, FormGroup, Label,FormText, Col ,Input as Inputcore } from 'reactstrap';
import Input from '@material-ui/core/Input';
import TextField from "@material-ui/core/TextField";
import moment from "moment";

import { NotificationManager } from 'react-notifications';

import api from 'Api';


// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Switch from '@material-ui/core/Switch';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = {
	
	bgsuccess: {
		backgroundColor: '#25C975',
	},
	textsuccess: {
		color: '#25C975',
		'& + $bgsuccess': {
			backgroundColor: '#25C975',
		},
	},
	bgwarning: {
		backgroundColor: '#EEA222',
	},
	textwarning: {
		color: '#EEA222',
		'& + $bgwarning': {
			backgroundColor: '#EEA222',
		},
	},
	bgprimary: {
		backgroundColor: '#895DFF',
	},
	textprimary: {
		color: '#895DFF',
		'& + $bgprimary': {
			backgroundColor: '#895DFF',
		},
	},
	bgdanger: {
		backgroundColor: '#F04E6A',
	},
	textdanger: {
		color: '#F04E6A',
		'& + $bgdanger': {
			backgroundColor: '#F04E6A',
		},
	},
};


export default class Setting extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false, // loading activity
            os_setting:[],
            subscription:'',
            languageResult:[]
         };
      }
    
   getInfo() {
      api.get('user-get-os-setting', {
            params: {
              os_type: this.props.os_type,
              subs_id: this.props.subs_id,
            }
          })
         .then((response) => {
              const data =  response.data.data;
               this.setState({os_setting:data});
               this.setState({
                  os_setting: {
                     ...this.state.os_setting,
                     setting_exit_key:data.setting_exit_key ?data.setting_exit_key:'L'
                  }
               });
         }) 
        
         //subscription info by id for display acadmic code
      api.get('user-get-subscription-by-id', {
            params: {
              subs_id: this.props.subs_id,
              is_other: 1,
            }
          })
         .then((response) => {
               const data =  response.data.subscription;
               this.setState({subscription:data});
               
         }) 
         api.get('get-language-array', {
            params: {
              browser_id: this.props.browser_id
            }
          })
           .then((response) => {
              this.setState({languageResult:response.data });
           })
         
      


   }


   componentDidMount() {
     
     this.getInfo();
   }
   //for change props only url is same
   componentWillReceiveProps(){
      this.getInfo();
   } 

   
   

   onReload() {
      this.setState({ loading: true });
      this.componentDidMount();
      let self = this;
      setTimeout(() => {
         self.setState({ loading: false });
      }, 2000);
   }
 /**
    * Add User
    */
   onAddAlarm() {
      var validateField = this.validateField(this.state.os_setting);

      if(validateField){
     // alert(mydata);
         this.setState({ loading: true });
            api.post('user-update-os-setting', this.state.os_setting )
            .then((response) => {
               this.setState({ loading: false });
               if(response.data.errors){
                  var allErrors  = response.data.errors.join('<br>') 
                  NotificationManager.error(allErrors);
               }else{
                  this.setState({ currentCountries:response.data });
                  // localStorage.setItem('user_id',JSON.stringify(response.data.data)) 
                  NotificationManager.success(<IntlMessages id="note.SettingsUpdatedSuccessfully" /> );
                  if(window.IsChameleon){
                     chameleonEngine.installBrowser(this.props.icon_size.browser_unique_id)
                  }
               }
            })
            .catch(error => {
               // error hanlding
               })
         }
      }
 
   
   /**
    * On Update User Details
    */
   onUpdateUserDetails(key, value, e) {

      if(key=='setting_exit_key'){
         if(value.length > 1){
            value =  value.charAt(0);
         }
      }
      this.setState({
         os_setting: {
            ...this.state.os_setting,
            [key]: value
         }
      });
   }



    handleChange = key_name  => (event, checked  ) => {
      this.setState({
         os_setting: {
            ...this.state.os_setting,
            [key_name]: checked,
         }
      });
   };

   validateField(str){

      let fieldValidationErrors = {}; 
      let formIsValid = true;
     for (var key in str) {
         switch(key) {
           case 'setting_exit_key':
             if(str[key] !== '' && str[key] != null){
                  if(str[key].length > 1){
                     formIsValid = false;
                     NotificationManager.error(<IntlMessages id="validation.ExitKeySingleChar"/>);
                  }
              } else {
                   formIsValid = false;
                   NotificationManager.error(<IntlMessages id="validation.ExitKeyIsRequried" />);
              }
           break;
         
           
           default:
             break;
         }
     }
      
       return formIsValid;
       
    }
   render() {
     const {os_setting , loading, languageResult} = this.state;
     const { classes } = this.props;

      return (
         <div className="user-management">
             <IntlMessages id='sidebar.contentManager' defaultMessage='Chameleon | Content Manager'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                 </Helmet>
               )}
             </IntlMessages>
            
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                   


                     <div className="w-50">
                           <h2 className="heading"><IntlMessages id="components.settings"/></h2>
                           <Form>
                                 
               {/* <FormGroup row> */}
                {/* <Label for="language"  sm={5} >{<IntlMessages id="components.language" />}</Label>  */}
                {/* <Input  className="col-sm-5" type="select" name="language" id="language" value={this.state.os_setting.setting_language} onChange={(e) => this.onUpdateUserDetails('setting_language', e.target.value)}>
                <option  value=''>Select Language</option>
                  { languageResult && languageResult.map((user, key) => (
                      <option key={key} value={user.id}>{user.name}</option>
                    )) }
              </Input> */}



{/* <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Inputcore type="select" name="language" id="language" value={this.state.os_setting.setting_language}
                 onChange={(e) => this.props.onUpdateUserDetails('setting_language', e.target.value)}>
                <option  value=''>Select Language</option>
                  { languageResult && languageResult.map((user, key) => (
                      <option key={key} value={user.id}>{user.name}</option>
                    )) }
              </Inputcore>
            </FormGroup> */}


              {/* <Input id="select-currency-native" 
               type="select"
              select 
                    value={this.state.os_setting.setting_language} onChange={(e) => this.onUpdateUserDetails('setting_language', e.target.value)}
                    sm={5}
                   
                    SelectProps={{
                      native: true,
                    }}
                    helperText="Select your language"
                    label="Exit Key"
                    helperText="Exit Key"
                    fullWidth>
                     <option  value=''>Select Language</option>
                    {languageResult.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Input> */}
                
                  <FormGroup row>
                  <Label for="setting_exit_key" sm={5} > Select your language</Label>
                  <Inputcore sm={5}
                  className="col-sm-5"
                   type="select" 
                   name="language"
                    id="language" 
                    value={this.state.os_setting.setting_language}
                 onChange={(e) => this.onUpdateUserDetails('setting_language', e.target.value)}>

                <option  value=''>Select Language</option>
                  { languageResult && languageResult.map((user, key) => (
                      <option key={key} value={user.id}>{user.name}</option>
                    )) }
              </Inputcore>

                </FormGroup>




            {/* </FormGroup>  */}
            { this.props.subs_type != 0 && 
            <div>
               <FormGroup row>
                  <Label for="setting_schedule" sm={5}><IntlMessages id="sidebar.schedule" /></Label>
                  <Badge className="mb-15 mt-15 mr-10 text-center"  color="danger"><IntlMessages id="widgets.off" /></Badge>
                  <Switch sm={5}
                     id='setting_schedule' 
                     checked= {this.state.os_setting.setting_schedule == 1 ? true : false } 
                     onChange={this.handleChange('setting_schedule')}  
                     color='primary'
                     /> 
                    
                  <Badge className="mb-15 mt-15 mr-10" href="#" color="success"><IntlMessages id="widgets.on" /></Badge>
                </FormGroup>

           
                <FormGroup row>
                  <Label for="setting_exit_button" sm={5}><IntlMessages id="widgets.ExitButton" /></Label>
                  <Badge className="mb-15 mt-15 mr-10 text-center"  color="danger"><IntlMessages id="widgets.off" /></Badge>
                  <Switch sm={5}
                     id='setting_exit_button'
                     // checked= {user.cat_status == 1 ? true : false } 
                     checked= { this.state.os_setting.setting_exit_button == 1 ?  true : false } 
                     onChange={this.handleChange('setting_exit_button')}  
                     color='primary'
                     /> 
                     <Badge className="mb-15 mt-15 mr-10" href="#" color="success"><IntlMessages id="widgets.on" /></Badge>
                </FormGroup>
               
           
                <FormGroup row>
                  <Label for="setting_content_filter" sm={5}><IntlMessages id="widgets.ContentFilter" /> </Label>
                  <Badge className="mb-15 mt-15 mr-10"  color="danger"><IntlMessages id="widgets.off" /></Badge>
                  <Switch sm={5}
                     id='setting_content_filter'
                     // checked= {user.cat_status == 1 ? true : false } 
                     checked= {this.state.os_setting.setting_content_filter == 1 ? true : false } 
                      onChange={this.handleChange('setting_content_filter')}  
                      color='primary'
                     /> 
                     <Badge className="mb-15 mt-15 mr-10" href="#" color="success"><IntlMessages id="widgets.on" /></Badge>
                </FormGroup>
            

            
           
                <FormGroup row>
                  <Label for="setting_auto_launch" sm={5}><IntlMessages id="widgets.AutoLaunchwhenDeviceIsBootingUp" /> </Label>
                  <Badge className="mb-15 mt-15 mr-10"  color="danger"><IntlMessages id="widgets.off" /></Badge>
                  <Switch sm={5}
                     id='setting_auto_launch'
                     // checked= {user.cat_status == 1 ? true : false } 
                     checked= {this.state.os_setting.setting_auto_launch == 1 ? true : false } 
                     onChange={this.handleChange('setting_auto_launch')}  
                     color='primary'
                     /> 
                     <Badge className="mb-15 mt-15 mr-10" href="#" color="success"><IntlMessages id="widgets.on" /></Badge>
                </FormGroup>
                </div>
                  }
                { this.props.subs_type != 0  &&
                
                <FormGroup row>
                  <Label for="setting_exit_key" sm={5} > <IntlMessages id="widgets.ExitKey" /> </Label>
                  <Input sm={5}
                      className="col-sm-5"
                      label="Exit Key"
                      helperText="Exit Key"
                      type="text"
                      name="setting_exit_key"
                      id="setting_exit_key"
                      placeholder="Enter a letter or number"
                      value={this.state.os_setting.setting_exit_key}
                      onChange={(e) => this.onUpdateUserDetails('setting_exit_key', e.target.value)}
                      startAdornment={<InputAdornment position="start">CTRL+</InputAdornment>}
                      fullWidth
                      maxLength={1}
                  />

                </FormGroup>
                }
         
               

                <Button variant="raised" color="primary" className="text-white" onClick={() => this.onAddAlarm()}><IntlMessages id="button.save" /></Button>
            </Form>
            </div>  
            <div className="w-50">
               {(this.state.subscription.plan_name == 'Academic') &&
                  <h2 className="heading">Your Academic Code : {this.state.subscription.academic_code}</h2>
               }
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
