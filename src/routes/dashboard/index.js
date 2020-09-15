/**
 * Ecommerce Dashboard
 */

import React, { Component } from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { Route, Redirect } from 'react-router'
import { Link } from 'react-router-dom';
// rct collapsible card
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import {
	VisitorAreaChartWidget,
	SalesAreaChartWidget,
	OrdersAreaChartWidget,
	RecentOrdersWidget,
	SupportRequest,
	Notifications,
	TopSellingWidget,
	OverallTrafficStatusWidget,
	ProductReportsWidget,
	OnlineVisitorsWidget,
	TodayOrdersStatsWidget,
	BookingInfo,
	NewOrderCountdown,
	FollowersWidget,
	Notes
} from "Components/Widgets";
import {checkRoleAuth,hubCheckPaths,timeAgo, user_id} from "Helpers/helpers";
// widgets data
import {
	visitorsData,
	salesData,
	ordersData,
	topSellingProducts,
	trafficStatus,
	onlineVisitorsData,
} from './data';
import Avatar from '@material-ui/core/Avatar';
// api
import api from 'Api';
import AppConfig from 'Constants/AppConfig';

export default class Dashboard extends Component {
	
	/*componentDidMount(){
       axios.post('http://127.0.0.1:8000/items')
       .then(response => {

	         const ordersData = {
		    	chartData: {
			      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			      data: [600, 500, 650, 470, 520, 700, 500, 650, 580, 500, 650, 700]
			   },
			   today: 6544,
			   totalRevenue: 9125
		    }
		     this.setState({ ordersData });
         console.log(this.setState);
       })
       .catch(function (error) {
         console.log(error);
       })
     }*/


	 
	// componentDidMount(){
	// 	//document.getElementById("myBtn").click();
		
