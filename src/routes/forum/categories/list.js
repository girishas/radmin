/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import Checkbox from '@material-ui/core/Checkbox';
import {
   Input,
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
// update user form
//import UpdateUserForm from './UpdateUserForm';
import FHeader from '../header/index';
import { timeAgo, textTruncate, checkPaths, hubCheckPaths, pathForxml  , get_player_url} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Pagination from '../Pagination';
import { Divider } from '@material-ui/core';
import TopicSearchForm from 'Components/Search/TopicSearchForm';


export default class Categories extends Component {
  
  constructor(props) {
 
        super(props);  
        this.state = {
            loading: false,
            redirectToTopics:false,
            totalRecords:null,
            results: null,
			search:'',
            currentPageData:[],
            forums:[],
            addNewUserModal:false, 
            searchFilter: this.props.location.state ? this.props.location.state.searchFilter : [],
         
         
        }
        this.onPageChanged = this.onPageChanged.bind(this);
  }

    componentDidMount() {
        api.get('forum/get-all-forums' )
            .then((response) => {
                const offset = 0;
                const currentPageData = response.data.forum;
                this.setState({ currentPageData:currentPageData,forums: response.data.forum, totalRecords:response.data.forum.length  });
        }) 
    } 
  
    searchIdeas(query){
        const { forums } = this.state;
         let currentList =null;
         let newList = null;
         let records = null;

        if (query !== "") {
            currentList = forums;
            newList = currentList.filter(item => {
                return item.name.toLowerCase().includes(query.toLowerCase()) 
              });
            records = newList.length
        } else {
            newList = this.state.forums;
            records = newList.length
        }
        const offset = 0;
        const currentCountries = newList.slice(offset, offset + 1);
        this.setState({
            results: newList,
            search:query
        });
    }
    onPageChanged = data => {
	    const { forums } = this.state;
	    const { currentPage, totalPages, pageLimit } = data;
	    const offset = (currentPage - 1) * pageLimit;
	    const currentPageData = forums.slice(offset, offset + pageLimit);
	    this.setState({  currentPageData, currentPage, totalPages  });
    };
    topicSearchForm(){
        this.setState({  addNewUserModal:true });
    }
       /**
    * On Add & Update Comment Modal Close
    */
   onAddUpdateUserModalClose() {
    this.setState({ addNewUserModal: false })
 }
   render() {
    const { forums ,currentPageData, results , search , totalRecords } = this.state;
    
    let filteredResult;
    if(search){
       filteredResult = results;
    }else{
       filteredResult = currentPageData;
    }
     
      return (
         <div>
       
       <main id="tt-pageContent">
            <div className="tt-custom-mobile-indent container">
                <div className="tt-categories-title">
                    <div className="tt-title"><IntlMessages id="sidebar.forums"/></div>
                    <div className="tt-search">
                        <form className="search-wrapper">
                            <div className="search-form">
                                <input type="text" class="tt-search__input" placeholder="Search Forums" onKeyUp={(e) => this.searchIdeas(e.target.value)}/>
                                <button class="tt-search__btn" type="submit">
                                    <span class="material-icons"  >search</span>
                                </button>
                            </div>
                        </form>
                          
                        <a href="javascript:void(0)" className="advance_search mt-1 float-right"  onClick={() => this.topicSearchForm()} > <span className="material-icons advance-search-icon" style={{fontSize:"15px"}}  >search</span> <span><IntlMessages id="widgets.advanceSearch"/></span></a>
                    </div>
                </div>
                {/* <div className="hr"></div> */}
        <div className="tt-categories-list">
            <div className="row">

            { filteredResult && filteredResult.map((forum, key) => (
                            
                           
                <div className="col-md-6 col-lg-4">
                    <div className="tt-item mt-0" style={{marginTop:"0px!important"}}>
                        <div className="tt-item-header">
                        <div className="media" title={forum.name}>
                        {forum.logo !== '' && forum.logo !== null && forum.logo !== 'undefined' ?
                        <img src={hubCheckPaths('forum_images')+forum.logo} alt={forum.logo} className="rounded-circle " width="50" height="50" />
                        : <Avatar className="mr-15">{forum.name.charAt(0)}</Avatar>
                        }
                    </div>
                            <ul className="tt-list-badge">
                                <li>
                                    <Link to={{ pathname: '/app/forum/details' , state: {   forum_id: forum.id }}} className="tt-color01 tt-badge" style={{backgroundColor: forum.colour,color: '#fff'}} ><span>{forum.name}</span></Link>
                                  
                                </li>
                            </ul>
                            <h6 className="tt-title"><a href="javascript:void(0)" className="cursor-default"><IntlMessages id="widgets.topics"/> - {forum.counttopic}</a></h6>
                        </div>
                        <div className="tt-item-layout">
                           <div className="innerwrapper">
                           <p dangerouslySetInnerHTML={{__html:forum.short_desc}} />
                           
                           </div>
                           <div className="innerwrapper">
                                <h6 className="tt-title"><IntlMessages id="sidebar.categories"/></h6>
                                <ul className="tt-list-badge">
                                {
                                   forum.categories.map((category, key) => (
                                        <li><Link to={{ pathname: '/app/forum/topics' , state: { cat_id: category.cat_id }}}><span className="tt-badge">{category.name}</span></Link></li>

                                    ))}
                                 
                                </ul>
                           </div>
                           <div className="hr"></div>

                           <div className="forum-moderator">
                           <h6 className="tt-title"><IntlMessages id="widgets.moderators"/></h6>

                        
                            <div className="tt-moderators-list" style={{display:'flex'}}>
                                {forum.moderators && forum.moderators.map((moderator, key) => (
                                    <Link to={{ pathname: '/app/forum/user/activity/' + moderator.id }} >
                                    <div className="media ml-1" title={moderator.full_name}>
                                            { moderator.photo !== '' && moderator.photo !== null && moderator.photo !== 'undefined' ?
                                            <img src={hubCheckPaths('images')+moderator.photo} alt={moderator.full_name} className="rounded-circle " width="40" height="40" />
                                            : <Avatar   className="mr-15">{moderator.full_name.charAt(0)}</Avatar>
                                            }
                                        </div>
                                    </Link>
                                ))}
                            </div>
                             </div>
                        </div>
                    </div>
                </div>
                )) }
                  <div className="col-12">
                    <div className="tt-row-btn">
                                { !search &&
										<Pagination
			                                className="mb-0 py-10 px-10"
			                                totalRecords={totalRecords}
			                                pageLimit={AppConfig.paginate}
			                                pageNeighbours={1}
			                                onPageChanged={this.onPageChanged}
			                              />
                                    }
                                    
                        <button type="button" className="btn-icon js-topiclist-showmore">
                            <svg className="tt-icon">
                              <use xlink href="#icon-load_lore_icon"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<Modal  backdrop="static" isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
            <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
            <span className="material-icons" >search</span> <IntlMessages id="widgets.advanceSearch"/>
            </ModalHeader>
            <ModalBody>
            
            <TopicSearchForm searchFilter={this.state.searchFilter}  />
                
            </ModalBody>
            <ModalFooter> 

            </ModalFooter>
        </Modal>


 </div>
           );
   }
}
