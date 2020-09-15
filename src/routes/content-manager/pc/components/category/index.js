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

import { timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml , getOsNamesByIds , get_lang_name_by_id , get_category_type_name_by_id , get_player_url} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

import Switch from '@material-ui/core/Switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

export default class Category extends Component {

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
             title: '',
             icon: '',
             bg_image: '',
             bg_video: '',
             bg_selection: 1,
             language:1,
             cat_type:1,
             sound:1,
             os_type:[this.props.os_type],
           
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
           change: [],
           has_new_cat: null,
           languageResult:[],
           icon_size:{
            height:this.props.icon_size.height,
            width:this.props.icon_size.width,
         }
       };
       this.switchChange = [];
        this.onPageChanged = this.onPageChanged.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

      }

      onDragEnd(result) {
         // dropped outside the list
         if (!result.destination) {
            return;
         }
         const currentCountries = reorder(
            this.state.currentCountries,
            result.source.index,
            result.destination.index
         );
         this.setState({
            currentCountries,
         });
         let orderArray = [];
         $('.tableBody tr').each(function(index){
           var key = $(this).attr('key');
           var id = $(this).attr('id');
            orderArray[id] = index+1;
         });
         console.log('orderArray',orderArray)
         //send data api
         api.post('user-set-category-order',{
            'dataArray':orderArray,
            'subs_id':this.props.subs_id,
         }).then((response) => {
            })
            .catch(error => {
               // error hanlding
            })
      }
   
    
      handleChange = user  => (event, checked  ) => {
         this.switchChange[user] = checked;
         this.setState({ change :  this.switchChange});
      
         api.get('user-change-category-status', {
            params: {
              category_id: user,
              cat_status: checked,
              'subs_id':this.props.subs_id,
            }
          })
         .then((response) => {
              const data =  response.data;
            //   console.log('aks data' , data);
              if(checked){
                  NotificationManager.success('Category Is On');
              }else{
                  NotificationManager.error('Category Is Off');
              }
         })
         .catch(error => {
            // error hanlding
         })

      };
   getInfo() {
      api.get('user-get-category', {
            params: {
              os_type: this.props.os_type,
              subs_id: this.props.subs_id,
              browser_id: this.props.browser_id
            }
          })
         .then((response) => {

          
              const data =  response.data.data;
              let checkedUsers = data.map(user => {
                return user;
             });

            const offset = 0;

             const currentCountries = checkedUsers.slice(offset, offset + 200);  
            this.setState({currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords ,has_new_cat : response.data.has_new_cat   });
         })
         .catch(error => {
            // error hanlding
         })
   }


   componentDidMount() {
     this.getInfo();
     api.get('get-language-array', {
      params: {
        browser_id: this.props.browser_id
      }
    })
     .then((response) => {
        this.setState({languageResult:response.data });
     })
     .catch(error => {
        // error hanlding
     })
   }

   //for change props only url is same
   componentWillReceiveProps(){
      this.getInfo();
   } 


   onPageChanged = data => {

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
      api.post('user-deleteoscategory',{
               'id':selectedUser.id,
            }).then((response) => {
               users.splice(indexOfDeleteUser, 1);
                 setTimeout(() => {
               self.setState({ loading: false, currentCountries:users, selectedUser: null });
               self.setState({  has_new_cat:0 });
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
      this.setState({ addNewUserModal: true,addNewUserDetail:'' });
      
      this.setState({
         addNewUserDetail:{
                     id: '',
                     title: '',
                     icon: '',
                     bg_image: '',
                     bg_video: '',
                    
                     language:1,
                     cat_type:1,
                     sound:1,
                     os_type:[this.props.os_type],
                  
                     subscription_id:this.props.subs_id,
                     subscription_type:this.props.subs_type,
                     user_id:this.props.login_user_id,
         }
      })

    
 

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
    
   
           this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
             }
          });
         
     
   }

   validateField(str){
     let formIsValid = true;
    for (var key in str) {
      console.log(key);
        switch(key) {
          case 'title':
            if(str[key] !== '' && str[key] != null){
               
             } else {
                  formIsValid = false;
                  NotificationManager.error('Title is not empty!');
             }
          break;
          case 'bg_video':
              if(str[key] !== '' && str[key] != null){
                if(!str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)){
                   formIsValid = false;
                   NotificationManager.error('Background Video url should be vimeo or youtube url!');
                }
             }
          break;
            case 'video_url':
            //   if(str[key] !== '' && str[key] != null){
            //     if(!str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)){
            //        formIsValid = false;
            //        NotificationManager.error('Video url should be vimeo or youtube url!');
            //     }
            //  }
            case 'language':
            if(str[key] == '' || str[key] == 0){
               formIsValid = false;
               NotificationManager.error('Language is required!');
            }
         break;
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
    console.log(this.state.addNewUserDetail);

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
         api.post('user-addoscategory',data , {timeout: 180000}).then((response) => {
            const data =  response.data;
                    
             currentCountries.push(data);
                setTimeout(() => {
                  self.setState({ loading: false, currentCountries });
                  self.setState({  has_new_cat:1 });
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
    console.log(user);
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

   
  
    onSort(column){
      const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
      const sortedData = this.state.currentCountries.sort((a, b) => {
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
        } else if(column === 'sound' ) {
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
      this.setState({
         editUser: {
            ...this.state.editUser,
            [key]: value
         }
      });
   }




      searchIdeas(query){
    
        const { users } = this.state;
         let currentList =null;
         let newList = null;

          if (query !== "") {
            
            currentList = users;
            newList = currentList.filter(item => {
                return item.title.toLowerCase().includes(query.toLowerCase()) 
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
         api.post('user-updateoscategory', data , {timeout: 180000}).then((response) => {
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
     const { users, loading, selectedUser,languageResult  , editUser, allSelected, selectedUsers, search, results,direction, totalRecords, currentCountries, cropResult, foldername, cropResultOnHover } = this.state;
     if(!users)
          return null;

     let filteredResult;
     if(search){
        filteredResult = results;
     }else{
        filteredResult = currentCountries;
     }
     console.log('aks addnewuserform',this.state.addNewUserDetail);
    
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
                     
                     <Search searchIdeas={this.searchIdeas.bind(this)}/>
                     {this.state.has_new_cat == 0 ?
                     <div>                        
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="sidebar.addnewcategory" />} <i className="zmdi zmdi-plus"></i></a>
                     </div>:''
                     }
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-primary text-white">
                          <th onClick={e => this.onSort('title')}>{<IntlMessages id="components.title" />} <i className={this.setArrow('title')}></i></th>
                          <th onClick={e => this.onSort('icon')}>{<IntlMessages id="components.icon" />} <i className={this.setArrow('icon')}></i></th>
                          <th onClick={e => this.onSort('bg_image')}>{<IntlMessages id="components.backgroundImage" />} <i className={this.setArrow('bg_image')}></i></th>
                          <th onClick={e => this.onSort('sound')}>{<IntlMessages id="components.sound" />}  <i className={this.setArrow('sound')}></i></th>
                          <th onClick={e => this.onSort('video')}>{<IntlMessages id="components.video" />}  <i className={this.setArrow('video')}></i></th>
                         
                          <th onClick={e => this.onSort('language')}>{<IntlMessages id="components.language" />}  <i className={this.setArrow('language')}></i></th>
                          <th onClick={e => this.onSort('categoryType')}>{<IntlMessages id="components.categoryType" />}  <i className={this.setArrow('categoryType')}></i></th>
                          <th onClick={e => this.onSort('osSelected')}>{<IntlMessages id="components.osSelected" />}  <i className={this.setArrow('osSelected')}></i></th>
                          <th width="200" className="text-center" ><IntlMessages id="widgets.onOrOff" /></th>
                          <th><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
                     <DragDropContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
                     <tbody ref={provided.innerRef} className='tableBody'>
                        {filteredResult && filteredResult.map((user, key) => (
                             <Draggable key={user.id} draggableId={user.id} index={key}>
                             {/* condition code start if  */}
                        { user.is_new_cat == 1 ? 
                            (provided, snapshot) => (
                              <tr key={key} id={user.id}
                                 ref={provided.innerRef}
                                 {...provided.draggableProps}
                                 {...provided.dragHandleProps}
                                 className="drag-list"
                                >
                     
                               <td>{user.title}</td>
                                 <td>
                                    <div className="media">
                                       {user.icon !== '' && user.icon !== null ?
                                        <img key={key} src={ hubCheckPaths('images')+user.icon} onClick={() => this.imageView(hubCheckPaths('images')+user.icon)} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                     
                                          : <Avatar className="mr-15">{user.title.charAt(0)}</Avatar>
                                       }
                                    </div>
                                 </td>
                                 <td>
                                    <div className="media">
                                       {user.bg_image !== '' && user.bg_image !== null ?
                                           <img key={key} src={ hubCheckPaths('images')+user.bg_image} onClick={() => this.imageView(hubCheckPaths('images')+user.bg_image)} alt="user prof" className="rounded-circle mr-15" width="100" height="50" />
                                          : <Avatar  style={{ width:"100px", height:"50px"}}  className="mr-15">{user.title.charAt(0)}</Avatar>
                                       }
                                    </div>
                                 </td>
                                 
                                
                     <td>{user.sound == 1 ?
                        <span className={`badge badge-success badge-pill`}><IntlMessages id="button.yes" /></span> : <span className={`badge badge-danger badge-pill`}><IntlMessages id="button.no" /></span>
                     }</td>
                     <td>
                     <a  onClick={() => this.videoView(get_player_url(user.bg_video))}  href="javascript:void(0)">{user.bg_video}</a>
                     </td>
                     <td>{get_lang_name_by_id (languageResult , user.language)}</td>
                     <td>{get_category_type_name_by_id (AppConfig.category_type_array  , user.cat_type)}</td>
                     <td>{  getOsNamesByIds(AppConfig.os_types_array ,user.os_type )}</td>
                     <td>
                     <Badge className="mb-15 mt-15 pl-1 pr-1 text-center hide-mobile-all"  color="danger"><IntlMessages id="widgets.off" /></Badge> 
                      <Switch 
                     
                          // checked= {user.cat_status == 1 ? true : false } 
                           checked= { typeof this.state.change[user.id] !== 'undefined' ? this.state.change[user.id] : user.cat_status == 0 ? false : true } 
                           onChange={this.handleChange(user.id)}  
                           aria-label={user.id} className={"switch"+user.id} 
                           color='primary'
                      /> 
                     <Badge className="mb-15 mt-15 pl-1 pr-1 text-center hide-mobile-all"   color="success"><IntlMessages id="widgets.on" /></Badge>
                                   
                        </td>
                              { user.is_new_cat == 1 ? 
                                 <td className="list-action">
                                    
                                 {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                                 <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                                 <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a> 
                              </td>
                                 :
                              
                              <td className="list-action">
                              {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                           </td>
                              }
                              </tr>
                                                 
                                        
                             ) :
                            
      //  Second part========================================================================
                            
           
                            
                            
                            
                            
                            
                            
                            
                            
                            (provided, snapshot) => (
                              <tr key={key} id={user.id}
                                 ref={provided.innerRef}
                                 {...provided.draggableProps}
                                 {...provided.dragHandleProps}
                                 className="drag-list"
                                >
   
                               <td>{user.title}</td>
                                 <td>
                                    <div className="media">
                                       {user.icon !== '' && user.icon !== null ?
                                        <img key={key} src={ hubCheckPaths('images')+user.icon} onClick={() => this.imageView(hubCheckPaths('images')+user.icon)} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                     
                                          : <Avatar className="mr-15">{user.title.charAt(0)}</Avatar>
                                       }
                                    </div>
                                 </td>
                                 <td>
                                    
                                 </td>
                                 
                                
                     <td></td>
                     <td>
                      </td>
                     <td>{get_lang_name_by_id (languageResult , user.language)}</td>
                     <td></td>
                     <td></td>
                     <td >
                     <Badge className="mb-15 mt-15 pl-1 pr-1 text-center hide-mobile-all"  color="danger"><IntlMessages id="widgets.off" /></Badge> 
                      <Switch 
                   
                          // checked= {user.cat_status == 1 ? true : false } 
                           checked= { typeof this.state.change[user.id] !== 'undefined' ? this.state.change[user.id] : user.cat_status == 0 ? false : true } 
                           onChange={this.handleChange(user.id)}  
                           aria-label={user.id} className={"switch"+user.id} 
                           color='primary'
                      /> 
                    <Badge className="mb-15 mt-15 pl-1 pr-1 text-center hide-mobile-all"   color="success"><IntlMessages id="widgets.on" /></Badge>
                     
                                       
                            {/* <Switch checked={true} onChange={this.handleChange(user)}  aria-label={user.id} className={"switch"+user.id} /> */}
                        </td>
                              { user.is_new_cat == 1 ? 
                                   <td className="list-action">
                                    
                                   {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                                   <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                                   <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a> 
                                </td>
                                 :
                                 <td className="list-action">
                                    {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                                 </td>
                              }
                              </tr>
                               )                       
                           
                            
      }
                            </Draggable>
                        ))}
                          {provided.placeholder}
                     </tbody >
                         )}
                         </Droppable>
                      </DragDropContext>
                     {/* <tfoot className="border-top">
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
                     </tfoot> */}
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
            <Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {editUser === null ? <IntlMessages id="sidebar.addnewcategory" /> : <IntlMessages id="sidebar.updatecategory" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                        os_type={this.props.os_type}
                        os_type={this.props.os_type}
                        browser_id={this.props.browser_id}
                        icon_size={this.state.icon_size}
                     />
                     : <UpdateUserForm 
                           user={editUser}  
                           browser_id={this.props.browser_id} 
                           onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} 
                           cropResult={cropResult} 
                           cropResultOnHover={cropResultOnHover} 
                           icon_size={this.state.icon_size}
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
                            {selectedUser.icon !== '' && selectedUser.icon !== null ?
                                       <img src={hubCheckPaths(foldername)+selectedUser.icon} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{selectedUser.title.charAt(0)}</Avatar>
                                    }

                              <div className="media-body">
                                 <p>{<IntlMessages id="components.title" />}: <span className="fw-bold">{selectedUser.title}</span></p>
                                 <p>{<IntlMessages id="components.backgroundVideo" />}: <span className="fw-bold">{selectedUser.bg_video}</span></p>
                                 <p>{<IntlMessages id="components.backgroundSelection" />}: <span className="fw-bold">{selectedUser.bg_selection}</span></p>
                                 
                                 <p>{<IntlMessages id="components.sound" />}: <span className="badge badge-warning">{selectedUser.sound}</span></p>
                                 <p> {timeAgo(selectedUser.created_at)}</p>
                                 <p>{<IntlMessages id="components.backgroundImage" />}: {selectedUser.bg_image !== '' && selectedUser.bg_image !== null ?
                                       <img src={hubCheckPaths(foldername)+selectedUser.bg_image} alt="user prof" width="50" height="50" />
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
   }
}
