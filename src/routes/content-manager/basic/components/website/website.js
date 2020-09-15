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

import { timeAgo, textTruncate, checkPath, checkPaths } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';


const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;


export default class Website extends Component {

  constructor() {
        super();
        this.state = {
          all: false,
          users: null, // initial user data
          selectedUser: null, // selected user to perform operations
          loading: false, // loading activity
          addNewUserModal: false, // add new user form modal
          addNewUserDetail:{
             id: '',
             title: '',
             cat_id: null,
             os_id: 1,
             url: '',
             icon: '',
             language_id:1,
             allow:'',
             deny:''
          },
          openViewUserDialog: false, // view user dialog box
          editUser: null,
          allSelected: false,
          selectedUsers: 0,
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
          category: [],
          website:null
       };
        this.onPageChanged = this.onPageChanged.bind(this);
        this.onSort = this.onSort.bind(this);
      //  this.cropImage = this.cropImage.bind(this);
      }

   getInfo() {
      api.get('get-xml-website', {
            params: {
              os_type: 1
            }
          })
         .then((response) => {


          const category =  response.data.data;


          let checkedUsers = category.map(user => {
                return user;
          });

         

            const offset = 0;

             const currentCountries = checkedUsers.slice(offset, offset + AppConfig.paginate);  
             
            this.setState({category, currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords });
         })
         .catch(error => {
            // error hanlding
         })
   }


   componentDidMount() {
     this.getInfo();
   }

