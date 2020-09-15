//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Form, FormGroup, Label, Input,FormText } from 'reactstrap';
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


const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

const pStyle = {
  minHeight: '8em'
}


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      selectOptions: [],
      cropResultonHover:null
  }


   

  cropImage(e) {
      e.preventDefault();
    console.log(this.cropper);
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.image = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }


   cropImageOnHover() {
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.image_hover = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResultonHover: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }

  

   render() {

    console.log(this.props);

      return (
        <Form>
            <FormGroup>
                <Label for="name">{<IntlMessages id="sidebar.name" />}</Label>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Name"
                    value={this.props.addNewUserDetails.name}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('name', e.target.value)}
                />
            </FormGroup>
			<FormGroup>
                <Label for="designation">{<IntlMessages id="sidebar.designation" />}</Label>
                <Input
                    type="text"
                    name="designation"
                    id="designation"
                    placeholder="Enter Name"
                    value={this.props.addNewUserDetails.designation}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('designation', e.target.value)}
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
                  aspectRatio={260 / 360}
                  guides={false}
                  src={this.props.addNewUserDetails.image}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }   
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFile">Image</Label>
                <Input type="file" name="file" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image', e.target.value, e)} 
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


      {this.props.addNewUserDetails.image_hover &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={260 / 360}
                  guides={false}
                  src={this.props.addNewUserDetails.image_hover}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }    



              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFile">Image On Hover</Label>
                <Input type="file" name="file" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image_hover', e.target.value, e)} 
                   />
                   <FormText color="muted">
                     Choose an image to resize.
                   </FormText>
                </div>
              </FormGroup> 
              
              <div className="d-flex align-items-center justify-content-center mb-10">
                  <Button onClick={this.cropImageOnHover.bind(this)} variant="raised" className="bg-success text-white w-100">
                    <IntlMessages id="button.cropImage" />
                  </Button>
                </div>
             {this.state.cropResultonHover &&
                <RctCollapsibleCard
                   colClasses="col-sm-12 col-md-12 col-lg-12"
                   heading={<IntlMessages id="widgets.croppedImage" />}
                >
                   <img style={{ width: '100%' }} src={this.state.cropResultonHover} alt="cropped_img" />
                </RctCollapsibleCard>
             }
			 
         </Form>
      );
   }
}
export default AddNewUserForm;