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

import { user_id, timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import Avatar from '@material-ui/core/Avatar';
import api from 'Api';
import { Link } from 'react-router-dom';

export default class UserThreads extends Component {
  
  constructor(props) {
 
        super(props);
        this.state = {
            user_id :  $(location).attr("href").split('/').pop(),
            user_details : [],
            topics:[],
        }
  }
  componentDidMount() {
    console.log('this.props.location.state',this.props)
    api.get('forum/get-all-topics', {
        params: {
            user_id: this.state.user_id,
        },
        headers: {'User-Id':user_id()},

      })
        .then((response) => {
            this.setState({topics:response.data.topics  });
    }) 
  
} 
  
   render() {
    const {  topics} = this.state;
      return (
         <div id="">
            <div class="user-container container">
               <div class="tt-tab-wrapper">
                  <FUTabs/>
                  {topics.length > 0  ?
                  <div class="tab-content">
                  <div class="tab-pane tt-indent-none active" id="tt-tab-02" role="tabpanel">
                  <div className="tt-topic-list">
                    <div className="tt-list-header">
                        <div className="tt-col-value"><IntlMessages id="widgets.user"/></div>
                        <div className="tt-col-topic"><IntlMessages id="widgets.topic"/></div>
                        <div className="tt-col-category" style={{textAlign:"initial"}}><IntlMessages id="sidebar.Forum"/></div>
                        <div className="tt-col-category"><IntlMessages id="widgets.category"/></div>
                        <div className="tt-col-category"><IntlMessages id="sidebar.type"/></div>
                        <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.likes"/></div>
                        <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.replies"/></div>
                        <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.views"/></div>
                        <div className="tt-col-category"><IntlMessages id="widgets.activity"/></div>
                    </div>
            {/* <div className="tt-topic-alert tt-alert-default" role="alert">
              <a href="javascript:void(0)" target="_blank">4 new posts</a> are added recently, click here to load them.
            </div> */}
            
            
            { topics && topics.map((topic, key) => (
            // <div className="tt-item tt-itemselect">
             <div className="tt-item">
                <div className="tt-col-avatar">
                <Link to={{pathname: '/app/forum/user/activity/'+topic.user_id }} >
                    <div className="media" title={topic.user_full_name}>
                        {topic.user_photo !== '' && topic.user_photo !== null && topic.user_photo !== 'undefined' ?
                        <img src={hubCheckPaths('images')+topic.user_photo} alt={topic.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                        : <Avatar className="mr-15">{topic.user_full_name.charAt(0)}</Avatar>
                        }
                    </div>
                    </Link>
                </div>
                <div className="tt-col-description" style={{textAlign:"center"}}>
                    <h6 className="tt-title">
                   
                    <Link to={{ pathname: '/app/forum/topic-details/'+topic.id,}} className="" >
                         
                            <span>{topic.title}</span>
                        </Link>
                       
                    </h6>
                    <div className="" style={{textAlign:"center"}}>
                        <div className="">
                            <ul className="tt-list-badge" style={{textAlign:"center"}}>
                           <li> <Link to={{ pathname: '/app/forum/details', state: { forum_id: topic.forum_id }}} className="show-mobile tt-color01 tt-badge" style={{backgroundColor: topic.forum_colour  ,color:'#fff'}} ><span>{topic.forum_name}</span></Link></li>
                            {
                                topic.tags.map((tag, key) => (
                                    <li><Link to={{ pathname: '/app/forum/topics' , state: { tag_id: tag.tag_id }}}><span className="tt-badge">{tag.tag_name}</span></Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-1 ml-auto show-mobile">
                            <div className="tt-value">{timeAgo(topic.activity)}</div>
                        </div>
                    </div>
                </div>
                <div className="tt-col-category" style={{backgroundColor: topic.forum_colour,padding: "10px 0 10px 0",borderRadius: "5px"}}><Link to={{ pathname: '/app/forum/details'}} className="tt-color01 tt-badge" style={{backgroundColor: "unset", color:'#fff',whiteSpace:"unset"}} ><span>{topic.forum_name}</span></Link></div>
                <div className="tt-col-category"><span>{topic.category_name}</span></div>
                <div className="tt-col-category">
                
                <span><span  title={topic.topic_type_name} className="material-icons"  >{topic.topic_type_icon}</span></span></div>
{/*                 
                <div className="tt-col-category"><span className="tt-color01 tt-badge">{topic.category_name}</span></div> */}
                <div className="tt-col-value hide-mobile">{topic.likes}</div>
                <div className="tt-col-value tt-color-select hide-mobile">{topic.replies}</div>
                <div className="tt-col-value hide-mobile">{topic.views}</div>
                <div className="tt-col-category hide-mobile">{timeAgo(topic.activity)}</div>
            </div>
               )) }
           
           
        </div>
   
                  </div>

                  </div>
                  : 
                  <div class="tt-topic-list">
                  <center> <IntlMessages id="widgets.NoRecordFound"/> </center>   
               </div> 
            }
               </div>
            </div>
         </div>
           );
   }
}