   onPageChanged = data => {

    console.log(this.state);

    const { users } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    

    const offset = (currentPage - 1) * pageLimit;
    
    const currentCountries = users.slice(offset, offset + pageLimit);

    this.setState({  currentCountries, currentPage, totalPages  });
  };

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
      api.post('deleteoswebsite',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
                 setTimeout(() => {
               self.setState({ loading: false, currentCountries:users, selectedUser: null });
               NotificationManager.success('Website Deleted!');
            }, 2000);
         })
         .catch(error => {
            // error hanlding
         })
    
   }

   /**
    * Open Add New User Modal
    */
   opnAddNewUserModal(id) {
    this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['cat_id']: id,
             },
             addNewUserModal: true
           });
   }

   /**
    * On Reload
    */
   onReload() {
      this.setState({ loading: true });
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
      
     if(key == 'icon'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['icon']: reader.result
             }
            });
          }

          reader.readAsDataURL(file)
        }
 

        if(key !== 'icon'){
           this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
             }
          });
         }
     
   }


   validateField(str){

     let fieldValidationErrors; 
    for (var key in str) {

        switch(key) {
          case 'url':
          if(str[key] !== '' && str[key] !== null){
           var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
           if (!re.test(str[key])) { 
              fieldValidationErrors = 'true';
            }
          }
          break;
          case 'video_url':
          if(str[key] !== '' && str[key] != null){
            var videoUrl = str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
           fieldValidationErrors = videoUrl ? '' : 'true';
         }
            break;
          default:
            break;
        }
    }
     
      if(fieldValidationErrors){
          NotificationManager.error('url is not valid!');
      }else{
          return true;
      }
      
   }

    /**
    * Add New User
    */
   addNewUser() {
    var validateField = this.validateField(this.state.addNewUserDetail);

      if(validateField){
         let category = this.state.category;
         let newUser = {
            ...this.state.addNewUserDetail
         }

         console.log(newUser);

        let self = this;
         this.setState({ addNewUserModal: false, loading: true });

         api.post('addoswebsite',newUser).then((response) => {
            const data =  response.data;
                    
             category.unshift(data);
                setTimeout(() => {
                  self.setState({ loading: false, category });
                  NotificationManager.success('Os Website Created!');
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
    * On Add & Update User Modal Close
    */
   onAddUpdateUserModalClose() {
      this.setState({ addNewUserModal: false, editUser: null })
   }

   
  
    onSort(column){
      console.log(this.state.sort.column);
      const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
    
      
      const sortedData = this.state.category.map((item) => {

        return item.category.sort((a, b) => {
          if (column === 'title' ) {
          
            const nameA = a[column].toUpperCase(); // ignore upper and lowercase
            const nameB = b[column].toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            return 0;
          }
        });
        
        
      });

      
    if (direction === 'desc') {
      sortedData.reverse();
    }
    
    this.setState({
      data: sortedData,
      sort: {
        column,
        direction,
      }
    });
  };

  setArrow = (column) => {
    let className = 'zmdi';
    
    if (this.state.sort.column === column) {
      className += this.state.sort.direction === 'asc' ? ' zmdi-long-arrow-down' : ' zmdi-long-arrow-up';
    }   
 
    return className;
  };

   /**
    * On Update User Details
    */
   onUpdateUserDetails(key, value, e) {
     if(key == 'icon'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              editUser: {
                ...this.state.editUser,
                icon: reader.result,
             },
             cropResult:true,
            });
          }
          reader.readAsDataURL(file)
        }

    
        if(key !== 'icon'){
           this.setState({
               editUser: {
                  ...this.state.editUser,
                  [key]: value
               }
            });
         }
      
   }




      searchIdeas(query){
    
        const { users } = this.state;
         let currentList =null;
         let newList = null;

          if (query !== "") {
            
            currentList = users;
            newList = currentList.filter(item => {
                return item.category.title.toLowerCase().includes(query.toLowerCase()) 
              });
          } else {
            newList = this.state.users;
          }
          this.setState({
            results: newList,
            search:query
          });

      }
   /**
    * Update User
    */

  
    updateUser() {
      const { editUser } = this.state;
      var validateField = this.validateField(editUser);

      let indexOfUpdateUser = '';
      let users = this.state.currentCountries;
      for (let i = 0; i < users.length; i++) {
         const user = users[i];
         if (user.id === editUser.id) {
            indexOfUpdateUser = i
         }
      }


      this.setState({ loading: true, editUser: null, addNewUserModal: false });
      if(validateField){
        let self = this;
        api.post('updateoswebsite', editUser).then((response) => {
          const data =  response.data;
         
          
          users[indexOfUpdateUser] = data;
              setTimeout(() => {
                self.setState({ loading: false, currentCountries:users, cropResult: '', });
                NotificationManager.success('Category Updated!');
             }, 5000);       
           })
           .catch(error => {
              // error hanlding
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

   render() {

     const { category, users, loading, selectedUser, editUser, allSelected, selectedUsers, search, results,direction, totalRecords, currentCountries, cropResult, foldername, cropResultOnHover } = this.state;
     if(!category)
          return null;

     let filteredResult;
     if(search){
        filteredResult = results;
     }else{
        filteredResult = category;
     }

     console.log(filteredResult);
      return (

         <div className="user-management">
         
                                    
             <IntlMessages id='sidebar.contentManager' defaultMessage='Chameleon | Content Manager'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                 </Helmet>
               )}
             </IntlMessages>
      {filteredResult.map((headers, key) => {
        return (
          <div key={key}>
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <div>
                         <a href="javascript:void(0)" className=" mr-10">{headers.title}</a>
                     </div>
                     <div>                        
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal(headers.id)} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="components.addnewwebsite" />} <i className="zmdi zmdi-plus"></i></a>
                     </div>
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr key={key} className="bg-primary text-white">
                          <th>{<IntlMessages id="components.title" />} </th>
                          <th>{<IntlMessages id="components.icon" />} </th>
                          <th>{<IntlMessages id="components.language" />}</th>
                          <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {headers.category && headers.category.map((user, key) => (
                           <tr key={key}>
                            <td>{user.title}</td>
                              <td>
                                 <div className="media">
                                    {user.image !== '' && user.image !== null ?
                                       <img key={key} src={checkPaths(foldername)+user.icon} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{user.title.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                             
                              <td>{user.language_id}</td>
                              <td className="list-action">
                                 <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a>
                                 <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
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
               title="Are You Sure Want To Delete?"
               message="This will delete permanently."
               onConfirm={() => this.deleteUserPermanently()}
            />
            <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {editUser === null ? <IntlMessages id="sidebar.addnewcategory" /> : <IntlMessages id="sidebar.updatecategory" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                        cat={headers.id}
                     />
                     : <UpdateUserForm user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} cropResult={cropResult} cropResultOnHover={cropResultOnHover}  />
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
            <Dialog
               onClose={() => this.setState({ openViewUserDialog: false })}
               open={this.state.openViewUserDialog}
            >
               <DialogContent>
                  {selectedUser !== null &&
                     <div>
                        <div className="clearfix d-flex">
                           <div className="media pull-left">
                            {selectedUser.icon !== '' && selectedUser.icon !== null ?
                                       <img src={checkPaths(foldername)+selectedUser.icon} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.title.charAt(0)}</Avatar>
                                    }

                              <div className="media-body">
                                 <p>{<IntlMessages id="components.title" />}: <span className="fw-bold">{selectedUser.title}</span></p>
                                 <p>{<IntlMessages id="components.backgroundVideo" />}: <span className="fw-bold">{selectedUser.bg_video}</span></p>
                                 <p>{<IntlMessages id="components.backgroundSelection" />}: <span className="fw-bold">{selectedUser.bg_selection}</span></p>
                                 
                                 <p>{<IntlMessages id="components.sound" />}: <span className="badge badge-warning">{selectedUser.sound}</span></p>
                                 <p> {timeAgo(selectedUser.created_at)}</p>
                                 <p>{<IntlMessages id="components.backgroundImage" />}: {selectedUser.bg_image !== '' && selectedUser.bg_image !== null ?
                                       <img src={checkPaths(foldername)+selectedUser.bg_image} alt="user prof" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.title.charAt(0)}</Avatar>
                                    }  </p>  
                              </div>
                           </div>
                        </div>
                     </div>
                  }
               </DialogContent>
            </Dialog>
            </div>
            );
         })}
         </div>
      );
   }
}
