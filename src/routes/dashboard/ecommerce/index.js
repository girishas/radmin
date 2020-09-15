/**
 * Ecommerce Dashboard
 */

import React, { Component } from 'react'
import { Helmet } from "react-helmet";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

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

// widgets data
import {
	visitorsData,
	salesData,
	ordersData,
	topSellingProducts,
	trafficStatus,
	onlineVisitorsData,
} from './data';

export default class EcommerceDashboard extends Component {
	
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

	render() {
		const { match } = this.props;
		//const {ordersData} = this.state;
		return (
			<div className="ecom-dashboard-wrapper">
				<Helmet>
					<title>Dashboard</title>
					<meta name="description" content="Chameleon Dashboard" />
				</Helmet>
				<PageTitleBar title={<IntlMessages id="sidebar.dashboard" />} match={match} />
				<div className="row">
					<div className="col-sm-6 col-md-6 w-xs-half-block">
						<VisitorAreaChartWidget
							data={visitorsData}
						/>
					</div>

					<div className="col-sm-12 col-md-6 w-xs-half-block">
						<OrdersAreaChartWidget
							data={ordersData}
						/>
					</div>
					{/* <div className="col-sm-6 col-md-4 w-xs-full">
						<SalesAreaChartWidget
							data={salesData}
						/>
					</div> */}
				</div>
				<div className="row">
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
						heading={<IntlMessages id="widgets.supportRequest" />}
						collapsible
						reloadable
						closeable
						fullBlock
						customClasses="overflow-hidden"
					>
						<SupportRequest />
					</RctCollapsibleCard>
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-8 col-lg-8 w-xs-full"
						heading={<IntlMessages id="widgets.RecentOrders" />}
						collapsible
						reloadable
						closeable
						fullBlock
					>
						<RecentOrdersWidget />
					</RctCollapsibleCard>
				</div>
				<div className="row">
					<RctCollapsibleCard
						customClasses="trafic-bar-chart"
						colClasses="col-sm-12 col-md-12 col-lg-5 d-sm-full"
						heading={<IntlMessages id="widgets.overallTrafficStatus" />}
						collapsible
						reloadable
						closeable
						fullBlock
					>
						<OverallTrafficStatusWidget
							chartData={trafficStatus}
						/>
					</RctCollapsibleCard>
					{/* 
					<div className="col-sm-12 col-md-12 col-lg-7 d-sm-full">
						<div className="row">
							<div className="col-sm-6 col-md-6 col-lg-6">
								<div className="dash-cards">
									<Notes />
								</div>
								<NewOrderCountdown />
								<TodayOrdersStatsWidget />
							</div>
							<div className="col-sm-6 col-md-6 col-lg-6">
								<div className="dash-cards-lg">
									<OnlineVisitorsWidget data={onlineVisitorsData} />
								</div>
								<FollowersWidget />
								<BookingInfo />
							</div>
						</div>
					</div>
					This is a comment, one line */}
				</div>
				{/* <div className="row">
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
						heading={<IntlMessages id="widgets.productReports" />}
						collapsible
						reloadable
						closeable
						fullBlock
					>
						<ProductReportsWidget />
					</RctCollapsibleCard>
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
						fullBlock
						customClasses="overflow-hidden"
					>
						<Notifications />
					</RctCollapsibleCard>
					<RctCollapsibleCard
						colClasses="col-sm-12 col-md-4 col-lg-4 w-xs-full"
						heading={<IntlMessages id="widgets.topSellings" />}
						collapsible
						reloadable
						closeable
						fullBlock
					>
						<TopSellingWidget data={topSellingProducts} />
					</RctCollapsibleCard>
				</div>
				This is a comment, one line */}
			</div>
		)
	}
}
