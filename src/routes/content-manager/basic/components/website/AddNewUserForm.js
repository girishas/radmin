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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      options: [1],
      cropResultonHover:null,
      chkbox:true,
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
    console.log(this.cropper);
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.icon = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }


  

   render() {
    console.log(this.props);
      return (
        <Form>
            <FormGroup>
                <Label for="title">{<IntlMessages id="components.title" />}</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.addNewUserDetails.title}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('title', e.target.value)}
                />
              </FormGroup>  
               <FormGroup >
                <Input
                    type="text"
                    name="cat_id"
                    value ={this.props.addNewUserDetails.cat_id}
                    id="category"
                    style={{display : 'none'}}
                />
            </FormGroup>
      <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.url" />}</Label>
                <Input
                    type="text"
                    name="url"
                    id="bg_video"
                    placeholder="Enter URL"
                    value={this.props.addNewUserDetails.url}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('url', e.target.value)}
                />
            </FormGroup>
         <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Input
                    type="text"
                    name="language_id"
                    id="language"
                    placeholder="Enter Language"
                    value={this.props.addNewUserDetails.language_id}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('language_id', e.target.value)}
                />
            </FormGroup>   
         
          <FormGroup>
                <Label for="allow">{<IntlMessages id="components.allow" />}</Label>
                <Input
                    type="text"
                    name="allow"
                    id="allow"
                    placeholder="Enter Instruction"
                    value={this.props.addNewUserDetails.allow}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('allow', e.target.value)}
                />
            </FormGroup> 
            <FormGroup>
                <Label for="deny">{<IntlMessages id="components.deny" />}</Label>
                <Input
                    type="text"
                    name="deny"
                    id="deny"
                    placeholder="Enter Instruction"
                    value={this.props.addNewUserDetails.deny}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('deny', e.target.value)}
                />
            </FormGroup>
      {this.props.addNewUserDetails.icon &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={260 / 360}
                  guides={false}
                  src={this.props.addNewUserDetails.icon}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }   
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFile">Image</Label>
                <Input type="file" name="icon" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('icon', e.target.value, e)} 
                   />
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