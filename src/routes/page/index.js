/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import Iframe from 'react-iframe'
import { Form, FormGroup, Label, Input,FormText, Col ,Footer } from 'reactstrap';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';


import AppConfig from 'Constants/AppConfig';

// import stylecss from './style.css';
import Slim from 'Components/Slim/slim.react';

// api
import api from 'Api';

//=======================
import $ from 'jquery';
// import 'Assets/page-assets/bundle.js.download';
//import 'Assets/page-assets/js/jquery.js';
//require('Assets/page-assets/js/jquery.js');



export default class Page extends Component {


   constructor(props) {
 
      super(props);
      
      this.state = {
        loading: false,
        categories:[],
      }
   }

   addNewUser(e) {
   
     // var formData = new FormData($('#formId'))
          var form_data = $("#formId").serialize();
      /// var form_data = new FormData(e);
                   
      var FormData = new FormData($(form_data)[0]);
           console.log(form_data);
           console.log(FormData);
    
        
            let self = this;
            this.setState({ loading: true });
          
              const config = {
                headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                data: {form_data},
              };
              
            api.post('form-add-post',headers).then((response) => {
              const data =  response.data;
                //   setTimeout(() => {
                //     self.setState({ loading: false });
                //     NotificationManager.success('get form data!');
                //  }, 5000);       
            })
           .catch(error => {
              // error hanlding
           })
         }
     
componentDidMount() {
   
    api.get('forum/forum-get-all-categories' )
        .then((response) => {
            this.setState({categories:response.data });
        })
      
}
    //on any transform on image croper
    slimTransform(data, slim){
        if(slim._hasInitialImage  && !slim._imageEditor)
        return true;
    
        var base64 = 0;
        var large_base64 = 0;
        if(slim._data.output.image){
          var  dataurl = slim._data.output.image.toDataURL("image/*") ;
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                      u8arr[n] = bstr.charCodeAt(n);
                }
          var file =  new File([u8arr], slim._data.input.name, {type:mime});
          base64 =  file;
        }
        if(slim._data.input.image){
          var inputFile = new File([slim._data.input.file], slim._data.input.name);
          large_base64 = inputFile;
        }
        //  this.props.onChangeAddNewUserDetails(slim._output.name, base64);
        //  this.props.onChangeAddNewUserDetails(slim._output.name+'_large', large_base64);
        console.log('Transform');
     }
      

   render() {
    const { categories } = this.state;
      return (
         <div  >

<nav className="panel-menu" id="mobile-menu">
<div className="mmpanels">
<div className="mmpanel mmopened mmcurrent" id="mm0">
<ul>
    <li className="mm-close-parent"><a href="http://azyrusthemes.com/forum2019/demo/index.html#close" data-target="#close" className="mm-close">
            Close
            <div className="tt-icon">
                <svg>
                  {/* <use xlink:href="#icon-cancel"></use> */}
                </svg>
            </div>
        </a></li>

    <li><a href="http://azyrusthemes.com/forum2019/demo/page-categories.html"><span>Categories</span></a></li><li><a href="http://azyrusthemes.com/forum2019/demo/page-tabs.html"><span>Trending</span></a></li><li><a href="http://azyrusthemes.com/forum2019/demo/page-create-topic.html"><span>New</span></a></li><li>
                                <a href="http://azyrusthemes.com/forum2019/demo/index.html#mm1" data-target="#mm1" className="mm-next-level"><span>Pages</span></a>
                                
                            </li></ul></div><div className="mmpanel mmhidden" id="mm1"><ul><li><a href="http://azyrusthemes.com/forum2019/demo/index.html#" data-target="#" className="mm-prev-level">Back</a></li><li><a href="http://azyrusthemes.com/forum2019/demo/page-single-user.html" className="mm-original-link"><span>Pages</span></a></li>
                                    <li className="active"><a href="http://azyrusthemes.com/forum2019/demo/index.html">Home</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">Single Topic</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-create-topic.html">Create Topic</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single-user.html">Single User Activity</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_threads.html">Single User Threads</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_replies.html">Single User Replies</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_followers.html">Single User Followers</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_categories.html">Single User Categories</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_settings.html">Single User Settings</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-signup.html">Sign up</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-login.html">Log in</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-categories.html">Categories</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-categories-single.html">Single Category</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-tabs.html">About</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-tabs_guidelines.html">Guidelines</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/_demo_modal-advancedSearch.html">Advanced Search</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/error404.html">Error 404</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/_demo_modal-age-confirmation.html">Age Verification</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/_demo_modal-level-up.html">Level up Notification</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/messages-page.html">Message</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/messages-compose.html">Message Compose</a></li>
                                </ul></div></div></nav>
<header id="tt-header">
    <div className="container">
        <div className="row tt-row no-gutters">
            <div className="col-auto">
               
                <a className="toggle-mobile-menu" href="http://azyrusthemes.com/forum2019/demo/index.html#" >
                    <svg className="tt-icon">
                      {/* <use xlink:href="#icon-menu_icon"></use> */}
                    </svg>
                </a>
               
               
              
                 <div className="tt-desktop-menu">
                    <nav>
                        <ul>
                            <li><a href="http://azyrusthemes.com/forum2019/demo/page-categories.html"><span>Categorieffs</span></a></li>
                            <li><a href="http://azyrusthemes.com/forum2019/demo/page-tabs.html"><span>Trending</span></a></li>
                            <li><a href="http://azyrusthemes.com/forum2019/demo/page-create-topic.html"><span>New</span></a></li>
                            <li>
                                <a href="http://azyrusthemes.com/forum2019/demo/page-single-user.html"><span>Pages</span></a>
                                <ul>
                                    <li className="active"><a href="http://azyrusthemes.com/forum2019/demo/index.html">Home</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">Single Topic</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-create-topic.html">Create Topic</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single-user.html">Single User Activity</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_threads.html">Single User Threads</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_replies.html">Single User Replies</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_followers.html">Single User Followers</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_categories.html">Single User Categories</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-single_settings.html">Single User Settings</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-signup.html">Sign up</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-login.html">Log in</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-categories.html">Categories</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-categories-single.html">Single Category</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-tabs.html">About</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/page-tabs_guidelines.html">Guidelines</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/_demo_modal-advancedSearch.html">Advanced Search</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/error404.html">Error 404</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/_demo_modal-age-confirmation.html">Age Verification</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/_demo_modal-level-up.html">Level up Notification</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/messages-page.html">Message</a></li>
                                    <li><a href="http://azyrusthemes.com/forum2019/demo/messages-compose.html">Message Compose</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
              
                <div className="tt-search">
                   
                    <button className="tt-search-toggle" data-toggle="modal" data-target="#modalAdvancedSearch">
                       <svg className="tt-icon">
                          {/* <use xlink:href="#icon-search"></use> */}
                        </svg>
                    </button>
                   
                    <form className="search-wrapper">
                        <div className="search-form">
                            <input type="text" className="tt-search__input" placeholder="Search"/>
                            <button className="tt-search__btn" type="submit">
                                <svg className="tt-icon">
                                  {/* <use xlink:href="#icon-search"></use> */}
                                </svg>
                            </button>
                             <button className="tt-search__close">
                                <svg className="tt-icon">
                                  {/* <use xlink:href="#cancel"></use> */}
                                </svg>
                            </button>
                        </div>
                        <div className="search-results">
                            <div className="tt-search-scroll">
                                <ul>
                                    <li>
                                        <a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">
                                            <h6 className="tt-title">Rdr2 secret easter eggs</h6>
                                            <div className="tt-description">
                                               Here’s what I’ve found in Red Dead Redem..
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                       <a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">
                                            <h6 className="tt-title">Top 10 easter eggs in Red Dead Rede..</h6>
                                            <div className="tt-description">
                                                You can find these easter eggs in Red Dea..
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                       <a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">
                                            <h6 className="tt-title">Red Dead Redemtion: Arthur Morgan..</h6>
                                            <div className="tt-description">
                                                Here’s what I’ve found in Red Dead Redem..
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">
                                            <h6 className="tt-title">Rdr2 secret easter eggs</h6>
                                            <div className="tt-description">
                                               Here’s what I’ve found in Red Dead Redem..
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                       <a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">
                                            <h6 className="tt-title">Top 10 easter eggs in Red Dead Rede..</h6>
                                            <div className="tt-description">
                                                You can find these easter eggs in Red Dea..
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                       <a href="http://azyrusthemes.com/forum2019/demo/page-single-topic.html">
                                            <h6 className="tt-title">Red Dead Redemtion: Arthur Morgan..</h6>
                                            <div className="tt-description">
                                                Here’s what I’ve found in Red Dead Redem..
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <button type="button" className="tt-view-all" data-toggle="modal" data-target="#modalAdvancedSearch">Advanced Search</button>
                        </div>
                    </form>
                </div>
           
            </div>
            {/* <div className="col-auto ml-auto">
                <div className="tt-account-btn">
                    <a href="http://azyrusthemes.com/forum2019/demo/page-login.html" className="btn btn-primary">Log in</a>
                    <a href="http://azyrusthemes.com/forum2019/demo/page-signup.html" className="btn btn-secondary">Sign up</a>
                </div>
            </div> */}
        </div>
    </div>
</header>











      <main id="tt-pageContent">
    <div className="container">
        <div className="tt-wrapper-inner">
            <h1 className="tt-title-border">
                Create New Topic
            </h1>
            <form className="form-default form-create-topic" id="formId" >
                <div className="form-group">
                    <label for="inputTopicTitle">Topic Title</label>
                    <div className="tt-value-wrapper">
                        <input type="text" name="name" className="form-control" id="inputTopicTitle" placeholder="Subject of your topic"/>
                        <span className="tt-value-input"></span>
                    </div>
                    <div className="tt-note">Describe your topic well, while keeping the subject as short as possible.</div>
                </div>
                <div className="form-group">
                    <label>Topic Type</label>
                    <div className="tt-js-active-btn tt-wrapper-btnicon">
                        <div className="row tt-w410-col-02">
                        
                            <div className="col-4 col-lg-3 col-xl-2" for="comment">
                                <a href="javascript:void(0)" className="tt-button-icon">
                                <span className="tt-icon">
                                    <span class="material-icons" style={{fontSize:'150px'}} >comment</span>
                                    <input type="radio" name='type'  id='comment' ></input>
                                </span>
                                    <span className="tt-text">Discussion</span>
                                </a>
                            </div>
                          
                            <label  className="col-4 col-lg-3 col-xl-2" for="question_answer">
                                <a href="javascript:void(0)" className="tt-button-icon">
                                    <span className="tt-icon">
                                        <span class="material-icons" style={{fontSize:'150px'}} >question_answer</span>
                                    </span>
                                    <span className="tt-text">Question</span>
                                </a>
                            </label >
                            <input type="radio" name='type'  id='question_answer' />
                            <div className="col-4 col-lg-3 col-xl-2">
                                <a href="javascript:void(0)" className="tt-button-icon">
                                    <span className="tt-icon">
                                         <svg>
                                            {/* <use xlink:href="#Poll"></use> */}
                                        </svg>
                                    </span>
                                    <span className="tt-text">Poll</span>
                                </a>
                            </div>
                            <div className="col-4 col-lg-3 col-xl-2">
                                <a href="javascript:void(0)" className="tt-button-icon">
                                    <span className="tt-icon">
                                         <svg>
                                            {/* <use xlink:href="#icon-gallery"></use> */}
                                        </svg>
                                    </span>
                                    <span className="tt-text">Gallery</span>
                                </a>
                            </div>
                            <div className="col-4 col-lg-3 col-xl-2">
                                <a href="javascript:void(0)" className="tt-button-icon">
                                    <span className="tt-icon">
                                         <svg>
                                            {/* <use xlink:href="#Video"></use> */}
                                        </svg>
                                    </span>
                                    <span className="tt-text">Video</span>
                                </a>
                            </div>
                            
                        </div>
                    </div>
                </div>
               <div className="row">
               <div className="col-md-6">
               
                    <div className="form-group">
                    <label for="inputTopicTitle">Topic Body</label>
                        <textarea name="message" className="form-control" rows="5" placeholder="Lets get started"></textarea>
                    </div>
                    {/* <div className="form-group">
                        <input type='file' name='uploadFile'></input>
                    </div> */}
                    <div class="form-group">
                        <label for="inputTopicTitle">Category</label>
                        <select class="form-control" name="cat_id" >
                            <option  value=''>Select Category</option>
                        { categories && categories.map((user, key) => (
                            <option key={key} value={user.id}>{user.name}</option>
                            )) }
                        </select>
                    </div>
                
                
                    <div className="form-group">
                        <label for="inputTopicTags">Tags</label>
                        <input type="text" name="name" className="form-control" id="inputTopicTags" placeholder="Use comma to separate tags"/>
                    </div>
                    
                </div>
                <div className="col-md-6">
                    <FormGroup>
            <Label >Image</Label>
                <Slim
                    ratio="512:512"
                    data-size="512,512"
                    initialImage={null}
                    didTransform={ this.slimTransform.bind(this) }
                    didRemove={ this.slimTransform.bind(this) }
                    >
                  <input type="file" name="file"  accept="image/*" />
              </Slim>
            </FormGroup>
            </div>
            </div>
                     <div className="row">
                        <div className="col-auto ml-md-auto">
                            <a href="#" onClick={(e) => this.addNewUser(e)} className="btn btn-secondary btn-width-lg">Create Post</a>
                        </div>
                    </div>
         
            </form>
        </div>
        <div className="tt-topic-list tt-offset-top-30">
            <div className="tt-list-search">
                <div className="tt-title">Suggested Topics</div>
               
                <div className="tt-search">
                    <form className="search-wrapper" enctype="multipart/form-data" >
                        <div className="search-form">
                            <input type="text" className="tt-search__input" placeholder="Search for topics"/>
                            <button className="tt-search__btn" type="submit">
                               <svg className="tt-icon">
                                  {/* <use xlink:href="#icon-search"></use> */}
                                </svg>
                            </button>
                             <button className="tt-search__close">
                               <svg className="tt-icon">
                                  {/* <use xlink:href="#icon-cancel"></use> */}
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
               
            </div>
            <div className="tt-list-header tt-border-bottom">
                <div className="tt-col-topic">Topic</div>
                <div className="tt-col-category">Category</div>
                <div className="tt-col-value hide-mobile">Likes</div>
                <div className="tt-col-value hide-mobile">Replies</div>
                <div className="tt-col-value hide-mobile">Views</div>
                <div className="tt-col-value">Activity</div>
            </div>
            <div className="tt-item">
                <div className="tt-col-avatar">
                    <svg className="tt-icon">
                      {/* <use xlink:href="#icon-ava-n"></use> */}
                    </svg>
                </div>
                <div className="tt-col-description">
                    <h6 className="tt-title"><a href="javascript:void(0)">
                        Does Envato act against the authors of Envato markets?
                    </a></h6>
                    <div className="row align-items-center no-gutters hide-desktope">
                        <div className="col-auto">
                            <ul className="tt-list-badge">
                                <li className="show-mobile"><a href="javascript:void(0)"><span className="tt-color05 tt-badge">music</span></a></li>
                            </ul>
                        </div>
                        <div className="col-auto ml-auto show-mobile">
                           <div className="tt-value">1d</div>
                        </div>
                    </div>
                </div>
                <div className="tt-col-category"><span className="tt-color05 tt-badge">music</span></div>
                <div className="tt-col-value hide-mobile">358</div>
                <div className="tt-col-value tt-color-select hide-mobile">68</div>
                <div className="tt-col-value hide-mobile">8.3k</div>
                <div className="tt-col-value hide-mobile">1d</div>
            </div>
            <div className="tt-item">
                <div className="tt-col-avatar">
                   <svg className="tt-icon">
                      {/* <use xlink:href="#icon-ava-h"></use> */}
                    </svg>
                </div>
                <div className="tt-col-description">
                    <h6 className="tt-title"><a href="javascript:void(0)">
                        <svg className="tt-icon">
                          {/* <use xlink:href="#icon-locked"></use> */}
                        </svg>
                        We Want to Hear From You! What Would You Like?
                    </a></h6>
                    <div className="row align-items-center no-gutters hide-desktope">
                        <div className="col-auto">
                            <ul className="tt-list-badge">
                                <li className="show-mobile"><a href="javascript:void(0)"><span className="tt-color06 tt-badge">movies</span></a></li>
                            </ul>
                        </div>
                        <div className="col-auto ml-auto show-mobile">
                           <div className="tt-value">2d</div>
                        </div>
                    </div>
                </div>
                <div className="tt-col-category"><span className="tt-color06 tt-badge">movies</span></div>
                <div className="tt-col-value hide-mobile">674</div>
                <div className="tt-col-value tt-color-select  hide-mobile">29</div>
                <div className="tt-col-value hide-mobile">1.3k</div>
                <div className="tt-col-value hide-mobile">2d</div>
            </div>
            <div className="tt-item">
                <div className="tt-col-avatar">
                   <svg className="tt-icon">
                      {/* <use xlink:href="#icon-ava-j"></use> */}
                    </svg>
                </div>
                <div className="tt-col-description">
                    <h6 className="tt-title"><a href="javascript:void(0)">
                       Seeking partner backend developer
                    </a></h6>
                    <div className="row align-items-center no-gutters">
                        <div className="col-auto">
                            <ul className="tt-list-badge">
                                <li className="show-mobile"><a href="javascript:void(0)"><span className="tt-color03 tt-badge">exchange</span></a></li>
                                <li><a href="javascript:void(0)"><span className="tt-badge">themeforest</span></a></li>
                                <li><a href="javascript:void(0)"><span className="tt-badge">elements</span></a></li>
                            </ul>
                        </div>
                        <div className="col-auto ml-auto show-mobile">
                           <div className="tt-value">2d</div>
                        </div>
                    </div>
                </div>
                <div className="tt-col-category"><span className="tt-color13 tt-badge">movies</span></div>
                <div className="tt-col-value hide-mobile">278</div>
                <div className="tt-col-value tt-color-select  hide-mobile">27</div>
                <div className="tt-col-value hide-mobile">1.4k</div>
                <div className="tt-col-value hide-mobile">2d</div>
            </div>
            <div className="tt-item">
                <div className="tt-col-avatar">
                   <svg className="tt-icon">
                      {/* <use xlink:href="#icon-ava-t"></use> */}
                    </svg>
                </div>
                <div className="tt-col-description">
                    <h6 className="tt-title"><a href="javascript:void(0)">
                        Cannot customize my intro
                    </a></h6>
                    <div className="row align-items-center no-gutters">
                        <div className="col-auto">
                             <ul className="tt-list-badge">
                                <li className="show-mobile"><a href="javascript:void(0)"><span className="tt-color07 tt-badge">video games</span></a></li>
                                <li><a href="javascript:void(0)"><span className="tt-badge">videohive</span></a></li>
                                <li><a href="javascript:void(0)"><span className="tt-badge">photodune</span></a></li>
                            </ul>
                        </div>
                        <div className="col-auto ml-auto show-mobile">
                           <div className="tt-value">2d</div>
                        </div>
                    </div>
                </div>
                <div className="tt-col-category"><span className="tt-color07 tt-badge">video games</span></div>
                <div className="tt-col-value hide-mobile">364</div>
                <div className="tt-col-value tt-color-select  hide-mobile">36</div>
                <div className="tt-col-value  hide-mobile">982</div>
                <div className="tt-col-value hide-mobile">2d</div>
            </div>
            <div className="tt-item">
                <div className="tt-col-avatar">
                   <svg className="tt-icon">
                      {/* <use xlink:href="#icon-ava-k"></use> */}
                    </svg>
                </div>
                <div className="tt-col-description">
                    <h6 className="tt-title"><a href="javascript:void(0)">
                        <svg className="tt-icon">
                          {/* <use xlink:href="#icon-verified"></use> */}
                        </svg>
                        Microsoft Word and Power Point
                    </a></h6>
                    <div className="row align-items-center no-gutters hide-desktope">
                        <div className="col-auto">
                            <ul className="tt-list-badge">
                                <li className="show-mobile"><a href="javascript:void(0)"><span className="tt-color08 tt-badge">youtube</span></a></li>
                            </ul>
                        </div>
                        <div className="col-auto ml-auto show-mobile">
                           <div className="tt-value">3d</div>
                        </div>
                    </div>
                </div>
                <div className="tt-col-category"><span className="tt-color08 tt-badge">youtube</span></div>
                <div className="tt-col-value  hide-mobile">698</div>
                <div className="tt-col-value tt-color-select  hide-mobile">78</div>
                <div className="tt-col-value  hide-mobile">2.1k</div>
                <div className="tt-col-value hide-mobile">3d</div>
            </div>
            <div className="tt-row-btn">
                <button type="button" className="btn-icon js-topiclist-showmore">
                    <svg className="tt-icon">
                      {/* <use xlink:href="#icon-load_lore_icon"></use> */}
                    </svg>
                </button>
            </div>
        </div>
    </div>
</main>
    
     </div>
        );
   }
}

// import 'Assets/page-assets/js/popper.min.js';
// import 'Assets/page-assets/js/bootstrap.min.js';
//import 'Assets/page-assets/js/owl.carousel.min.js';
// import 'Assets/page-assets/js/wow.min.js';
// import 'Assets/page-assets/js/app.min.js';
// import 'Assets/page-assets/js/circle.js';
// import 'Assets/page-assets/js/chatbot.js';

//require('Assets/page-assets/js/main.js');
//import 'Assets/page-assets/bundle.js.download'
//import 'Assets/page-assets/js/main.js';
