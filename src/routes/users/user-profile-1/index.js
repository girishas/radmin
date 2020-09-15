/**
 * User Profile Page
 */
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Helmet } from "react-helmet";
// Components
import Profile from './component/Profile';
import EmailPrefrences from './component/EmailPrefrences';
import Messages from './component/Messages';
import Address from './component/Address';
import UserBlock from './component/UserBlock';
import ManageAccount from './component/ManageAccount';

// rct card box
import { RctCard } from 'Components/RctCard';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import {checkRoleAuth} from "Helpers/helpers";
// For Tab Content
function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

export default class UserProfile extends Component {
	

	state = {
		activeTab:  0,
		user:localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : null
	}

	handleChange = (event, value) => {
		this.setState({ activeTab: value });
	}

	componentDidMount() {
		if(this.props.location.state ){
			localStorage.setItem("userProfilePage.activeTab",this.props.location.state.activeTab)
		}
      this.setState({ activeTab: localStorage.getItem("userProfilePage.activeTab")});
	}



	render() {
	
		const { activeTab, user } = this.state;
		return (
			<div className="userProfile-wrapper">
				<Helmet>
					<title>User Profile</title>
					<meta name="description" content="User Profile" />
				</Helmet>
				<PageTitleBar title={<IntlMessages id="sidebar.userProfile" />} match={this.props.match} />
				<RctCard>
					<UserBlock user={user}/>
					<div className="rct-tabs">
						<AppBar position="static">
							<Tabs
								value={activeTab}
								onChange={this.handleChange}
								scrollable
								scrollButtons="off"
								indicatorColor="primary"
							>
								<Tab
									icon={<i className="ti-user"></i>}
									label={<IntlMessages id="components.generalInfo" />}
								/>
								<Tab
									icon={<i className="ti-camera"></i>}
									label={<IntlMessages id="components.profilePicture" />}
								/>
								<Tab
									icon={<i className="ti-home"></i>}
									label={<IntlMessages id="components.address" />}
								/>
								<Tab
									icon={<i className="ti-lock"></i>}
									label={<IntlMessages id="widgets.password" />}
								/>
								<Tab
									icon={<i className="ti-settings"></i>}
									label={<IntlMessages id="components.manageAccount" />}
								/>
							</Tabs>
						</AppBar>
						{activeTab === 0 &&
							<TabContainer>
								<Profile user={user} />
							</TabContainer>}
						{activeTab === 1 &&
							<TabContainer>
								<EmailPrefrences user={user} />
							</TabContainer>}
						{activeTab === 2 &&
						<TabContainer>
								<Address user={user} />
							</TabContainer>}
						{activeTab === 3 &&
							<TabContainer>
								<Messages user={user} />
						</TabContainer>}
						{activeTab === 4 &&
							<TabContainer>
								<ManageAccount />
						</TabContainer>}
					</div>
				</RctCard>
			</div>
		);
	}
}
