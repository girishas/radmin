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
import { Link } from 'react-router-dom';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';


// add new user form
import AddNewComment from '../AddNewComment';
// update new user form
import UpdateComment from '../UpdateComment';

import {user_id, getFileType , getFileExt , formatBytes,get_player_url ,timeAgo, textTruncate, checkPath, checkPaths, hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import ReactQuill from 'react-quill';

import { Link as SLink , Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import TopicsDetails from '../details';
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import ReactAudioPlayer from 'react-audio-player';
export default class InnerComments extends Component {
  
  constructor(props) {
 
        super(props);  
        this.state = {
            loading: false,
            redirectToTopics:false,
            addNewUserModal:false,
            imageViewModel: false, 
            soundViewModel: false, 
            imageFile:null,
            soundFile:null,
            editUser: null,
            addNewUserDetail:{
                parent_id:0,
                topic_id: $(location).attr("href").split('/').pop(),
                user_id: user_id(),
                topic_type_id: 1,
                description: '',
                is_subscribed:this.props.is_subscribed
            },
            topic:[],
            topics:[],
            comments:this.props.comments,
            topic_id : $(location).attr("href").split('/').pop(),
            user_id : user_id(),
         
        }
     
  }



    /**
    * Open Add New Comment Modal
    */
   opnAddNewUserModal(parent_id) {
    this.setState({
        addNewUserModal:true,
        addNewUserDetail: {
            // ...this.state.addNewUserDetail,
            //     parent_id:parent_id,
            //     description: '',
                parent_id:parent_id,
                topic_id: $(location).attr("href").split('/').pop(),
                user_id: user_id(),
                topic_type_id: 1,
                description: '',
                is_subscribed:1
        }
    });
 }
 
/**
* On Edit User
*/
onEditUser(user) {
    
      this.setState({ addNewUserModal: true, editUser: user });
   }


   /**
    * On Add & Update Comment Modal Close
    */
   onAddUpdateUserModalClose() {
    this.setState({ addNewUserModal: false , editUser: null })
 }

 
 get_comments(){
    api.get('forum/get-comments', {
        params: {
            topic_id: this.state.topic_id,
        }
    })
    .then((response) => {
        this.props.comments = response.data
        this.setState({  comments:response.data ,
        });
    }) 
}
   
    /**
    * Add New comment
    */
   addNewUser() {
    var validateField = this.validateField(this.state.addNewUserDetail);

      if(validateField){
      
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

         api.post('forum/add-comment',data).then((response) => {
            const data =  response.data;
               
               
            setTimeout(() => {
                self.setState({ loading: false });
                NotificationManager.success(<IntlMessages id="note.RepliedSuccessfully"/>);
                   location.reload();
                  }, 1000);  
              
                   

         })
         .catch(error => {
            // error hanlding
         })
       }
   }

   
   /**
    * Update User
    */
   updateUser() {
    const { editUser } = this.state;
    var validateField = this.validateField(editUser);
    if(validateField){
        let indexOfUpdateUser = '';
      

    this.setState({ loading: true, editUser: null, addNewUserModal: false });
      let self = this;
       //new code for file
       var data = new FormData()
       $.map(editUser, function(value, index) {
          data.append(index,value)
       });
        api.post('forum/update-comment', data ).then((response) => {
            const data =  response.data;
        
            NotificationManager.success(<IntlMessages id="note.ReplyUpdated"/>);
            location.reload()
            setTimeout(() => {
                self.setState({ loading: false });
            
            }, 2000);       
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
 

validateField(str){
    let formIsValid = true;
   for (var key in str) {
       switch(key) {
         case 'description':
           if(str[key] !== '' && str[key] != null){
              
            } else {
                 formIsValid = false;
                 NotificationManager.error(<IntlMessages id="validation.descriptionIsRequired"/>);
            }
         break; 
         default:
           break;
       }
   }
     return formIsValid;
  } 

  comment_action(e , action ,comment_id){
   
    var td = new TopicsDetails;
    td.comment_action(e, action ,comment_id)
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
    * On Delete
    */
   onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
}

/**
* On Image Delete
*/

onImageDelete(data) {
    this.refs.deleteConfirmationDialogCommentFile.open();
    this.setState({ selectedUser: data });
}

/**
* Delete User Permanently
*/
deleteUserPermanently() {
    const { selectedUser } = this.state;

    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let self = this;
    api.post('forum/admin-delete-topic-comment', {
    'id': selectedUser.id,
    }).then((response) => {
        $('.inner_comment'+selectedUser.id).hide();
        $('.main_comment'+selectedUser.id).hide();
        $('.display-topic-comment-count').text(response.data.replies)
        setTimeout(() => {
            self.setState({ loading: false, selectedUser: null });
            NotificationManager.success(<IntlMessages id="note.CommentDeleted"/>);
        }, 2000);
    }).catch(error => {
        // error hanlding
    })
}

/**
* Delete Image Permanently
*/
deleteFilePermanently() {
    const { selectedUser } = this.state;
    this.refs.deleteConfirmationDialogCommentFile.close();
    this.setState({ loading: true });
    let self = this;
    api.post('forum/delete-comment-file', {
    'id': selectedUser.id,
    }).then((response) => {
        setTimeout(() => {
        self.setState({ loading: false,selectedUser: null   });
        $('.imageId'+selectedUser.id).hide();
        NotificationManager.success(<IntlMessages id="note.FileDeleted"/>);
        }, 1000);
    }).catch(error => {
        // error hanlding
    })
}
   render() {
    const { topic,topics ,comments,editUser,loading} = this.state;

     
      return (
    <div>
        {this.props.comments && this.props.comments.map((comment, key) => (    
        <div key={key} className={"topic-inner-list inner_comment"+comment.id}>
           <div className="topic-inner">
               <div className="topic-inner-title">
                   <div className="topic-inner-avatar">
                   <Link to={{pathname: '/app/forum/user/activity/'+comment.user_id }} >
                                    <div className="media ml-15" title={comment.user_full_name} style={{marginTop:"12px"}}>
                                        {comment.user_photo !== '' && comment.user_photo !== null && comment.user_photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+comment.user_photo} alt={comment.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{comment.user_full_name.charAt(0)}</Avatar>
                                        }
                                    </div>
                                </Link>
                   </div>
                   <div className="topic-inner-title">
                   <Link to={{pathname: '/app/forum/user/activity/'+comment.user_id }} >
                        <a href="javascript:void(0)">{comment.user_full_name}</a>
                   </Link>
                   </div>
               </div>
               <div className="topic-inner-description">
               <p dangerouslySetInnerHTML={{__html:comment.description}} />
               {comment.video_url !== null &&
                            <iframe width='500' height='300' src={get_player_url(comment.video_url)} frameborder="0" allowfullscreen></iframe>
                        }  
              
                            <div className="comment_files" >
                            {comment.files  && comment.files.length > 0 &&
                               <h5 className="ATTACHEMENTS"><IntlMessages id="widgets.ATTACHMENT"/></h5>
                            }
                                 <div className="row " >
                                
                                {comment.files && comment.files.map((value, key) => (
                                      <div  key={key} className={"col-md-2 comment-file row-height imageId"+value.id}>
                                        
                                        {getFileType(value.file_name) == 'image' &&
                                            //  <img src={checkPaths('forum_images')+value.file_name} />
                                            value.file_name !== '' && value.file_name !== null &&
                                            <div className="image_div">
                                                <a title={value.file_original_name} onClick={(e) => this.imageView(hubCheckPaths('forum_images')+value.file_name)} href="javascript:void(0)">
                                                    <img src={require('Assets/img/file-icons/'+getFileExt(value.file_name)+'.png')} alt={getFileExt(value.file_name)} />
                                                    <p className="file_name">{value.file_original_name}</p>
                                                    <p className="file_size">{formatBytes(value.file_size)}</p>
                                                </a>
                                                { (comment.user_id == user_id()) &&
                                                    <div className="delete-file"><a href="javascript:void(0)"   onClick={() => this.onImageDelete(value)} > <span className="material-icons"  >delete_forever</span></a></div>
                                                }
                                            </div>
                                        }
                                        {getFileType(value.file_name) == 'audio' &&
                                            //  <img src={checkPaths('forum_images')+value.file_name} />
                                            value.file_name !== '' && value.file_name !== null &&
                                            <div className="audio_div">
                                                <a title={value.file_original_name} onClick={() => this.soundView(hubCheckPaths('forum_images')+value.file_name)} href="javascript:void(0)"> 
                                                    <img src={require('Assets/img/file-icons/'+getFileExt(value.file_name)+'.png')} alt={getFileExt(value.file_name)} />
                                                    <p className="file_name">{value.file_original_name}</p>
                                                    <p className="file_size">{formatBytes(value.file_size)}</p>
                                                </a>
                                                { (comment.user_id == user_id()) &&
                                                    <div className="delete-file"><a href="javascript:void(0)"   onClick={() => this.onImageDelete(value)} > <span className="material-icons"  >delete_forever</span></a></div>
                                                }
                                            </div>
                                        }

                                        {getFileType(value.file_name) == 'file' &&
                                            //  <img src={checkPaths('forum_images')+value.file_name} />
                                            value.file_name !== '' && value.file_name !== null &&
                                            <div className="file_div">
                                                <a title={value.file_original_name} href={hubCheckPaths('forum_images')+value.file_name} target="_blank"  download={value.file_name}>
                                                    <img src={require('Assets/img/file-icons/'+getFileExt(value.file_name)+'.png')} alt={getFileExt(value.file_name)} />
                                                    <p className="file_name">{value.file_original_name}</p>
                                                    <p className="file_size">{formatBytes(value.file_size)}</p>
                                                </a>
                                                { (comment.user_id == user_id()) &&
                                                    <div className="delete-file"><a href="javascript:void(0)"   onClick={() => this.onImageDelete(value)} > <span className="material-icons"  >delete_forever</span></a></div>
                                                }
                                            </div>
                                            
                                        }
                                        {/* <img src={checkPaths('forum_images')+value.file_name} /> */}
                                    </div>
                                ))}
                            </div>
                 </div>
                    
                   {/* actions start */}
                   <div className="tt-item-info info-bottom">
                        <a href="javascript:void(0)" className={"tt-icon-btn tt-text-right comment_action likes commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'likes' , comment.id)}>
                            {/* <i className="tt-icon"><svg><use xlink href="#icon-like"></use></svg></i> */}
                            <span className={comment.user_likes == 1? "material-icons active": "material-icons"} >thumb_up</span>
                            <span className="tt-text">{comment.likes}</span>
                        </a>
                        <a href="javascript:void(0)"className={"tt-icon-btn tt-text-right comment_action dislikes commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'dislikes' , comment.id)} >
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-dislike"></use></svg></i> */}
                             <span className={comment.user_dislikes == 1? "material-icons active": "material-icons"}  >thumb_down</span>
                            <span className="tt-text">{comment.dislikes}</span>
                        </a>
                        <a href="javascript:void(0)" className={"tt-icon-btn tt-text-right comment_action favourites commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'favourites' , comment.id)} >
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-favorite"></use></svg></i> */}
                             <span className={comment.user_favourites == 1? "material-icons active": "material-icons"}>favorite</span>
                            <span className="tt-text">{comment.favourites}</span>
                        </a>
                        <div className="col-separator"></div>
                        {/* <a href="javascript:void(0)" className="tt-icon-btn tt-hover-02 tt-small-indent">
                        <span className="material-icons"  >share</span>
                        
                        </a>
                        <a href="javascript:void(0)" className="tt-icon-btn tt-hover-02 tt-small-indent">
                        <span className="material-icons"  >flag</span>
                          
                        </a> */}
                      
                        {/* {this.props.is_locked == 0 &&
                            <a href="javascript:void(0)"   onClick={() => this.opnAddNewUserModal(comment.id)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                            <span className="material-icons"  >reply</span>
                                
                            </a>
                        } */}
                    { (comment.user_id == user_id()) &&
                        <a title="Edit" href="javascript:void(0)"   onClick={() => this.onEditUser(comment)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                            <span className="material-icons"  >edit</span>  
                        </a>
                      }
                        {comment.user_id == user_id() &&
                            <a href="javascript:void(0)"   onClick={() => this.onDelete(comment)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                                <span className="material-icons"  >delete_forever</span> 
                            </a>
                        }
                    </div>

                    {comment.children &&
                        <InnerComments comments={comment.children} is_subscribed={this.props.is_subscribed} is_locked={this.props.is_locked}/>
                        }
               
               </div>
           </div>
           {loading &&
                  <RctSectionLoader />
               }
       </div>
             ))}
          


          <Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                    
                {editUser === null ?
                     <IntlMessages id="widgets.PostYourReply"/> :  <IntlMessages id="widgets.UpdateYourReply"/>
                }
               </ModalHeader>
               <ModalBody>
               {editUser === null ?
                     <AddNewComment
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                     />
                     : <UpdateComment
                        user={editUser}
                        onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} 
                        />
                  }
               </ModalBody>
               <ModalFooter> 
               {editUser === null ?
                     <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}><IntlMessages id="button.reply"/></Button>
                     : <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateUser()}><IntlMessages id="button.update"/></Button>
                  }
                  
                  {' '}
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}><IntlMessages id="button.cancel"/></Button>
               </ModalFooter>
            </Modal>

{/* 
<Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
               <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                     Post Your Reply
               </ModalHeader>
               <ModalBody>
                
                     <AddNewComment
                        addNewUserDetails={this.state.addNewUserDetail}
                        onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                     />
                    
               </ModalBody>
               <ModalFooter>

                     <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}>Reply</Button>
                    
                  
                  {' '}
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}>Cancel</Button>
               </ModalFooter>
            </Modal> */}
            <DeleteConfirmationDialog
               ref="deleteConfirmationDialog"
               title={<IntlMessages id="components.sureDelete"/>}
               message={<IntlMessages id="components.sureDeleteMessage"/>}
               onConfirm={() => this.deleteUserPermanently()}
            />
            <DeleteConfirmationDialog
               ref="deleteConfirmationDialogCommentFile"
               title={<IntlMessages id="components.sureDelete"/>}
               message={<IntlMessages id="components.sureDeleteMessage"/>}
               onConfirm={() => this.deleteFilePermanently()}
            />
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
        </div>
           );
   }
}
