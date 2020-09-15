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

/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      selectOptions: []
  }

    

  cropImage(e) {
      e.preventDefault();
      
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.image = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }

  

   render() {
      return (
        <Form>
            <FormGroup>
                <Label for="title">Name</Label>
                <Input
                    type="text"
                    name="name"
                    id="title"
                    placeholder="Enter Name"
                    value={this.props.addNewUserDetails.name}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('name', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="url">URL</Label>
                <Input
                    type="text"
                    name="url"
                    id="url"
                    placeholder="Enter URL"
                    value={this.props.addNewUserDetails.url}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('url', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="status">Status</Label>
                <Input type="select" name="status" id="status" value={this.props.addNewUserDetails.status} onChange={(e) => this.props.onChangeAddNewUserDetails('status', e.target.value)}>
                   <option value="1">Active</option>
                   <option value="0">Inactive</option>
              </Input>
            </FormGroup>
              
           
            {this.props.addNewUserDetails.image &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={130 / 60}
                  guides={false}
                  src={this.props.addNewUserDetails.image}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                {this.props.cropResult &&
                   <Input value={this.state.cropResult} type="file" name="image" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image', e.target.value, e)} 

                   />
                 
               }
                {!this.props.cropResult &&
                <Input type="file" name="image" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image', e.target.value, e)} 
                   />
                 }
                   <FormText color="muted">
                     Choose an image to resize.
                   </FormText>
                </div>
              </FormGroup>
              <div className="d-flex align-items-center justify-content-center mb-10">
                  <Button onClick={this.cropImage.bind(this)} variant="raised" className="bg-success text-white w-100">
                    <IntlMessages id="button.cropImage" />
                  </Button>
                </div>
             {this.state.cropResult &&
                <RctCollapsibleCard
                   colClasses="col-sm-12 col-md-12 col-lg-12"
                   heading={<IntlMessages id="widgets.croppedImage" />}
                >
                   <img style={{ width: '100%' }} src={this.state.cropResult} alt="cropped_img" />
                </RctCollapsibleCard>
             }
        </Form>
      );
   }
}
export default AddNewUserForm;