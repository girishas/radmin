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
export default class UserIdeas extends Component {
  
  
    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            user_id : $(location).attr("href").split('/').pop(),
            ideas : [],
        }

  }
  getInfo(){
    api.get('forum/get_ideas_by_user_id', {
        params: {
          user_id: $(location).attr("href").split('/').pop(),
          session_user_id:user_id()
        },
        headers: {'User-Id':user_id()},

      })
    .then((response) => {
        this.setState({ideas:response.data.ideas });
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
    const { ideas, loading} = this.state;
      return (
         
            <div class="user-container container" >
                <div class="tt-tab-wrapper">
                    <FUTabs/>
               <div class="tab-content">
                    <div class="tab-pane tt-indent-none active" id="tt-tab-01" role="tabpanel">
                    {ideas.length > 0 ?
                    <div class="tt-topic-list">
                    <div class="tt-list-header">
                        <div class="tt-col-value"><IntlMessages id="widgets.user"/></div>   
                        <div class="tt-col-topic"><IntlMessages id="sidebar.ideas"/></div>   
 
                        {/* <div class="tt-col-value-large hide-mobile"><IntlMessages id="widgets.status"/></div> */}
                        <div class="tt-col-value hide-mobile" style={{width:"12.33%"}}><IntlMessages id="label.submitted" /></div>
                     
                    </div>
                    { ideas && ideas.map((activity, key) => (
                        <div class="tt-item p-0">
                            <div class="tt-col-avatar">
                                <Link to={{pathname: '/app/forum/user/activity/'+activity.user_user_id }} >
                                    <div className="media" title={activity.user_full_name}>
                                        {activity.user_photo !== '' && activity.user_photo !== null && activity.user_photo !== 'undefined' ?
                                        <img src={hubCheckPaths('images')+activity.user_photo} alt={activity.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                        : <Avatar className="mr-15">{ activity.user_full_name != null ? activity.user_full_name.charAt(0) : 'P'.charAt(0) }</Avatar>
                                        }
                                    </div>
                                </Link>
                            </div>
                            <div class="tt-col-description " style={activity.comment_desc&& {marginTop:"3%"}}>
                               
                                <h4 class="tt-title" style={{fontSize:"22px"}}>         
                                    <Link to={{ pathname: '/app/ideas/details/'+activity.id,}} className="" >
                                        <b><span>{activity.title}</span></b>
                                    </Link>
                                </h4>
                              
                            </div>
                            {/* <div class="tt-col-category  hide-mobile"> 
                            <Link to={{ pathname: '/app/forum/details', state: { forum_id: activity.forum_id }}} className="tt-color01 tt-badge" style={{backgroundColor: activity.forum_colour ,color:'#fff'}} ><span>{activity.forum_name}</span></Link>
                            </div> */}
                            {/* <div class="tt-col-value-large hide-mobile pl-25">
                               
                                     <i class="tt-icon">
                                     <span className="material-icons"  >{get_icon_by_id(activity.activity_type)}</span>
                                     </i>
                            
                            </div> */}
                            <div class="tt-col-category tt-col-value pl-0 pr-0 hide-mobile"> {timeAgo(activity.created_at)}</div>
      
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

