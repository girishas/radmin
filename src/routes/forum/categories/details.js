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
import { timeAgo, textTruncate, checkPaths, hubCheckPaths, pathForxml, get_player_url,pagination_display  } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';``
import Pagination from '../Pagination';
import TopicSearchForm from 'Components/Search/TopicSearchForm';


export default class Categories extends Component {

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            redirectToTopics: false,
            forum: [],
            topics: [],
            forum_id: this.props.location.state ? this.props.location.state.forum_id : 1,

            totalRecords: null,
            results: null,
            search: '',
            currentPageData: [],
            addNewUserModal:false,
            searchFilter: [],
            currentPage: 1,
        }

    }

    componentDidMount() {


        api.get('forum/get-all-topics', {
            params: {
                forum_id: this.state.forum_id,
            }
        })
            .then((response) => {
                const offset = 0;
                const currentPageData = response.data.topics.slice(offset, offset + AppConfig.paginate);
                this.setState({ currentPageData: currentPageData, topics: response.data.topics, totalRecords: response.data.totalRecords });
            })

        api.get('forum/get-forum-detail', {
            params: {
                forum_id: this.state.forum_id,
            }
        })
            .then((response) => {
                this.setState({ forum: response.data.forum });
            })
    }

    searchIdeas(query) {

        const { topics } = this.state;
        let currentList = null;
        let newList = null;
        let records = null;

        if (query !== "") {
            currentList = topics;
            newList = currentList.filter(item => {
                return item.title.toLowerCase().includes(query.toLowerCase())
            });
            records = newList.length
        } else {
            newList = this.state.topics;
            records = newList.length
        }

        const offset = 0;
        const currentCountries = newList.slice(offset, offset + 1);
        this.setState({
            results: newList,
            search: query
        });

    }
    onPageChanged = data => {
        const { topics } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const currentPageData = topics.slice(offset, offset + pageLimit);
        this.setState({ currentPageData, currentPage, totalPages });
    };
    isInt(value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    }
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
        const { forum, topics, currentPageData, results, search, totalRecords,currentPage } = this.state;

        let filteredResult;
        if (search) {
            filteredResult = results;
        } else {
            filteredResult = currentPageData;
        }



        return (
            <div>
                {forum.name &&
                    <main id="tt-pageContent">
                    <div className="tt-custom-mobile-indent container">
                        <div className="tt-categories-title" style={{marginBottom:"0px"}}>
                            <div className="tt-title"><IntlMessages id="sidebar.forums"/></div>
                            <div className="tt-search">
                                <form className="search-wrapper">
                                    <div className="search-form">
                                        <input type="text" className="tt-search__input" placeholder={"Search this forum"} onKeyUp={(e) => this.searchIdeas(e.target.value)} />
                                        <button className="tt-search__btn" type="submit">
                                            <span className="material-icons"  >search</span>
                                        </button>
                                    </div>
                                </form>
                                <a href="javascript:void(0)" className="advance_search mt-1 float-right"  onClick={() => this.topicSearchForm()} > <span className="material-icons advance-search-icon" style={{fontSize:"15px"}}  >search</span> <span><IntlMessages id="widgets.advanceSearch"/></span></a>
                            </div>
                            
                        </div>

                        <div className="tt-catSingle-title">
                                <div className="tt-innerwrapper row" style={{alignItems:'center'}}>
                                    <div className="col-md-1">
                                        <div className="media" title={forum.name}>
                                            {forum.logo !== '' && forum.logo !== null && forum.logo !== 'undefined' ?
                                                <img src={hubCheckPaths('forum_images') + forum.logo} alt={forum.logo} className="rounded-circle mr-25" width="50" height="50" />
                                                : <Avatar className="mr-25">{forum.name.charAt(0)}</Avatar>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                   
                                     
                                            <Link  to={{ pathname: '/app/forum/details', state: { forum_id: forum.id } }} className="tt-color01 tt-badge" style={{ backgroundColor: forum.colour, color: '#fff'}} ><span>{forum.name}</span></Link>
                                          
                                   
                                   
                                    </div>
                                    <div className="col-md-7">
                                    <h2> 
                                    <span dangerouslySetInnerHTML={{ __html: forum.short_desc }} />
                                    </h2>
                                    </div>
                                    <div className="col-md-2">
                                    <div className="ml-left tt-col-right">
                                        <div className="tt-col-item">
                                            <h2 className="tt-value"><IntlMessages id="widgets.topics" /> - {totalRecords?pagination_display(currentPage , AppConfig.paginate ,totalRecords ):''     }</h2>
                                            {/* <div className="tt-search">
                                                <form className="search-wrapper">
                                                    <div className="search-form">
                                                        <input type="text" className="tt-search__input" placeholder={"Search in " + forum.name} onKeyUp={(e) => this.searchIdeas(e.target.value)} />
                                                        <button className="tt-search__btn" type="submit">
                                                            <span className="material-icons"  >search</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div> */}
                                        </div>


                                    </div>
                                    </div>
                                </div>
                                {/* <div className="tt-innerwrapper">
                                    <p dangerouslySetInnerHTML={{ __html: forum.short_desc }} />

                                </div> */}
                                <div className="tt-innerwrapper">
                                    <h6 className="tt-title"><IntlMessages id="sidebar.categories" /></h6>
                                    <ul className="tt-list-badge">

                                        {forum.categories &&
                                            forum.categories.map((category, key) => (
                                                <li><Link to={{ pathname: '/app/forum/topics', state: { cat_id: category.cat_id } }}><span className="tt-badge">{category.name}</span></Link></li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        <div className="background-white container">
                            
                   
                        <div className="tt-topic-list">
                            <div className="tt-list-header">
                                <div className="tt-col-value"><IntlMessages id="widgets.user"/></div>
                                <div className="tt-col-topic"><IntlMessages id="widgets.topic" /></div>
                                <div className="tt-col-category" style={{textAlign:"initial"}}><IntlMessages id="sidebar.Forum" /></div>
                                <div className="tt-col-category" ><IntlMessages id="widgets.category" /></div>
                                <div className="tt-col-category"><IntlMessages id="sidebar.type" /></div>
                                <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.likes" /></div>
                                <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.replies" /></div>
                                <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.views" /></div>
                                <div className="tt-col-category"><IntlMessages id="widgets.activity" /></div>

                            </div>
                            {/* <div className="tt-topic-alert tt-alert-default" role="alert">
              <a href="#" target="_blank">4 new posts</a> are added recently, click here to load them.
            </div> */}


                            {filteredResult && filteredResult.map((topic, key) => (
                                // <div className="tt-item tt-itemselect">
                                <div className="tt-item">
                                    <div className="tt-col-avatar">
                                        {/* <svg className="tt-icon">
                      <use xlink href="#icon-ava-k"></use>
                    </svg> */}
                                        <Link to={{ pathname: '/app/forum/user/activity/' + topic.user_id }} >
                                            <div className="media" title={topic.user_full_name}>
                                                {topic.user_photo !== '' && topic.user_photo !== null && topic.user_photo !== 'undefined' ?
                                                    <img src={hubCheckPaths('images') + topic.user_photo} alt={topic.user_photo} className="rounded-circle mr-15" width="50" height="50" />
                                                    : <Avatar className="mr-15">{topic.user_full_name.charAt(0)}</Avatar>
                                                }
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="tt-col-description" style={{textAlign:"center"}}>
                                        <h6 className="tt-title">

                                            <Link to={{ pathname: '/app/forum/topic-details/' + topic.id, }} className="" >
                                                {/* <svg className="tt-icon">
                            <use xlink href="#icon-pinned"></use>
                            </svg> */}
                                                <span>{topic.title}</span>
                                            </Link>

                                        </h6>
                                        <div className="" style={{textAlign:"center"}}>
                                            <div className="">
                                                <ul className="tt-list-badge" style={{textAlign:"center"}}>
                                                    <li className="show-mobile"> <Link to={{ pathname: '/app/forum/details', state: { forum_id: topic.forum_id } }} className="show-mobile tt-color01 tt-badge" style={{ backgroundColor: topic.forum_colour, color: '#fff' }} ><span>{topic.forum_name}</span></Link></li>
                                                    {
                                                        topic.tags.map((tag, key) => (
                                                            <li><Link to={{ pathname: '/app/forum/topics', state: { tag_id: tag.tag_id } }}><span className="tt-badge">{tag.tag_name}</span></Link></li>
                                                        ))}
                                                </ul>
                                            </div>
                                            <div className="col-1 ml-auto show-mobile">
                                                <div className="tt-value">{timeAgo(topic.activity)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tt-col-category" style={{ backgroundColor: topic.forum_colour,borderRadius:"5px",padding:"10px 0 10px 0" }}><Link to={{ pathname: '/app/forum/details' }} className="tt-color01" style={{color: '#fff'}} ><span>{topic.forum_name}</span></Link></div>
                                    <div className="tt-col-category"><span>{topic.category_name}</span></div>
                                    <div className="tt-col-category"><span title={topic.topic_type_name} className="material-icons"  >{topic.topic_type_icon}</span></div>
                                    {/*                 
                <div className="tt-col-category"><span className="tt-color01 tt-badge">{topic.category_name}</span></div> */}
                                    <div className="tt-col-value hide-mobile">{topic.likes}</div>
                                    <div className="tt-col-value tt-color-select hide-mobile">{topic.replies}</div>
                                    <div className="tt-col-value hide-mobile">{topic.views}</div>
                                    <div className="tt-col-category hide-mobile">{timeAgo(topic.activity)}</div>
                                </div>
                            ))}

                            <div className="tt-row-btn">
                                {!search && this.isInt(totalRecords) &&

                                    <Pagination
                                        className="mb-0 py-10 px-10"
                                        totalRecords={totalRecords}
                                        pageLimit={AppConfig.paginate}
                                        pageNeighbours={1}
                                        onPageChanged={this.onPageChanged}
                                    />

                                }
                              
                            </div>
                        </div>
</div>
</div>
                    </main>
                }
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
