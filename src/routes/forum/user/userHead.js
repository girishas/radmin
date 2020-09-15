/**
 * Tables Routes
 */
import React, { Component } from 'react';


import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Tooltip from '@material-ui/core/Tooltip';
import {IntlProvider} from "react-intl";
// intlmessages
import IntlMessages from 'Util/IntlMessages';
// async components
import { user_id,get_user_level, timeAgo, textTruncate, checkPath, checkPaths , hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import Avatar from '@material-ui/core/Avatar';
import api from 'Api';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { NotificationManager } from 'react-notifications';
// components
import AnchorPopover from './components/AnchorPopover';

export default class UserHead extends Component {
  
  constructor(props) {
 
        super(props);
        this.state = {
            loading: false,
           // user_id : this.props.location.state ? this.props.location.state.user_id : 1,
            user_id :    $(location).attr("href").split('/').pop(),
            user_details : [],
            isSound:false,
            props_user_id:this.props.user_id
          
        }

  }
  getInfo(){
    let self = this;
    api.get('forum/get-user-details', {
        params: {
          id: $(location).attr("href").split('/').pop(),
          session_user_id:user_id()
        },
        headers: {'User-Id':user_id()},

      })
    .then((response) => {
        this.setState({user_details:response.data });
        var  created_badge_array  = response.data.created_badge_array
        
        created_badge_array.map((headers, key) => {
            self.setState({ isSound: true});
            //var newaa = <IntlMessages id={headers} />+"headers has been assign to you.";
            var newaa = headers;
            //newaa =  <IntlProvider locale={'en'} messages={headers}/>
            NotificationManager.success(newaa);
        })
    



        if(response.data.followers_count > 0){
            $('#followers_count').text(response.data.followers_count)
        }
        if(response.data.following_count > 0){
            $('#following_count').text(response.data.following_count)
       
        }
    }) 
  }

    componentDidMount() {
        //this.getInfo();
    } 
    // static  getDerivedStateFromProps (newProps,oldPorps){
    //     console.log('newProps1',newProps)
    //     console.log('oldPorps1',oldPorps)
    // }

    // componentDidUpdate(prevProps, prevState, snapshot){
    //     console.log('prevProps',prevProps);
    //     console.log('prevState',prevState);
    //     console.log('snapshot',snapshot);
        
    // }
   //for change props only url is same
   componentWillReceiveProps(newProps,oldPorps){
   
    // if (newProps.user_id !== this.state.props_user_id) {
       // this.setState({ props_user_id:newProps.user_id });
       // this.props = newProps;
        this.getInfo();
      //}
      
      
 } 
//action follow
follow_action(e, action){
    this.setState({ loading: true });
    var action_status = 1;
    if($('.follow-btn').hasClass("following")){
        $('.follow-btn').removeClass("following"); 
        action_status = 0;
    }else{
        $('.follow-btn').addClass("following"); 
        action_status = 1;
    }  

    self = this
    api.get('forum/follow-actions', {
        params: {
            follow_to: this.state.user_id,
            follow_from: user_id(),
            status: action_status,
        }
    })
    .then((response) => {
        // this.setState({topic:response.data });
        console.log('action_status', action_status)
        if(action_status == 1){
            $('.follow-btn').html("<span>Following</span>")
            self.setState({ loading: false });
            NotificationManager.success(<IntlMessages id="note.FollowingSuccessfully"/>);
        }else{
            $('.follow-btn').html("<span>Follow</span>")
            self.setState({ loading: false });
            NotificationManager.success(<IntlMessages id="note.UnfollowSuccessfully"/>);
        }
    }) 
}
  
   render() {
 
    const { user_details, loading,isSound} = this.state;
    
      return (
         <div id="tt-pageContent">
     {isSound &&
				<audio ref="audio_tag" src={AppConfig.chameleon_web_url+"public/audio/notification.mp3"}  autoPlay/> 
				}
        <div className="tt-wrapper-section">
        <div className="container user-head-section">
       
            <div className="tt-user-header">
           
                <div className="tt-col-avatar" style={{paddingLeft:'0px'}}>
                    <div className="tt-icon" style={{ marginTop:"-40%"}}>
                    
                       {user_details.photo ?
                            <img src={hubCheckPaths('images')+user_details.photo} alt={user_details.photo} className="full-rounded-circle mr-15" width="60" height="60" />
                        : <Avatar className="mr-15">{  user_details.user_full_name? user_details.user_full_name.charAt(0) :'U'.charAt(0)}</Avatar>
                        }
                     
                    </div>
                </div>
                <div className="tt-col-title" style={{ marginTop:"-1%"}}>
                    <div className="tt-title">
                        <a href="javascript:void(0)">{user_details.full_name}</a>
                        <span className={"tt-badge cursor-default ml-15 tt-color"+get_user_level(user_details.points)}>Level: {get_user_level(user_details.points)}</span>
                    </div>
                     <ul className="tt-list-badge">
                     <div className="tt-icon">
                 
                    {user_details.badges &&   user_details.badges.map((badge, key) => (
                          <Tooltip id="tooltip-icon" title={<IntlMessages id={badge.name}/>} onClick={this.handleClickButton} >
                                <img src={hubCheckPaths('forum_images')+badge.icon} alt={badge.icon}  className="rounded-circle mr-15" width="50" height="50" />
                        </Tooltip>

                //     <Tooltip id="tooltip-icon" title={<IntlMessages id={badge.name}/>} onClick={this.handleClickButton} >
                //            <img src={hubCheckPaths('images')+user_details.photo} alt={badge.icon}  className="rounded-circle mr-15" width="50" height="50" />
                //    </Tooltip>

                   ))}
                  
                     
                  
                 </div>
                    </ul> 
                </div>
                <div className="tt-col-btn" id="js-settings-btn">
                    <div className="tt-list-btn">
                    
                        {(user_details.id && user_details.id != user_id()) &&
                            <a href="javascript:void(0)" onClick={(e) => this.follow_action(e)}  
                            className={user_details.follow_status == 1 ? "btn btn-secondary mt-0 follow-btn  following":'btn btn-secondary mt-0 follow-btn '}><span>{user_details.follow_status == 1 ? 'Following':'Follow'}</span></a>
                        }
                    
                    </div>
                </div>
           
            </div>
            
        </div>
    </div>
     
    {/* tabs start */}
    {loading &&
                  <RctSectionLoader />
               }

         </div>
           );
   }
}

