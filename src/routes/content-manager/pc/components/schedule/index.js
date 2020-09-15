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
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import moment from "moment";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { NotificationManager } from 'react-notifications';
import Avatar from '@material-ui/core/Avatar';

// api
import api from 'Api';

// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// add new user form
import AddNewUserForm from './AddNewUserForm';

// update user form
import UpdateUserForm from './UpdateUserForm';

// update user form
import Search from './SearchBar';

import Pagination from './Pagination';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import Cropper from 'react-cropper';

import { timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml , daysArray ,getDayNameByIds } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

import { TimePicker } from 'material-ui-pickers';

const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;


export default class Schedule extends Component {

  constructor(props) {
        super(props);
        this.state = {
          all: false,
          users: null, // initial user data
          selectedUser: null, // selected user to perform operations
          loading: false, // loading activity
          addNewUserModal: false, // add new user form modal
          imageViewModel: false, 
          imageFile:null,
          addNewUserDetail:{
              id: '',
             home_title: '',
             home_icon: '',
             home_bgimage: '',
             home_bgvideo: '',
             os_type:this.props.os_type
          },
          openViewUserDialog: false, // view user dialog box
          editUser: null,
          allSelected: false,
          selectedUsers: null,
          src,
          search:'',
          results:null,
          totalRecords: [],
          currentPage: null,
          totalPages: null,
          currentCountries:[],
          direction:'asc',
          cropResult:null,
          cropResultOnHover:null,
          foldername:'images',
          sort: {
            column: null,
            direction: 'desc',
          },
          days : [ 
            {'id':0, value:'Sun'},
            {'id':1, value:'Mon'},
            {'id':2, value:'Tue'},
            {'id':3, value:'Wed'},
            {'id':4, value:'Thu'},
            {'id':5, value:'Fri'},
            {'id':6, value:'Sat'},
          ],
          options: [],
          selectedDate: moment(),
          selectedDate2: moment().add(2, 'hours'),
        
         
       };
       
 
    
      //  this.cropImage = this.cropImage.bind(this);
      }
      handleDateChange = (date) => {
         this.setState({ selectedDate: date });
        
      };
      handleDateChange2 = (date) => {
         this.setState({ selectedDate2: date });
       
      };
   getInfo() {
      api.get('user-get-schedule', {
            params: {
              os_type: this.props.os_type,
              subs_id: this.props.subs_id,
            }
          })
         .then((response) => {
              const data =  response.data.data;
             // console.log(data);
                let checkedUsers = data.map(user => {
                  return user;
               });
            const offset = 0;

             const currentCountries = checkedUsers.slice(offset, offset + AppConfig.paginate);  
            
            this.setState({currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords });
         }) 
         .catch(error => {
            // error hanlding
         })
   }


