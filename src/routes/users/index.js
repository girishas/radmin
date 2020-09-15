/**
 * Users Routes
 */
/* eslint-disable */
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
import Pagination from './Pagination';
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

import { timeAgo, checkPath } from "Helpers/helpers";

import SearchForm from './SearchForm';
import AppConfig from 'Constants/AppConfig';

/* // async components
import {
    AsyncUsersListComponent,
    AsyncUserProfileComponent,
    AsyncUserProfile1Component,
    AsyncUserManagementComponent
} from 'Components/AsyncComponent/AsyncComponent';

const Forms = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/user-profile`} />
            <Route path={`${match.url}/user-profile`} component={AsyncUserProfileComponent} />
            <Route path={`${match.url}/user-list`} component={AsyncUsersListComponent} />
            <Route path={`${match.url}/user-profile-1`} component={AsyncUserProfile1Component} />
            <Route path={`${match.url}/user-management`} component={AsyncUserManagementComponent} />
        </Switch>
    </div>
);

export default Forms; */

export default class Users extends Component {

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
				role_id: '2',
				password: '',
				email: '',
				full_name: '',
				description: '',
				mobile: '',
				photo: '',
				gender: '1',
				street1: '',
				street2: '',
				city:'',
				state:1,
				zip:'',
				country_id:'',
				status:1
				//checked: false
			},
			openViewUserDialog: false, // view user dialog box
			editUser: null,
			allSelected: false,
			selectedUsers: 0,
			results: null,
			search:'',
			totalRecords:null,
			currentCountries:[],
			cropResult:null,
			foldername:'users',
		};
        this.onPageChanged = this.onPageChanged.bind(this);
     
      }

	

	componentDidMount() {
		api.get('get-user-list')
			.then((response) => {
				/*let checkedUsers = response.data.map(user => {
					user.checked = false
		                return user;
		          });*/
		         const offset = 0;

             const currentCountries = response.data.data.slice(offset, offset + AppConfig.paginate);
				this.setState({ currentCountries,users: response.data.data, totalRecords: response.data.totalRecords });
			})
			.catch(error => {
				// error hanlding
			})
	}

	/**
	 * On Delete
	 */
	onDelete(data) {
		this.refs.deleteConfirmationDialog.open();
		this.setState({ selectedUser: data });
	}


	 onPageChanged = data => {
	    const { users } = this.state;
	    const { currentPage, totalPages, pageLimit } = data;
	    const offset = (currentPage - 1) * pageLimit;
	    const currentCountries = users.slice(offset, offset + pageLimit);


	    this.setState({  currentCountries, currentPage, totalPages  });
  };

	/**
	 * Delete User Permanently
	 */
	deleteUserPermanently() {
		const { selectedUser } = this.state;
		let users = this.state.users;
		let indexOfDeleteUser = users.indexOf(selectedUser);
		users.splice(indexOfDeleteUser, 1);
		this.refs.deleteConfirmationDialog.close();
		this.setState({ loading: true });
		let self = this;
		setTimeout(() => {
			self.setState({ loading: false, users, selectedUser: null });
			NotificationManager.success('User Deleted!');
		}, 2000);
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
		if(key == 'photo'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['photo']: reader.result
             },
             cropResult:true
            });
          }

          reader.readAsDataURL(file)
        } 

        if(key !== 'photo'){
           this.setState({
				addNewUserDetail: {
					...this.state.addNewUserDetail,
					[key]: value
				}
			});
         }

		

	}

	validateEmail(email) {
		  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		  return re.test(email);
		}


	validateField(str){

     let fieldValidationErrors = {}; 
     let formIsValid = true;
    for (var key in str) {
        switch(key) {
          case 'full_name':
            if(str[key] !== '' && str[key] != null){
                
             } else {
                  formIsValid = false;
                  NotificationManager.error('Name is not empty!');
             }
          break;
          case 'email':
            if(str[key] !== '' && str[key] != null){
               var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		  		if(!re.test(str[key])){
		  			formIsValid = false;
                  NotificationManager.error('Email is not valid!');
		  		};
             } else {
                  formIsValid = false;
                  NotificationManager.error('Email is not empty!');
             }
          break;
          case 'password':
            if(str[key] !== '' && str[key] != null){
               
             } else {
                  formIsValid = false;
                  NotificationManager.error('Password is not empty!');
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
		if (validateField) {
			let currentCountries = this.state.currentCountries;
			let newUser = {
				...this.state.addNewUserDetail
			}
			this.setState({  loading: true });
			let self = this;
			api.post('add-user-data',newUser).then((response) => {

				if(response.data.response === 'error'){
					self.setState({ loading: false });
					 NotificationManager.error('Email is already Exist');
				} else {
					const data =  response.data.data;

					console.log(data);
	                    
	             currentCountries.unshift(data);
	                setTimeout(() => {
	                  self.setState({ addNewUserModal: false, loading: false, currentCountries });
	                  NotificationManager.success('User Created!');
	               }, 2000);   
				}
	                
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
	onUpdateUserDetails(key, value, e) {
		if(key == 'photo'){
         let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = () => {
            this.setState({
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['photo']: reader.result
             },
             cropResult:true
            });
          }

          reader.readAsDataURL(file)
        } 

        if(key !== 'photo'){
           this.setState({
				editUser: {
					...this.state.editUser,
					[key]: value
				}
			});
         }
		
	}

	/**
	 * Update User
	 */
	updateUser() {
		/*var validateField = this.validateField(this.state.addNewUserDetail);
		const { editUser } = this.state;
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
      var validateField = this.validateField(editUser);

      let indexOfUpdateUser = '';
      let users = this.state.currentCountries;
      for (let i = 0; i < users.length; i++) {
         const user = users[i];
         if (user.id === editUser.id) {
            indexOfUpdateUser = i
         }
      }
      if(validateField){
         this.setState({ loading: true, editUser: null, addNewUserModal: false });
        let self = this;
        api.post('update-user-data', editUser).then((response) => {
					const data =  response.data.data;

				users[indexOfUpdateUser] = data;
	                setTimeout(() => {
	                  self.setState({ addNewUserModal: false, loading: false, currentCountries:users, cropResult: '' });
	                  NotificationManager.success('User Updated!');
	               }, 2000);   
				
                  
           })
           .catch(error => {
              // error hanlding
           }) 
      
      }
	}

	searchIdeas(query){
    
        const { users } = this.state;
         let currentList =null;
         let newList = null;
         let records = null;

          if (query !== "") {
            
            currentList = users;
            newList = currentList.filter(item => {
                return item.full_name.toLowerCase().includes(query.toLowerCase()) 
              });
            records = newList.length
          } else {
            newList = this.state.users;
            records = newList.length
          }

           const offset = 0;

           const currentCountries = newList.slice(offset, offset + 1);
          this.setState({
            results: newList,
            search:query
          });

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
		console.log(this.props);
		const {foldername, cropResult, currentCountries, users, loading, selectedUser, editUser, allSelected, selectedUsers, results, search, totalRecords } = this.state;
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
				<IntlMessages id='sidebar.users' defaultMessage='Chameleon | Users'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
				   <meta name="description" content="Chameleon | Users" />
                 </Helmet>
               )}
             </IntlMessages>
				<PageTitleBar
					title={<IntlMessages id="sidebar.users" />}
					match={this.props.match}
				/>
				<RctCollapsibleCard fullBlock>
					<div className="table-responsive">
						<div className="d-flex justify-content-between py-20 px-10 border-bottom">
							<div>
							<a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
							</div>
							<SearchForm searchIdeas={this.searchIdeas.bind(this)} />
							<div>
								{ /* <a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10">Export to Excel</a> */}
								<a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">Add New User <i className="zmdi zmdi-plus"></i></a>
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
									</th>*/}
									<th>Name</th>
									<th>Email Address</th>
									<th>Phone</th>
									<th>Status</th>
									<th>Date Created</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredResult && filteredResult.map((user, key) => (
									<tr key={key}>
										{/*<td>
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
										<td>
											<div className="media">
												{user.photo !== '' && user.photo !== null ?
													<img src={checkPath(foldername)+user.photo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
													: <Avatar className="mr-15">{user.full_name.charAt(0)}</Avatar>
												}
												<div className="media-body">
													<h5 className="mb-5 fw-bold">{user.full_name}</h5>
													<Badge color="warning">{user.role_id == '1'?'Admin':'User'}</Badge>
												</div>
											</div>
										</td>
										<td>{user.email}</td>
										<td>{user.mobile}</td>
										<td><span className={`badge badge-warning badge-pill`}>{user.status == '0'?'Inactive':(user.status == '1'?'Active':'Blocked')}</span></td>
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
									{ !search &&
										<Pagination
			                                className="mb-0 py-10 px-10"
			                                totalRecords={totalRecords}
			                                pageLimit={AppConfig.paginate}
			                                pageNeighbours={1}
			                                onPageChanged={this.onPageChanged}
			                              />
									}
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
						{editUser === null ?
							'Add New User' : 'Update User'
						}
					</ModalHeader>
					<ModalBody>
						{editUser === null ?
							<AddNewUserForm
								addNewUserDetails={this.state.addNewUserDetail}
								onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)} cropResult={cropResult} 
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
										{selectedUser.photo !== '' && selectedUser.photo !== null ?
                                       <img src={ checkPath(foldername)+selectedUser.photo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.fullname.charAt(0)}</Avatar>
                                    }
										<div className="media-body">
											<p>{<IntlMessages id="sidebar.name" />}: <span className="fw-bold">{selectedUser.full_name}</span></p>
											<p>{<IntlMessages id="components.email" />}: <span className="fw-bold">{selectedUser.email}</span></p>
											<p>{<IntlMessages id="components.mobileNumber" />}: <span className="fw-bold">{selectedUser.mobile}</span></p>
											<p>{<IntlMessages id="widgets.gender" />}: <span className="badge badge-warning">{selectedUser.gender === 1 ? 'Male':'Female'}</span></p>
											<p>{<IntlMessages id="widgets.role" />}: <span className="badge badge-warning">{selectedUser.role_id === 1 ? 'Admin':'User'}</span></p>
											<p>{<IntlMessages id="components.state" />}: <span className="badge badge-warning">{selectedUser.status === 1 ? 'Active':(selectedUser.status === 2 ? 'Blocked':'Inactive') }</span></p>
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
