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
   Input,
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
import Switch from '@material-ui/core/Switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

import { timeAgo, textTruncate, checkPath, getLanguageNamesByIds ,hubCheckPaths, pathForxml , get_lang_name_by_id  , getOsNamesByIds} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import { relative } from 'path';


const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';

const regex = /(<([^>]+)>)/ig;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
   //console.log('reorder',list,startIndex,endIndex)
   result.splice(endIndex, 0, removed);
	return result;
};
export default class Website extends Component {

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
             title: '',
             cat_id: null,
             os_id: [],
             url: '',
             icon: '',
             language_id:1,
             allow:'*',
             deny:'',
             screenShotFile:'',
            os_type:this.props.os_type,

          subscription_id:this.props.subs_id,
          subscription_type:this.props.subs_type,
          user_id:this.props.login_user_id,
          web_cat_id:0,
          },
          languageResult:[],
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
          website:null,
          headers_os : null,
          change: [],
          customDataArray:[],
          icon_size:{
            height:this.props.icon_size.height,
            width:this.props.icon_size.width,
         },
         search_cat_id:false
       };
        this.switchChange = [];

        this.onPageChanged = this.onPageChanged.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
     
      }


      onDragEnd(result ,provided ) {
         // dropped outside the list
         if (!result.destination) {
            return;
         }
         let dragedId = result.draggableId 
         
         //For get categor title by website id
          let  categories =  this.state.category;
        
          let draged_cat_name = ''  ;
          let draged_cat_id = 0  ;
          categories.map((headers, key) => {
            headers.category.map((cat,key) =>{
               if( cat.id == dragedId){
               
                  draged_cat_name = 'a'+headers.id;
                  draged_cat_id = headers.id;
                  return ;
               }
            })
         })

      this.state.customDataArray[draged_cat_name];
    
         var customDataArrayaa = reorder(
            this.state.customDataArray[draged_cat_name],
            result.source.index,
            result.destination.index
         );
        
         customDataArrayaa = customDataArrayaa.filter(function( element ) {
            return element !== undefined;
         });
      
         this.setState({
            customDataArray: {
              ...this.state.customDataArray,
              [draged_cat_name]: customDataArrayaa
           }
          });
        
         let orderArray = [];
         $('.categoryBody_'+draged_cat_name.replace(/\s/g, "")+' tr').each(function(index){
           var key = $(this).attr('key');
           var id = $(this).attr('id');
            orderArray[id] = index+1;
         });
     
         //send data api
         api.post('user-set-website-order',{
            'dataArray':orderArray,
            'cat_id':draged_cat_id,
            'subs_id':this.props.subs_id,
         }).then((response) => {
            })
            .catch(error => {
             
            })
      }


      handleChange = user   => (event, checked  ) => {
    
       
         this.switchChange[user] = checked;
        let cat_id =  $('.switch'+user +' input').attr('id');
       // console.log('cat_id' , cat_id )
         this.setState({ change :  this.switchChange});

         api.get('user-change-website-status', {
            params: {
              web_id: user,
              cat_status: checked,
              subs_id:this.props.subs_id,
              cat_id:cat_id,
             
            }
          })
         .then((response) => {
              const data =  response.data;
          
              if(checked){
                  NotificationManager.success(<IntlMessages id="note.WebsiteIsOn" />);
              }else{
                  NotificationManager.error(<IntlMessages id="note.WebsiteIsOff" />);
              }
              self.setState({ loading: true});
         })
         .catch(error => {
            // error hanlding
         })

      };
   getInfo() {
      api.get('user-get-xml-website', {
            params: {
              os_type: this.props.os_type,
              subs_id: this.props.subs_id,
              browser_id: this.props.browser_id,
            }
          })
         .then((response) => {

          const category =  response.data.data.website;
          const languageResult =  response.data.data.languaglist;
          const foldername =  response.data.data.path;


          let checkedUsers = category.map(user => {
                return user;
          });
        
         

            const offset = 0;

             const currentCountries = checkedUsers;  
             var cat_array = [];
            
             category.map((headers, key) => {
               cat_array['a'+headers.id] = headers.category
            })
           
            this.setState({foldername, languageResult,customDataArray :cat_array, category, currentCountries, users: checkedUsers, totalRecords:response.data.totalRecords });
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

   onPageChanged = data => {

    //console.log(this.state);

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
   
      api.post('user-deleteoswebsite',{
               'id':selectedUser.id,
            }).then((response) => {
              // users.splice(indexOfDeleteUser, 1);
              var cat_id = $('tr#'+selectedUser.id).closest('.cat_top_class').attr('id');
                 setTimeout(() => {
              
                  $('tr#'+selectedUser.id).hide()
               self.setState({ loading: false,web_cat_id:cat_id,  currentCountries:users, selectedUser: null });
              
              
               NotificationManager.success(<IntlMessages id="components.WebsiteDeleted" />);
              // location.reload()
            }, 2000);
         })
         .catch(error => {
            // error hanlding
         })
    
   }

   /**
    * Open Add New User Modal
    */
   opnAddNewUserModal(category) {
   // console.log("kapil 1 => "+category.os_type);
    this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['cat_id']: category.xml_categories_id,
                ['os_id']: category.os_type.split(','),
                ['id']: '',
                ['title']: '',
                ['allow']: '',
                ['deny']: '',
                ['icon']: '',
                ['url']: ''
             },
             addNewUserModal: true
			
           });
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
        switch(key) {
          case 'url':
        
          if(str[key] !== '' && str[key] !== null){
         
           var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
          
           if (!re.test(str[key])) { 
              formIsValid = false;
              NotificationManager.error(<IntlMessages id="validation.Urlisnotvalid" />);
            }
          }else{
            formIsValid = false;
            NotificationManager.error(<IntlMessages id="validation.urlisnotempty" />);
          }
          break;
           case 'title':
            if(str[key] !== '' && str[key] != null){
               
             } else {
                  formIsValid = false;
                  NotificationManager.error(<IntlMessages id="validation.TitleIsNotEmpty" />);
             }
          break;
          case 'language_id':
               if(str[key] == '' || str[key] == 0){
                  formIsValid = false;
                  NotificationManager.error(<IntlMessages id="validation.Languageisrequired" />);
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
    //console.log(this.state.addNewUserDetail);
    var validateField = this.validateField(this.state.addNewUserDetail);

      if(validateField){
         let category = this.state.category;

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
         api.post('user-addoswebsite',data).then((response) => {
            const data =  response.data;
            self.getInfo();
            // category.unshift(data);
                setTimeout(() => {

                  // data.map((headers, key) => {
                  //    this.setState({
                  //       customDataArray: {
                  //         ...this.state.customDataArray,
                  //         ['a'+headers.id]: headers.category
                  //      }
                  //     })
                  //    });
                

                  self.setState({ loading: false});
                  NotificationManager.success(<IntlMessages id="components.OsWebsiteCreated" />);
               }, 2000);       
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
   onEditUser(user , headers_os) {

   
      this.setState({ addNewUserModal: true, editUser: user, headers_os: headers_os });
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
    * On Add & Update User Modal Close
    */
   onAddUpdateUserModalClose() {
      this.setState({ addNewUserModal: false, editUser: null })
   }

   
  
    onSort(column, id){

      const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
      
      
      const sortedData = this.state.category.map((item) => {

        if(item.id == id){
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
      if(validateField){
         let indexOfUpdateUser = '';
         let users = this.state.category;

         for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.id === editUser.cat_id) {
               indexOfUpdateUser = i
            }
         }

      editUser['os_type'] = this.props.os_type;
     this.setState({ loading: true,  addNewUserModal: false });
      
        let self = this;
          //new code for file
          var data = new FormData()
          $.map(editUser, function(value, index) {
             data.append(index,value)
          });
        api.post('user-updateoswebsite', data).then((response) => {
          const data =  response.data;
       
          users[indexOfUpdateUser] = data;
              setTimeout(() => {
               this.setState({
                  customDataArray: {
                    ...this.state.customDataArray,
                    ['a'+data.id]: data.category
                 }
                });

                self.setState({ loading: false, category:users, cropResult: '',editUser: null });
                NotificationManager.success(<IntlMessages id="components.WebsiteUpdated" />);
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

   onChangeCatId(name , value){
      this.setState({ search_cat_id: value});
   }

   render() {

     const { languageResult,search_cat_id , web_cat_id ,category, users,customDataArray, loading, selectedUser, editUser, allSelected, selectedUsers, search, results,direction, totalRecords, currentCountries, cropResult, foldername, cropResultOnHover } = this.state;
     
     if(!category)
          return null;

     let filteredResult;
     if(search){
        filteredResult = results;
     }else{
        filteredResult = category;
     }
      return (

         <div className="user-management">
         <div className="d-flex justify-content-between py-10 px-10 border-bottom">
            <div className="select_cat mb-10"  style={{position:'relative',left:'85%' ,maxWidth:'200px' }}>
                  <Input type="select" name="language_id"   onChange={(e) => this.onChangeCatId('search_cat_id', e.target.value)}>
                     <option  value={0}>All Categories</option>
                        { category && category.map((categor, key) => (
                           <option key={key} value={categor.id}>{categor.title}</option>
                           )) }
                  </Input>
            </div>
         </div>
         {filteredResult.map((headers, key) => {
           
        return (
         (search_cat_id == 0 || search_cat_id == headers.id) &&
         <div key={key} className="cat_top_class" id={headers.id}>
            <RctCollapsibleCard fullBlock >
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-10 px-10 border-bottom">
                     <div style={{display:"block"}}>
                        <div className="media ml-10 ">
                           {headers.icon !== '' && headers.icon !== null ?
                              <img key={key} src={ hubCheckPaths('images')+headers.icon} onClick={() => this.imageView(hubCheckPaths('images')+headers.icon)} alt="user prof" className="rounded-circle mr-15" width="40" height="40" />
                           
                              : <Avatar style={{width:"40px" , height:"40px"}} className="mr-15">{headers.title.charAt(0)}</Avatar>
                           }
                              <h3 className=" mr-10 p-10">{headers.title}</h3>
                        </div>
                     </div>
                     { headers.is_new_cat == 1 &&
                     <div>                        
                        <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal(headers)} color="primary" className="caret btn-sm mr-10">{<IntlMessages id="sidebar.addnewwebsite" />} <i className="zmdi zmdi-plus"></i></a>
                     </div>
                     }
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr key={key} className="bg-primary text-white">
                        <th width='250px' onClick={e => this.onSort('title',headers.id)}>{<IntlMessages id="components.title" />} <i className={this.setArrow('title')}></i></th>
                          <th width='150px'>{<IntlMessages id="components.icon" />} </th>
                          <th width='100px'>{<IntlMessages id="components.language" />}</th>
                          <th width='250px'>{<IntlMessages id="components.url" />}</th>
                          <th width='250px'>{<IntlMessages id="components.osSelected" />}</th>
                          <th width='250px'>{<IntlMessages id="components.allow" />}</th>
                          <th width='250px' >{<IntlMessages id="components.deny" />}</th>
                          <th width='300px' className='text-center' ><IntlMessages id="widgets.onOrOff" /></th>
                          <th width='200px'><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
               <DragDropContext onDragEnd={this.onDragEnd} >
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
                     <tbody ref={provided.innerRef} className={'categoryBody_'+'a'+headers.id}> 
                       {headers.category &&  customDataArray['a'+headers.id].map((user, k) => ( 
                        // {headers.category && headers.category.map((user, k) => (
                        <Draggable key={user.id} draggableId={user.id} index={k} >
                           {(provided, snapshot) => (
                              <tr key={key+'_'+k} id={user.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={"drag-list trClass_"+user.id}
                              >
                            <td>{user.title}</td>
                              <td>
                                 <div className="media">
                                    {user.icon !== '' && user.icon !== null ?
                                     <img src={hubCheckPaths('images')+user.icon} alt="user prof" onClick={() => this.imageView(hubCheckPaths('images')+user.icon)}  className="rounded-circle mr-15" width="50" height="50" />

                                       : <Avatar className="mr-15">{user.title.charAt(0)}</Avatar>
                                    }   
                                 </div>
                              </td>
                     <td>{getLanguageNamesByIds( languageResult , user.language_id)}</td>
                       
                              
                           <td> { headers.is_new_cat == 1 && <a href={user.url} target="_blank" >{user.url}</a>}</td>
                                 <td>{headers.is_new_cat == 1 &&  (user.os_id )?  getOsNamesByIds(AppConfig.os_types_array ,user.os_id): ''}</td>
                                 <td>{ headers.is_new_cat == 1 &&  user.allow}</td>
                                 <td>{ headers.is_new_cat == 1 &&  user.deny}</td>

                              
                              <td>  
                              <Badge className="mb-15 mt-15 pl-1 pr-1 text-center hide-mobile-all"  color="danger"><IntlMessages id="widgets.off" /></Badge> 
                              <Switch 
                                      // checked= {user.status == 1 ? true : false }
                               
                                      checked= { typeof this.state.change[user.id] !== 'undefined' ? this.state.change[user.id] : (user.status == 1 || user.status == null) ? true : false } 
                                       onChange={this.handleChange(user.id , user.cat_id)}  
                                       aria-label={user.id} 
                                       className={"switch"+user.id} 
                                       color='primary'

                                       id={user.cat_id}
                               />
                                <Badge className="mb-15 mt-15 pl-1 pr-1 hide-mobile-all" href="#" color="success"><IntlMessages id="widgets.on" /></Badge>
                          
                               </td>
                                
                                    <td className="list-action">
                                    {/* <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a> */}
                                    { headers.is_new_cat == 1 &&
                                       <a href="javascript:void(0)" onClick={() => this.onEditUser(user , headers.os_type.split(','))}><i className="ti-pencil"></i></a>
                                    }
                                    { headers.is_new_cat == 1 &&
                                       <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a>
                                    }
                                 </td>
                                 {provided.placeholder}
                           </tr>
                              )}
                              </Draggable>
                        ))}
                        {provided.placeholder}
                     </tbody>
                       )}
                       </Droppable>
                    </DragDropContext>
                  </table>
               </div>
               {this.state.addNewUserDetail.cat_id === headers.id && loading &&
                  <RctSectionLoader />
               }

               {editUser && editUser.cat_id === headers.id && loading &&
                  <RctSectionLoader />
               }

               {web_cat_id === headers.id && loading &&
                  <RctSectionLoader />
               }





            </RctCollapsibleCard>
    
            </div>

            );
         })}



                
            <DeleteConfirmationDialog
               ref="deleteConfirmationDialog"
               title="Are You Sure Want To Delete?"
               message="This will delete permanently."
               onConfirm={() => this.deleteUserPermanently()}
            />
            <Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                  {editUser === null ? <IntlMessages id="sidebar.addnewwebsite" /> : <IntlMessages id="sidebar.updatewebsite" /> }
               </ModalHeader>
               <ModalBody>
                  {editUser === null  ?
                     <AddNewUserForm
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                        os={this.state.headers_os}
                        browser_id={this.props.browser_id}
                        icon_size={this.state.icon_size}
                     />
                     : <UpdateUserForm 
                        user={editUser} 
                        onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} 
                        cropResult={cropResult} 
                        os={this.state.headers_os}   
                        browser_id={this.props.browser_id}
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
                                 <img src={hubCheckPaths('images')+selectedUser.icon} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                 : <Avatar className="mr-15">{selectedUser.title.charAt(0)}</Avatar>
                              }

                              <div className="media-body">
                                 <p>{<IntlMessages id="components.title" />}: <span className="fw-bold">{selectedUser.title}</span></p>
                                 <p>{<IntlMessages id="components.url" />}: <span className="fw-bold">{selectedUser.url}</span></p>
                                 <p>Allow: <span className="fw-bold">{selectedUser.allow}</span></p>
                                 
                                 <p>Deny: <span className="badge badge-warning">{selectedUser.deny}</span></p>
                                 <p>Created at: {timeAgo(selectedUser.created_at)}</p>
                                
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
