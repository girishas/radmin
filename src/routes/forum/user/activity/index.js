/**
 * Tables Routes
 */
import React, { Component } from 'react';


import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";
// intlmessages
import IntlMessages from 'Util/IntlMessages';
// async components
import FUTabs from '../tabs.js';
// async components
import { user_id, get_icon_by_id, timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import Avatar from '@material-ui/core/Avatar';
import api from 'Api';
import { Link } from 'react-router-dom';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { NotificationManager } from 'react-notifications';
export default class UserActivity extends Component {
  
  
    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            user_id :    $(location).attr("href").split('/').pop(),
            activities : [],
        }

  }
  getInfo(){
    api.get('forum/get-user-activities', {
        params: {
          id: $(location).attr("href").split('/').pop(),
          session_user_id:user_id()
        },
        headers: {'User-Id':user_id()},

      })
    .then((response) => {
        this.setState({activities:response.data });
        console.log(response.data )
    }) 
  }
  componentDidMount() {
    this.getInfo()
} 

   //for change props only url is same
   componentWillReceiveProps(newProps){
    this.props = newProps;
    this.getInfo();
 } 

   render() {
    const { activities, loading} = this.state;
      return (
         
            <div class="user-container container" >
                <div class="tt-tab-wrapper">
                    <FUTabs/>
               <div class="tab-content">
                    <div class="tab-pane tt-indent-none active" id="tt-tab-01" role="tabpanel">
                    {activities.length > 0 ?
                   <div class="tt-topic-list">
                        <div class="tt-list-header">
                            <div class="tt-col-value"><IntlMessages id="widgets.user"/></div>   
                            <div class="tt-col-topic"><IntlMessages id="widgets.topic"/></div>   
                            <div class="tt-col-value hide-mobile test-center" style={{width: "10.33%"}}><IntlMessages id="sidebar.Forum"/></div>
                            <div class="tt-col-value-large hide-mobile"><IntlMessages id="widgets.status"/></div>
                            <div class="tt-col-value-large hide-mobile"><IntlMessages id="widgets.activity"/></div>
                        </div>
                    { activities && activities.map((activity, key) => (
                        <div class="tt-item p-0">
                            <div class="tt-col-avatar">
                            {activity.is_idea == 0 ?
                                <Link to={{pathname: '/app/forum/user/activity/'+activity.user_user_id }} >
                                    <div className="media" title={activity.user_full_name}>
                                        {activity.user_photo !== '' && activity.user_photo !== null && activity.user_photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+activity.user_photo} alt={activity.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{ activity.user_full_name != null ? activity.user_full_name.charAt(0) : 'P'.charAt(0) }</Avatar>
                                        }
                                    </div>
                                </Link>
                                :
                                <Link to={{pathname: '/app/forum/user/activity/'+activity.idea_user_id }} >
                                    <div className="media" title={activity.idea_user_full_name}>
                                        {activity.idea_user_photo !== '' && activity.idea_user_photo !== null && activity.idea_user_photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+activity.idea_user_photo} alt={activity.idea_user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{ activity.idea_user_full_name != null ? activity.idea_user_full_name.charAt(0) : 'P'.charAt(0) }</Avatar>
                                        }
                                    </div>
                                </Link>
                            }
                            </div>
                            <div class="tt-col-description " style={activity.comment_desc&& {marginTop:"3%"}}>
                               {activity.is_idea == 0 ?
                               <div>
                                    <h4 class="tt-title" style={{fontSize:"22px"}}>         
                                        <Link to={{ pathname: '/app/forum/topic-details/'+activity.topic_id,}} className="" >
                                            <b><span>{activity.title}</span></b>
                                        </Link>
                                    </h4>
                                    {activity.comment_desc &&
                                        <div class="tt-col-message" style={{marginLeft:"0px"}}>
                                            <p dangerouslySetInnerHTML={{__html:textTruncate(activity.comment_desc)}} />
                                        </div>
                                    }
                                </div>
                                :
                                <div>
                                    <h4 class="tt-title" style={{fontSize:"22px"}}>         
                                        <Link to={{ pathname: '/app/ideas/details/'+activity.topic_id,}} className="" >
                                            <b><span>{activity.idea_title}</span></b>
                                        </Link>
                                    </h4>
                                  
                                    {activity.idea_comment_desc &&
                                        <div class="tt-col-message" style={{marginLeft:"0px"}}>
                                            <p dangerouslySetInnerHTML={{__html:textTruncate(activity.idea_comment_desc)}} />
                                        </div>
                                    }
                                </div>
                                }
                                
                                <div class="row align-items-center no-gutters hide-desktope">
                                    <div class="col-9">
                                        <ul class="tt-list-badge">
                                            <li class="show-mobile">
                                            <Link to={{ pathname: '/app/forum/details', state: { forum_id: activity.forum_id }}} className=" tt-color01 tt-badge" style={{backgroundColor: activity.forum_colour  ,color:'#fff'}} ><span>{activity.forum_name}</span></Link>
                                            </li>
                                        </ul>
                                     
                                        
                                     <i class="tt-icon ">
                                     <span className="material-icons"  >{get_icon_by_id(activity.activity_type)}</span>
                                     </i>
                                    </div>
                                    <div class="col-3 ml-auto show-mobile">
                                       <div class="tt-value"> {getTheDate(convertDateToTimeStamp(activity.created_at) , 'D MMMM,YYYY')}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="tt-col-category  hide-mobile"> 
                            {activity.is_idea == 0 ?
                            <Link to={{ pathname: '/app/forum/details', state: { forum_id: activity.forum_id }}} className="tt-color01 tt-badge" style={{backgroundColor: activity.forum_colour ,color:'#fff'}} ><span>{activity.forum_name}</span></Link>
                           :
                            <span  className="tt-color01 tt-badge" style={{color:'#fff'}} ><span>{activity.idea_subject_name}</span></span>
                            }
                            </div>
                            <div class="tt-col-value-large hide-mobile pl-25">
                                     <i class="tt-icon">
                                     <span className="material-icons"  >{get_icon_by_id(activity.activity_type)}</span>
                                     </i>
                            </div>
                            <div class="tt-col-category tt-col-value-large pl-0 pr-0 hide-mobile"> {timeAgo(activity.created_at)}</div>
                        </div>
                      )) }

                    </div>
                    :
                    <div class="tt-topic-list">
                       <center> <IntlMessages id="widgets.NoActivityFound"/> </center>   
                    </div>
                    }
                </div>

         </div>
         
                </div>
            </div>
    
           );
   }
}

