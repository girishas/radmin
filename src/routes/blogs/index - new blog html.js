/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import Iframe from 'react-iframe'

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';


import AppConfig from 'Constants/AppConfig';
import {checkRoleAuth} from "Helpers/helpers";



export default class Blog extends Component {


   render() {
      checkRoleAuth();
let last_url =  $(location).attr("href").split('/').pop();
if(last_url=="blog"){
  // require('./assets/css/main.css') 
}
      return (
         <div className="user-management">
             <IntlMessages id='sidebar.blog' defaultMessage='Chameleon | Blog'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.blog" />}
               match={this.props.match}
            />
             <div id="main" className="site-main">
            <div className="layout-medium"> 
            <div id="primary" className="content-area">

                    <div id="content" className="site-content" role="main">
                    
                                    
                        
                        
                        
                        
                        
                        
                        {/* <!--<header className="entry-header">
                        	<h1 className="entry-title">Latest Stories</h1>
                        </header>--> */}
                        
                        
                        
                       
                        
                
                
                        
                        <div className="blog-creative first-full blog-stream">
                        
                        
                        
                        
                        
                            
                            
                            
                            
                            <article className="hentry post has-post-thumbnail">
                                
                                
                                <div className="post-thumbnail" >
                                        
                                    
                                    <header className="entry-header">
                                        
                                        
                                        <div className="entry-meta">
                                            <span className="cat-links">
                                                <a href="#" title="View all posts in Life" rel="category tag">Life</a>
                                            </span>	
                                        </div>
                                        
                                        
                                        
                                        <h2 className="entry-title"><a href="blog-single.html">Embracing Minimalist Lifestyle</a></h2>
                                    
                                        
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <time className="entry-date" datetime="2014-07-13T04:34:10+00:00">July 13, 2014</time>
                                            </span> 
                                            <span className="comment-link">
                                                <a href="#comments">4 Comments</a>
                                            </span>
                                        </div>
                                        
                                        
                                        <p><a href="blog-single.html" className="more-link">View Post</a></p>
                                        
                                    </header>
                                    
                                    
                                </div>
                                 
                                
                            </article>
                            
                            
                        
                        
                        
                        
                        
                        
                        
                        
                        
                            
                            <article className="hentry post has-post-thumbnail">
                            
                                <div className="post-thumbnail post-img" >
                                    <a href="blog-single.html">Gathering with old friends</a>
                                        
                                    
                                    <header className="entry-header">
                                
                                        
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <time className="entry-date" datetime="2014-07-13T04:34:10+00:00">July 13, 2014</time>
                                            </span> 
                                            <span className="comment-link">
                                                <a href="#comments">4 Comments</a>
                                            </span>
                                        </div>
                                        
                                        
                                    </header>
                                    
                                    
                                </div>
                                
                                <div className="post-thumbnail post-desc">
                                        
                                    
                                    <header className="entry-header">
                                        
                                        
                                        <div className="entry-meta">
                                            <span className="cat-links">
                                                <a href="#" title="View all posts in Life" rel="category tag">Life</a>
                                            </span>	
                                        </div>
                                        
                                        
                                        
                                        <h2 className="entry-title"><a href="blog-single.html">Gathering with old friends</a></h2>
                                        
                                        <p><a href="blog-single.html" className="more-link">View Post</a></p>
                                        
                                    </header>
                                    
                                    
                                </div>
                                
                            </article>
                            
                            
                            
                            
                            
                            <article className="hentry post has-post-thumbnail">
                            
                                <div className="post-thumbnail post-img">
                                    <a href="blog-single.html">Gathering with old friends</a>
                                        
                                    
                                    <header className="entry-header">
                                
                                        
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <time className="entry-date" datetime="2014-07-13T04:34:10+00:00">July 13, 2014</time>
                                            </span> 
                                            <span className="comment-link">
                                                <a href="#comments">4 Comments</a>
                                            </span>
                                        </div>
                                        
                                        
                                    </header>
                                    
                                </div>
                            
                                <div className="post-thumbnail post-desc">
                                        
                                    
                                    <header className="entry-header">
                                        
                                        
                                        <div className="entry-meta">
                                            <span className="cat-links">
                                                <a href="#" title="View all posts in Life" rel="category tag">Life</a>
                                            </span>	
                                        </div>
                                        
                                        
                                        
                                        <h2 className="entry-title"><a href="blog-single.html">Step Your Feet On The Ground</a></h2>
                                        
                                        <p><a href="blog-single.html" className="more-link">View Post</a></p>
                                        
                                    </header>
                                    
                                    
                                </div>
                                
                            </article>
                            
                            
                            
                            
                            
                            <article className="hentry post has-post-thumbnail">
                            
                                <div className="post-thumbnail post-img">
                                    <a href="blog-single.html">Gathering with old friends</a>
                                        
                                    
                                    <header className="entry-header">
                                
                                        
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <time className="entry-date" datetime="2014-07-13T04:34:10+00:00">July 13, 2014</time>
                                            </span> 
                                            <span className="comment-link">
                                                <a href="#comments">4 Comments</a>
                                            </span>
                                        </div>
                                        
                                        
                                    </header>
                                    
                                </div>
                            
                                <div className="post-thumbnail post-desc">
                                        
                                    
                                    <header className="entry-header">
                                        
                                        
                                        <div className="entry-meta">
                                            <span className="cat-links">
                                                <a href="#" title="View all posts in Life" rel="category tag">Life</a>
                                            </span>	
                                        </div>
                                        
                                        
                                        
                                        <h2 className="entry-title"><a href="blog-single.html">How To Write Kickass Articles</a></h2>
                                        
                                        <p><a href="blog-single.html" className="more-link">View Post</a></p>
                                        
                                    </header>
                                    
                                    
                                </div>
                                
                            </article>
                            
                            
                            
                            
                            
                            <article className="hentry post has-post-thumbnail">
                            
                                <div className="post-thumbnail post-img">
                                    <a href="blog-single.html">Gathering with old friends</a>
                                        
                                    
                                    <header className="entry-header">
                                
                                        
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <time className="entry-date" datetime="2014-07-13T04:34:10+00:00">July 13, 2014</time>
                                            </span> 
                                            <span className="comment-link">
                                                <a href="#comments">4 Comments</a>
                                            </span>
                                        </div>
                                        
                                        
                                    </header>
                                    
                                </div>
                            
                                <div className="post-thumbnail post-desc">
                                        
                                    
                                    <header className="entry-header">
                                        
                                        
                                        <div className="entry-meta">
                                            <span className="cat-links">
                                                <a href="#" title="View all posts in Life" rel="category tag">Life</a>
                                            </span>	
                                        </div>
                                        
                                        
                                        
                                        <h2 className="entry-title"><a href="blog-single.html">Freelancer Work Schedule</a></h2>
                                        
                                        <p><a href="blog-single.html" className="more-link">View Post</a></p>
                                        
                                    </header>
                                    
                                    
                                </div>
                                
                            </article>
                            
                            
                                                          
                          
                        </div>
                        
                        
                        
               
                    	
                            
                            
                            
                        
                        <nav className="post-pagination">
                            <ul className="pagination">
                              <li className="pagination-first"><a href="#"> First </a></li>
                              <li className="pagination-prev"><a href="#" rel="prev"></a></li>
                              <li className="pagination-num"><a href="#"> 1 </a></li>
                              <li className="pagination-num current"><a href="#"> 2 </a></li>
                              <li className="pagination-num"><a href="#"> 3 </a></li>
                              <li className="pagination-next"><a href="#" rel="next"></a></li>
                              <li className="pagination-last"><a href="#"> Last </a> </li>
                            </ul>
                        </nav>
                        
                        
                        
                        
                        
                        
                            
                        
                        
                        
                        
                    </div>
                    
            
            </div>
                    
            
            
            	
            
            
            </div>
            
        
        
        </div>
        
       
       </div>
      
     
        
        
      );
   }
}
