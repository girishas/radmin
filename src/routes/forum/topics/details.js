/**
 * User Management Page
 */
import React, { Component } from 'react';
//import ImgsViewer from 'react-images'
import {  Redirect } from 'react-router-dom';
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
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';

import ScrollManager from 'Components/Scroll/ScrollManager'

// update user form
//import UpdateUserForm from './UpdateUserForm';
import FHeader from '../header/index';
// add new user form
import AddNewComment from './AddNewComment';
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

import {user_id,is_moderator_can_update, timeAgo, textTruncate, checkPath, checkPaths, 
     getFileExt ,get_player_url , formatBytes,getFileType , hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import ReactQuill from 'react-quill';

import { Link as SLink , Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Comments from './comment/comments'
import ReactAudioPlayer from 'react-audio-player';

export default class TopicsDetails extends Component {
  
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
            addNewUserDetail:{
                parent_id:0,
                topic_id: $(location).attr("href").split('/').pop(),
                user_id: user_id(),
                topic_type_id: 1,
                description: '',
                is_subscribed:0
            },
            topic:[],
            is_pinned:'',
            is_locked:'',
            topics:[],
            comments:[],
            topic_id : $(location).attr("href").split('/').pop(),
            user_id : user_id(),
            sort: {
                column: null,
                direction: 'desc',
              },
              maxLikedId:0
        };
        this.onSort = this.onSort.bind(this);
     
  }

  getInfo(is_count){
     
    api.get('forum/get-topic-detail', {
        params: {
        id: this.state.topic_id,
        user_id: this.state.user_id,
        is_count: is_count,
        },headers: {'User-Id':user_id()},

    })
    .then((response) => {
        var is_subscribed = response.data.is_subscribed == null ?1:response.data.is_subscribed
        var status = response.data.status;
        if(status == 0){
            //alert('topic is not available');
            this.setState({ redirectToTopics : true });
            return
        }
        this.setState({
           
            topic:response.data ,
            
            addNewUserDetail: {
                ...this.state.addNewUserDetail, 
                topic_type_id: response.data.topic_type_id,
                is_subscribed: is_subscribed,
            },
            is_pinned:response.data.is_pinned,
            is_locked:response.data.is_locked
        });
        
    }) 

  }

    componentDidMount() {
        $("div").scrollTop(0);
        window.scrollTo(0, 0);
        this.getInfo(1)
        // get related topics
        // api.get('forum/get-all-topics' )
        // .then((response) => {
        //     this.setState({
        //         topics:response.data.topics,
        //     });
        // }) 
        //get all comments of this topic
        this.get_comments()
    } 

    get_comments(){
        api.get('forum/get-comments', {
            params: {
                topic_id: this.state.topic_id,
                user_id: this.state.user_id,
            }
        })
        .then((response) => {
            var maxLikedIdvar = 0
            if(response.data.maxLikedId){
                maxLikedIdvar = response.data.maxLikedId.id
            }
           
            this.setState({  comments:response.data.data ,maxLikedId:maxLikedIdvar });
        }) 
    }


    get_comments_filter(order_by){
        api.get('forum/get-comments', {
            params: {
                topic_id: this.state.topic_id,
                user_id: this.state.user_id,
                order_by: this.state.user_id,
            },headers: {'User-Id':user_id()},

        })

        .then((response) => {
           
            this.setState({  comments:response.data.data ,maxLikedId:response.data.maxLikedId 
            });
        })
    }
    topic_action(e, action){
            var action_status = 1;
            if($(e.target).hasClass("active")){
                $(e.target).removeClass("active"); 
                action_status = 0;
            }else{
                $(e.target).addClass("active"); 
                action_status = 1;
            }  
            api.get('forum/topic-actions', {
                params: {
                    topic_id: this.state.topic_id,
                    user_id: this.state.user_id,
                    action: action,
                    action_status: action_status,
                },headers: {'User-Id':user_id()},

            })
            .then((response) => {
            // this.setState({topic:response.data });
            $('.topic_action.'+action+' .tt-text').text(response.data.value);
            this.getInfo(0)
        }) 
    }

    comment_action(e, action, comment_id){
       
        var action_status = 1;
        if($(e.target).hasClass("active")){
            $(e.target).removeClass("active"); 
            action_status = 0;
        }else{
            $(e.target).addClass("active"); 
            action_status = 1;
        }  
        let self = this;
        api.get('forum/comment-actions', {
            params: {
                comment_id: comment_id,
                user_id: this.state.user_id,
                action: action,
                action_status: action_status,
            },headers: {'User-Id':user_id()},

        })
        .then((response) => {
            // this.setState({topic:response.data });
            if(action == 'likes' || action == 'dislikes'){
                $('.commentwid'+comment_id+'.likes .tt-text').text(response.data.comment_data.likes);
                $('.commentwid'+comment_id+'.dislikes .tt-text').text(response.data.comment_data.dislikes);
               var comment_action =  response.data.comment_action ; 
               $('.commentwid'+comment_id+' .material-icons').removeClass("active");
                if(comment_action.likes == 1){
                    $('.commentwid'+comment_id+'.likes .material-icons').addClass("active"); 
                }
                if(comment_action.dislikes == 1){
                    $('.commentwid'+comment_id+'.dislikes .material-icons').addClass("active"); 
                }
                

            }else{
                $('.commentwid'+comment_id+'.'+action+' .tt-text').text(response.data.value);
            }

        
            
           
        }) 
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
            is_subscribed:this.state.addNewUserDetail.is_subscribed
        }
    });
 }
 
   /**
    * On Add & Update Comment Modal Close
    */
   onAddUpdateUserModalClose() {
    this.setState({ addNewUserModal: false })
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

         api.post('forum/add-comment',data,{
            headers: {'User-Id':user_id()}
        }).then((response) => {
            const data =  response.data;
                self.getInfo(0)
                self.get_comments()
                setTimeout(() => {
                  self.setState({ loading: false });
                  NotificationManager.success(<IntlMessages id="note.RepliedSuccessfully"/>);
               }, 2000);       
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
         case 'video_url':
                if(str['add_video'] == 1){
                    if(str[key] == '' || str[key] == null){
                        formIsValid = false;
                        NotificationManager.error(<IntlMessages id="validation.VideoUrlisnotempty"/>);
                    } 
                    if(str[key] !== '' && str[key] != null){
                        if(!str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)){
                        formIsValid = false;
                        NotificationManager.error(<IntlMessages id="validation.VideoUrlShouldBeVimeoOrYoutubeUrl"/>);
                        }
                    }
                }
               
          break;
         default:
           break;
       }
   }
     return formIsValid;
  } 

   
