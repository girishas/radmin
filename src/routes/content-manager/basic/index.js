/**
 * Tabs Advance UI Components
 */
import React from 'react';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// components

import ForcedScrollButtons from './components/ForcedScrollButtons';


// intl messages
import IntlMessages from 'Util/IntlMessages';

class FullWidthTabs extends React.Component {

	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};

	render() {
		return (
			<div className="tabs-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.contentManager" />} match={this.props.match} />
				<div className="row">
					<div className="col-sm-12 col-md-12 col-xl-12">
						<ForcedScrollButtons />
					</div>
				</div>
			</div>
		);
	}
}

export default FullWidthTabs;
