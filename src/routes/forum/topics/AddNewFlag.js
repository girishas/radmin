//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import ReactQuill from 'react-quill';
import {pathForxml } from "Helpers/helpers";
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
import DropzoneComponent from 'react-dropzone-component';
// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';
//for editor
//for editor
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
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
class AddNewFlag extends Component {
   constructor(props) {
      super(props);
      this.state = {
         multiFile:[],
         cropResult:null,

      };
      
   

  
   }
   imageHandler() {
      alert()
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click(); 
      input.onchange = async function() {
        const file = input.files[0];
        console.log('User trying to uplaod this:', file);
  
        const id = await uploadFile(file); // I'm using react, so whatever upload function
        const range = this.quill.getSelection();
        const link = `${ROOT_URL}/file/${id}`;
  
        // this part the image is inserted
        // by 'image' option below, you just have to put src(link) of img here. 
        this.quill.insertEmbed(range.index, 'image', link); 
      }.bind(this); // react thing
    }



 


   render() {

     

      //  const  modules= {
      //    imageUploader: {
      //      upload: file => {
      //        return new Promise((resolve, reject) => {
      //          setTimeout(() => {
      //            resolve(
      //              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png"
      //            );
      //          }, 3500);
      //        });
      //      }
      //    }
      //  }
      
      
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
//Dropzone

// For a list of all possible events (there are many), see README.md!

      return (
        <Form>
          
           {/* <Input
                    type="hidden"
                    name="subscription_id"
                    value={this.props.addNewUserDetails.subscription_id}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('subscription_id', e.target.value)}
                />
           <Input
                    type="hidden"
                    name="subscription_type"
                    value={this.props.addNewUserDetails.subscription_type}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('subscription_type', e.target.value)}
                />
           <Input
                    type="hidden"
                    name="user_id"
                    value={this.props.addNewUserDetails.user_id}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('user_id', e.target.value)}
                /> */}
            <FormGroup>
                <Label for="description">{<IntlMessages id="widgets.description" />}</Label>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            name="description"
                            id="description"
                            placeholder="Lets get started"
                            value={this.props.addNewFlagDetails.description}
                            onChange={(e) => this.props.onChangeAddNewFlagDetails('description', e)}
                        /> 
            </FormGroup>  
         </Form>
      );
   }
}
export default AddNewFlag;