   componentDidMount() {
     this.getInfo();
   }
   //for change props only url is same
   componentWillReceiveProps(){
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
      let users = this.state.currentCountries;
      let indexOfDeleteUser = users.indexOf(selectedUser);
       this.refs.deleteConfirmationDialog.close();
      this.setState({ loading: true });
      
      let self = this;
      api.post('user-delete-schedule',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
                 setTimeout(() => {
               self.setState({ loading: false, currentCountries:users, selectedUser: null });
               NotificationManager.success(<IntlMessages id="components.AlarmDeleted" />);
            }, 2000);
         })
         .catch(error => {
            // error hanlding
         })
    
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
      const { editUser ,options , selectedDate ,selectedDate2} = this.state;
      var os_type = this.props.os_type;
      var subs_id =this.props.subs_id;
      var mydata = moment(selectedDate).format("HH:mm:ss");
      var mydata2 = moment(selectedDate2).format("HH:mm:ss");
      var user_id = this.props.login_user_id;
     // alert(mydata);
      const postData = { 
                        'days':options, 'start_time':mydata,  'end_time':mydata2, 'os_type':os_type, 'subscription_id':subs_id , 'user_id':user_id
                };
       api.post('user-add-schedule', postData )
           .then((response) => {
              if(response.data.errors){
               var allErrors  = response.data.errors.join('<br>') 
               NotificationManager.error(allErrors);
              }else{
               this.setState({ currentCountries:response.data });
               // localStorage.setItem('user_id',JSON.stringify(response.data.data)) 
               NotificationManager.success(<IntlMessages id="components.AalrmAddSuccessfully" />);
              }
           })
           .catch(error => {
              // error hanlding
           })
      
    }
 
   onChange(e) {

      // current array of options
      const options = this.state.options
      let index

      // check if the check box is checked or unchecked
      if (e.target.checked) {
        // add the numerical value of the checkbox to options array
        options.push(+e.target.value)
      } else {
        // or remove the value from the unchecked checkbox from the array
        index = options.indexOf(+e.target.value)
        options.splice(index, 1)
      }

     // this.props.user.os_type = options;
      // update the state with the new array of options
      this.setState({ options: options })
    }  

   render() {
     const {selectedDate,selectedDate2,  users, loading, selectedUser, editUser,search, results,direction, totalRecords, currentCountries, cropResult, foldername, cropResultOnHover , days } = this.state;
    
     if(!users)
          return null;

     let filteredResult;
     if(search){
        filteredResult = results;
     }else{
        filteredResult = currentCountries;
     }

    
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
                     {/* <div>
                        <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                     </div>
           
                     <div>
                                     
                     <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="sidebar.addnewalarm" />} <i className="zmdi zmdi-plus"></i></a>
                     
                     </div> */}


                     <div className="schedule-wrapper w-50">
                           <h2 className="heading"><IntlMessages id="sidebar.scheduleToTurnOff"/></h2>
                           <Form>
                                 <FormGroup row>
                                    <Label for="checkbox2" sm={2}><IntlMessages id="components.days" /></Label>
                                    <Col sm={10}>
                                       <div className='row'>
                                    {days && days.map((day,key) => {
                                       return <FormGroup check sm={2}> 
                                                   <Label check>
                                                      <input type="checkbox"  value={day.id}  onChange={this.onChange.bind(this)}  />{' '}
                                                   {day.value}
                                                   </Label> 
                                                </FormGroup>
                                       })
                                       
                                       }
                                       </div>
                                    </Col>
                                 </FormGroup>
                                 <div className="rct-picker">
                                    <div className="picker">
                                       <TimePicker
                                             name='start_time'
                                             label="Start Time"
                                             value={selectedDate}
                                             onChange={this.handleDateChange}
                                             fullWidth
                                             
                                       />
                                    </div>
                                 </div>

                                 <div className="rct-picker">
                                    <div className="picker">
                                       <TimePicker
                                             name='end_time'
                                             label="End Time"
                                             value={selectedDate2}
                                             onChange={this.handleDateChange2}
                                             fullWidth
                                             
                                       />
                                    </div>
                                 </div>
                                
                              <br></br>
                              <FormGroup>
                              <Button variant="raised" color="primary" className="text-white" onClick={() => this.onAddAlarm()}><IntlMessages id="button.save" /></Button>
                              </FormGroup>
                           </Form>
                          
                           </div>
                          
                  </div>
                  

                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-primary text-white">
                          <th>{<IntlMessages id="components.days" />}</th>
                          <th>{<IntlMessages id="widgets.start_time" />} </th>
                          <th>{<IntlMessages id="widgets.end_time" />} </th>
                      
                          <th><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredResult && filteredResult.map((user, key) => (
                           <tr key={key}>
                           <td>{getDayNameByIds(this.state.days , user.days)}</td>
                           
                            <td>{moment(user.start_time, "h:mm:ss A").format("hh:mm A") }</td>
                            <td>{moment(user.end_time, "h:mm:ss A").format("hh:mm A") }</td>
                            
                             
                     
                              <td className="list-action">
                                 {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a>
                                 <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a> */}
                                 <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a> 
                              </td>
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
               title={<IntlMessages id="components.sureDelete" />}
               message={<IntlMessages id="components.sureDeleteMessage" />}
               onConfirm={() => this.deleteUserPermanently()}
            />
            <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {editUser === null ? <IntlMessages id="sidebar.addnewhome" /> : <IntlMessages id="sidebar.updatehome" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        //onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                       
                     />
                     : <UpdateUserForm user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} cropResult={cropResult} cropResultOnHover={cropResultOnHover}  />
                  }
               </ModalBody>
               <ModalFooter>
                  {editUser === null ?
                     <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}><IntlMessages id="button.add" /></Button>
                     : <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateUser()}><IntlMessages id="button.update" /></Button>
                  }
                  {' '}
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}><IntlMessages id="button.cancel" /></Button>
               </ModalFooter>
            </Modal>
             {/* ===============image view popup==================== */}
             <Modal isOpen={this.state.imageViewModel} toggle={() => this.onimageViewClose()}>
            <ModalHeader toggle={() => this.onimageViewClose()}>
               </ModalHeader>                 
               <ModalBody>
                   {this.state.imageFile != null ? 
                     <img src={this.state.imageFile} alt="user prof"  width='100%'/>:
                     ''
                  } 
               </ModalBody>
            </Modal>
                   {/* ===============image view popup END==================== */}
            <Dialog
               onClose={() => this.setState({ openViewUserDialog: false })}
               open={this.state.openViewUserDialog}
            >
               <DialogContent>
                  {selectedUser !== null &&
                     <div>
                        <div className="clearfix d-flex">
                           <div className="media pull-left">
                            {selectedUser.home_icon !== '' && selectedUser.home_icon !== null ?
                                       <img src={ hubCheckPaths('images')+selectedUser.home_icon} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.intro_url.charAt(0)}</Avatar>
                                    }

                              <div className="media-body">
                                 <p>{<IntlMessages id="components.title" />}: <span className="fw-bold">{selectedUser.home_title!== null?selectedUser.home_title:''}</span></p>
                                 <p>{<IntlMessages id="components.video" />}: <span className="fw-bold">{selectedUser.home_bgvideo!== null?selectedUser.home_bgvideo:''}</span></p>
                                 <p>{<IntlMessages id="components.backgroundImage" />}: {selectedUser.image_hover !== '' && selectedUser.image_hover !== null ?
                                       <img src={ hubCheckPaths('images')+selectedUser.home_bgimage} alt="user prof" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.intro_url.charAt(0)}</Avatar>
                                    }  </p>  
                                 <p> {timeAgo(selectedUser.created_at)}</p>
                                 
                              </div>
                           </div>
                        </div>
                     </div>
                  }
               </DialogContent>
            </Dialog>
         </div>
      );
   }
}
