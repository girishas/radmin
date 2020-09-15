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

import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import sagaMiddlewareFactory from 'redux-saga';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Sound from 'react-sound';
import AppConfig from '../../../../constants/AppConfig';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { timeAgo, getTheDate , checkRoleAuth, print_tr_id ,user_id,get_plan_id_by_name} from "Helpers/helpers";
//import soundfile from 'Assets/sound/notification1.wav';
export default class Donation extends Component {

	state = {
		addNewAddressDetail: this.props.user ? this.props.user : null,
		donations: [],
		loading: false,
		isSound:false,
		openViewUserDialog: false, 
		selectedTransaction:null,
		isAnonymous:false,
	};


	getInfo(){
		let self = this;
		api.post('transactions_donation_user_id', { id: user_id() },{
			headers: {'User-Id':user_id()}
		})
			.then((response) => {
				self.setState({ donations: response.data.data });

			})
			.catch(error => {
				// error hanlding
			})
	}
	componentDidMount() {
		this.getInfo();

	
	
	}


		viewUserDetail(data) {
			console.log(data.is_subscription_canceled)
		  	this.setState({ openViewUserDialog: true, selectedTransaction: data });
	   }

	   handleChangeNew(key,value){
			let self = this;
			self.setState({ loading:true });
			api.post('makeAllDonationAnonymous', { id: user_id(), value: value, },{
				headers: {'User-Id':user_id()}
			})
			.then((response) => {
				this.getInfo();
				self.setState({ donations: response.data.data,loading:false });
			})

			this.setState({isAnonymous: !value});
	  }
	render() {
		const { loading, donations ,selectedTransaction,isAnonymous} = this.state;
		const foldername = 'forum_images'
		return (
			<div>
			<div className="row mb-5" >
				
					<div className="col-md-3"> 
						<a href={AppConfig.front_web_url+"pay-it-forward"}><Button className="btn btn-primary text-white"><IntlMessages id="sidebar.SupportAProject" /></Button></a>
					</div>
					<div className="col-md-3">
					<a href={AppConfig.front_web_url+"pay-it-forward"}><Button className="btn btn-primary text-white"><IntlMessages id="button.donateAZacToChild" /></Button></a>
					</div>
				</div>


			<div className="row">
				
			
					<div className="table-responsive">
						
						<table className="table table-middle table-hover mb-0">
							<thead>
								
							<tr className="bg-primary text-white">
                           <th><IntlMessages id="components.TransactionId" /></th>
                           
                           <th><IntlMessages id="login.emailaddress" /></th>
                           <th><IntlMessages id="topsupporters.amount" /></th>
                           <th><IntlMessages id="sidebar.campaign" /></th>
                           <th><IntlMessages id="components.Annonymous" /></th>
                         
                           <th><IntlMessages id="components.CreatedAt" /></th>
                           <th><IntlMessages id="widgets.action" /></th>
                        </tr>
							
							</thead>
							<tbody>
								{donations && donations.map((transaction, key) => (
									 <tr key={key}>
									 <td>{transaction.payment_type == 0 ? 'Manual' :print_tr_id(transaction.amount , transaction.payment_type ,transaction.stripe_id , transaction.paypal_tx )}</td>
									  <td>{transaction.email}</td>
									  <td>{transaction.amount}</td>
									  <td>{ transaction.campaign && transaction.campaign.name}</td>
									   <td>{transaction.isAnonymous == 1 ?
								<span className={`badge badge-success badge-pill`}><IntlMessages id="components.Annonymous" /></span> : <span className={`badge badge-danger badge-pill`}><IntlMessages id="components.not" /></span>
							 }</td>
							  
									  <td>{timeAgo(transaction.created_at)}</td>
									  <td className="list-action">
											<a href="javascript:void(0)" onClick={() => this.viewUserDetail(transaction)}><i className="ti-eye"></i></a>
										   
										
										 </td>
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
					<FormGroup>
						<FormControlLabel
						control={
							<Checkbox
								checked={isAnonymous}
								onChange={() => this.handleChangeNew('isAnonymous',isAnonymous)}
								color="primary"
							/>}
						label={<IntlMessages id="label.makeMyDonationAnonymous"/>}
						/>
					</FormGroup>
					{loading &&
						<RctSectionLoader />
					}
			
			<Dialog
               onClose={() => this.setState({ openViewUserDialog: false })}
               open={this.state.openViewUserDialog}
            >
               <DialogContent>
                  {selectedTransaction !== null &&
                     <div>
                        <div className="clearfix d-flex">
                              <div className="media-body">
                                 <p><IntlMessages id="components.email" />: <span className="fw-bold">{selectedTransaction.email}</span></p>
                                 <p><IntlMessages id="sidebar.name" />: <span className="fw-bold">{selectedTransaction.full_name}</span></p>
                                 <p><IntlMessages id="widgets.phone" />: <span className="fw-bold">{selectedTransaction.phone}</span></p>
                                 <p><IntlMessages id="components.address1" />: <span className="fw-bold">{selectedTransaction.address_1}</span></p>
                                 <p><IntlMessages id="components.address2Optional" />: <span className="fw-bold">{selectedTransaction.address_2}</span></p>
                                 <p><IntlMessages id="components.city" />: <span className="fw-bold">{selectedTransaction.city}</span></p>
                                 <p><IntlMessages id="components.state" />: <span className="fw-bold">{selectedTransaction.state}</span></p>
                                 <p><IntlMessages id="components.country" />: <span className="fw-bold">{selectedTransaction.country}</span></p>
                                 <p><IntlMessages id="components.zip" />: <span className="fw-bold">{selectedTransaction.zip}</span></p>
                                 {selectedTransaction.type == '0' &&
                                 <p><IntlMessages id="sidebar.campaign" />: <span className="fw-bold">{selectedTransaction.campaign.name}</span></p>
                                 
                                 }
                                 <p><IntlMessages id="topsupporters.amount" />: <span className="fw-bold">{selectedTransaction.amount}</span></p>
                               
                               
                                 <p><IntlMessages id="components.TransactionId" />: <span className="fw-bold">  {print_tr_id(selectedTransaction.amount , selectedTransaction.payment_type ,selectedTransaction.stripe_id , selectedTransaction.paypal_tx )}</span></p>
                                 
                                 
                                 {selectedTransaction.isAnonymous == 1 && (selectedTransaction.isAnonymous == 1 ?
                     <p><IntlMessages id="components.Annonymous" />: <span className={`badge badge-success badge-pill`}><IntlMessages id="components.Annonymous" /></span></p> : <p><IntlMessages id="components.Annonymous" />: <span className={`badge badge-danger badge-pill`}><IntlMessages id="components.not" /></span></p>
                  )}
                                 <p>Created At: {timeAgo(selectedTransaction.created_at)}</p>
                                 {/* <p><IntlMessages id="widgets.Comment" />: <span className="fw-bold">{selectedTransaction.comment}</span></p> */}
                              </div>
                        </div>
                     </div>
                  }
               </DialogContent>
            </Dialog>

			</div>
			</div>

		);
	}
}
