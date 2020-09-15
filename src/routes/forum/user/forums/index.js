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
export default class UserCategories extends Component {
  
  constructor(props) {
 
        super(props);
        this.state = {
            loading: false,
            user_id :    $(location).attr("href").split('/').pop(),
            forums : [],
        }
  }
  componentDidMount() {

    api.get('forum/get-user-forums', {
        params: {
          id: this.state.user_id,
          session_user_id:user_id()
        },
        headers: {'User-Id':user_id()},

      })
        .then((response) => {
            this.setState({forums:response.data.forum });
    }) 
}
   render() {
    const { forums} = this.state;
      return (
         <div>
            <div class="user-container container">
               <div class="tt-tab-wrapper">
                  <FUTabs/>
                  {forums.length > 0  ?
                  <div class="tab-content">
                  <div class="tab-pane active" id="tt-tab-06" role="tabpanel">
                    <div class="tt-wrapper-inner">
                    <div className="tt-categories-list">
            <div className="row">

            { forums && forums.map((forum, key) => (
                            
                           
                <div className="col-md-6 col-lg-4">
                    <div className="tt-item">
                        <div className="tt-item-header">
                            <ul className="tt-list-badge">
                                <li>
                                    <Link to={{ pathname: '/app/forum/details' , state: {   forum_id: forum.id }}} className="tt-color01 tt-badge" style={{backgroundColor: forum.colour ,color:'#fff'}} ><span>{forum.name}</span></Link>
                                  
                                </li>
                            </ul>
                            <h6 className="tt-title"><a href="javascript:void(0)"><IntlMessages id="widgets.topics"/> - {forum.counttopic}</a></h6>
                        </div>
                        <div className="tt-item-layout">
                           <div className="innerwrapper">
                          
                           <p dangerouslySetInnerHTML={{__html:textTruncate(forum.short_desc)}} />
                           </div>
                           <div className="innerwrapper">
                                <h6 className="tt-title"><IntlMessages id="sidebar.categories"/></h6>
                                <ul className="tt-list-badge">
                                {
                                   forum.categories.map((category, key) => (
                                        <li><a href="javascript:void(0)"><span className="tt-badge">{category.name}</span></a></li>

                                    ))}
                                 
                                </ul>
                           </div>
                           <a href="javascript:void(0)" className="tt-btn-icon">
                                <i className="tt-icon"><svg><use xlink href="#icon-favorite"></use></svg></i>
                            </a>
                        </div>
                    </div>
                </div>
                )) }
                  <div className="col-12">
                    <div className="tt-row-btn">
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

