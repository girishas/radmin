/* /**
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

import { timeAgo, textTruncate, checkPaths ,hubCheckPaths  ,checkPath,notification_text , user_id } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import { Link } from 'react-router-dom';

const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;


export default class Testimonial extends Component {

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
       
      }

   getInfo() {
      api.post('forum/notificationlist',{
         user_id:user_id()
      })
         .then((response) => {
              const data =  response.data.data;
              let checkedUsers = data.map(user => {
               
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
    * View User Detail Hanlder
    */
   viewUserDetail(data) {
      this.setState({ openViewUserDialog: true, selectedUser: data });
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
		<IntlMessages id='sidebar.notifications' defaultMessage='Chameleon | Notifications'>
		{(title) => (
			<Helmet>
			<title>Chameleon | {title}</title>
			<meta name="description" content="Chameleon | Notifications" />
			</Helmet>
		)}
		</IntlMessages>
		<PageTitleBar
		title={<IntlMessages id="sidebar.notifications" />}
		match={this.props.match}
		/>
		<RctCollapsibleCard fullBlock>
		<div className="table-responsive">
		<div className="d-flex justify-content-between py-20 px-10 border-bottom">
		<div>
		<a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
		{/*<a href="javascript:void(0)" className="btn-outline-default mr-10">More</a> */}
		</div>
		 {/* <Search searchIdeas={this.searchIdeas.bind(this)}/> */}
		<div>
		{/*<a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10">Export to Excel</a>*/}
		{/* <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10"><IntlMessages id="sidebar.addnewtestimonial" /> <i className="zmdi zmdi-plus"></i></a>  */}
		</div>
		</div>
		<table className="table table-middle table-hover mb-0">
		<thead>
		<tr>

   
    <th onClick={e => this.onSort('image')}>{<IntlMessages id="sidebar.image"/>} <i className={this.setArrow('image')}></i></th>
	
    <th onClick={e => this.onSort('messages')}>{<IntlMessages id="widgets.messages"/>} <i className={this.setArrow('messages')}></i></th>

		</tr>
		</thead>
		<tbody>
		{filteredResult && filteredResult.map((notification, key) => (
         	notification.notification_type != 6 ?
			<tr key={key}>

			<td><Link to={{pathname: '/app/forum/user/activity/'+notification.sender_user_id }} title={notification.user_full_name} >
								
												
                        {notification.user_photo !== '' && notification.user_photo !== null && notification.user_photo !== 'undefined' ?
                        <img src={hubCheckPaths('images')+notification.user_photo} alt={notification.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                        : <Avatar className="mr-15">{notification.user_full_name !== null? notification.user_full_name.charAt(0) :'P'.charAt(0)}</Avatar>
                        }

            </Link>
			</td>
			
         <td>
         {notification_text(notification)}
         </td>
		
			
		
			</tr>
         :

         <tr key={key}>

			<td>{notification.badge_icon !== null|| notification.badge_icon != ''  ?
							<img src={checkPaths('forum_images')+notification.badge_icon} alt={notification.badge_icon} className="full-rounded-circle mr-15" width="50" height="50" />
							 : <Avatar className="mr-15">{notification.badge_icon !== null? notification.badge_icon.charAt(0) :'P'.charAt(0)}</Avatar>
								}
			</td>
			
		<td>
                     <span className="text-muted fs-12 d-block">  {notification.badge_name && <IntlMessages id={notification.badge_name} />} has been assign to you.</span>
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
		
		<Dialog
		onClose={() => this.setState({ openViewUserDialog: false })}
		open={this.state.openViewUserDialog}
		>
		{/* <DialogContent>
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
               </DialogContent> */}
		</Dialog>
		</div>
		);
    
   }
}
 