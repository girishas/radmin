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


export default class Schedule extends Component {

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
			 designation: '',
			 content: '',
			 status: 1,
			 badgeClass: 'badge-success',
			 image:''

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
          cropResult:null,
          foldername:'testimonial',
          arrow: null,
          sort: {
            column: null,
            direction: 'desc',
          }
       };
        this.onPageChanged = this.onPageChanged.bind(this);
        this.onSort = this.onSort.bind(this);
        this.cropImage = this.cropImage.bind(this);
      }

   getInfo() {
      api.get('testimoniallist')
         .then((response) => {
              const data =  response.data.data;
              let checkedUsers = data.map(user => {
                user.checked = false,
                user.content =  user.content.replace(regex, '')
                return user;
             });

            const offset = 0;

             const currentCountries = checkedUsers.slice(offset, offset + AppConfig.paginate);  
             
            this.setState({currentCountries:currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords });
         
         	
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
    const offset = (currentPage - 1) * pageLimit;
    
    const currentCountries = users.slice(offset, offset + pageLimit);

    console.log(currentCountries);

    this.setState({  currentCountries, currentPage, totalPages  });
  };

   /**
    * On Delete
    */
   onDelete(data) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
   }


    cropImage(e) {
      e.preventDefault();
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
           return;
        }
        this.setState({
           cropResult: this.cropper.getCroppedCanvas().toDataURL(),
        });
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
       api.post('deletetestimonial',{
               'id':selectedUser.id,
            }).then((response) => {
               
            users.splice(indexOfDeleteUser, 1);
            const offset = 0;
            const user =  users.slice(offset, offset + AppConfig.paginate);

             setTimeout(() => {
               self.setState({ loading: false, currentCountries:user, selectedUser: null });
               NotificationManager.success('Testimonial Deleted!');
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
         self.setState({ loading: false, arrow:null });
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

        if(key !== 'image'){
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


     const { name, content } = this.state.addNewUserDetail;
      if (name !== '' && content !== '') {
         let currentCountries = this.state.currentCountries;
         let newUser = {
            ...this.state.addNewUserDetail
         }

         let self = this;
         this.setState({ addNewUserModal: false, loading: true });

         api.post('addtestimonial',newUser).then((response) => {
            const data =  response.data;
            data.content =  data.content.replace(regex, '');
            data.checked = false;
          
             currentCountries.unshift(data);
                setTimeout(() => {
                  self.setState({ loading: false, currentCountries });
                  NotificationManager.success('User Created!');
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

   
   onSort(column){
      const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
      const sortedData = this.state.currentCountries.sort((a, b) => {
        if (column === 'name' || column === 'image' || column === 'content' || column === 'designation') {
          
          const nameA = a[column].toUpperCase(); // ignore upper and lowercase
          const nameB = b[column].toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        } else if( column === 'status') {
          return a[column] - b[column];
        } else if(column === 'created_at'){
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

        if(key !== 'image'){
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
                return item.name.toLowerCase().includes(query.toLowerCase()) || item.content.toLowerCase().includes(query.toLowerCase())
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
      api.post('updatetestimonial', editUser).then((response) => {

      	console.log(response);
        const data =  response.data;
       
        data.content =  data.content.replace(regex, '');
        users[indexOfUpdateUser] = data;
        console.log(users[indexOfUpdateUser]);
            setTimeout(() => {
              self.setState({ loading: false, currentCountries:users, cropResult: '', });
              NotificationManager.success('Testimonial Updated!');
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
     const { users, loading, selectedUser, editUser, allSelected, selectedUsers, search, results,direction, totalRecords, currentCountries, cropResult, foldername, arrow } = this.state;
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
		<IntlMessages id='sidebar.schedule' defaultMessage={<IntlMessages id="sidebar.schedule" />}>
		{(title) => (
			<Helmet>
			<title>Chameleon | {title}</title>
			<meta name="description" content={<IntlMessages id="sidebar.schedule" />} />
			</Helmet>
		)}
		</IntlMessages>
		<PageTitleBar
		title={<IntlMessages id="sidebar.schedule" />}
		match={this.props.match}
		/>
		<RctCollapsibleCard fullBlock>
		<div className="table-responsive">
		<div className="d-flex justify-content-between py-20 px-10 border-bottom">
		<div>
		<a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
		{/*<a href="javascript:void(0)" className="btn-outline-default mr-10">More</a> */}
		</div>
		 <Search searchIdeas={this.searchIdeas.bind(this)}/>
		<div>
		{/*<a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10">Export to Excel</a>*/}
		<a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10"><IntlMessages id="sidebar.addnewtestimonial" /> <i className="zmdi zmdi-plus"></i></a> 
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
    <th onClick={e => this.onSort('name')}>{<IntlMessages id="sidebar.name"/>} <i className={this.setArrow('name')}></i></th>
    <th onClick={e => this.onSort('image')}>{<IntlMessages id="sidebar.image"/>} <i className={this.setArrow('image')}></i></th>
		<th onClick={e => this.onSort('designation')}>{<IntlMessages id="sidebar.designation"/>} <i className={this.setArrow('designation')}></i></th>
    <th onClick={e => this.onSort('content')}>{<IntlMessages id="sidebar.content"/>} <i className={this.setArrow('content')}></i></th>
		<th onClick={e => this.onSort('status')}>{<IntlMessages id="widgets.status"/>} <i className={this.setArrow('status')}></i></th>
		<th>{<IntlMessages id="sidebar.action" />}</th>
		</tr>
		</thead>
		<tbody>
		{filteredResult && filteredResult.map((user, key) => (
			<tr key={key}>
			{/* <td>
			<FormControlLabel
			control={
				<Checkbox
				checked={user.checked}
				onChange={() => this.onSelectUser(user)}
				color="primary"
				/>
			}
			/>
			</td> */}
			<td>{user.name}</td>
			<td><div className="media">
				{user.image !== '' && user.image !== null && user.image !== 'undefined' ?
				   <img src={checkPath(foldername)+user.image} alt={user.name} className="rounded-circle mr-15" width="50" height="50" />
				   : <Avatar className="mr-15">{user.name.charAt(0)}</Avatar>
				}
			 </div>
			</td>
			<td>{user.designation}</td>
			<td>{user.content && textTruncate(user.content,15)}</td>
			<td>{user.status == 1 ?
                     <span className={`badge badge-success badge-pill`}>Active</span> : <span className={`badge badge-danger badge-pill`}>Inactive</span>
                  }
			</td>
			
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
		{editUser === null ? <IntlMessages id="sidebar.addnewtestimonial" /> : <IntlMessages id="sidebar.updatetestimonial" /> }
	</ModalHeader>
		<ModalBody>
		{editUser === null ?
			<AddNewUserForm
			addNewUserDetails={this.state.addNewUserDetail}
			onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
			/>
			: <UpdateUserForm user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} cropResult={cropResult} />
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
                                 <p>{<IntlMessages id="sidebar.content" />}: <span className="fw-bold">{selectedUser.content}</span></p>
                                 <p>{<IntlMessages id="widgets.status" />}: <span className="badge badge-warning">{selectedUser.status}</span></p>
                                 <p>{<IntlMessages id="widgets.date" />}: {timeAgo(selectedUser.created_at)}</p>
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
