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

// update user form

// add new user form
import AddNewComment from '../AddNewComment';
// update new user form
import UpdateComment from '../UpdateComment';
// add new user Flag
import AddNewFlag from '../AddNewFlag';

import {user_id,getFileType ,is_moderator_can_update , getFileExt ,get_player_url , formatBytes, timeAgo, textTruncate, checkPath, checkPaths ,hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import ReactQuill from 'react-quill';
import InnerComments from './innerCommnet';
import { Link as SLink , Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import TopicsDetails from '../details';
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import ReactAudioPlayer from 'react-audio-player';
import { array } from 'prop-types';

export default class Comments extends Component {
  
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
                is_subscribed:1
            },
            addNewFlagDetail:{
                user_id: user_id(),
                comment_id:0,
                description: '',
            },
            comment_flags:[],
            selectedComment:null,
            topic:[],
            topics:[],
            comments:this.props.comments,
            maxLikedId:this.props.maxLikedId,
            topic_id : $(location).attr("href").split('/').pop(),
            user_id : user_id(),
         
        }
     
  }

   //for change props only url is same
   componentWillReceiveProps(newProps){
    this.props = newProps;

 } 
 

    /**
    * Open Add New Comment Modal
    */
   opnAddNewUserModal(parent_id) {
       console.log('addNewUserDetail',this.state.addNewUserDetail)
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
    * Open Add New Comment Modal
    */
   opnAddNewFlagModal(comment_id) {
    this.setState({
        addNewFlagModal:true,
        addNewFlagDetail: {
            ...this.state.addNewFlagDetail,
                comment_id:comment_id,
                description: '',
        }
    });
 }
 
   /**
    * On Add & Update Comment Modal Close
    */
   onAddUpdateUserModalClose() {
    this.setState({ addNewUserModal: false , editUser: null })
 }

   /**
    * On Add & Update Comment Modal Close
    */
   onAddFlagModalClose() {
    this.setState({ addNewFlagModal: false })
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
    * Add New comment
    */
   addNewFlag() {
    //var validateField = this.validateFlagField(this.state.addNewFlagDetail);
    var validateField = true;
        if(validateField){
      
         let newUser = {
            ...this.state.addNewFlagDetail
         }
        let self = this;
         this.setState({ addNewFlagModal: false, loading: true });

          //new code for file
          var data = new FormData()
          $.map(newUser, function(value, index) {
             data.append(index,value)
          });

         api.post('forum/add-comment-flag',data).then((response) => {
            const data =  response.data;

            setTimeout(() => {
                self.setState({ loading: false });
                NotificationManager.success(<IntlMessages id="note.ReportSentSuccessfully"/>);
                  // location.reload();
                  }, 1000);  
                    
         })
         .catch(error => {
            // error hanlding
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


/**
* On Change Add New User Details
*/
onChangeAddNewFlagDetails(key, value, e) {
    this.setState({
      addNewFlagDetail: {
         ...this.state.addNewFlagDetail,
         [key]: value,
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
* On flags view 
*/
flagsView(comment){
    this.setState({ loading: true });
   
    let self = this;
    api.post('forum/get-comment-flags',{
        'comment_id':comment.id
    }).then((response) => {
        const comment_flags =  response.data.flags;
        self.setState({ flagsViewModel: true, comment_flags: comment_flags, loading:false , selectedComment:comment });
     })

   
   
 }
 onflagsViewClose() {
    this.setState({ flagsViewModel: false, imageFile: null })
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
            self.setState({ loading: false,  selectedUser: null });
            NotificationManager.success(<IntlMessages id="note.CommentDeleted"/>);
        }, 2000);
       
    
    }).catch(error => {
        // error hanlding
    })
    // var td = new TopicsDetails;
    // td.getInfo(0)
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
MarkAppropriate(comment_id,status) {
    const { selectedUser } = this.state;

    this.setState({ loading: true });
    let self = this;
    api.post('forum/update-comment-status', {
        'comment_id': comment_id,
        'status':status,
    }).then((response) => {
        NotificationManager.success(<IntlMessages id="note.CommentStatusUpdated"/>);
        setTimeout(() => {
             location.reload();
        //NotificationManager.success(<IntlMessages id="note.CommentDeleted"/>);
        }, 2000);
    }).catch(error => {
        // error hanlding
    })
}


   render() {
    const { topic,topics ,comments,loading ,editUser, comment_flags } = this.state;

      return (
<div>
    
        {this.props.comments && this.props.comments.map((comment, key) => (  
           
            // <div className={"tt-item tt-wrapper-success main_comment"+comment.id}>
       
            <div key={key} 
            className={ this.props.maxLikedId == comment.id ? "tt-item tt-wrapper-success main_comment"+comment.id : 
              comment.status == 0 ?"tt-item tt-wrapper-danger  main_comment"+comment.id:"tt-item  main_comment"+comment.id} >
                 <div className="tt-single-topic">
                    <div className="tt-item-header pt-noborder">
                        <div className="tt-item-info info-top">
                            <div className="tt-avatar-icon" style={{left: "1%"}}>
                            <Link to={{pathname: '/app/forum/user/activity/'+comment.user_id }} >
                                    <div className="media ml-15" title={comment.user_full_name}>
                                        {comment.user_photo !== '' && comment.user_photo !== null && comment.user_photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+comment.user_photo} alt={comment.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{comment.user_full_name.charAt(0)}</Avatar>
                                        }
                                    </div>
                                    <span className="tt-avatar-title " >{comment.user_full_name}</span>  
                                </Link>
                            </div>
                            {this.props.maxLikedId == comment.id && 
                            <div className="tt-avatar-title">
                            {/* <Link to={{pathname: '/app/forum/user/activity/'+comment.user_id }} >{comment.user_full_name}</Link> */}
                           
                                <span class="tt-color13 tt-badge"><IntlMessages id="widgets.BestAnswer"/></span>
                           
                           
                            </div>
                             }
                            
                            
                        </div>
                        {is_moderator_can_update(comment.forum_id) && comment.flags > 0 &&
                            <a href="javascript:void(0)" onClick={(e) => this.flagsView(comment)} className="tt-info-time  ">
                                <span class="tt-color08 tt-badge">{comment.flags} <span className="material-icons"  >flag</span></span>
                            </a>
                        }
                    </div>
                    {comment.status == 1 ?
                    <div className="tt-item-description">
                        <a href="javascript:void(0)" className="tt-info-time  cursor-default pull-right" style={{color: "#464d69"}}>
                            <span className="material-icons"  >access_time</span>
                                <span className="tt-text">  {getTheDate(convertDateToTimeStamp(comment.created_at ,'YYYY-MM-DD HH:mm' ) , 'D MMMM,YYYY hh:mm A')}</span>
                            </a> 
                        <p dangerouslySetInnerHTML={{__html:comment.description}} />
                        {this.props.maxLikedId == comment.id && 
                                <span class="tt-color13 tt-badge"><IntlMessages id="widgets.BestAnswer"/></span>
                            }
                        {comment.video_url !== null &&
                            <iframe width='500' height='300' src={get_player_url(comment.video_url)} frameborder="0" allowfullscreen></iframe>
                        }                

                      
                            <div className="comment_files" >
                            {comment.files != 'undefined' && comment.files.length > 0 &&
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
                        
                              
                    <div className="tt-item-info info-bottom">
                        <a href="javascript:void(0)" className={"tt-icon-btn tt-text-right comment_action likes commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'likes' , comment.id)} >
                            {/* <i className="tt-icon"><svg><use xlink href="#icon-like"></use></svg></i> */}
                            <span className={comment.user_likes == 1? "material-icons active": "material-icons"}   >thumb_up</span>
                            <span className="tt-text">{comment.likes}</span>
                        </a>
                        <a href="javascript:void(0)"className={"tt-icon-btn tt-text-right comment_action dislikes commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'dislikes' , comment.id)} >
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-dislike"></use></svg></i> */}
                             <span className={comment.user_dislikes == 1? "material-icons active": "material-icons"}  >thumb_down</span>
                            <span className="tt-text">{comment.dislikes}</span>
                        </a>
                        <a href="javascript:void(0)" className={"tt-icon-btn tt-text-right comment_action favourites commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'favourites' , comment.id)} >
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-favorite"></use></svg></i> */}
                             <span className={comment.user_favourites == 1? "material-icons active": "material-icons"}  >favorite</span>
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
                            <a title="Reply" href="javascript:void(0)"   onClick={() => this.opnAddNewUserModal(comment.id)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                                <span className="material-icons"  >reply</span>
                            </a>
                        } */}
                      { !(comment.user_id == user_id()) &&
                        <a title="Report" href="javascript:void(0)"   onClick={() => this.opnAddNewFlagModal(comment.id)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                            <span className="material-icons"  >flag</span>  
                        </a>
                      }

                      { (comment.user_id == user_id()) &&
                        <a title="Edit" href="javascript:void(0)"   onClick={() => this.onEditUser(comment)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                            <span className="material-icons"  >edit</span>  
                        </a>
                      }
                        {(is_moderator_can_update(comment.forum_id) || comment.user_id == user_id()) &&
                            <a href="javascript:void(0)"   onClick={() => this.onDelete(comment)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                                <span className="material-icons"  >delete_forever</span> 
                            </a>
                        }
                    </div>
                        {comment.children &&
                        <InnerComments comments={comment.children} is_subscribed={this.props.is_subscribed} is_locked={this.props.is_locked}/>
                        }
                    </div>
                    :
                    <div className="tt-item-description">
                        <span><IntlMessages id="widgets.FlaggedByAModerator"/></span>
                                 
                    <div className="tt-item-info info-bottom">
                       
                        <a href="javascript:void(0)"className={"tt-icon-btn tt-text-right comment_action dislikes commentwid"+comment.id}  onClick={(e) => this.comment_action(e, 'dislikes' , comment.id)} >
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-dislike"></use></svg></i> */}
                             <span className={comment.user_dislikes == 1? "material-icons active": "material-icons"}  >thumb_down</span>
                            <span className="tt-text">{comment.dislikes}</span>
                        </a>
                        
                        <div className="col-separator"></div>
                        {/* <a href="javascript:void(0)" className="tt-icon-btn tt-hover-02 tt-small-indent">
                            <span className="material-icons"  >share</span>
                        
                        </a>
                        <a href="javascript:void(0)" className="tt-icon-btn tt-hover-02 tt-small-indent">
                            <span className="material-icons"  >flag</span>
                           
                        </a> */}
                       
                       
                     
                        {comment.user_id == user_id() &&
                            <a href="javascript:void(0)"   onClick={() => this.onDelete(comment)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                                <span className="material-icons"  >delete_forever</span> 
                            </a>
                        }
                    </div>
                        </div>
                    }
                   
                   
                   
                </div>
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



            {/* <Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
                <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                    <IntlMessages id="widgets.PostYourReply"/>
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

            <Modal  backdrop="static" isOpen={this.state.addNewFlagModal} toggle={() => this.onAddFlagModalClose()}>
                <ModalHeader toggle={() => this.onAddFlagModalClose()}>
                     Report
                </ModalHeader>
                <ModalBody>
                     <AddNewFlag
                        addNewFlagDetails={this.state.addNewFlagDetail}
                        onChangeAddNewFlagDetails={this.onChangeAddNewFlagDetails.bind(this)}
                     />
               </ModalBody>
               <ModalFooter>
                     <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewFlag()}>Submit</Button>{' '}
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddFlagModalClose()}>Cancel</Button>
               </ModalFooter>
            </Modal>

            {loading &&
                  <RctSectionLoader />
               }
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

            {/* ===============Flags view popup==================== */}
                {/* <Modal isOpen={this.state.flagsViewModel} toggle={() => this.onflagsViewClose()}>
                    <ModalHeader toggle={() => this.onflagsViewClose()}>
                    </ModalHeader>                 
                    <ModalBody>
                       
                    </ModalBody>
                </Modal> */}
            {/* ===============Flags view popup END==================== */}

            <Dialog
               onClose={() => this.setState({ flagsViewModel: false })}
               open={this.state.flagsViewModel}
            >
               <DialogContent>
                  {comment_flags && comment_flags !== null && this.state.selectedComment  != null &&
                     <div>
                      <h2>Report  <span class="tt-color08 tt-badge float-right">{comment_flags.length} 
                      <span className="material-icons"  >flag</span></span> 
                      
                        {this.state.selectedComment.status == 1 ?
                        <span onClick={(e) => this.MarkAppropriate(this.state.selectedComment.id , 0)} class="tt-color14 tt-badge float-right mr-2">Mark In Appropriate </span>
                      :<span onClick={(e) => this.MarkAppropriate(this.state.selectedComment.id , 1)} class="tt-color13 tt-badge float-right mr-2">Mark Appropriate </span>}
                      </h2>
                      

                        {comment_flags && comment_flags.map((comment_flag, key) => (
                              <div className="clearfix d-flex">
                           <div className="media pull-left" style={{width:"500px", marginTop:"20px"}}>
                            {comment_flag.photo !== '' && comment_flag.photo !== null ?
                                       <img src={hubCheckPaths('images')+comment_flag.photo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                       : <Avatar className="mr-15">{comment_flag.full_name !== null  ? comment_flag.full_name.charAt(0) : 'U'.charAt(0)}</Avatar>
                                    }

                              <div className="media-body">
                                
                                 <p dangerouslySetInnerHTML={{__html:comment_flag.description}} />
                                 <p> {timeAgo(comment_flag.created_at)}</p>
                                 
                              </div>
                           </div>
                        </div>
                        ))}
                       
                     </div>
                  }
               </DialogContent>
            </Dialog>
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
