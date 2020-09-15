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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
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
	  hideOnSelect:null
  }

  handleChange = (e) => {
       
    let target = e.target
    let name = target.name

    //here
    let value = Array.from(target.selectedOptions, option => option.value);
    this.setState({
      selectOptions: value
    });
    this.props.addNewUserDetails.category = value;
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

    //console.log(this.props.addNewUserDetails);

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
                <Label for="type">{<IntlMessages id="sidebar.type" />}</Label>
                <Input type="select" name="type" id="type" value={this.props.addNewUserDetails.type} onChange={(e) => this.props.onChangeAddNewUserDetails('type', e.target.value)}>
                   <option value="1">Blog</option>
                   <option value="2">Campaign</option>
              </Input>
            </FormGroup>
			{this.props.addNewUserDetails.type === '2' &&
			<FormGroup>
                <Label for="campaign_type">{<IntlMessages id="sidebar.campaign_type" />}</Label>
                <Input type="select" name="campaign_type" id="campaign_type" value={this.props.addNewUserDetails.campaign_type} onChange={(e) => this.props.onChangeAddNewUserDetails('campaign_type', e.target.value)}>
                   <option value="1">Programming</option>
                <option value="2">Hardware</option>
              </Input>
            </FormGroup>
			}
            <FormGroup>
                <Label for="status">Status</Label>
                <Input type="select" name="status" id="status" value={this.props.addNewUserDetails.status} onChange={(e) => this.props.onChangeAddNewUserDetails('status', e.target.value)}>
                   <option value="1">Active</option>
                   <option value="0">Inactive</option>
              </Input>
            </FormGroup>
         </Form>
      );
   }
}
export default AddNewUserForm;