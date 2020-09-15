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

import { timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml  , get_player_url} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import ReactAudioPlayer from 'react-audio-player';

const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;
import Switch from '@material-ui/core/Switch';

export default class Profile extends Component {
  
  constructor(props) {
 
        super(props);
        
        this.state = {
          all: false,
          users: null, // initial user data
          selectedUser: null, // selected user to perform operations
          loading: false, // loading activity
          addNewUserModal: false, // add new user form modal
          imageViewModel: false, 
          soundViewModel: false, 
          videoViewModel: false, 
          imageFile:null,
          soundFile:null,
          videoFile:null,
          addNewUserDetail:{
              id: '',
             intro_url: '',
             intro_logo: '',
             intro_sound: '',
             intro_video: '',
             os_type:this.props.os_type,
             subscription_id:this.props.subs_id,
             subscription_type:this.props.subs_type,
             user_id:this.props.login_user_id,
          },
          openViewUserDialog: false, // view user dialog box
          editUser: null,
          allSelected: false,
          selectedUsers: 0,
          src,
          search:'',
          results:null,
          totalRecords: null,
          currentPage: null,
          totalPages: null,
          currentCountries:null,
          direction:'asc',
          cropResult:null,
          cropResultOnHover:null,
          foldername:'images',
          sort: {
            column: null,
            direction: 'desc',
          },
          switchStatus:false
       };
      //  this.cropImage = this.cropImage.bind(this);
      }

   getInfo() {
    
      api.get('user-get-xml-data', {
            params: {
              os_type: this.props.os_type,
              subs_id: this.props.subs_id,
            }
          })
         .then((response) => {
              const data =  response.data.data;
                let checkedUsers = data.map(user => {
                  return user;
               });
            const offset = 0;
            const currentCountries = checkedUsers.slice(offset, offset + AppConfig.paginate);  
            this.setState({currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords });
            this.setState({  switchStatus:currentCountries[0].intro_custom })
         }) 
         .catch(error => {
            // error hanlding
         })
   }


   componentDidMount() {
     this.getInfo();
   }
   
   //for change props only url is same
   componentWillReceiveProps(newProps){
      this.props = newProps;
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
      api.post('user-deleteOs',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
                 setTimeout(() => {
               self.setState({ loading: false, currentCountries:users, selectedUser: null });
               NotificationManager.success('Intro Deleted!');
            }, 2000);
         })
         .catch(error => {
            // error hanlding
         })
    
   }

   /**
    * Open Add New User Modal
    */
   opnAddNewUserModal() {
      this.setState({ addNewUserModal: true });
   }

   /**
    * On Reload
    */
   onReload() {
      this.setState({ loading: true });
      this.componentDidMount();
      let self = this;
      setTimeout(() => {
         self.setState({ loading: false });
      }, 2000);
   }

   /**
    * On Select User
    */
   onSelectUser(user) {
      user.checked = !user.checked;
      let selectedUsers = 0;
      let users = this.state.users.map(userData => {
         if (userData.checked) {
            selectedUsers++;
         }
         if (userData.id === user.id) {
            if (userData.checked) {
               selectedUsers++;
            }
            return user;
         } else {
            return userData;
         }
      });
      this.setState({ users, selectedUsers });
   }



   validateField(str){

     let fieldValidationErrors = {}; 
     let formIsValid = true;
    for (var key in str) {
        switch(key) {
          case 'intro_url':
            if(str[key] !== '' && str[key] != null){
               
             } else {
                  formIsValid = false;
                  NotificationManager.error(<IntlMessages id="validation.urlisnotempty" />);
             }
          break;
          case 'intro_video':
              if(str[key] !== '' && str[key] != null){
                if(!str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)){
                   formIsValid = false;
                   NotificationManager.error(<IntlMessages id="validation.Videourlisnotvalid" />);
                }
             }
          break;
          case 'intro_sound':
         
             if(str[key]==0){
               formIsValid = true;
             }else{
               if(str[key] !== '' && str[key] != null ){
                  console.log(str[key]);
                  // if(!str[key].includes("audio/mp3") && !str[key].includes(".mp3")){
                  //    formIsValid = false;
                  //    NotificationManager.error('File is not mp3 file!');
                  // }
               }

             }
             
          break;  
          default:
            break;
        }
    }
     
      return formIsValid;
      
   }


   /**
    * View User Detail Hanlder
    */
   viewUserDetail(data) {
      this.setState({ openViewUserDialog: true, selectedUser: data });
   }

   /**
    * On Edit User
    */
   onEditUser(user) {
      this.setState({ addNewUserModal: true, editUser: user });
   }
 /**
    * On image view 
    */
   imageView(image){
      this.setState({ imageViewModel: true, imageFile: image });
     
   }
   onimageViewClose() {
      this.setState({ imageViewModel: false, imageFile: null })
   }
