/**
 * Address Page
 */
import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {
	FormGroup,
	Form,
	Label,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';

import { NotificationManager } from 'react-notifications';

import api from 'Api';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { user_id ,checkPaths } from "Helpers/helpers";
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import sagaMiddlewareFactory from 'redux-saga';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Sound from 'react-sound';
import AppConfig from '../../../../constants/AppConfig';
//import soundfile from 'Assets/sound/notification1.wav';
export default class Badges extends Component {

	state = {
		addNewAddressDetail: this.props.user ? this.props.user : null,
		badges: [],
		loading: false,
		isSound:false,
	};

	componentDidMount() {


	
		let self = this;
		api.post('forum/get-user-badges', { id: user_id() },{
			headers: {'User-Id':user_id()}
		})
			.then((response) => {
				self.setState({ badges: response.data.badges });
				var  created_badge_array  = response.data.created_badge_array
				created_badge_array.map((headers, key) => {
					self.setState({ isSound: true});
					
					//var newaa = <IntlMessages id={headers} />+"headers has been assign to you.";
					var newaa = headers;
					//newaa =  <IntlProvider locale={'en'} messages={headers}/>
					NotificationManager.success(newaa);
				})
			
			})
			.catch(error => {
				// error hanlding
			})
	}




	render() {
		const { loading, badges , isSound} = this.state;
		const foldername = 'forum_images'
		return (

			<div className="row">
				{isSound &&
				<audio ref="audio_tag" src={AppConfig.chameleon_web_url+"public/audio/notification.mp3"}  autoPlay/> 
				}
					<div className="table-responsive">
						
						<table className="table table-middle table-hover mb-0">
							<thead>
								<tr>
									<th>{<IntlMessages id="sidebar.image" />}</th>
									<th>{<IntlMessages id="sidebar.name" />}</th>
									<th>{<IntlMessages id="widgets.description" />}</th>
								</tr>
							</thead>
							<tbody>
								{badges && badges.map((user, key) => (
									<tr key={key}>
										<td><div className="media">
											{user.icon !== '' && user.icon != null && user.icon !== 'undefined' ?
												<img src={checkPaths('forum_images') + user.icon} alt={user.name} className="rounded-circle mr-15" width="50" height="50" />
												: <Avatar className="mr-15">{user.name.charAt(0)}</Avatar>
											}
										</div>
										</td>
										<td>{<IntlMessages id={user.name} />}</td>
										{/* <p dangerouslySetInnerHTML={{__html:user.short_desc}} /> */}
										{/* <td> 
											
										<IntlMessages id={dangerouslySetInnerHTML={__html:user.short_desc} }/>
										</td> */}
										<td>{<IntlMessages id={user.short_desc} />}</td>
							
									</tr>
								))}
							</tbody>
							<tfoot className="border-top">
								<tr>
									<td colSpan="100%">

									</td>
								</tr>
							</tfoot>
						</table>
					</div>
					{loading &&
						<RctSectionLoader />
					}
			


			</div>

		);
	}
}
