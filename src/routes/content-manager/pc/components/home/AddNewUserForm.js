//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import ReactQuill from 'react-quill';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';

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

    //on any transform on image croper
    slimTransform(data, slim){
      var base64 = 0;
      if(slim._data.output.image){
          base64 = slim._data.output.image.toDataURL("image/*");
      }
      this.props.onChangeAddNewUserDetails(slim._output.name, base64);
      console.log('Transform');
   }
   
   render() {
      return (
        <Form>
            <FormGroup>
                <Label for="title">{<IntlMessages id="components.url" />}</Label>
                <Input
                    type="text"
                    name="intro_url"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.addNewUserDetails.intro_url}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('intro_url', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="video">{<IntlMessages id="components.video" />}</Label>
                <Input
                    type="text"
                    name="intro_video"
                    id="title"
                    placeholder="Enter video"
                    value={this.props.addNewUserDetails.intro_video}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('intro_video', e.target.value)}
                />
            </FormGroup>
            {this.props.addNewUserDetails.intro_logo &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={260 / 360}
                  guides={false}
                  src={this.props.addNewUserDetails.intro_logo}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }   
             <FormGroup row>
              <Label for="sound" sm={3}><IntlMessages id="components.sound" /></Label>
                       <Col sm={6}>
                        <Input type="file" name="intro_sound" id="sound" onChange={(e) => this.props.onChangeAddNewUserDetails('intro_sound', e.target.value, e)} />
                      </Col>
                     
              </FormGroup>
           
                <FormGroup>
              <Label >{<IntlMessages id="components.logo" />} (512 X 512)</Label>
                 <Slim ratio="512:512"
                       data-size="512,512"
                      initialImage={null}
                      didTransform={ this.slimTransform.bind(this) }
                      didRemove={ this.slimTransform.bind(this) }
                      >
                    <input type="file" name="intro_logo" accept="image/png" />
                </Slim>
               </FormGroup>
         </Form>
      );
   }
}
export default AddNewUserForm;