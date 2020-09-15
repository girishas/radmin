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

import { timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml , get_player_url } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';


const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import Switch from '@material-ui/core/Switch';
const regex = /(<([^>]+)>)/ig;


export default class Home extends Component {

  constructor(props) {
        super(props);
        this.state = {
          all: false,
          users: null, // initial user data
          selectedUser: null, // selected user to perform operations
          loading: false, // loading activity
          addNewUserModal: false, // add new user form modal
          imageViewModel: false, 
          videoViewModel: false,  
          imageFile:null,
          videoFile:null,
          addNewUserDetail:{
              id: '',
             home_title: '',
             home_icon: '',
             home_bgimage: '',
             home_bgimage_file: '',
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
          switchStatus:false,
          icon_size:{
            height:this.props.icon_size.height,
            width:this.props.icon_size.width,
         }
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
              console.log(data);
                let checkedUsers = data.map(user => {
                  return user;
               });
            const offset = 0;

            const currentCountries = checkedUsers.slice(offset, offset + AppConfig.paginate);  
            this.setState({currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords });
            this.setState({  switchStatus:currentCountries[0].home_custom })
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
      api.post('user-deleteOs',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
                 setTimeout(() => {
               self.setState({ loading: false, currentCountries:users, selectedUser: null });
               NotificationManager.success('Category Deleted!');
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

   /**
    * On Change Add New User Details
    */
   onChangeAddNewUserDetails(key, value, e) {
     if(key == 'home_icon'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['home_icon']: reader.result
             },
             cropResult:true,
            });
          }

          reader.readAsDataURL(file)
        }
   if(key == 'home_bgimage'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['home_bgimage']: reader.result
             },
             cropResultOnHover:true,
            });
          }

          reader.readAsDataURL(file)
        } 

        if(key !== 'home_icon' && key !== 'home_bgimage'){
           this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
             }
          });
         }
     
   }


   validateField(str){

     let fieldValidationErrors = {}; 
     let formIsValid = true;
    for (var key in str) {
        switch(key) {
          case 'home_title':
            if(str[key] !== '' && str[key] != null){
               
             } else {
                  formIsValid = false;
                  NotificationManager.error(<IntlMessages id="validation.TitleIsNotEmpty" />);
             }
          break;
          case 'home_bgvideo':
              if(str[key] !== '' && str[key] != null){
                if(!str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)){
                   formIsValid = false;
                   NotificationManager.error(<IntlMessages id="validation.Videourlisnotvalid" />);
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

         api.post('user-add-xml-intro-data',newUser).then((response) => {
            const data =  response.data;
                    
             currentCountries.unshift(data);
                setTimeout(() => {
                  self.setState({ loading: false, currentCountries });
                  NotificationManager.success('Os Category Created!');
               }, 5000);       
         })
         .catch(error => {
            // error hanlding
         })
       }
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
  
 
   onUpdateUserDetails(key, value) {
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
      console.log(editUser);
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
        api.post('user-updatexmlhome', data).then((response) => {
          const data =  response.data;
          users[indexOfUpdateUser] = data;
              setTimeout(() => {
                self.setState({ loading: false, currentCountries:users, cropResult: '', });
                NotificationManager.success(<IntlMessages id="components.DataUpdated" />);
             }, 5000);       
           })
           .catch(error => {
             
           }) 


      
      
      }
        
   }


   //Select All user
   onSelectAllUser(e) {
      const { selectedUsers, users } = this.state;
      let selectAll = selectedUsers < users.length;
      if (selectAll) {
         let selectAllUsers = users.map(user => {
            user.checked = true
            return user
         });
         this.setState({ users: selectAllUsers, selectedUsers: selectAllUsers.length })
      } else {
         let unselectedUsers = users.map(user => {
            user.checked = false
            return user;
         });
         this.setState({ selectedUsers: 0, users: unselectedUsers });
      }
   }

   
   handleSwitchChange = user  => (event, checked  ) => {
   
      this.setState({ switchStatus :checked, loading :true});
      let self = this;
      $('table').toggle();
      api.post('set-home-is-custom',{
         'home_custom':checked,
         os_type: this.props.os_type,
         subs_id: this.props.subs_id,
      }).then((response) => {

         self.setState({loading :false});
         NotificationManager.success(<IntlMessages id="note.HomeStatusUpdated" />);
      
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
                     <span>{<IntlMessages id="components.defaultHome" />}</span>
                   
                   <Switch  color='primary' checked= {   this.state.switchStatus }  onChange={this.handleSwitchChange('home_custom')}  /> 
                   <span>{<IntlMessages id="components.customHome" />}</span>
                  
                     {!filteredResult &&                        
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="sidebar.addnewcategory" />} <i className="zmdi zmdi-plus"></i></a>
                     }
                     </div>
                  </div>
                  {this.state.switchStatus==1 && 
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-primary text-white">
                          <th>{<IntlMessages id="components.title" />}</th>
                          <th>{<IntlMessages id="components.icon" />} </th>
                          <th>{<IntlMessages id="components.backgroundImage" />} </th>
                          <th>{<IntlMessages id="components.video" />} </th>
                          <th><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredResult && filteredResult.map((user, key) => (
                           <tr key={key}>
                            <td>{user.home_title}</td>
                              <td>
                                 <div className="media">
                                    {user.home_icon !== '' && user.home_icon !== null ?
                                      <img key={key} src={  hubCheckPaths('images')+user.home_icon} alt="user prof" onClick={() => this.imageView(hubCheckPaths('images')+user.home_icon)} className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{user.home_title !== null ?user.home_title.charAt(0):'I'.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                             
                             <td>
                                 <div className="media">
                                    {user.home_bgimage !== '' && user.home_bgimage !== null ?
                                        <img key={key} src={  hubCheckPaths('images')+user.home_bgimage} alt="user prof" onClick={() => this.imageView(hubCheckPaths('images')+user.home_bgimage)} className="rounded-circle mr-15" width="100" height="50" />
                                       : <Avatar style={{ width:"100px", height:"50px"}} className="mr-15">{user.home_title !== null ?user.home_title.charAt(0):'B'.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                              <td> <a  onClick={() => this.videoView(get_player_url(user.home_bgvideo))}  href="javascript:void(0)">{user.home_bgvideo}</a>
                             </td>
                              <td className="list-action">
                                 {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                                 <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                                 {/* <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a>  */}
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
                  {editUser === null ? <IntlMessages id="sidebar.addnewhome" /> : <IntlMessages id="sidebar.updatehome" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                        icon_size={this.state.icon_size}
                     />
                     : <UpdateUserForm 
                     user={editUser} 
                     onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} 
                     cropResult={cropResult} 
                     cropResultOnHover={cropResultOnHover} 
                     icon_size={this.state.icon_size}
                      />
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
