/**
 * Search Form
 */
import React, { Component } from 'react'
import { Input } from 'reactstrap';

export default class SearchForm extends Component {
	handleSearch(event) {
	    this.props.searchIdeas(event.target.value)
	  }
	render() {
		return (
			<div className="search-wrapper">
				<Input type="search" className="search-input-lg" placeholder="Search.." onKeyUp={this.handleSearch.bind(this)}/>
			</div>
		)
	}
}
