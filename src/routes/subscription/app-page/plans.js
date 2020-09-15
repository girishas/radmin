/**
 * Pricing
 */
import React, { Component } from 'react';
import { Button } from 'reactstrap';

import Switch from 'react-toggle-switch';
import { Helmet } from "react-helmet";
// components
import PricingBlockV1 from 'Components/Pricing/PricingBlockV1';
import PricingBlockV2 from 'Components/Pricing/PricingBlockV2';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
// component
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import ReactTooltip from 'react-tooltip';
import { get_plan_name_by_id } from "Helpers/helpers";
// components
// import Testimonials from './Tesimonials';
// import Faqs from './Faqs';

export default class Plans extends Component {

	state = {
		monthlyPlan: true,
		silverPlan:4.16,
		goldPlan: 12.50,
		diamondPlan: 20.83,
	
	}

	// on plan change
	onPlanChange(isMonthly) {
		this.setState({ monthlyPlan: !isMonthly });
		if (isMonthly) {
			this.setState({ silverPlan: 4.99, goldPlan: 14.99, diamondPlan: 24.99 });
		} else {
			this.setState({ silverPlan: 4.16, goldPlan: 12.50, diamondPlan: 20.83 });
		}
	}

	render() {
		return (
			<div className="pricing-wrapper">


				<div className="pricing-top mb-50">
					<div className="row">
						<div className="col-sm-12 col-md-9 col-lg-7 mx-auto text-center">
							<h2 className="mb-20">Choose the plan that works for you.</h2>
							<div>
								<span>Monthly</span>
								<Switch onClick={() => this.onPlanChange(this.state.monthlyPlan)} on={this.state.monthlyPlan} />
								<span>Yearly ( get 2 month extra)</span>
							</div>
						</div>
					</div>
				</div>
				<div className="price-list">
					<div className="row row-eq-height">
						{/* <PricingBlockV1
							planType="free"
							type="widgets.basic"
							color="primary"
							description="Secure file sharing and collaboration. Ideal for small teams."
							buttonText="widgets.startToBasic"
							price="widgets.free"
							users={1}
							features={[
								'100 GB secure storage',
								'2 GB file upload',
								'Minimum 3 users, max 10 users'
							]}
						/> */}
						<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
							<div className="pricing-icon mb-40">
								<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
							</div>
							<h2 className={`text-primary pricing-title`}><IntlMessages id="plan.Classic" /></h2>
							<p style={{height: "34px"}}>Secure file sharing and collaboration. Ideal for</p>
							{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
							<div className="mb-25">
								<h2 className="amount-title"><IntlMessages id="widgets.free" /></h2>
								{/*  <h2 className="amount-title">${price}<sub>/mo</sub></h2> */}
							</div>
							<div className="plan-info">
								<span>{"For 1 user"}</span>
							</div>
							<div className="pricing-body text-primary">
								<ul className="list-unstyled plan-info-listing">

									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Granular access and controls"}</a>
										{/* <ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Granular access and controls"}</span>
										</ReactTooltip> */}
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Desktop sync"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Desktop sync"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Version history"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Version history"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"SSL and at-rest encryption"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"SSL and at-rest encryption"}</span>
										</ReactTooltip>
									</li>
								</ul>
							</div>

		
				


							<Button color={"primary"} className='btn-block btn-lg'>
								<IntlMessages id={"plan.Classic"} />
							</Button>
						</RctCollapsibleCard>
						{/*===================================== plan 2 start ==========================================*/}
						<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
							<div className="pricing-icon mb-40">
								<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
							</div>
							<h2 className={`text-warning pricing-title`}><IntlMessages id="plan.Silver" /></h2>
							<p style={{height: "34px"}}>Secure file sharing</p>
							{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
							<div className="mb-25">
							  <h2 className="amount-title">${this.state.silverPlan}<sub>/mo</sub></h2> 
								{/* <span className="text-muted small">Connect 1 device</span> */}
							</div>
							<div className="plan-info">
								<span>{"Connect 1 device"}</span>
							</div>
							<div className="pricing-body text-warning">
								<ul className="list-unstyled plan-info-listing">

									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Granular access and controls"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Granular access and controls"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Desktop sync"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Desktop sync"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Version history"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Version history"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"SSL and at-rest encryption"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"SSL and at-rest encryption"}</span>
										</ReactTooltip>
									</li>
								</ul>
							</div>
							<Button color={"warning "} className='btn-block btn-lg'>
								<IntlMessages id={"plan.Silver"} />
							</Button>
						</RctCollapsibleCard>
		{/*===================================== plan 3 start ==========================================*/}
							
		<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
							<div className="pricing-icon mb-40">
								<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
							</div>
							<h2 className={`text-info pricing-title`}><IntlMessages id="plan.Gold" /></h2>
							<p style={{height: "34px"}}>Secure file sharing</p>
							{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
							<div className="mb-25">
							  <h2 className="amount-title">${this.state.goldPlan}<sub>/mo</sub></h2> 
								{/* <span className="text-muted small">Connect 1 device</span> */}
							</div>
							<div className="plan-info">
								<span>{"Connect 10 device"}</span>
							</div>
							<div className="pricing-body text-info">
								<ul className="list-unstyled plan-info-listing">

									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Granular access and controls"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Granular access and controls"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Desktop sync"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Desktop sync"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Version history"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Version history"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"SSL and at-rest encryption"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"SSL and at-rest encryption"}</span>
										</ReactTooltip>
									</li>
								</ul>
							</div>
							<Button color={"info "} className='btn-block btn-lg'>
								<IntlMessages id={"plan.Gold"} />
							</Button>
						</RctCollapsibleCard>	
							

							{/*===================================== plan 4 start ==========================================*/}
							<RctCollapsibleCard customClasses="text-center" colClasses="col-md-3">
							<div className="pricing-icon mb-40">
								<img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
							</div>
							<h2 style={{color:"#953CC0"}} className={` pricing-title`}><IntlMessages id="plan.Diamond" /></h2>
							<p style={{height: "34px"}}>Secure file sharing</p>
							{/* <span className="text-muted mb-5 d-block small">Starting at just</span> */}
							<div className="mb-25">
							  <h2 className="amount-title">${this.state.diamondPlan}<sub>/mo</sub></h2> 
								{/* <span className="text-muted small">Connect 1 device</span> */}
							</div>
							<div className="plan-info">
								<span>{"Connect 25 device"}</span>
							</div>
							<div className="pricing-body"  style={{color:"#953CC0"}}>
								<ul className="list-unstyled plan-info-listing">

									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Granular access and controls"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Granular access and controls"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Desktop sync"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Desktop sync"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"Version history"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"Version history"}</span>
										</ReactTooltip>
									</li>
									<li className="d-flex justify-align-start" key={11}>
										<i className="ti-check-box"></i>
										<a data-tip>{"SSL and at-rest encryption"}</a>
										<ReactTooltip place="right" effect="solid" className="rct-tooltip">
											<span>{"SSL and at-rest encryption"}</span>
										</ReactTooltip>
									</li>
								</ul>
							</div>
							<Button color="zac" style={{background:"#953CC0"}} className='btn-block btn-lg text-white'>
								<IntlMessages id={"plan.Diamond"} />
							</Button>
						</RctCollapsibleCard>
						</div>
				</div>

			</div>
		);
	}
}