setArrow = (column) => {
    let className = 'zmdi';
    
    if (this.state.sort.column === column) {
     // className += this.state.sort.direction === 'asc' ? ' zmdi-long-arrow-down' : ' zmdi-long-arrow-up';
    }   
 
    return className;
  };

  onSort(num,column){
    var direction = this.state.sort.column ? (this.state.sort.direction === 'desc' ? 'desc' : 'desc') : 'desc';
   
    $('.comment-filtter .tt-badge').removeClass("tt-color02") 
    $('.tt-badge-'+num).addClass("tt-color02");
    //$(e.target).addClass("tt-color02"); 
      
    
  
    const sortedData = this.state.comments.sort((a, b) => {

        // comment-filtter
  
      if( column === 'likes' || column === 'dislikes' || column === 'favourites' ) {
        return a[column] - b[column];
      } else if(column === 'created_at'){
         return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    if( column === 'created_at'){
         direction = this.state.sort.column ? (this.state.sort.direction === 'desc' ? 'desc' : 'desc') : 'desc';
        sortedData.reverse();
     }
    if( column === 'created_at_rev'){
         direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'asc' : 'asc') : 'asc';
        sortedData.reverse();
     }

    
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


/**
* On Delete
*/
onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
 }

/**
* On Pin
*/
onPin(data) {
    this.refs.pinConfirmationDialog.open();
    this.setState({ selectedUser: data });
 }
/**
* On Lock
*/
onLock(data) {
    this.refs.lockConfirmationDialog.open();
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
    api.post('forum/admin-delete-topic', {
       'id': selectedUser.id,
    },{
        headers: {'User-Id':user_id()}
    },).then((response) => {
          
        NotificationManager.success(<IntlMessages id="note.TopicDeleted"/>);
       setTimeout(() => {
        //   self.setState({ loading: false, currentCountries: user, selectedUser: null });
        self.setState({ loading: false, selectedUser: null ,  redirectToTopics : true });
          
       }, 1000);
    })
       .catch(error => {
          // error hanlding
       })
 }

 /**
    * Delete User Permanently
    */
   updateTopicConfig(key,value) {
    const { selectedUser } = this.state;
    this.refs.pinConfirmationDialog.close();
    this.refs.lockConfirmationDialog.close();
    this.setState({ loading: true });
    let self = this;
    api.post('forum/admin-update-config-topic', {
       'id': selectedUser.id,
       'key': key,
       'value': value,
    },{
        headers: {'User-Id':user_id()}
    },).then((response) => {
          
        NotificationManager.success(<IntlMessages id="note.TopicUpdated"/>);
       setTimeout(() => {
        //   self.setState({ loading: false, currentCountries: user, selectedUser: null });
    
        self.setState({ loading: false, selectedUser: null, is_pinned:response.data.data.is_pinned, is_locked:response.data.data.is_locked});
          
       }, 1000);
    })
       .catch(error => {
          // error hanlding
       })
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
 
//  handleScroll = e => {
//     let element = e.target
//    var pageContent =  $('#scrollTop').target;
//    var elmnt = document.getElementById("scrollTop");
//    var y = elmnt.scrollHeight;
//    var x = elmnt.scrollWidth;
//    var scrollTop = elmnt.scrollTop;
//     let scrollHeight = Math.max(
//         document.body.scrollHeight, document.documentElement.scrollHeight,
//         document.body.offsetHeight, document.documentElement.offsetHeight,
//         document.body.clientHeight, document.documentElement.clientHeight
//     );
//     console.log('scrollHeight: ',scrollHeight)
//     console.log('Full document height, with scrolled out part: ',elmnt,y,x,scrollTop)
//    // console.log('Full document height, with scrolled out part: ' + $(document).scrollTop(), $(document).height() )
//     if($(window).scrollTop() + $(window).height() == $(document).height()) {
       
//     }
//     const container = document.querySelector('div')

   
//         var scrollTop =elmnt.scrollTop;
//         if (scrollTop + elmnt.innerHeight >= this.scrollHeight) {
//          // $('#message').text('end reached');
//           console.log(' end reached')
//         } else if (scrollTop <= 0) {
//        //   $('#message').text('Top reached');
//           console.log(' Top reached')
//         } else {
//             console.log('MIDDDD')
//          // $('#message').text('');
//         }
//         /////////////////////////////////////////////////////////////////////
//         console.log('$(this).scrollTop()',$(this).scrollTop())
//         if ($(this).scrollTop() > 100) 
// 		{ console.log('yes')
// 			$('#backToTop').fadeIn();
// 		} 
// 		else 
// 		{ console.log('MIDDDD')
// 			$('.backToTop').fadeOut();
// 		}
//     console.log(' container.scrollTop',  container.scrollTop)
//     console.log(' document.documentElement.clientWidth', document.documentElement.clientWidth)
//     console.log('element.scrollHeight',element.scrollHeight)
//     console.log('element.offsetHeight',element.offsetHeight)
//     console.log('element.clientHeight',element.clientHeight)
//     if (element.scrollHeight - element.scrollTop === element.clientHeight) {
//       // do something at end of scroll
//       console.log('MIDDDD')
//     }
//   }
  
   render() {
    const { topic,topics ,comments,loading , redirectToTopics , maxLikedId ,is_pinned,is_locked} = this.state;

   
      return (
<div>
{ (redirectToTopics === true) &&
            <Redirect to="/app/forum/topics" />
        }  
<main id="tt-pageContent"/* onWheel={this.handleScroll}*/>
    <div className="container forum-details" style={{paddingTop:"0px",width:"90%" }}>
        <div className="tt-single-topic-list">
            <div className="tt-item ">
                 <div className="tt-single-topic">
                    <div className="tt-item-header">
                        <div className="tt-item-info info-top">
                            <div className="tt-avatar-icon">
                                <Link to={{pathname: '/app/forum/user/activity/'+topic.user_id }} >
                                    <div className="media" title={topic.user_full_name}>
                                        {topic.user_photo !== '' && topic.user_photo !== null && topic.user_photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+topic.user_photo} alt={topic.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{topic.user_full_name !== null? topic.user_full_name.charAt(0) :''}</Avatar>
                                        }
                                      
                                    </div>
                                    <span className="tt-avatar-title " >{topic.user_full_name}</span>  
                               </Link>
                                {/* <i className="tt-icon"><svg><use xlink href="#icon-ava-d"></use></svg></i> */}
                            </div>
                            {/* <div className="tt-avatar-title">
                            <Link to={{pathname: '/app/forum/user/activity/'+topic.user_id }} >{topic.user_full_name} </Link>
                            </div> */}
                            <h2 className="tt-item-title text-bold " style={{fontWeight: "500",fontSize: "216%"}}>
                                {topic.is_pinned == 1 &&
                                    <span className="tt-icon ti-pin2 ti-large-size mr-2" style={{fontSize: "14px"}}  ></span>  
                                }
                                {topic.is_locked == 1 &&
                                    <span title="This topic is closed" className=" material-icons mr-2" style={{fontSize: "15px", cursor:"default"}} >lock</span>
                                }
                                <a href="javascript:void(0)" className=" cursor-default " style={{color: "#303344"}}>{topic.title}</a>
                            </h2>
                            <div className="tt-item-tag">
                            <ul className="tt-list-badge">
                            <li> <Link to={{ pathname: '/app/forum/details', state: { forum_id: topic.forum_id }}} className="tt-hidden-mobile tt-badge" style={{backgroundColor: topic.forum_colour}} ><span>{topic.forum_name}</span></Link></li>
                            {/* { topic.tags &&
                                topic.tags.map((tag, key) => (
                                    <li><a href="javascript:void(0)"><span className="tt-badge">{tag.tag_name}</span></a></li>
                                ))}  
                            */}
                            </ul>
                        </div>
                           
                        </div>
                        <a href="javascript:void(0)" className="tt-info-time  cursor-default pull-right" style={{color: "#464d69"}}>
                                <span className="material-icons"  >access_time</span>
                                <span className="tt-text">{getTheDate(convertDateToTimeStamp(topic.created_at ,'YYYY-MM-DD HH:mm' ) , 'D MMMM,YYYY hh:mm A')}</span>
                            </a>
                        
                    </div>
                  
                    <div className="tt-item-description" >
                    
                    { topic.topic_type_id == 1 &&
                            <p dangerouslySetInnerHTML={{__html:topic.description}} />
                    }
                    { topic.topic_type_id == 2 &&
                            <p dangerouslySetInnerHTML={{__html:topic.description}} />
                    }
                    {topic.topic_type_id == 3 &&
                            <div>
                                <strong><IntlMessages id="widgets.questions"/></strong>
                                <p dangerouslySetInnerHTML={{__html:topic.description}} />
                                <strong><IntlMessages id="widgets.answer"/> 1</strong>
                                <p>{topic.ans_1} </p>
                                <strong><IntlMessages id="widgets.answer"/> 2</strong>
                                <p>{topic.ans_2} </p>
                                <strong><IntlMessages id="widgets.answer"/> 3</strong>
                                <p>{topic.ans_3} </p>
                                <strong><IntlMessages id="widgets.answer"/> 4</strong>
                                <p>{topic.ans_4} </p>
                            </div>
                    }
                    {topic.topic_type_id == 4 &&
                        <div>
                            <p dangerouslySetInnerHTML={{__html:topic.description}} />
                            <div className="row">
                                { topic.gallary && topic.gallary.map((gallary, key) => (
                                        
                                        <div className="col-sm-4" title={topic.title}  onClick={(e) => this.imageView(hubCheckPaths('forum_images')+gallary.file_name)}>
                                        {gallary.file_name !== '' &&  gallary.file_name !== null &&  gallary.file_name  !== 'undefined' ?
                                                            <img src={hubCheckPaths('forum_images')+ gallary.file_name } alt={topic.title} className=" m-15 "  />
                                    : ""}
                                    </div>
                                )) }
                            </div>
                        </div>
                    }
                    {topic.topic_type_id == 5 &&
                    <div>
                        <p dangerouslySetInnerHTML={{__html:topic.description}} />
                       
                        {topic.video_url !== null &&
                            <iframe width='500' height='300' src={get_player_url(topic.video_url)} frameborder="0" allowfullscreen></iframe>
                        }
                        
                    </div>
                    }
                    {topic.topic_type_id == 6 &&
                    <div>
                        <p dangerouslySetInnerHTML={{__html:topic.description}} />
                       
                        {topic.website_url !== null &&
                            <a target="blank" href={topic.website_url }>{topic.website_url }</a>
                        }
                        
                    </div>
                    }
                    {/* {   .description} */}
                        {/* <div className="" title={topic.title}>
                                {topic.file !== '' && topic.file !== null && topic.file !== 'undefined' ?
                                    <img src={hubCheckPaths('forum_images')+topic.file} alt={topic.file} className=" mr-15"  />
                                    : ""
                                }
                        </div> */}

                        <div className="comment_files" >
                            {topic.files && topic.files.length > 0 &&
                               <h5 className="ATTACHEMENTS"><IntlMessages id="widgets.ATTACHMENT"/></h5>
                            }
                                <div className="row " >
                                

                                    {topic.files && topic.files.map((value, key) => (
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
                                                   
                                                </div>
                                                
                                            }
                                            {/* <img src={checkPaths('forum_images')+value.file_name} /> */}
                                        </div>
                                    ))}
                                </div>
                            </div>



                    </div>
                    {/* onClick={(e) => this.topic_action(e, 'likes')} */}

                    <div className="tt-item-info info-bottom">
                        <a href="javascript:void(0)" className="tt-icon-btn tt-text-right topic_action likes" onClick={(e) => this.topic_action(e, 'likes')} >
                            {/* <i className="tt-icon"><svg><use xlink href="#icon-like"></use></svg></i> */}
                            <span className={topic.user_likes == 1? "material-icons active": "material-icons"}  >thumb_up</span>
                            <span className="tt-text">{topic.likes}</span>
                        </a>
                        <a href="javascript:void(0)"className="tt-icon-btn tt-text-right topic_action dislikes"  onClick={(e) => this.topic_action(e, 'dislikes')}>
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-dislike"></use></svg></i> */}
                             <span className={topic.user_dislikes == 1? "material-icons active": "material-icons"}  >thumb_down</span>
                            <span className="tt-text">{topic.dislikes}</span>
                        </a>
                        <a href="javascript:void(0)" className="tt-icon-btn tt-text-right topic_action favourites"  onClick={(e) => this.topic_action(e, 'favourites')} >
                             {/* <i className="tt-icon"><svg><use xlink href="#icon-favorite"></use></svg></i> */}
                             <span className={topic.user_favourites == 1? "material-icons active": "material-icons"}  >favorite</span>
                            <span className="tt-text">{topic.favourites}</span>
                        </a>
                        <div className="col-separator"></div>
                        {/* <a href="javascript:void(0)" className="tt-icon-btn tt-hover-02 tt-small-indent">
                        <span className="material-icons"  >share</span>
                         
                        </a>
                        <a href="javascript:void(0)" className="tt-icon-btn tt-hover-02 tt-small-indent">
                        <span className="material-icons"  >flag</span>
                           
                        </a> */}
                          {  is_locked == 0 &&
                                <a href="javascript:void(0)"   onClick={() => this.opnAddNewUserModal(0)}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                                <span className="material-icons"  >reply</span>
                                    
                                </a>
                          }
                        {(is_moderator_can_update(topic.forum_id) || topic.user_id == user_id() )&&
                            <Link to={{pathname: '/app/forum/update-topic/'+topic.id , state: { topic:topic}}}  className="tt-icon-btn tt-hover-02 tt-small-indent">
                                <span className="material-icons"  >edit</span> 
                            </Link>
                         }
                        {(is_moderator_can_update(topic.forum_id) ) && is_pinned == 0 &&
                            <a title="Pin" href="javascript:void(0)" onClick={() => this.onPin(topic)} className="tt-icon-btn tt-hover-02 tt-small-indent" ><span className="ti-pin2 ti-large-size"  ></span></a>
                        }
                        {(is_moderator_can_update(topic.forum_id) )&&  is_pinned == 1 &&
                            <a title="Unpin" href="javascript:void(0)" onClick={() => this.onPin(topic)} className="tt-icon-btn tt-hover-02 tt-small-indent" ><span className="ti-pin-alt ti-large-size" ></span></a>
                        }

                        {(is_moderator_can_update(topic.forum_id) ) && is_locked == 0 &&
                            <a title="Lock" href="javascript:void(0)" onClick={() => this.onLock(topic)} className="tt-icon-btn tt-hover-02 tt-small-indent" ><span className="material-icons"  >lock</span></a>
                        }
                        {(is_moderator_can_update(topic.forum_id) )&& is_locked == 1 &&
                            <a title="Unlock" href="javascript:void(0)" onClick={() => this.onLock(topic)} className="tt-icon-btn tt-hover-02 tt-small-indent" ><span className="material-icons"  >lock_open</span></a>
                        }

                         {(is_moderator_can_update(topic.forum_id) || topic.user_id == user_id()) &&
                            <a href="javascript:void(0)" onClick={() => this.onDelete(topic)} className="tt-icon-btn tt-hover-02 tt-small-indent" ><span className="material-icons"  >delete</span></a>
                         }
                       
   
            
                    </div>
                </div>
            </div>
            <div className="tt-item">
                <div className="tt-info-box">
                    <h6 className="tt-title"><IntlMessages id="widgets.TopicStatus"/></h6> 
                    <div className="tt-row-icon">
                        <div className="tt-item">
                            <a href="javascript:void(0)" className=" cursor-default tt-icon-btn tt-position-bottom">
                                {/* <i className="tt-icon"><svg><use xlink href="#icon-reply"></use></svg></i> */}
                                <span className="material-icons"  >reply</span>
                                <span className="tt-text display-topic-comment-count">{topic.replies}</span>
                            </a>
                        </div>
                        <div className="tt-item">
                            <a href="javascript:void(0)" className=" cursor-default tt-icon-btn tt-position-bottom">
                                
                                <span className="material-icons"  >remove_red_eye</span>
                                <span className="tt-text">{topic.views}</span>
                            </a>
                        </div>
                        <div className="tt-item">
                            <a href="javascript:void(0)" className=" cursor-default tt-icon-btn tt-position-bottom topic_action likes">
                                {/* <i className="tt-icon"><svg><use xlink href="#icon-like"></use></svg></i> */}
                                
                                <span className="material-icons"  >thumb_up</span>
                                <span className="tt-text">{topic.likes}</span>
                            </a>
                        </div>
                        <div className="tt-item">
                            <a href="javascript:void(0)" className=" cursor-default tt-icon-btn tt-position-bottom topic_action dislikes">
                                {/* <i className="tt-icon"><svg><use xlink href="#icon-user"></use></svg></i> */}
                                <span className="material-icons"  >thumb_down</span>
                                <span className="tt-text">{topic.dislikes}</span>
                            </a>
                        </div>
                      
                        <div className="tt-item">
                            <a href="javascript:void(0)" className=" cursor-default tt-icon-btn tt-position-bottom topic_action favourites">
                                {/* <i className="tt-icon"><svg><use xlink href="#icon-favorite"></use></svg></i> */}
                                <span className="material-icons"  >favorite</span>
                                <span className="tt-text">{topic.favourites}</span>
                            </a>
                        </div>
                        {/* <div className="tt-item">
                              <a href="javascript:void(0)" className="tt-icon-btn tt-position-bottom">
                                <span className="material-icons"  >share</span>
                                <span className="tt-text">{topic.share}</span>
                            </a>
                        </div> */}
                    </div> 
                    <div className="hr"></div>
                    <h6 className="tt-title"><IntlMessages id="widgets.FrequentTopicPosters"/></h6>
                    <div className="tt-row-icon">
                       
                       
                        {topic.frequent_users &&  topic.frequent_users.map((user, key) => (
                             <div className="tt-item">
                            <Link className="tt-icon-avatar" to={{pathname: '/app/forum/user/activity/'+user.id }} >
                                    <div className="media" title={user.full_name}>
                                        {user.photo !== '' && user.photo !== null && user.photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+user.photo} alt={user.photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{user.full_name !== null ? user.full_name.charAt(0):''}</Avatar>
                                        }
                                    </div>
                                </Link>
                                </div>
                        ))}

                       
                      
                    </div>
                   
                
                </div>
               
            </div>

            {comments  && comments[0]  &&
                 <div className="tt-item" >
                    <div className="tt-info-box" >
                            <div className=" row-object-inline form-default">
                                <h6 className="tt-title"><IntlMessages id="widgets.SortRepliesBy"/>:</h6>
                                <ul className="tt-list-badge tt-size-lg comment-filtter">
                                    <li className="near-li" ><a href="javascript:void(0)"><span className="tt-badge tt-badge-0  tt-color02" onClick={e => this.onSort(0,'created_at')}> <IntlMessages id="widgets.Recent"/><i className={this.setArrow('created_at')}></i></span></a></li>
                                    <li className="near-li"><a href="javascript:void(0)"><span className="tt-badge tt-badge-1" onClick={e => this.onSort(1,'created_at_rev')}> <IntlMessages id="widgets.Chronological"/><i className={this.setArrow('created_at')}></i></span></a></li>
                                    <li className="near-li"><a href="javascript:void(0)"><span className="tt-badge tt-badge-2" onClick={e => this.onSort(2,'likes')} ><IntlMessages id="widgets.MostLiked"/> <i className={this.setArrow('likes')}></i></span></a></li>
                                    <li className="near-li"><a href="javascript:void(0)"><span className="tt-badge tt-badge-3" onClick={e => this.onSort(3,'dislikes')} ><IntlMessages id="widgets.MostDisliked"/> <i className={this.setArrow('dislikes')}></i></span></a></li>
                                    <li className="near-li"><a href="javascript:void(0)"><span className="tt-badge tt-badge-4" onClick={e => this.onSort(4,'favourites')} > <IntlMessages id="widgets.MostFavorite"/><i className={this.setArrow('favourites')}></i></span></a></li>
                                </ul>
                            
                            </div>
                        </div>
                    </div>
                    }
                  
            {comments && 
                    <Comments comments={comments} is_subscribed={this.state.addNewUserDetail.is_subscribed} maxLikedId = {maxLikedId} is_locked = {is_locked}/>
                }
           
           
          
       

    </div> 
    {  is_locked == 0 &&              
        <div class="row">
            <div class="col-md-8">
                <div class="checkbox-group">
                </div>
            </div>
            <div class="col-md-4">
                <button  onClick={() => this.opnAddNewUserModal(0)} class="btn btn-secondary btn-width-lg"><span><IntlMessages id="button.replyToThisTopic"/></span></button> 
            </div>
        </div>
    }

    </div>
   
</main>
<Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
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

                     <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}><IntlMessages id="button.reply"/></Button>
                    
                  
                  {' '}
                  <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}><IntlMessages id="button.cancel"/></Button>
               </ModalFooter>
            </Modal>
            <DeleteConfirmationDialog
               ref="deleteConfirmationDialog"
               title={<IntlMessages id="components.sureDelete"/>}
               message={<IntlMessages id="components.sureDeleteMessage"/>}
               onConfirm={() => this.deleteUserPermanently()}
            />
            {is_pinned == 0 ?
            <DeleteConfirmationDialog
               ref="pinConfirmationDialog"
               title="Are You Sure Want To Pin?"
               message="This will Pinned."
               onConfirm={() => this.updateTopicConfig('is_pinned',1)}
            />
            :
                <DeleteConfirmationDialog
                ref="pinConfirmationDialog"
                title="Are You Sure Want To Unpin?"
                message="This will Unpinned."
                onConfirm={() => this.updateTopicConfig('is_pinned',0)}
            />
            }
              {is_locked == 0 ?
                <DeleteConfirmationDialog
                    ref="lockConfirmationDialog"
                    title="Are You Sure Want To Lock?"
                    message="This will Locked."
                    onConfirm={() => this.updateTopicConfig('is_locked',1)}
                />
            :
            <DeleteConfirmationDialog
                ref="lockConfirmationDialog"
                title="Are You Sure Want To Unlock?"
                message="This will UnLocked."
                onConfirm={() => this.updateTopicConfig('is_locked',0)}
            />
            }


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
            

            {loading &&
                  <RctPageLoader />
               }

         
        </div>
           );
   }
}
