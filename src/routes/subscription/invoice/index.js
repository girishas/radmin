/**
 * Invoice
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card
import { RctCard } from 'Components/RctCard/index';
// api
import api from 'Api';
//date
import { timeAgo, getTheDate ,convertDateToTimeStamp ,checkRoleAuth } from "Helpers/helpers";
export default class Invoice extends Component {

	state = {
		
		transaction: this.props.location.state.transaction ? this.props.location.state.transaction : 0,
		company_info:null,
		invoice:null,
		serialNumbers:[]

	}

	componentDidMount() {
		this.getInvoice();
	}



	getInvoice() {
		
	const path = window.location.href;
    var subPatharr = path.split('/');
	const trId =	subPatharr[subPatharr.length-1];

	 	api.get('get-invoice', {
		  params: {
			'id': this.state.transaction.id,
		  }
		})
		.then((response) => {
			const invoice =  response.data.transection;
			const company_info =  response.data.company_info;
			const serialNumbers =  response.data.serialNumbers;
			this.setState({ company_info : company_info , invoice : invoice , serialNumbers : serialNumbers });
		})
		.catch(error => {
		   // error hanlding
		})
  }



	render() {
		checkRoleAuth()
		const{company_info , invoice , transaction ,serialNumbers } = this.state;
		const regex = /(<([^>]+)>)/ig;

		console.log('Akshitg');
		console.log(transaction);

		if(!company_info)
		return null;
		
		return (
			<div className="invoice-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.invoice" />} match={this.props.match} />
				<div className="row">
					<div className="col-sm-12 col-md-12 col-xl-10 mx-auto">
						<RctCard>
							{/* <div className="invoice-head text-right">
								<ul className="list-inline">
									<li><a href="javascript:void(0);"><i className="mr-10 ti-email"></i> Email</a></li>
									<li><a href="javascript:void(0);"><i className="mr-10 ti-printer"></i> Print</a></li>
								</ul>
							</div> */}
							<div className="p-50">
								<div className="d-flex justify-content-between mb-50">
									<div className="sender-address">
										<div className="invoice-logo mb-30">
											<img src={require('Assets/img/zac_browser_logo_wt.png')} style={{ background: '#808281' }}  alt="session-logo" className="img-fluid" width="140" height="37" />
										</div>
										<div className="address">
											 <span>{company_info.street_1},{company_info.street_2}</span>
											<span>{company_info.city}, {company_info.state}, {company_info.country_id}</span>
											<span>{company_info.zip} , {company_info.mobile}</span> 
										</div>
										
									</div>
									<div className="invoice-address text-right">
										<span>Invoice: #958{invoice.id}</span>
										<span>{getTheDate(convertDateToTimeStamp(invoice.created_at))}</span>
									</div>
								</div>
								<div className="d-flex justify-content-between mb-30 add-full-card">
									<div className="add-card">
										<h4 className="mb-15">To</h4>
										<span className="name">{invoice.full_name}</span>
										<span>{invoice.address_1}</span>
										<span>{invoice.address_2}, {invoice.city}, {invoice.state}</span>
										<span>{invoice.country}, {invoice.zip}</span>
										<span>Phone: {invoice.phone}</span>
										<span>Email: {invoice.email}</span>
									</div>
									{/* <div className="add-card">
										<h4 className="mb-15">Ship To</h4>
										<span className="name">Jack Perez</span>
										<span>2nd Floor</span>
										<span>St John Street, Aberdeenshire 2541</span>
										<span>United Kingdom</span>
										<span>Phone: 031-432-678</span>
										<span>Email: youemail@gmail.com</span>
									</div> */}
								</div>
								<div className="order-status mb-30">
									<span>Order Date: {getTheDate(convertDateToTimeStamp(invoice.created_at), 'MMMM DD, Y')}</span>
									<span>Order Status: Complete</span>
									
									<span>Transaction ID: {transaction.payment_type === 1?transaction.stripe_id:transaction.paypal_tx}</span>
									{serialNumbers && serialNumbers.map((serialNumber, key) => (
										<span>Device ID: {	serialNumber.serial_number}</span>
										))} 
								</div>
								<div className="table-responsive mb-40">
									<table className="table table-borderless">
										<thead>
											<tr>
												<th>Name</th>
												<th>Description</th>
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
										
												<tr >
													 <td>{transaction.type === 1?transaction.plan_name:transaction.campaign.name}</td>
													 <td>{transaction.type === 1?transaction.plan_name:transaction.campaign.desciption.replace(regex, '')}</td>

												
													<td>$ {transaction.amount}</td> 
												</tr>
								
											
										
											<tr>
												<td>&nbsp;</td>
										
												<td className="fw-bold">Total</td>
												<td>$ {transaction.amount}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div className="note-wrapper row">
									<div className="invoice-note col-sm-12 col-md-8">
										<h2 className="invoice-title">Note</h2>
										<p className="fs-14">Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem plugg dopplr jibjab, movity jajah plickers sifteo edmodo ifttt zimbra.</p>
									</div>
									<div className="totle-amount col-sm-12 col-md-4 text-right">
										<h2 className="invoice-title">$ {transaction.amount}</h2>
										 
										{/* <Button variant="raised" className="btn-success text-white btn-icon"><i className="ti-wallet mr-10"></i> <IntlMessages id="components.payNow" /></Button>
									 */}
									</div>
								</div>
							</div>
						</RctCard>
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
 
