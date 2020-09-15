/**
 * Update User Details Form
 */
import React from 'react';
import { Form, FormGroup, Label, Input,FormText } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import IntlMessages from 'Util/IntlMessages';

import ReactQuill from 'react-quill';

import { checkPath } from "Helpers/helpers";


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
 

const UpdateUserForm = ({ user, onUpdateUserDetail, cropResult }) => {
  
  return(
    <Form>
        <FormGroup>
            <Label for="name">{<IntlMessages id="sidebar.name" />}</Label>
            <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                value={user.name}
                onChange={(e) => onUpdateUserDetail('name', e.target.value)}
            />
        </FormGroup>
		<FormGroup>
            <Label for="type">{<IntlMessages id="sidebar.type" />}</Label>
            <Input type="select" name="type" id="type" value={user.type} onChange={(e) => onUpdateUserDetail('type', e.target.value)}>
               <option value="1">Blog</option>
               <option value="2">Campaign</option>
          </Input>
        </FormGroup>
		{user.type == '2' &&
		<FormGroup>
            <Label for="campaign_type">{<IntlMessages id="sidebar.campaign_type" />}</Label>
            <Input type="select" name="campaign_type" id="campaign_type" value={user.campaign_type} onChange={(e) => onUpdateUserDetail('type', e.target.value)}>
               <option value="1">Programming</option>
               <option value="2">Hardware</option>
          </Input>
        </FormGroup>
      }
        <FormGroup>
            <Label for="status">Status</Label>
            <Input type="select" name="status" id="status" value={user.status} onChange={(e) => onUpdateUserDetail('status', e.target.value)}>
               <option value="1">Active</option>
               <option value="0">Inactive</option>
          </Input>
        </FormGroup>

    </Form>
);
}

export default UpdateUserForm;