	// }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            topics: [],
            totalRecords: null,
            results: null,
            search: '',
            currentPageData: [],
            ideas: [],
        }
    }
    getInfo() {
		let params = {
			limit: 7,
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
	
	getIdeas() {
		api.get('forum/get_ideas', {
		  params: {
			user_id:user_id(),
			'limit':5
		  }
		}).then((response) => {
				const ideas =  response.data.ideas;
				const subjects =  response.data.subjects;
				const plannedIdeasCount =  response.data.plannedIdeasCount;
				const newIdeasCount =  response.data.newIdeasCount;
				const progressIdeasCount =  response.data.progressIdeasCount;
				const completedIdeasCount =  response.data.completedIdeasCount;
				const totalIdeasCount =  response.data.totalIdeasCount;
				console.log('data',ideas);
			   
				this.setState({
				  subjects:subjects,
				  ideas:ideas,
				  newIdeasCount:newIdeasCount,
				  plannedIdeasCount:plannedIdeasCount,
				  progressIdeasCount:progressIdeasCount,
				  completedIdeasCount:completedIdeasCount,
				  totalIdeasCount:totalIdeasCount
			  });
	
	  
		   })
		   .catch(error => {
			  // error hanlding
		   })
	 }
    componentDidMount() {
		//alert()
		this.getInfo();
		this.getIdeas();
    }
// componentDidUpdate(){
// 	document.getElementById("myBtn").click();
// }
	render() {
		checkRoleAuth()
		const { match } = this.props;
	  const { topics, currentPageData, results, search, totalRecords,ideas } = this.state;
        if (!topics)
            return null;

        let filteredResult;
        if (search) {
            filteredResult = results;
        } else {
            filteredResult = currentPageData;
        }

			//const {ordersData} = this.state;
		return (
		
			

			<div className="ecom-dashboard-wrapper">
				<Helmet>
					<title>Dashboard</title>
					<meta name="description" content="Chameleon Dashboard" />
				</Helmet>
				<PageTitleBar title={<IntlMessages id="sidebar.dashboard" />} match={match} />
				{/* <Link to={{
						pathname: '/app/user/user-profile-1',
						state: { activeTab: 0,
						user: match }
					}}>
				<div id="myBtn">     </div>
			   
				</Link>  */}
		
			

				<div className="row">
				
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-6 col-lg-6 w-xs-full"
						heading={<IntlMessages id="widgets.RecentTopics" />}
						collapsible
						reloadable
						reloadebleFunction={() => this.componentDidMount()}
						fullBlock
					>
					 <div className="tt-topic-list">
                            <div className="tt-list-header">
                                <div className="tt-col-topic"><IntlMessages id="widgets.topic"/></div>
                                <div className="tt-col-category" style={{width:"35.33333%"}}><IntlMessages id="sidebar.Forum"/></div>
                                {/* <div className="tt-col-category"><IntlMessages id="widgets.category"/></div>
                                <div className="tt-col-category"><IntlMessages id="sidebar.type"/></div> */}
                                {/* <div className="tt-col-value hide-mobile"><IntlMessages id="widgets.likes"/></div> */}
                                <div className="tt-col-value hide-mobile" style={{width:"16.33333%"}}><IntlMessages id="widgets.replies"/></div>
                            
                            </div>
                            {/* <div className="tt-topic-alert tt-alert-default" role="alert">
              <a href="#" target="_blank">4 new posts</a> are added recently, click here to load them.
            </div> */}


                            {filteredResult && filteredResult.map((topic, key) => (
                                // <div className="tt-item tt-itemselect">
                                <div className="tt-item">
                                    <div className="tt-col-avatar" style={{width:"14.33%"}}>

                                        <Link to={{ pathname: '/app/forum/user/activity/' + topic.user_id }} >
                                            <div className="" title={topic.user_full_name}>
                                                {topic.user_photo !== '' && topic.user_photo !== null && topic.user_photo !== 'undefined' ?
                                                    <img src={hubCheckPaths('images') + topic.user_photo} alt={topic.user_photo} className="full-rounded-circle " width="50" height="50" />
                                                    : <Avatar className="mraaa-15">{topic.user_full_name.charAt(0)}</Avatar>
                                                }
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="tt-col-description">
                                        <h6 className="tt-title">
                                            <Link to={{ pathname: '/app/forum/topic-details/' + topic.id }}  >
                                                {/* <svg className="tt-icon">
                            <use xlink href="#icon-pinned"></use>
                            </svg> */}
                                                <span>{topic.title}</span>
                                            </Link>

                                        </h6>
                                        <div className="row align-items-center no-gutters">
                                            <div className="col-11">
                                                <ul className="tt-list-badge">
                                                    <li> <Link to={{ pathname: '/app/forum/details', state: { forum_id: topic.forum_id } }} className="show-mobile tt-color01 tt-badge" style={{ backgroundColor: topic.forum_colour }} style={{ color: '#fff' }} ><span>{topic.forum_name}</span></Link></li>
                                                    {
                                                        topic.tags.map((tag, key) => (
                                                            <li><Link to={{ pathname: '/app/forum/topics', state: { tag_id: tag.tag_id } }}><span className="tt-badge">{tag.tag_name}</span></Link></li>
                                                        ))}
                                                </ul>
                                            </div>
                                            {/* <div className="col-1 ml-auto hide-mobile">
                                                <div className="tt-value">{timeAgo(topic.created_at)}</div>
                                            </div> */}
                                        </div>
                                    </div>
									<div className="tt-col-category" style={{width:"35.66667%"}}><Link to={{ pathname: '/app/forum/details' }} className="tt-color01 tt-badge" style={{ backgroundColor: topic.forum_colour, color: '#fff' }} ><span>{topic.forum_name}</span></Link></div>
                                    {/* <div className="tt-col-category"><span>{topic.category_name}</span></div>
                                    <div className="tt-col-category"><span  title={topic.topic_type_name} className="material-icons"  >{topic.topic_type_icon}</span></div> */}
                                    {/*                 
                <div className="tt-col-category"><span className="tt-color01 tt-badge">{topic.category_name}</span></div> */}
                                    {/* <div className="tt-col-value hide-mobile">{topic.likes}</div> */}
                                    <div className="tt-col-value tt-color-select hide-mobile" style={{width:"16.33333%"}}>{topic.replies}</div>
                                  
                                </div>
                            ))}

                        
                        </div>
                
					</RctCollapsibleCard>


				
	{/*=============================== latest Ideas Submitted============================== */}
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-6 col-lg-6 w-xs-full "
						heading={<IntlMessages id="widgets.latestIdeasSubmitted" />}
						collapsible
						reloadable
						reloadebleFunction={() => this.componentDidMount()}
						//closeable
						fullBlock
					>
				 <div className="tt-topic-list">
                    { ideas && ideas.map((data, key) => (
                            
						<div className="tt-item">
							<div className="tt-col-avatar">

								<Link to={{ pathname: '/app/forum/user/activity/' + data.user_id }} >
									<div className="">
										{data.user_photo !== '' && data.user_photo !== null && data.user_photo !== 'undefined' ?
											<img src={hubCheckPaths('images')+data.user_photo} alt={data.user_photo} className="full-rounded-circle" width="50" height="50" />
											: <Avatar className="full-rounded-circle" style={{height:"50px",width:"50px"}}>{data.user_full_name !== null? data.user_full_name.charAt(0) :''}</Avatar> 
										}
									</div>
								</Link>
							</div>
							<div className="tt-col-description ml-5">
								<h6 className="tt-title">
									<Link to={{pathname: '/app/ideas/details/'+data.id }} >
										{/* <svg className="tt-icon">
											<use xlink href="#icon-pinned"></use>
											</svg> */}
										<span>{" "+data.title}{data.subject_name != null ? " for "+data.subject_name+" " : ""}</span>
									</Link>

								</h6>
							</div>
						</div>
						
					
					))}
					</div>
					</RctCollapsibleCard>

					{/* <RctCollapsibleCard
						colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
						heading={<IntlMessages id="sidebar.topSupporters" />}
						collapsible
						reloadable
						//closeable
						fullBlock
						customClasses="overflow-hidden"
					>
					<iframe width='100%' height='923px' src={AppConfig.front_web_url+"top-supporters-list-frame"} frameborder="0" allowfullscreen></iframe>
					
					</RctCollapsibleCard> */}
				</div>
				
				
			</div>
		)
	}
}
