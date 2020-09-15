//Image Cropper

import React, { Component } from 'react';

import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import ReactQuill from 'react-quill';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar


// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import TimePicker from './components/TimePicker';
// api
import api from 'Api';


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      
  }



 
  onChange(e) {
    // current array of options
    const options = this.state.options
    let index

    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      options.push(+e.target.value)
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = options.indexOf(+e.target.value)
      options.splice(index, 1)
    }

    this.props.addNewUserDetails.os_type = options;
    // update the state with the new array of options
    this.setState({ options: options })
  }

  cropImage(e) {
      e.preventDefault();
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.intro_logo = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }


 

  

   render() {
      return (
        <Form>
            <FormGroup>
            
                <Label for="title">{<IntlMessages id="components.url" />}</Label>
                <TimePicker />
            </FormGroup>
           
                 
             
         </Form>
      );
   }
}
export default AddNewUserForm;