/**
    * On sound view 
    */
   soundView(sound){
      this.setState({ soundViewModel: true, soundFile: sound });
     
   }
   onsoundViewClose() {
      this.setState({ soundViewModel: false, soundFile: null })
   }
 /**
    * On video view 
    */
   videoView(video){
      this.setState({ videoViewModel: true, videoFile: video });
     
   }
   onvideoViewClose() {
      this.setState({ videoViewModel: false, videoFile: null })
   }



   /**
    * On Add & Update User Modal Close
    */
   onAddUpdateUserModalClose() {
      this.setState({ addNewUserModal: false, editUser: null })
   }

   /**
    * On Update User Details
    */
   onUpdateUserDetails(key, value, e) {
           this.setState({
               editUser: {
                  ...this.state.editUser,
                  [key]: value
               }
            });
   }

   /**
    * Update User
    */
    updateUser() {
      const { editUser } = this.state;

      console.log('editUser',editUser);
      var validateField = this.validateField(editUser);
   if(validateField){
      let indexOfUpdateUser = '';
      let users = this.state.currentCountries;
      for (let i = 0; i < users.length; i++) {
         const user = users[i];
         if (user.id === editUser.id) {
            indexOfUpdateUser = i
         }
      }
    
         this.setState({ loading: true, editUser: null, addNewUserModal: false });
        let self = this;
        //new code for file
         var data = new FormData()
         $.map(editUser, function(value, index) {
            data.append(index,value)
         });
          
        api.post('user-updatexml', data ,{timeout: 180000}).then((response) => {
          const data =  response.data;
          users[indexOfUpdateUser] = data;
              setTimeout(() => {
                self.setState({ loading: false, currentCountries:users, cropResult: '', });
                NotificationManager.success(<IntlMessages id="components.IntroUpdated" />);
             }, 5000);       
           })
           .catch(error => {
              // error hanlding
           }) 
      
      }
        
   }


  
   
    /**
    * Add New User
    */
   addNewUser() {
      var validateField = this.validateField(this.state.addNewUserDetail);
  
        if(validateField){
           let currentCountries = this.state.currentCountries;
           let newUser = {
              ...this.state.addNewUserDetail
           }
  
  
          let self = this;
           this.setState({ addNewUserModal: false, loading: true });

            //new code for file
            var data = new FormData()
            $.map(newUser, function(value, index) {
               data.append(index,value)
            });

           api.post('user-add-xml-intro-data',data).then((response) => {
              const data =  response.data;
                      
               currentCountries.unshift(data);
                  setTimeout(() => {
                    self.setState({ loading: false, currentCountries });
                    NotificationManager.success('Intro Created!');
                 }, 5000);       
           })
           .catch(error => {
              // error hanlding
           })
         }
     }
