/**
** Session Slider
**/
import React, { Component } from "react";
import Slider from "react-slick";
import IntlMessages from 'Util/IntlMessages';
// api
import api from 'Api';
import { timeAgo, textTruncate, checkPath } from "Helpers/helpers";
export default class SessionSlider extends Component {

	state = {
		sessionUsersData: null
	}

	componentDidMount() {
		this.getSessionUsersData();
		// console.log('sessionUsersData' , this.props)
		//this.setState({ sessionUsersData: this.props.slider});
	}

	// session users data
	getSessionUsersData() {
		api.get('cha-testimoniallist-front')
			.then((response) => {
				console.log(response)
				this.setState({ sessionUsersData: response.data.data });
			})
			.catch(error => {
				// error handling
			})
	}

	render() {
		const settings = {
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			autoplay: true,
			swipe: true,
			touchMove: true,
			swipeToSlide: true,
			draggable: true
		};
		const { sessionUsersData } = this.state;
		return (
			<div className="session-slider" >
				<Slider {...settings}>
					{(sessionUsersData && sessionUsersData !== null) && sessionUsersData.map((data, key) => (
						<div key={key}>
							<img
							
								src=	{checkPath('testimonial')+data.admin_image}
								alt="session-slider"
								className="img-fluid"
								width="377"
								height="588"
							/>
							<div className="rct-img-overlay">
								<h5 className="client-name">{data.name}</h5>
								<span>{data.designation}</span>
								{/* <p className="mb-0 	fs-14" dangerouslySetInnerHTML={{__html:data.content}} /> */}
								<p className="mb-0 	fs-14"  ><IntlMessages id={data.content}/></p>
								{/* <p className="mb-0 	fs-14">{data.content && textTruncate(data.content,100)}</p> */}
							</div>
						</div>
					))}
				</Slider>
			</div>
		);
	}
}
