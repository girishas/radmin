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

import { timeAgo, textTruncate, checkPath } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';


const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;


export default class Team extends Component {

  constructor() {
        super();
        this.state = {
          all: false,
          users: null, // initial user data
          selectedUser: null, // selected user to perform operations
          loading: false, // loading activity
          addNewUserModal: false, // add new user form modal
          addNewUserDetail: {
             id: '',
             name: '',
             designation: null,
             image: '',
             image_hover: '',
             status: 1,
	      		 badgeClass: 'badge-success',
             checked: false
            
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
          foldername:'team'
       };
        this.onPageChanged = this.onPageChanged.bind(this);
        this.onSort = this.onSort.bind(this);
      //  this.cropImage = this.cropImage.bind(this);
      }

   getInfo() {
      api.get('teamlist')
         .then((response) => {
          
              const data =  response.data.data;
              let checkedUsers = data.map(user => {
                user.checked = false
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

   onPageChanged = data => {

    const { users } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    console.log(currentPage);

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


    /* cropImage() {
       //console.log('eheelo');
      console.log(this.refs);
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
           return;
        }
        this.setState({
           cropResult: this.cropper.getCroppedCanvas().toDataURL(),
        });
     }*/

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
      api.post('deleteteam',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
                 setTimeout(() => {
               self.setState({ loading: false, currentCountries:users, selectedUser: null });
               NotificationManager.success('Team Member Deleted!');
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

     if(key == 'image'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['image']: reader.result
             }
            });
          }

          reader.readAsDataURL(file)
        }
	 if(key == 'image_hover'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['image_hover']: reader.result
             }
            });
          }

          reader.readAsDataURL(file)
        } 

        if(key !== 'image' && key !== 'image_hover'){
           this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
             }
          });
         }
     
   }

    /**
    * Add New User
    */
   addNewUser() {

     const { name} = this.state.addNewUserDetail;
      if (name !== '') {
         let currentCountries = this.state.currentCountries;
         let newUser = {
            ...this.state.addNewUserDetail
         }

         let self = this;
         this.setState({ addNewUserModal: false, loading: true });

         api.post('addteam',newUser).then((response) => {
            const data =  response.data;
           
            data.checked = false;
          
             currentCountries.unshift(data);
                setTimeout(() => {
                  self.setState({ loading: false, currentCountries });
                  NotificationManager.success('Team Member Created!');
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
    console.log(user);
      this.setState({ addNewUserModal: true, editUser: user });
   }



   /**
    * On Add & Update User Modal Close
    */
   onAddUpdateUserModalClose() {
      this.setState({ addNewUserModal: false, editUser: null })
   }

   
   onSort(event, sortKey, direction){
    
    let data  = this.state.currentCountries;
    if(direction==='asc') {

          if (event.target.childNodes[1].classList.contains('zmdi-long-arrow-up')) {
            event.target.childNodes[1].classList.remove('zmdi-long-arrow-up');
            event.target.childNodes[1].classList.add('zmdi-long-arrow-down');
          } else {
            event.target.childNodes[1].classList.add('zmdi-long-arrow-down');
          }

      /**/
        let Sorted = data.sort(function(a,b) {
          return a[sortKey].toLowerCase() > b[sortKey].toLowerCase() ? 1 : b[sortKey].toLowerCase() > a[sortKey].toLowerCase() ? -1 : 0;
      });
       this.setState({ currentCountries:Sorted,direction:'desc'})
           
    } else {
      if (event.target.childNodes[1].classList.contains('zmdi-long-arrow-down')) {
            event.target.childNodes[1].classList.remove('zmdi-long-arrow-down');
            event.target.childNodes[1].classList.add('zmdi-long-arrow-up');
          } else {
            event.target.childNodes[1].classList.add('zmdi-long-arrow-up');
          }
        let Sorted = data.sort(function(a,b) {
          return a[sortKey].toLowerCase() > b[sortKey].toLowerCase() ? -1 : b[sortKey].toLowerCase() > a[sortKey].toLowerCase() ? 1 : 0;
            });
        this.setState({ currentCountries:Sorted,direction:'asc'})

    }
  
    // sort
    /*let Sorted = data.sort(function(a,b) {
        return a[sortKey].localeCompare(b[sortKey]);
    });*/
   
  }

   /**
    * On Update User Details
    */
   onUpdateUserDetails(key, value, e) {
     if(key == 'image'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              editUser: {
                ...this.state.editUser,
                image: reader.result,
             },
             cropResult:true,
            });
          }
          reader.readAsDataURL(file)
        }

		if(key == 'image_hover'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              editUser: {
                ...this.state.editUser,
                image_hover: reader.result,
             },
             cropResultOnHover:true,
            });
          }
          reader.readAsDataURL(file)
        }

        if(key !== 'image' && key !== 'image_hover'){
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
                return item.name.toLowerCase().includes(query) || item.designation.toLowerCase().includes(query)
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
      api.post('updateteam', editUser).then((response) => {
        const data =  response.data;
       
        
        users[indexOfUpdateUser] = data;
            setTimeout(() => {
              self.setState({ loading: false, currentCountries:users, cropResult: '', });
              NotificationManager.success('Team Member Updated!');
           }, 5000);       
         })
         .catch(error => {
            // error hanlding
         })   
    
    
        
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
             <IntlMessages id='sidebar.teams' defaultMessage='Chameleon | Teams'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.teams" />}
               match={this.props.match}
            />
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <div>
                        <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                     </div>
                     {/*<div className="w-30 mb-10 mb-md-0">
                      <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList.bind(this)}/>
                     </div> */}
                     <Search searchIdeas={this.searchIdeas.bind(this)}/>
                     <div>{/*
                        <a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10">Export to Excel</a>*/}
                        
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="sidebar.addnewteam" />} <i className="zmdi zmdi-plus"></i></a>
                     </div>
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr>
                            {/*<th className="w-5">
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       indeterminate={selectedUsers > 0 && selectedUsers < users.length}
                                       checked={selectedUsers > 0}
                                       onChange={(e) => this.onSelectAllUser(e)}
                                       value="all"
                                       color="primary"
                                    />
                                 }
                                 label="All"
                              />
                           </th> */}
                           <th onClick={e => this.onSort(e, 'name',direction)}>{<IntlMessages id="sidebar.name" />} <i className="zmdi"></i></th>
                         
                           <th onClick={e => this.onSort(e, 'designation', direction)}>{<IntlMessages id="sidebar.designation" />} <i className="zmdi"></i></th>
						               <th onClick={e => this.onSort(e, 'image', direction)}>{<IntlMessages id="sidebar.image" />} <i className="zmdi"></i></th>
                           <th onClick={e => this.onSort(e, 'image_hover', direction)}>{<IntlMessages id="sidebar.image" />} <i className="zmdi"></i></th>
          
                           <th onClick={e => this.onSort(e, 'status', direction)}>{<IntlMessages id="widgets.status" />}</th>
                          
                           <th onClick={e => this.onSort(e, 'created_at',direction)}>{<IntlMessages id="widgets.date" />}</th>
                           <th>{<IntlMessages id="sidebar.action" />}</th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredResult && filteredResult.map((user, key) => (
                           <tr key={key}>
                            <td>{user.name}</td>
                            <td>{user.designation}</td>
                              <td>
                                 <div className="media">
                                    {user.image !== '' && user.image !== null ?
                                       <img key={key} src={checkPath(foldername)+user.image} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{user.name.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                              <td>
                                 <div className="media">
                                    {user.image_hover !== '' && user.image_hover !== null ?
                                       <img key={key} src={checkPath(foldername)+user.image_hover} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{user.name.charAt(0)}</Avatar>
                                    }
                                 </div>
                              </td>
                               
                              <td>{user.status == 1 ?
                     <span className={`badge badge-success badge-pill`}>Active</span> : <span className={`badge badge-danger badge-pill`}>Inactive</span>
                  }</td>
                              <td>{timeAgo(user.created_at)}</td>
                              <td className="list-action">
                                 <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a>
                                 <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                                 <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                     <tfoot className="border-top">
                        <tr>
                           <td colSpan="100%">
                              <Pagination
                                className="mb-0 py-10 px-10"
                                totalRecords={totalRecords}
                                pageLimit={AppConfig.paginate}
                                pageNeighbours={1}
                                onPageChanged={this.onPageChanged}
                              />
                           </td>
                        </tr>
                     </tfoot>
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
                  {editUser === null ? <IntlMessages id="sidebar.addnewteam" /> : <IntlMessages id="sidebar.updateteam" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                       
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
                            {selectedUser.image !== '' && selectedUser.image !== null ?
                                       <img src={checkPath(foldername)+selectedUser.image} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.name.charAt(0)}</Avatar>
                                    }

                              <div className="media-body">
                                 <p>{<IntlMessages id="sidebar.name" />}: <span className="fw-bold">{selectedUser.name}</span></p>
                                 <p>{<IntlMessages id="sidebar.designation" />}: <span className="fw-bold">{selectedUser.designation}</span></p>
                                 <p>{<IntlMessages id="widgets.status" />}: <span className="badge badge-warning">{selectedUser.status}</span></p>
                                 <p>{<IntlMessages id="widgets.date" />}: {timeAgo(selectedUser.created_at)}</p>
                                 <p>Image on Hover: {selectedUser.image_hover !== '' && selectedUser.image_hover !== null ?
                                       <img src={checkPath(foldername)+selectedUser.image_hover} alt="user prof" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.name.charAt(0)}</Avatar>
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
   }
}
