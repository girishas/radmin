/**
 * Forced Scroll Buttons
 */
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Badge,
   Button
} from 'reactstrap';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
// async components
import { is_moderator} from "Helpers/helpers";
// rct card box
// import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// import Profile from './profile';
// import Category from './category';
// import Website from './website';
// import Home from './home/index';
// import Schedule from './schedule';
// import Setting from './setting';
// api
import api from 'Api';
//toggle btn
import Avatar from '@material-ui/core/Avatar';
// async components
import { hubCheckPaths} from "Helpers/helpers";


class FHeader extends Component {

    state = {
        user_details:[]
    }

componentDidMount(){
    const userDetails = window.localStorage.getItem('user_id');
    if(userDetails){
        const authUser = JSON.parse(userDetails);
        this.setState({ user_details: authUser,user_id:authUser.id });
        
    }
}
	// When the user clicks on the button, scroll to the top of the document
    topFunction() {
		//	$("div").scrollTop(0);
		$('div').animate({scrollTop:0}, 'slow');
	  return false;
	}

    render() {
        const  currentPathArray  =  $(location).attr("href").split('/');
        var  currentPath1  =  currentPathArray[currentPathArray.length - 2];
        const  path_user_id  =  currentPathArray[currentPathArray.length - 1];
        const{user_details ,user_id}= this.state;

        const currentPath = (user_details.id == path_user_id)? currentPath1 :'';

        const forumCurrentPath = path_user_id
        return (
           
            <header id="tt-header" style={{background:"#e4e4e4"}} >
           
            <div className="background-white  container" style={{padding:0 ,width:"88%"}}>
                <div className="row tt-row no-gutters">
                    <div className="col-auto" style={{width:'100%'}}>
                       
                        <a className="toggle-mobile-menu" href="javascript:void(0)" >
                            <svg className="tt-icon">
                            Menu
                              {/* <use xlink:href="#icon-menu_icon"></use> */}
                            </svg>
                        </a>
                        
                                <div className="side-1" style={{width: "40%" ,marginLeft:"17px"}}>
                                    <div className="tt-desktop-menu">
                                        <nav>
                                            <ul>
                                                <li><Link to={{ pathname: '/app/forum/topics'}}   ><img src={require('Assets/img/chameleon_forum.png')} style={{marginTop: "10px" }} className="img-fluid" alt="site-logo" width="60" height="80" /></Link></li> 
                                                <li><Link to={{ pathname: '/app/forum/forums'}} className={forumCurrentPath == 'forums'? 'nav-link-custom active':'' } ><span>Forums</span></Link></li>
                                                <li><Link to={{ pathname: '/app/forum/topics'}} className={forumCurrentPath == 'topics'? 'nav-link-custom active':'' }  ><span>Topics</span></Link></li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                  <div className="side-2" style={{width: "46%" }} >
                                  <div className="tt-desktop-menu">
                                        <nav>
                                  <ul>
                                  
                                  
                                    <li className="ml-137 mt-10" >

                                    <div className="tt-icon">
                     
                                        {user_details.photo ?
                                                <img src={hubCheckPaths('images')+user_details.photo} alt={user_details.photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                            : <Avatar className="mr-15">{  user_details.full_name ? user_details.full_name.charAt(0) :'U'.charAt(0)}</Avatar>
                                            }
                                        
                                        </div>
                                        </li>  <li class="nav-item ">
                                        <Link className={currentPath == 'activity'? 'nav-link-custom active':'nav-link-custom ' } role="tab" to={{ pathname: '/app/forum/user/activity/'+user_id}}><IntlMessages id="widgets.activity"/></Link>
                                    
                                    </li>
                                    <li class="nav-item">
                    
                                    <Link className={(currentPath == 'topics')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/topics/'+user_id}}><IntlMessages id="widgets.topics"/></Link>
                                    
                                    </li>
                                    <li class="nav-item">
                                    <Link  className={(currentPath == 'replies')? 'nav-link-custom active':'nav-link-custom' }  role="tab" to={{ pathname: '/app/forum/user/replies/'+user_id}}><IntlMessages id="widgets.replies"/></Link>
                                    
                                    </li>
                                    <li class="nav-item tt-hide-xs">
                                    <Link  className={(currentPath == 'followers')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/followers/'+user_id}}><IntlMessages id="widgets.Followers"/></Link>
                                    
                                    </li>
                                    <li class="nav-item tt-hide-md">
                                    <Link  className={(currentPath == 'following')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/following/'+user_id}}><IntlMessages id="widgets.following"/></Link>
                                    
                                    </li>
                                    {/* <li class="nav-item tt-hide-md">
                                    <Link  className={(currentPath == 'forums')? 'nav-link-custom active':'nav-link-custom' } role="tab" to={{ pathname: '/app/forum/user/forums/'+user_id}}><IntlMessages id="sidebar.forums"/></Link>
                                    
                                    </li> */}
                                </ul>
                                </nav>
                                </div>
                                </div>
                               
                                 
 

                   
                    {/* {is_moderator() && */}
                <Link className="tt-btn-create-topic" to={{ pathname: '/app/forum/add-topic'}} title="Add topic">
                            
                    <span className="tt-icon">
                    <Button color={"primary"} className="btn-block  btn btn-secondary mr-2" style={{background: "#2172cd" }}><IntlMessages id="widgets.AddATopic"/></Button>
                        {/* <span className="material-icons" style={{fontSize:'50px'}} >add_circle</span> */}
                        
                    </span>

                </Link>
                    {/* } */}
                    </div>
                    {/* <div className="col-auto ml-auto">
                        <div className="tt-account-btn">
                            <a href="http://azyrusthemes.com/forum2019/demo/page-login.html" className="btn btn-primary">Log in</a>
                            <a href="http://azyrusthemes.com/forum2019/demo/page-signup.html" className="btn btn-secondary">Sign up</a>
                        </div>
                    </div> */}
           
                </div>

            </div>
  
            <button id="myBtn" title='Back to top' className='scroll' 
				onClick={ () => { this.topFunction(); }}>
			 	<span className='arrow-up material-icons'>arrow_upward</span>
		   </button>
        </header>
   
        );
    }
}

export default FHeader;
