/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Badge
} from 'reactstrap';
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

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import { timeAgo, textTruncate } from "Helpers/helpers";

import Pagination from './Pagination';
import Search from './SearchBar';
import AppConfig from 'Constants/AppConfig';

export default class Translation extends Component {

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
         slug: '',
         page_id: '',
         value_en: '',
         value_zh: '',
         value_ru: '',
         value_ko: '',
         value_ja: '',
         value_it: '',
         value_hu: '',
         value_he: '',
         value_fr: '',
         value_es: '',
         value_de: '',
         value_ar: '',
         created_at: '',
         undated_at: '',
         checked: false
      },
      openViewUserDialog: false, // view user dialog box
      editUser: null,
      allSelected: false,
      selectedUsers: 0,
      error:{},
      totalRecords: null,
      currentPage: null,
      totalPages: null,
      search:'',
      results:null,
      currentLanguage:[],
      sort: {
            column: null,
            direction: 'desc',
          }
   };
        this.onPageChanged = this.onPageChanged.bind(this);
        this.onSort = this.onSort.bind(this);
  }

   

   componentDidMount() {
      api.get('languagelist')
         .then((response) => {
          console.log(response.data.totalRecords);
            const data =  response.data.data;
              let checkedUsers = data.map(user => {
                user.checked = false
                return user;
             });
            const offset = 0;

            const currentLanguage = checkedUsers.slice(offset, offset + AppConfig.paginate);   
            this.setState({currentLanguage, users: checkedUsers,totalRecords:response.data.totalRecords });
         })
         .catch(error => {
            // error hanlding
         })
   }

   onPageChanged = data => {
    const { users } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
   
    const offset = (currentPage - 1) * pageLimit;
    
    const currentLanguage = users.slice(offset, offset + pageLimit);

    this.setState({  currentLanguage, currentPage, totalPages  });
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
      let users = this.state.users;
      let indexOfDeleteUser = users.indexOf(selectedUser);
      this.refs.deleteConfirmationDialog.close();
      this.setState({ loading: true });
      let self = this;
       api.post('deletelanguage',{
               'id':selectedUser.id,
            }).then((response) => {
               
               users.splice(indexOfDeleteUser, 1);

               console.log(users);

              const offset = 0;

              const user =  users.slice(offset, offset + AppConfig.paginate);

                 setTimeout(() => {
               self.setState({ loading: false, currentLanguage:user, selectedUser: null });
               NotificationManager.success('Label Deleted!');
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
      
      this.setState({ addNewUserModal: true,addNewUserDetail:{} });
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
   onChangeAddNewUserDetails(key, value) {

     this.setState({
         addNewUserDetail: {
            ...this.state.addNewUserDetail,
            [key]: value
         },
         error: {
            
         }
      });
   }


   onSort(column){
      const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
      const sortedData = this.state.currentLanguage.sort((a, b) => {
        if (column === 'slug' || column === 'value_en') {
          
          const nameA = a[column].toUpperCase(); // ignore upper and lowercase
          const nameB = b[column].toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        } else if (column === 'created_at'){
           return new Date(b.created_at) - new Date(a.created_at);
        }
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

   
   handleValidation(slug, value_en){
       
        let error = this.state.error;
        let formIsValid = true;
        let users = this.state.users;
        //Name
        if(!slug){
           formIsValid = false;
           error["slug"] = "Cannot be empty";
        }else{
          let checkSlug = users.map(user => {
            if (Object.values(user).indexOf(slug) > -1) {
               formIsValid = false;
               error["slug"] = "Slug is alredy exist";
            }
         });
        }

        //value
        if(!value_en){
           formIsValid = false;
           error["value_en"] = "Cannot be empty";
        }
     
        this.setState({ error: error })

        return formIsValid;
               
     }

     handleValidationOnUpdate(slug, value_en){ 
        let error = this.state.error;
        let formIsValid = true;
        let users = this.state.users;
        //value
        if(!value_en){
           formIsValid = false;
           error["value_en"] = "Cannot be empty";
        }
     
        this.setState({ error: error })

        return formIsValid;
               
     }

   /**
    * Add New User
    */
   addNewUser() {
      const { slug, value_en } = this.state.addNewUserDetail;
    
      if(this.handleValidation( slug, value_en )){
               
         let currentLanguage = this.state.currentLanguage;
         let newUser = {
            ...this.state.addNewUserDetail
         }

         let self = this;
         this.setState({ addNewUserModal: false, loading: true });

         api.post('addlanguage',newUser).then((response) => {
            const data =  response.data;
            data.checked = false;
          //  currentLanguage.pop();
            currentLanguage.unshift(data);
            setTimeout(() => {
                  self.setState({ loading: false, currentLanguage });
                  NotificationManager.success('Label Created!');
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

   /**
    * On Update User Details
    */
   onUpdateUserDetails(key, value) {
      this.setState({
         editUser: {
            ...this.state.editUser,
            [key]: value
         },
         error: {
            
         }
      });
   }

   /**
    * Generate File
    */

    generateFile(){
       let self = this;
       api.post('generateFile').then((response) => {
             setTimeout(() => {
                  NotificationManager.success('File Generated Successfully!');
               }, 5000);  
         })
         .catch(error => {
            // error hanlding
         })
    }    

   /**
    * Update User
    */
   updateUser() {

      /*const { editUser } = this.state;
      let indexOfUpdateUser = '';
      let users = this.state.users;
      for (let i = 0; i < users.length; i++) {
         const user = users[i];
         if (user.id === editUser.id) {
            indexOfUpdateUser = i
         }
      }
      users[indexOfUpdateUser] = editUser;
      this.setState({ loading: true, editUser: null, addNewUserModal: false });
      let self = this;
      setTimeout(() => {
         self.setState({ users, loading: false });
         NotificationManager.success('User Updated!');
      }, 2000);*/
      const { editUser } = this.state;

      const { slug, value_en } = editUser;

    
      if(this.handleValidationOnUpdate( slug, value_en )){
               
         let indexOfUpdateUser = '';
          let users = this.state.users;
          for (let i = 0; i < users.length; i++) {
             const user = users[i];
             if (user.id === editUser.id) {
                indexOfUpdateUser = i
             }
          }
          users[indexOfUpdateUser] = editUser;
          this.setState({ loading: true, editUser: null, addNewUserModal: false });

         let self = this;

         api.post('updatelanguage',editUser).then((response) => {

            const data =  response.data;
            data.checked = false;
          
             users[indexOfUpdateUser] = data;
                setTimeout(() => {
                  self.setState({ loading: false, users, currentLanguage:users });
                  NotificationManager.success('Label Updated!');
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

   searchIdeas(query){
    
        const { users } = this.state;
         let currentList =null;
         let newList = null;

         if (query !== "") {
            
            currentList = users;
            newList = currentList.filter(item => {
                return item.slug.toLowerCase().includes(query.toLowerCase()) || item.value_en.toLowerCase().includes(query.toLowerCase())
              });
          } else {
            newList = this.state.users;
          }

          this.setState({
            results: newList,
            search:query
          });

      }

   render() {
   
      const { currentLanguage, users, loading, selectedUser, editUser, allSelected, selectedUsers, error, totalRecords, search, results } = this.state;
     if(!users)
          return null;

     let filteredResult;
     if(search){
        filteredResult = results;
     }else{
        filteredResult = currentLanguage;
     }

      return (
         <div className="user-management">
             <IntlMessages id='sidebar.translations' defaultMessage='Chameleon | Translations'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
				   <meta name="description" content="Chameleon | Translations" />
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.translations" />}
               match={this.props.match}
            />
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <div>
                        <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                        <a href="javascript:void(0)" className="btn-outline-default mr-10">More</a>
                     </div>
                      <Search searchIdeas={this.searchIdeas.bind(this)}/>
                     <div>
                        <a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10" onClick={() => this.generateFile()}>Generate</a>
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10"><IntlMessages id="sidebar.addNewtranslation" /> <i className="zmdi zmdi-plus"></i></a> 
                     </div>
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr>
                          { /*<th className="w-5">
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
                           </th>*/}
                          <th onClick={e => this.onSort('slug')}>{<IntlMessages id="sidebar.key" />} <i className={this.setArrow('slug')}></i></th>
                          <th onClick={e => this.onSort('value_en')}>{<IntlMessages id="sidebar.text" />} <i className={this.setArrow('value_en')}></i></th>
                          <th onClick={e => this.onSort('created_at')}>{<IntlMessages id="widgets.date" />} <i className={this.setArrow('created_at')}></i></th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredResult && filteredResult.map((user, key) => (
                           <tr key={key}>
                             { /*<td>
                                 <FormControlLabel
                                    control={
                                       <Checkbox
                                          checked={user.checked}
                                          onChange={() => this.onSelectUser(user)}
                                          color="primary"
                                       />
                                    }
                                 />
                              </td>*/}
                              <td>{user.slug}</td>
                              <td>{textTruncate(user.value_en,55)}</td>
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
               message="This will delete user permanently."
               onConfirm={() => this.deleteUserPermanently()}
            />
            <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {editUser === null ? <IntlMessages id="sidebar.addNewtranslation" /> : <IntlMessages id="sidebar.updatetranslation" />
                  }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                        error={error}
                     />
                     : <UpdateUserForm user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} 
                        error={error}
                       />
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
                              <div className="media-body">
                                 <p>Language: <span className="fw-bold">{selectedUser.slug}</span></p>
                                 <p>Text: <span className="fw-bold">{selectedUser.value_en}</span></p>
                                 <p>Created At: {timeAgo(selectedUser.created_at)}</p>
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
