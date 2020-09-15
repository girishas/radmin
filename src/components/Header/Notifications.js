/**
 * Notification Component
 */
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {user_id, timeAgo, textTruncate, hubCheckPaths, pathForxml  , convertDateToTimeStamp,getTheDate ,notification_text} from "Helpers/helpers";
// api
import api from 'Api';
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { checkPaths } from '../../helpers/helpers';
class Notifications extends Component {

  state = {
		notifications: null,
		user_id:user_id(),
		totalRecords:0,
  }

  componentDidMount() {
		this.getNotifications();
		setInterval(this.getNotifications.bind(this), 10000);
  }

  // get notifications
  async getNotifications() {

 try {
	const settings = {
		method: 'GET',
		// headers: {
		// 		'User-Id': user_id(),
		// }
	}
			const res = await fetch(AppConfig.chameleon_web_url+'api/forum/get-notifications?user_id='+user_id(),settings)
			const blocks = await res.json();
			this.setState({ notifications: blocks.notifications  , totalRecords : blocks.totalRecords});
		} catch (e) {
			console.log(e);
		}







		// api.get('forum/get-notifications', {
		// 			params: {
							
		// 					user_id: this.state.user_id,
					
		// 			}
		// 	})
    //   .then((response) => {
				
    //     this.setState({ notifications: response.data.notifications  , totalRecords : response.data.totalRecords});
    //   })
     
	}
	



	changeNotificationStatus(){
		
		api.get('forum/mark-notifications-read', {
			params: {
					user_id: this.state.user_id,
			}
		})
		.then((response) => {
		  setTimeout(() => {
				this.setState({  totalRecords : 0 });
		 }, 2000);
		
		})
 
	}
  render() {

		const { notifications,totalRecords } = this.state;
		//console.log('notifications',notifications)
		//console.log('totalRecords',totalRecords)
    return (
      <UncontrolledDropdown nav className="list-inline-item notification-dropdown">
        <DropdownToggle nav className="p-0">
          <Tooltip title="Notifications" placement="bottom" onClick={this.changeNotificationStatus.bind(this)} >
            <IconButton className="donotshake" aria-label="bell">
              <i className="zmdi zmdi-notifications-active"></i>
							{totalRecords && totalRecords > 0 ?
             	 <Badge color="danger" className="badge-xs badge-top-right rct-notify">{totalRecords}</Badge>
								:
							''
							}
            </IconButton>
          </Tooltip>
        </DropdownToggle>
        <DropdownMenu right>
		  	<div className="dropdown-content">
					<div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
						<span className="text-white font-weight-bold">
							<IntlMessages id="widgets.recentNotifications" />
						</span>
						{totalRecords && totalRecords > 0 ?
							<Badge color="warning">{totalRecords} NEW</Badge>
							:''
						}
					</div>
          		<Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
						<ul className="list-unstyled dropdown-list">
						{notifications && notifications.map((notification, key) => (
								notification.notification_type != 6 ?
							<li key={key}>
								<div className="media">
								<div className="mr-10">
									
									<Link to={{pathname: '/app/forum/user/activity/'+notification.sender_user_id }} title={notification.user_full_name} >
								
												
														{notification.user_photo !== '' && notification.user_photo !== null && notification.user_photo !== 'undefined' ?
														<img src={hubCheckPaths('images')+notification.user_photo} alt={notification.user_photo} className="full-rounded-circle mr-15" width="50" height="50" />
														: <Avatar className="mr-15">{notification.user_full_name !== null? notification.user_full_name.charAt(0) :'P'.charAt(0)}</Avatar>
														}
	
										</Link>
								
								</div>
								<div className="media-body pt-1">
									<div className="d-flex justify-content-between">
										<h5 className="mb-1 text-primary">{notification.user_full_name}</h5>
										<span className="text-muted fs-12">{timeAgo(notification.created_at)}</span>
									</div>
									<span className="text-muted fs-12 d-block">{notification_text(notification)}</span>
								
								</div>
								</div>
							</li>
						:
							<li key={key}>
							<div className="media">
							<div className="mr-10">
								{notification.badge_icon !== null|| notification.badge_icon != ''  ?
							<img src={checkPaths('forum_images')+notification.badge_icon} alt={notification.badge_icon} className="full-rounded-circle mr-15" width="50" height="50" />
							 : <Avatar className="mr-15">{notification.badge_icon !== null? notification.badge_icon.charAt(0) :'P'.charAt(0)}</Avatar>
								}
							</div>
							<div className="media-body pt-1">
								<div className="d-flex justify-content-between">
									<h5 className="mb-1 text-primary">{notification.user_full_name}</h5>
									<span className="text-muted fs-12">{timeAgo(notification.created_at)}</span>
								</div>
								<span className="text-muted fs-12 d-block"> <IntlMessages id={notification.badge_name} /> has been assign to you</span>

							</div>
							</div>
							</li>
						))}
						</ul>
					</Scrollbars>
				</div>
          	<div className="dropdown-foot p-2 bg-white rounded-bottom">
						<Link to={{pathname: '/app/notifications/' }} >
							{<Button
								variant="raised"
								color="primary"
								className="mr-10 btn-xs bg-primary"
							>
							<IntlMessages id="button.viewAll" />
								
							</Button>}
						</Link>
							{totalRecords == 0 &&
							<span className="fw-normal text-dark font-weight-bold font-xs">
								<IntlMessages id="widgets.no_new_messages" /> 
							</span>
							}
						</div>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export default Notifications;
