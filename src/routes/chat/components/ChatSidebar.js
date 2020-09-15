/**
 * Chat Sidebar
 */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';

// components
import UserList from './UserList';
import { checkPath } from "Helpers/helpers";
import IntlMessages from 'Util/IntlMessages';
import api from 'Api';
class ChatSidebar extends Component {

	
	render() {
		const {users} = this.props;
		return (
			<div className="chat-sidebar">
				<div className="user-wrap d-flex justify-content-between">
					{users && <div className="media align-items-center">
						<img
							src={checkPath('users')+users.photo}
							alt="user-profile"
							className="img-fluid rounded-circle mr-3"
							width="50"
							height="50"
						/><div className="media-body mt-1">
							<h3 className="text-white mb-0">{users.full_name}</h3>
						</div>
						<IconButton className="btn-sm text-white">
							<i className="zmdi zmdi-more-vert text-white"></i>
						</IconButton>
					</div>
					}
				</div>
				<UserList />
			</div>
		);
	}
}

const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};

export default connect(mapStateToProps)(ChatSidebar);

