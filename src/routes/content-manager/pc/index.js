/**
 * Tabs Advance UI Components
 */
import React from 'react';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// components

import ForcedScrollButtons from './components/ForcedScrollButtons';

import {checkRoleAuth} from "Helpers/helpers";
// intl messages
import IntlMessages from 'Util/IntlMessages';
import {
 get_plan_name_by_id
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

class FullWidthTabs extends React.Component {

	state = {
		value: 0,
		loc_os_type: this.props.location.state ? this.props.location.state.os_type : 1,
		loc_os_name: this.props.location.state ? this.props.location.state.os_name : 'PC',
		subs_id: this.props.location.state ? this.props.location.state.subs_id : 1,
		subs_type: this.props.location.state ? this.props.location.state.subs_type : 0,
		child_name: this.props.location.state ? this.props.location.state.child_name : '',
		login_user_id: this.props.location.state ? this.props.location.state.login_user_id : '',
		browser_id: this.props.location.state ? this.props.location.state.browser_id : '',
		browser_name: this.props.location.state ? this.props.location.state.browser_name : '',
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};
	componentWillReceiveProps(){
	
		this.setState({
			value: 0,
			loc_os_type: this.props.location.state ? this.props.location.state.os_type : 1,
			loc_os_name: this.props.location.state ? this.props.location.state.os_name : 'PC',
			subs_id: this.props.location.state ? this.props.location.state.subs_id : 1,
			subs_type: this.props.location.state ? this.props.location.state.subs_type : 0,
			child_name: this.props.location.state ? this.props.location.state.child_name : '',
			login_user_id: this.props.location.state ? this.props.location.state.login_user_id : '',
			browser_id: this.props.location.state ? this.props.location.state.browser_id : '',
			browser_name: this.props.location.state ? this.props.location.state.browser_name : '',
			device: this.props.location.state ? this.props.location.state.device : '',
			serial_number: this.props.location.state ? this.props.location.state.serial_number : '',
        });
	
	} 

	render() {
		checkRoleAuth()

	
		return (
			<div className="tabs-wrapper">
				{/* {this.state.subs_type >1 ?
				<PageTitleBar title={this.state.browser_name +" "+get_plan_name_by_id(AppConfig.plans_array, this.state.subs_type)} match={this.props.match} />
				:
				<PageTitleBar title={this.state.child_name} match={this.props.match} />
			} */}
			<PageTitleBar title={this.state.child_name} match={this.props.match} />
				
				<div className="row">
					<div className="col-sm-12 col-md-12 col-xl-12">
						<ForcedScrollButtons 
							// os_type = {this.state.loc_os_type}  
							// os_name= {this.state.loc_os_name}
							// subs_id= {this.state.subs_id}
							// subs_type= {this.state.subs_type}
							// child_name= {this.state.child_name}
							// login_user_id= {this.state.login_user_id}
							// browser_id= {this.state.browser_id}
							// browser_name= {this.state.browser_name}

							os_type = {this.props.location.state ? this.props.location.state.os_type : 1}  
							os_name= {this.props.location.state ? this.props.location.state.os_name : 'PC'}
							subs_id= {this.props.location.state ? this.props.location.state.subs_id : 1}
							subs_type= { this.props.location.state ? this.props.location.state.subs_type : 0}
							child_name= {this.props.location.state ? this.props.location.state.child_name : ''}
							login_user_id= {this.props.location.state ? this.props.location.state.login_user_id : ''}
							browser_id= {this.props.location.state ? this.props.location.state.browser_id : ''}
							browser_name= {this.props.location.state ? this.props.location.state.browser_name : ''}
							device= {this.props.location.state ? this.props.location.state.device : ''}
							serial_number= {this.props.location.state ? this.props.location.state.serial_number : ''}

		
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default FullWidthTabs;
