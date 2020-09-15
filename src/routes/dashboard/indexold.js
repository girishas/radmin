/**
 * Dasboard Routes
 */
import React, { Component } from 'react'
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

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


 // async components
import {
   AsyncEcommerceDashboardComponent,
   AsyncSaasDashboardComponent,
   AsyncAgencyDashboardComponent,
   AsyncNewsDashboardComponent
} from 'Components/AsyncComponent/AsyncComponent';

const Dashboard = ({ match }) => {
	console.log(match);
	return (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/ecommerce`} />
         <Route path={`${match.url}/ecommerce`} component={AsyncEcommerceDashboardComponent} />
         <Route path={`${match.url}/saas`} component={AsyncSaasDashboardComponent} />
         <Route path={`${match.url}/agency`} component={AsyncAgencyDashboardComponent} />
         <Route path={`${match.url}/news`} component={AsyncNewsDashboardComponent} />
      </Switch>
   </div>
); 
}

export default Dashboard;