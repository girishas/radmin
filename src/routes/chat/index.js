/**
* Chat
*/
import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
// components
import ChatArea from './components/ChatArea';
import ChatSidebar from './components/ChatSidebar';
import UserList from './components/UserList';
import api from 'Api';
import { checkPath } from "Helpers/helpers";
import IconButton from '@material-ui/core/IconButton';

const drawerWidth = 310;

const styles = theme => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		width: '100%',
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: 230,
		[theme.breakpoints.up('md')]: {
			position: 'relative',
			width: drawerWidth
		},
		backgroundColor: '#fff'
	},
	content: {
		flexGrow: 1
	},
});

class ChatList extends Component {

	state = {
		mobileOpen: false,
		users:null
	};

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	}

	componentWillMount() {
		console.log(this.props);
        // Asynchronously load the initial data
        //this.props.loadInitialData(this.props.loadParameter);
    }

	

	render() {
		const { classes, theme, user} = this.props;
		let users = JSON.parse(user);
	
		return (
			<div className="chat-wrapper">
				<Helmet>
					<title>Support</title>
					<meta name="description" content="Chameleon Support" />
				</Helmet>
				<div className={classes.root}>
					<Hidden mdUp className="user-list-wrap">
						<Drawer
							variant="temporary"
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={this.state.mobileOpen}
							onClose={this.handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper,
							}}
							ModalProps={{
								keepMounted: true,
							}}
						>
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
								
								<UserList user={user} />
							</div>
						</Drawer>
					</Hidden>
					<Hidden smDown implementation="css" className="user-list-wrap">
						<Drawer
							variant="permanent"
							open
							classes={{
								paper: classes.drawerPaper,
							}}
						>
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
								<UserList user={user}/>
							</div>
						</Drawer>
					</Hidden>
					<div className={`chat-content ${classes.content}`}>
						<ChatArea onMenuIconPress={this.handleDrawerToggle} authUser={user}/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
};


export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChatList));
