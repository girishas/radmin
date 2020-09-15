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
import { user_id, timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import Avatar from '@material-ui/core/Avatar';
import api from 'Api';
import { Link } from 'react-router-dom';
export default class UserReplies extends Component {
  
  constructor(props) {
 
        super(props);
        this.state = {
            loading: false,
            user_id :    $(location).attr("href").split('/').pop(),
            comments : [],
        }

  }
  componentDidMount() {
    api.get('forum/get-user-comments', {
        params: {
          id: this.state.user_id,
          
        },
        headers: {'User-Id':user_id()},

      })
    .then((response) => {
        this.setState({comments:response.data.comments });
        console.log(response.data )
    }) 
} 
   render() {
    const { comments, loading} = this.state;
      return (
         <div>
            
            <div class="user-container container">
               <div class="tt-tab-wrapper">
                  <FUTabs/>
                  {comments.length > 0  ?
                  <div class="tab-content">
                  <div class="tab-pane tt-indent-none active" id="tt-tab-03" role="tabpanel">
                     <div class="tt-topic-list">
                        <div class="tt-list-header">
                            <div className="tt-col-value"><IntlMessages id="widgets.user"/></div>
                            <div class="tt-col-topic"><IntlMessages id="widgets.topic"/></div>
                            <div class="tt-col-category"><IntlMessages id="widgets.category"/></div>
                            <div class="tt-col-category"><IntlMessages id="widgets.activity"/></div>
                        </div>

                        {comments && comments.map((comment, key) => (
                            <div class="tt-item">
                                <div class="tt-col-avatar">
                                <Link to={{pathname: '/app/forum/user/activity/'+comment.user_id }} >
                                        <div className="media" title={comment.user_full_name}>
                                            {comment.user_photo !== '' && comment.user_photo !== null && comment.user_photo !== 'undefined' ?
                                            <img src={hubCheckPaths('images')+comment.user_photo} alt={comment.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                            : <Avatar className="mr-15">{'A'.charAt(0)}</Avatar>
                                            }
                                        </div>
                                        </Link>
                                </div>
                                <div class="tt-col-description" style={{textAlign:"center"}}>
                                    <h6 class="tt-title"><a href="javascript:void(0)">
                                    <Link to={{ pathname: '/app/forum/topic-details/'+comment.topic_id,}} className="" >
                                        <span>{comment.title}</span>
                                    </Link>
                                    </a></h6>
                                    <div class="row align-items-center no-gutters hide-desktope">
                                        <div class="col-9">
                                            <ul class="tt-list-badge">
                                                <li class="show-mobile"><Link to={{ pathname: '/app/forum/details', state: { forum_id: comment.forum_id }}} 
                                        className=" tt-badge" style={{backgroundColor: comment.forum_colour ,color:'#fff'}} >
                                <span>{comment.forum_name}</span></Link></li>
                                            </ul>
                                        </div>
                                        <div class="col-3 ml-auto show-mobile">
                                            <div class="tt-value">{getTheDate(convertDateToTimeStamp(comment.created_at) , 'D MMMM,YYYY')}</div>
                                        </div>
                                    </div>
                                    <div class="tt-content">
                                        
                                        <p dangerouslySetInnerHTML={{__html:textTruncate(comment.description)}} />
                                    </div>
                                </div>
                                <div class="tt-col-category"><Link to={{ pathname: '/app/forum/details', state: { forum_id: comment.forum_id }}} 
                                        className="tt-color15 tt-badge" style={{backgroundColor: comment.forum_colour ,color:'#fff'}} >
                                <span>{comment.forum_name}</span></Link></div>
                                <div class="tt-col-category hide-mobile">{getTheDate(convertDateToTimeStamp(comment.created_at) , 'D MMMM,YYYY')}</div>
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

