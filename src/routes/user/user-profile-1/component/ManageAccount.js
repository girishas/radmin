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
import {user_id } from "Helpers/helpers";
import api from 'Api';
// intl messages
import IntlMessages from 'Util/IntlMessages';

import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import sagaMiddlewareFactory from 'redux-saga';


export default class ManageAccount extends Component {

	state = {
		addNewAddressDetail: this.props.user ? this.props.user : null,
		editUser:{
			do_email_comment:this.props.user.do_email_comment,
			do_email_like:this.props.user.do_email_like,
			do_email_follow:this.props.user.do_email_follow,
		},
		isDefault:false,
	
		loading:false,
	};

	componentDidMount(){
		const {addNewAddressDetail, isDefault} = this.state;
		console.log(addNewAddressDetail);
		if(addNewAddressDetail.status === 0 ){
			this.setState({isDefault:true});
		}
		// this.setState({
		// 	editUser: {
		// 		 ...this.state.editUser,
		// 		 do_email_comment: true,
		// 		 do_email_like: addNewAddressDetail.do_email_like,
		// 		 do_email_follow: addNewAddressDetail.do_email_follow,
		// 	}
		// })
	
	}

	

	/**
	 * Add New Address Hanlder
	 */
	addNewAddress() {
		
		const { isDefault,editUser, addNewAddressDetail} = this.state;

		 let self = this;
		    /* api.post('change-status', addNewAddressDetail)
		         .then((response) => {
		            NotificationManager.success('Account Updated Successfully!');
		         })
		         .catch(error => {
		            // error hanlding
		         })*/
	    

	}




	 deleteUserPermanently() {
      const { addNewAddressDetail } = this.state;

      this.refs.deleteConfirmationDialog.close();
      this.setState({ loading: true });
      let self = this;
       api.post('change-status', addNewAddressDetail,{
		headers: {'User-Id':user_id()}
	})
         .then((response) => {
				self.setState({ loading: false });
            NotificationManager.success(<IntlMessages id="note.AccountDeletedSuccessfully"/>);
         })
         .catch(error => {
            // error hanlding
         })
	 }
	 
	
   cancelDelete(e){
		
		this.setState({
			addNewAddressDetail: {
				
				status: 1,
			},
			isDefault:false
		})
		this.refs.deleteConfirmationDialog.close();
   }


	handleChange(){
		const{ isDefault, addNewAddressDetail } = this.state;
		let checked;
		let value;
		if(isDefault === true){
			checked = false;
			value = 1;
		} else {
			checked = true;
			value = 0;
		}
		if(isDefault === false){
			this.refs.deleteConfirmationDialog.open();
		}
		this.setState({
			addNewAddressDetail: {
				...addNewAddressDetail,
				status: value,
			},
			isDefault:checked
		})
	}
	
	handleChangeNew(key,value){


	  this.setState({
			editUser: {
				 ...this.state.editUser,
				 [key]: !value
			}
	 });
	}
	onUpdate(){
		const { editUser } = this.state;
		this.setState({ loading: true });
		let self = this;
		 api.post('update-user-notification', 
		 	{
				 'id':this.props.user.id ,
				 'do_email_comment':editUser.do_email_comment ,
				 'do_email_follow':editUser.do_email_follow ,
				 'do_email_like':editUser.do_email_like ,
				

			 }
			 ,{
				headers: {'User-Id':user_id()}
			}
		 )
			 .then((response) => {
		self.setState({ loading: false });
					NotificationManager.success(<IntlMessages id="note.ProfileUpdatedSuccessfully"/>);
			 })
			 .catch(error => {
					// error hanlding
			 })
	}

	render() {
		const { isDefault, addNewAddressDetail, loading ,editUser} = this.state;
		return (
			<div className="row">
			<div className="col-md-6">
			<div className="address-wrapper">
				<h2 className="heading"><IntlMessages id="widgets.NotifyMeViaEmail"/></h2>
				
				<div className="w-50">
				<Form>
						
							<FormGroup>
									<FormControlLabel
									control={
										<Checkbox
											checked={editUser.do_email_comment}
										   onChange={() => this.handleChangeNew('do_email_comment',editUser.do_email_comment)}
											
											color="primary"
										/>
									}
									label={<IntlMessages id="widgets.WhenSomeoneRepliesToMyThread"/>}
								/>
								</FormGroup>
								<FormGroup>
									<FormControlLabel
									control={
										<Checkbox
											checked={editUser.do_email_like}
										   onChange={() => this.handleChangeNew('do_email_like',editUser.do_email_like)}
											
											color="primary"
										/>
									}
									label={<IntlMessages id="widgets.WhenSomeoneLikesMyThreadOrReply"/>}
								/>
								</FormGroup>	

								<FormGroup>
									<FormControlLabel
									control={
										<Checkbox
											checked={editUser.do_email_follow}
										   onChange={() => this.handleChangeNew('do_email_follow',editUser.do_email_follow)}
											
											color="primary"
										/>
									}
									label={<IntlMessages id="widgets.WhenSomeoneFollow"/>}
								/>
								</FormGroup>	
								<Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdate()}>Update</Button>	
									
							
						</Form>



				</div>
				
				
			</div>

			</div>
			<div className="col-md-6">
			{/* <div className="address-wrapper">
				<h2 className="heading"><IntlMessages id="widgets.closeAccount" /></h2>
				
				<div className="w-50">
				<Form>
							
											<FormGroup>
													<FormControlLabel
													control={
														<Checkbox
															checked={isDefault}
															onChange={() => this.handleChange()}
															
															color="primary"
														/>
													}
													label={<IntlMessages id="widgets.closeAccount"/>}
												/>
												</FormGroup>
												
							
						</Form>



				</div>
				
				
			</div> */}

			</div>

			{loading &&
                  <RctSectionLoader />
               }
				 <DeleteConfirmationDialog
	               ref="deleteConfirmationDialog"
	               title={<IntlMessages id="validation.SureUserCloseAccount"/>}
	               message={<IntlMessages id="validation.SureUserCloseAccountMessage"/>}
				   onConfirm={() => this.deleteUserPermanently()}
				   onCancel={(e) => this.cancelDelete()}
	            />
			</div>
			
		);
	}
}
