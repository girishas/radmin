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

// update user form
//import UpdateUserForm from './UpdateUserForm';
import FHeader from '../header/index';
import { user_id ,timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml, get_player_url,pagination_display } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import TopicSearchForm from 'Components/Search/TopicSearchForm'

export default class Topics extends Component {

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            topics: [],
            totalRecords: null,
            results: null,
            search: '',
            currentPageData: [],
            searchForm:false,
            addNewUserModal:false,
            searchFilter: this.props.location.state ? this.props.location.state.searchFilter : [],
            currentPage:1,
        }



    }

    getInfo() {

        let tag_id = '';
        let params = [];
        if (this.props.location.state) {
            if (this.props.location.state.tag_id) {
                params = {
                    tag_id: this.props.location.state.tag_id,
                }
            }
            if (this.props.location.state.cat_id) {
                params = {
                    cat_id: this.props.location.state.cat_id,
                }
            }
            if(this.props.location.state.searchFilter){
                params = {
                    filter: this.props.location.state.searchFilter,
                    user_id:  user_id()
                }
            }
           
            // console.log('tag_id', this.props.location.state.tag_id)
        }

        api.get('forum/get-all-topics', {
            params,
            headers: {'User-Id':user_id()},

        })
            .then((response) => {
                const offset = 0;
                const currentPageData = response.data.topics.slice(offset, offset + AppConfig.paginate);
                this.setState({ currentPageData: currentPageData, topics: response.data.topics, totalRecords: response.data.totalRecords });
            })
    }
    componentDidMount() {
        $("div").scrollTop(0);
        this.getInfo();
    }

    //for change props only url is same
    componentWillReceiveProps(newProps) {
        this.props = newProps;
       // console.clear();
        if(this.state.searchFilter){
            this.setState({  addNewUserModal:false });
        }
        this.getInfo();
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
        console.log(newList)
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
        const { topics, currentPageData, results, search, totalRecords,currentPage } = this.state;
        if (!topics)
            return null;

        let filteredResult;
        if (search) {
            filteredResult = results;
        } else {
            filteredResult = currentPageData;
        }


        return (
            <div className='forum_main_class'>
                <main id="tt-pageContent" style={{ marginTop: '-60px' }} className="tt-offset-small">
                    {/* <div className="tt-search float-right">
                <form className="search-wrapper">
                    <div className="search-form">
          
                   
           
				<Input type="search" className="tt-search__input" placeholder="Search Forums" onKeyUp={(e) => this.searchIdeas(e.target.value)}/>
                <button className="tt-search__btn" type="submit">
                <span className="tt-icon material-icons"  >search</span>
                                    </button>
                       
                    </div>
                </form>
            </div> */}


                    <div className="tt-custom-mobile-indent container" style={{  width:"90%"}}>

                        <div className="tt-categories-title" style={{marginBottom:"0px"}}>
                            <div className="tt-title"><IntlMessages id="widgets.topics"/> {totalRecords?(pagination_display(currentPage , AppConfig.paginate,totalRecords)):''} </div>
                            <div className="tt-search">
                                <form className="search-wrapper">
                                    <div className="search-form">
                                        <input type="text" className="tt-search__input" placeholder="Search Topics" onKeyUp={(e) => this.searchIdeas(e.target.value)} />
                                        <button className="tt-search__btn" type="submit">
                                            <span className="material-icons"  >search</span>
                                            
                                        </button>
                                    </div>
                                </form>
                               
                                <a href="javascript:void(0)" className="advance_search mt-1 float-right"  onClick={() => this.topicSearchForm()} > <span className="material-icons advance-search-icon" style={{fontSize:"15px"}}  >search</span> <span><IntlMessages id="widgets.advanceSearch"/></span></a>
                                
                                  
                                
                            </div>
                        </div>
                       
                        <div className="tt-topic-list">
                            <div className="tt-list-header">
                                <div className="tt-col-value"><IntlMessages id="widgets.user"/></div>
                                <div className="tt-col-topic"><IntlMessages id="widgets.topic"/></div>
                                <div className="tt-col-category"><IntlMessages id="sidebar.Forum"/></div>
                                <div className="tt-col-category"  style={{textAlign:'left'}}><IntlMessages id="widgets.category"/></div>
                                <div className="tt-col-category"><IntlMessages id="sidebar.type"/></div>
                                <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.likes"/></div>
                                <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.replies"/></div>
                                <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.views"/></div>
                                <div className="tt-col-category"><IntlMessages id="widgets.activity"/></div>
                            </div>
                            {/* <div className="tt-topic-alert tt-alert-default" role="alert">
              <a href="#" target="_blank">4 new posts</a> are added recently, click here to load them.
            </div> */}


                            {filteredResult && filteredResult.map((topic, key) => (
                                // <div className="tt-item tt-itemselect">
                                <div className="tt-item mt-0"> 
                                    <div className="tt-col-value">

                                        <Link to={{ pathname: '/app/forum/user/activity/' + topic.user_id }} >
                                            <div className="media" title={topic.user_full_name}>
                                                {topic.user_photo !== '' && topic.user_photo !== null && topic.user_photo !== 'undefined' ?
                                                    <img src={hubCheckPaths('images') + topic.user_photo} alt={topic.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
                                                    : <Avatar className="mr-15">{ topic.user_full_name ? topic.user_full_name.charAt(0) : 'U'.charAt(0) }</Avatar>
                                                }
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="tt-col-description">
                                        <h6 className="tt-title">
                                        
                                        {topic.is_pinned == 1 &&
                                            <span className="tt-icon ti-pin2 ti-large-size mr-2" style={{fontSize: "14px"}}  ></span>  
                                        }
                                        {topic.is_locked == 1 &&
                                            <span title="This topic is closed" className=" material-icons mr-2" style={{fontSize: "15px", cursor:"default"}} >lock</span>
                                        }

                                            <Link to={{ pathname: '/app/forum/topic-details/' + topic.id }}  >
                                                {/* <svg className="tt-icon">
                                                        <use xlink href="#icon-pinned"></use>
                                                    </svg> */}
                                      
                          
                            
                                                <span style={{  fontWeight:400   }}>{topic.title}</span>
                                            </Link>

                                        </h6>
                                        <div className="row align-items-center no-gutters">
                                            <div className="col-11">
                                                <ul className="tt-list-badge">
                                                    <li className="show-mobile"> <Link to={{ pathname: '/app/forum/details', state: { forum_id: topic.forum_id } }} className="show-mobile tt-color01 tt-badge" style={{ backgroundColor: topic.forum_colour }} style={{ color: '#fff' }} ><span>{topic.forum_name}</span></Link></li>
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
                                    <div className="tt-col-category"><Link to={{ pathname: '/app/forum/details' }} className="tt-color01 tt-badge" style={{ backgroundColor: topic.forum_colour, color: '#fff' }} ><span>{topic.forum_name}</span></Link></div>
                                    <div className="tt-col-category" style={{textAlign:'left'}}><span>{topic.category_name}</span></div>
                                    <div className="tt-col-category"><span  title={topic.topic_type_name} className="material-icons"  >{topic.topic_type_icon}</span></div>
                                    {/*                 
                <div className="tt-col-category"><span className="tt-color01 tt-badge">{topic.category_name}</span></div> */}
                                    <div className="tt-col-value hide-mobile">{topic.likes}</div>
                                    <div className="tt-col-value tt-color-select hide-mobile">{topic.replies}</div>
                                    <div className="tt-col-value hide-mobile">{topic.views}</div>
                                    <div className="tt-col-category hide-mobile">{timeAgo(topic.activity)}</div>
                                </div>
                            ))}

                          
                                {!search && this.isInt(totalRecords) &&

                                    <Pagination
                                        className="mb-0 py-10 px-10"
                                        totalRecords={totalRecords}
                                        pageLimit={AppConfig.paginate}
                                        pageNeighbours={1}
                                        onPageChanged={this.onPageChanged}
                                    />

                                }
                                {/* <button type="button" className="btn-icon js-topiclist-showmore">
                                    <svg className="tt-icon">
                                      
                                    </svg>
                                </button> */}
                            
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
