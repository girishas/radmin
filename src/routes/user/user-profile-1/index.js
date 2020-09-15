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
import Badges from './component/Badges';
import Donation from './component/Donation';

// rct card box
import { RctCard } from 'Components/RctCard';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { connect } from 'react-redux';
import api from 'Api';
import {checkRoleAuth, user_id} from "Helpers/helpers";
// For Tab Content
function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

class UserProfile extends Component {

	state = {
		activeTab:  0,
		userData:null,
	}

	handleChange = (event, value) => {
		this.setState({ activeTab: value });
	}


    componentDidMount(){
			checkRoleAuth()
			let params = new URLSearchParams(this.props.location.search)
			//let params = queryString.parse(this.props.location.search)
			const tab = params.get('t')


			if(this.props.location.state ){
				localStorage.setItem("userProfilePage.activeTab",this.props.location.state.activeTab)
			}
			if(tab){
				this.setState({ 
					activeTab: parseInt(tab),
				});
			}else{
				this.setState({ 
					activeTab: parseInt(localStorage.getItem("userProfilePage.activeTab")),
				});
			}


	 	
      api.get('user-detail', {
            params: {
              id:user_id()
			},
						headers: {'User-Id':user_id()},

      })
      .then((response) => {
            this.setState({ userData:response.data });
         })
         .catch(error => {
				 })
				 
    }




	render() {

		const { activeTab , userData} = this.state;
	
		if(!userData)
          return null;

		return (
			<div className="userProfile-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.userProfile" />} match={this.props.match} />
				<RctCard>
					<UserBlock/>
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
									icon={<i className="ti-medall"></i>}
									label={<IntlMessages id="sidebar.badges" />}
								/>
								<Tab
									icon={<i className="ti-settings"></i>}
									label={<IntlMessages id="widgets.emailNotifications" />}
								/>
								<Tab
									icon={<i className="ti-heart"></i>}
									label={<IntlMessages id="sidebar.myDonations" />}
								/>
							</Tabs>
						</AppBar>
						{activeTab === 0 &&
							<TabContainer>
								<Profile user={userData} />
							</TabContainer>}
						{activeTab === 1 &&
							<TabContainer>
								<EmailPrefrences user={userData} />
							</TabContainer>}
						{activeTab === 2 &&
							<TabContainer>
								<Address user={userData} />
							</TabContainer>}
						{activeTab === 3 &&
							<TabContainer>
								<Messages user={userData} />
							</TabContainer>}
						{activeTab === 4 &&
							<TabContainer>
								<Badges user={userData}/>
							</TabContainer>}
						{activeTab === 5 &&
							<TabContainer>
								<ManageAccount user={userData}/>
							</TabContainer>}
						{activeTab === 6 &&
							<TabContainer>
								<Donation user={userData}/>
							</TabContainer>}
					</div>
					
				</RctCard>
			</div>
		);
	}
}


const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
 	return { user };
  };
 
export default connect(mapStateToProps)(UserProfile);