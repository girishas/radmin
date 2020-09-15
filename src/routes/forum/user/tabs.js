/**
 * Tables Routes
 */
import React, { Component } from 'react';


import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";
// intlmessages
import IntlMessages from 'Util/IntlMessages';
// async components
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import { match } from 'minimatch';
// async components
import { user_id} from "Helpers/helpers";
import $ from 'jquery';
import UserHead from './userHead';

const SomeComponent = withRouter(props => <FUTabs {...props}/>);

export default class FUTabs extends Component {
  constructor(props) {
        super(props);
         
  }
  state = {
    session_user_id:0
}
  changeActive(self,classname){
    $('.nav-link-custom').removeClass('active');
    $('.'+classname).addClass('active');
//    alert(this.props.location.pathname)
//     console.log(this.props.location.pathname);
  }
 
  
componentDidMount(){
  const userDetails = window.localStorage.getItem('user_id');
  if(userDetails){
      const authUser = JSON.parse(userDetails);
      this.setState({ session_user_id:authUser.id });
      
  }
}

   render() {
    
    const  currentPathArray  =  $(location).attr("href").split('/');
    const  currentPath  =  currentPathArray[currentPathArray.length - 2];
    const  user_id  =  currentPathArray[currentPathArray.length - 1];
    const  session_user_id  = this.state.session_user_id;
    
    // parts = pageURL.split("/");
    // last_part = parts[parts.length-2];

      return (
        
      

        
        <div>
            {user_id != session_user_id &&
          <div>
        <UserHead user_id ={user_id} />
          <div class="tt-wrapper-inner" style={{marginRight:'0px'}}>
            <ul class="nav nav-tabs pt-tabs-default nav1" role="tablist">
                <li class="nav-item ">
                    <Link className={currentPath == 'activity'? 'nav-link-custom active':'nav-link-custom ' } role="tab" to={{ pathname: '/app/forum/user/activity/'+user_id}}><IntlMessages id="widgets.activity"/></Link>
                 
                </li>
                <li class="nav-item">
 
                <Link className={(currentPath == 'topics')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/topics/'+user_id}}><IntlMessages id="widgets.topics"/></Link>
                  
                </li>
                <li class="nav-item">
                <Link  className={(currentPath == 'replies')? 'nav-link-custom active':'nav-link-custom' }  role="tab" to={{ pathname: '/app/forum/user/replies/'+user_id}}><IntlMessages id="widgets.replies"/></Link>
                
                </li>
                <li class="nav-item">
                <Link  className={(currentPath == 'ideas')? 'nav-link-custom active':'nav-link-custom' }  role="tab" to={{ pathname: '/app/forum/user/ideas/'+user_id}}><IntlMessages id="sidebar.ideas"/></Link>
                
                </li>
                {/* <li class="nav-item tt-hide-xs">
                <Link  className={(currentPath == 'followers')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/followers/'+user_id}}><l id='followers_count'> </l> <IntlMessages id="widgets.Followers"/></Link>
                 
                </li>
                <li class="nav-item tt-hide-md">
                <Link  className={(currentPath == 'following')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/following/'+user_id}}><l id='following_count'> </l> <IntlMessages id="widgets.following"/></Link>
                   
                </li> */}
                {/* <li class="nav-item tt-hide-md">
                <Link  className={(currentPath == 'forums')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/forums/'+user_id}}><IntlMessages id="sidebar.forums"/></Link>
                  
                </li> */}
            </ul>
            <ul class="nav nav-tabs pt-tabs-default nav2" role="tablist" >
            <li class="nav-item tt-hide-xs">
                <Link  className={(currentPath == 'followers')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/followers/'+user_id}}><l id='followers_count'> </l> <IntlMessages id="widgets.Followers"/></Link>
                 
                </li>
                <li class="nav-item tt-hide-md">
                <Link  className={(currentPath == 'following')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/following/'+user_id}}><l id='following_count'> </l> <IntlMessages id="widgets.following"/></Link>
                   
                </li>
                </ul>
        </div>
        
        </div>
            }
          </div>
         
    );
   }
}

