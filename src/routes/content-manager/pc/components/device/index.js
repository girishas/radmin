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
import { Form, FormGroup, Label,FormText, Col } from 'reactstrap';
import Input from '@material-ui/core/Input';
import TextField from "@material-ui/core/TextField";
import moment from "moment";

import { NotificationManager } from 'react-notifications';

import api from 'Api';
import Switch from '@material-ui/core/Switch';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import {  hubCheckPaths ,user_id} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';



export default class Setting extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false, // loading activity
            devices:[],
            selectedUser:[],
            subs_id:'',
            change: [],
         };
         this.switchChange = [];
      }
    
   getInfo() {
      api.post('user-get-devices',{
         'user_id':user_id(),
        'subs_id':localStorage.getItem("devicesPage.subs_id"),
      }).then((response) => {
         this.setState({ devices: response.data.devices ,  mainDevice: response.data.mainDevice , });
         })
         .catch(error => {
            // error hanlding
         })

   }

   componentDidMount() {
     
      this.setState({ loading: true })
		if(this.props.subs_id ){
			localStorage.setItem("devicesPage.subs_id",this.props.subs_id)
		}
		var  subs_id = localStorage.getItem("devicesPage.subs_id");
		this.setState({ subs_id:subs_id,loading: false})

     this.getInfo();
   }
   //for change props only url is same
   componentWillReceiveProps(){

      this.setState({ loading: true })
		if(this.props.subs_id ){
			localStorage.setItem("devicesPage.subs_id",this.props.subs_id)
		}
		var  subs_id = localStorage.getItem("devicesPage.subs_id");
		this.setState({ subs_id:subs_id ,loading: false})

      this.getInfo();
   } 

   

 /**
    * On Delete
    */
   onDelete(data) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
   }


   /**
    * Delete User Permanently
    */
   deleteUserPermanently() {
      const { selectedUser } = this.state;
      let users = this.state.devices;
      let indexOfDeleteUser = users.indexOf(selectedUser);
       this.refs.deleteConfirmationDialog.close();
      this.setState({ loading: true });
      let self = this;
      api.post('user-changeSerialNumberStatus',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
               NotificationManager.success('Device Deleted!');
            setTimeout(() => {
               self.setState({ loading: false, devices:users, selectedUser: null });
              
               location.reload()
            }, 2000);
         })
         .catch(error => {
            // error hanlding
         })
    
   }

   
   handleChange = user   => (event, checked  ) => {
    
       
      this.switchChange[user] = checked;
     let cat_id =  $('.switch'+user +' input').attr('id');
    // console.log('cat_id' , cat_id )
      this.setState({ change :  this.switchChange});

      api.get('user-changeSerialNumberStatus', {
         params: {
           id: user,
           status: checked,
           
          
         }
       })
      .then((response) => {
           const data =  response.data;
       
           if(checked){
               NotificationManager.success('Device Connected');
           }else{
               NotificationManager.error('Device Disconnected');
           }
           self.setState({ loading: true});
      })
      .catch(error => {
         // error hanlding
      })

   };


   render() {
     const {devices , loading, mainDevice} = this.state;
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
               <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-primary text-white">
                          <th>{<IntlMessages id="components.DevicefriendlyName" />}</th>
                   
                          <th>{<IntlMessages id="widgets.action" />} </th>
                        </tr>
                     </thead>
                     <tbody>
                        {devices && devices.map((user, key) => (
                           <tr key={key}>
                            <td>{user.friendly_name}</td>
                              
                              {/* <td className="list-action">
                                 {mainDevice.id != user.id && 
                                <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a> 
                                 }
                                </td> */}
                     {mainDevice.id != user.id && 
                        <td className="list-action">
                        
                              <Badge className="mb-15 mt-15 pl-1 pr-1 text-center hide-mobile-all"  color="danger"><IntlMessages id="widgets.Disconnect" /></Badge> 
                              <Switch 
                                      // checked= {user.status == 1 ? true : false }
                                      checked= { typeof this.state.change[user.id] !== 'undefined' ? this.state.change[user.id] : (user.status == 1 || user.status == null) ? true : false } 
                                       onChange={this.handleChange(user.id )}  
                                       aria-label={user.id} 
                                       className={"switch"+user.id} 
                                       color='primary'
                                       id={user.cat_id}
                               />
                              <Badge className="mb-15 mt-15 pl-1 pr-1 hide-mobile-all"  color="success"><IntlMessages id="widgets.Connect" /></Badge>
                       
                        </td>
                     }
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  

                 
               </div>
               {loading &&
                  <RctSectionLoader />
               }
            </RctCollapsibleCard>
           
            
            <DeleteConfirmationDialog
               ref="deleteConfirmationDialog"
               title="Are You Sure Want To Delete?"
               message="This will delete permanently."
               onConfirm={() => this.deleteUserPermanently()}
            />  
          
         </div>
      );
   }
}