/**
* On Change Add New User Details
*/
   onChangeAddNewUserDetails(key, value, e) {
        this.setState({
          addNewUserDetail: {
             ...this.state.addNewUserDetail,
             [key]: value,
          }
       });
  }
  

   handleSwitchChange = user  => (event, checked  ) => {
   
      this.setState({ switchStatus :checked ,loading :true});
      
      $('table').toggle();
      let self = this;
      api.post('set-intro-is-custom',{
         'intro_custom':checked,
         os_type: this.props.os_type,
         subs_id: this.props.subs_id,
      }).then((response) => {
         self.setState({loading :false});
        
            NotificationManager.success(<IntlMessages id="note.IntroStatusUpdated!" />);
         
   })
   .catch(error => {
      // error hanlding
   })
   };
  
   render() {
     const { users, loading, selectedUser, editUser, allSelected, selectedUsers, search, results,direction, totalRecords, currentCountries, cropResult, foldername, cropResultOnHover } = this.state;
     
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
                     <div>
                        <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                     </div>
                     
                     {/*<Search searchIdeas={this.searchIdeas.bind(this)}/> */}
                     <div>
                     <span>{<IntlMessages id="components.defaultIntro" />}</span>
                   <Switch  color='primary' checked= {   this.state.switchStatus }  onChange={this.handleSwitchChange('intro_custom')}  /> 
                   <span>{<IntlMessages id="components.customIntro" />}</span>
                     {filteredResult.length<=0 &&                        
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="sidebar.addnewintro" />} <i className="zmdi zmdi-plus"></i></a>
                     }
                     
                    
                     </div>
                  </div>
                  {this.state.switchStatus==1 && 
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-primary text-white">
                          {/* <th>{<IntlMessages id="components.url" />}</th> */}
                          <th>{<IntlMessages id="components.logo" />} </th>
                          <th>{<IntlMessages id="components.cursor" />} </th>
                          <th>{<IntlMessages id="components.sound" />} </th>
                          <th>{<IntlMessages id="components.video" />} </th>
                          <th><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
                     <tbody>
                     
                        {filteredResult && filteredResult.map((user, key) => (
                           <tr key={key}>
                            {/* <td>{user.intro_url}</td> */}
                              <td>
                                 <div className="media">
                                 
                                    {user.intro_logo !== '' && user.intro_logo !== null ?
                                      <img key={key} src={ hubCheckPaths('images')+user.intro_logo} onClick={() => this.imageView(hubCheckPaths('images')+user.intro_logo)} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{user.intro_url.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                              <td>
                                 <div className="media">
                                 
                                    {user.intro_cursor !== '' && user.intro_cursor !== null ?
                                      <img key={key} src={ hubCheckPaths('images')+user.intro_cursor} onClick={() => this.imageView(hubCheckPaths('images')+user.intro_cursor)} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{user.intro_url.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                             
                              <td>
                                 <a  onClick={() => this.soundView(hubCheckPaths('sounds')+user.intro_sound)} href="javascript:void(0)"> {user.intro_sound }</a>
                              </td>
                             <td>
                                <a  onClick={() => this.videoView(get_player_url(user.intro_video))}  href="javascript:void(0)">{user.intro_video}</a>
                              </td>
                              
                              <td className="list-action">
                                 {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                                 <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                                 {/* <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a> */}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                   
                     
                  </table>
                   }
                
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
            <Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {editUser === null ? <IntlMessages id="sidebar.addnewintro" /> : <IntlMessages id="sidebar.updateintro" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                      
                     />
                     : <UpdateUserForm  user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} cropResult={cropResult} cropResultOnHover={cropResultOnHover}  />
                  }
               </ModalBody>
               <ModalFooter>
                  {editUser === null ?
                     <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}>Add</Button>
                     : <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateUser()}>Update</Button>
                  }
                  {' '}
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}>Cancel</Button>
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

                   
             {/* ===============sound view popup==================== */}
             <Modal isOpen={this.state.soundViewModel} toggle={() => this.onsoundViewClose()}>
            <ModalHeader toggle={() => this.onsoundViewClose()}>
               </ModalHeader>                 
               <ModalBody>
                  <ReactAudioPlayer  style={{  width: '100%' }}
                  width='100%'
                     src={this.state.soundFile}
                     autoPlay
                     controls
                     />
               </ModalBody>
            </Modal>
            {/* ===============sound view popup END==================== */}

            {/* ===============Video view popup==================== */}
            <Modal isOpen={this.state.videoViewModel} toggle={() => this.onvideoViewClose()}>
            <ModalHeader toggle={() => this.onvideoViewClose()}>
               </ModalHeader>                 
               <ModalBody>
               <iframe width='100%' height='300' src={this.state.videoFile} frameborder="0" allowfullscreen></iframe>
           
               </ModalBody>
            </Modal>
            {/* ===============Video view popup END==================== */}
            <Dialog
               onClose={() => this.setState({ openViewUserDialog: false })}
               open={this.state.openViewUserDialog}
            >
               <DialogContent>
                  {selectedUser !== null &&
                     <div>
                        <div className="clearfix d-flex">
                           <div className="media pull-left">
                            {selectedUser.intro_logo !== '' && selectedUser.intro_logo !== null ?
                                       <img src={hubCheckPaths(foldername)+selectedUser.intro_logo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.title.charAt(0)}</Avatar>
                                    }

                              <div className="media-body">
                                 {/* <p>{<IntlMessages id="components.url" />}: <span className="fw-bold">{selectedUser.intro_url}</span></p> */}
                                 <p>{<IntlMessages id="components.sound" />}: <span className="fw-bold">{selectedUser.intro_sound}</span></p>
                                 <p>{<IntlMessages id="components.video" />}: <span className="fw-bold">{selectedUser.intro_video}</span></p>
                                 
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
