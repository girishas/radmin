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
            <Label for="slug">{<IntlMessages id="sidebar.slug" />}</Label>
            <Input
                type="text"
                name="slug"
                id="slug"
                placeholder="Enter Slug"
                value={user.slug}
				disabled="disabled"
                onChange={(e) => onUpdateUserDetail('slug', e.target.value)}
            />
        </FormGroup>
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
