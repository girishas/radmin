/**
 * Update User Details Form
 */
import React from 'react';
import { Form, FormGroup, Label, Input,FormText } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import IntlMessages from 'Util/IntlMessages';

 
class Search extends React.Component {

  handleSearch(event) {
    this.props.searchIdeas(event.target.value)
  }

  render() {
    return (
        <div className="w-30 mb-10 mb-md-0">
          <input type="text" className="form-control form-control-lg" placeholder="Search"  onKeyUp={this.handleSearch.bind(this)}/>
         </div> 
    )
  }
}

export default Search;
