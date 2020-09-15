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


export default class ManageAccount extends Component {

	state = {
		addNewAddressDetail: localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : null,
		isDefault:false,
	};

	componentDidMount(){
		const {addNewAddressDetail, isDefault} = this.state;
		if(addNewAddressDetail.status === 0 ){
			this.setState({isDefault:true});
		}
	}

	

	/**
	 * Add New Address Hanlder
	 */
	addNewAddress() {
		const { isDefault, addNewAddressDetail } = this.state;
		 let self = this;
		     api.post('change-status', addNewAddressDetail)
		         .then((response) => {
		         	localStorage.setItem('user_id', JSON.stringify(response.data.data));

		            NotificationManager.success('Account Updated Successfully!');
		         })
		         .catch(error => {
		            // error hanlding
		         })
	    

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
		this.setState({
			addNewAddressDetail: {
				...addNewAddressDetail,
				status: value
			},
			isDefault:checked
		})
	}
	

	render() {
		const { isDefault, addNewAddressDetail } = this.state;
		return (
			<div className="address-wrapper">
				<h2 className="heading"><IntlMessages id="widgets.closeAccount" /></h2>
				
				<div className="w-50">
						<Form>
							<div className="row">
							<div className="col-md-6">
							<FormGroup>
									<FormControlLabel
									control={
										<Checkbox
											checked={isDefault}
										   onChange={() => this.handleChange()}
											
											color="primary"
										/>
									}
									label="Close Your Account"
								/>
								</FormGroup>
									</div>
								</div>	
							<Button variant="raised" color="primary" className="text-white" onClick={() => this.addNewAddress()}>Save</Button>
						</Form>
				</div>
				
			</div>
		);
	}
}
