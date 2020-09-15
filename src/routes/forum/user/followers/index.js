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
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { NotificationManager } from 'react-notifications';
export default class UserFollowers extends Component {
  
  constructor(props) {

        super(props);
        this.state = {
            loading: false,
            user_id :    $(location).attr("href").split('/').pop(),
            users : [],
        }

  }
  componentDidMount() {
    api.get('forum/get-user-followers', {
        params: {
          id: this.state.user_id,
          session_user_id:user_id()
        },
        headers: {'User-Id':user_id()},

      })
    .then((response) => {
        this.setState({users:response.data });
        console.log(response.data )
    }) 
} 
   render() {
    const { users, loading} = this.state;
      return (
         <div>
            <div className="user-container container">
               <div className="tt-tab-wrapper">
                  <FUTabs/>
                  {users.length > 0 ?
                  <div className="tab-content">
                  <div className="tab-pane tt-indent-none active" id="tt-tab-04" role="tabpanel">
                    <div className="tt-followers-list">
                        <div className="tt-list-header">
                            <div className="tt-col-name"><IntlMessages id="widgets.user"/></div>
                            <div className="tt-col-value-large hide-mobile"><IntlMessages id="widgets.FollowDate"/></div>
                            <div className="tt-col-value-large hide-mobile"><IntlMessages id="widgets.LastActivity"/></div>
                            <div className="tt-col-value-large hide-mobile"><IntlMessages id="widgets.topics"/></div>
                            <div className="tt-col-value-large hide-mobile"><IntlMessages id="widgets.replies"/></div>
                           
                        </div>
                        { users && users.map((user, key) => (
                            <div className="tt-item">
                                <div className="tt-col-merged">
                                    <div className="tt-col-avatar">
                                    <Link to={{pathname: '/app/forum/user/activity/'+user.id }} >
                                        <div className="media" title={user.full_name}>
                                            {user.photo !== '' && user.photo !== null && user.photo !== 'undefined' ?
                                            <img src={hubCheckPaths('images')+user.photo} alt={user.photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                            : <Avatar className="mr-15">{user.full_name.charAt(0)}</Avatar>
                                            }
                                        </div>
                                        </Link>
                                    </div>
                                    <div className="tt-col-description">
                                        <h6 className="tt-title"><a href="javascript:void(0)">{user.full_name}</a></h6>
                                        <ul>
                                            {/* <li><a href="mailto:@tails23">{user.email}</a></li> */}
                                        </ul>
                                    </div>
                                </div>
                                <div className="tt-col-value-large hide-mobile"> {getTheDate(convertDateToTimeStamp(user.follow_date) , 'D MMMM,YYYY')}</div>
                                <div className="tt-col-value-large hide-mobile tt-color-select">{timeAgo(user.last_activity)}</div>
                                <div className="tt-col-value-large hide-mobile">{user.topics_count}</div>
                                <div className="tt-col-value-large hide-mobile">{user.comments_count}</div>
                              
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

