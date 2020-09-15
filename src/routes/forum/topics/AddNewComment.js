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
class AddNewComment extends Component {
   constructor(props) {
      super(props);
      this.state = {
         multiFile:[],
         cropResult:null,

      };
      
      this.djsConfig = {
         addRemoveLinks: true,
         acceptedFiles: ".png,.jpeg,.gif,.jpg,.pdf,.docx,.zip,.rar,.ppt,.mp3",
         maxFiles:'10',
         maxfilesexceeded: function(file) {
            this.removeAllFiles();
            this.addFile(file);
        },
      };

      this.componentConfig = {
         postUrl: pathForxml()+'/api/droper_upload_file',
      };
      
      this.callback = () => console.log('Hello!');
      this.success = file => {
         // console.log('aks onDrrop',acceptedFiles);
            console.log('uploaded', file);
            var multiFile = this.state.multiFile;
            multiFile.push(file);
            
            this.setState({ multiFile:multiFile });
         
            setTimeout(() => {
               this.state.multiFile
               let _this = this;
               $.map(this.state.multiFile, function(value, index) {
                  _this.props.onChangeAddNewUserDetails('file_name'+index, value)
               });
            }, 100); 
       
       } 
      this.removedfile = file => {
         var multiFile = this.state.multiFile;
         let indexOfDeleteUser = multiFile.indexOf(file);
         multiFile.splice(indexOfDeleteUser, 1);
         this.setState({ multiFile:multiFile });
      
         setTimeout(() => {
            this.state.multiFile
            let _this = this;
            $.map(this.state.multiFile, function(value, index) {
               _this.props.onChangeAddNewUserDetails('file_name'+index, value)
            });
         }, 100); 

         console.log('removing...', file);
      }
      
      this.dropzone = null;
   }



 
   handleFileAdded(name, file) {
     
   }
  
   onChangeCheckbox(e) {
      // check if the check box is checked or unchecked
      if (e.target.checked) {
        // add the numerical value of the checkbox to options array
        this.props.onChangeAddNewUserDetails('is_subscribed', 1);
      } else {
        // or remove the value from the unchecked checkbox from the array
        this.props.onChangeAddNewUserDetails('is_subscribed', 0);
      }
    }
  
  
    onChangeVideoCheckbox(e) {
      // check if the check box is checked or unchecked
      if (e.target.checked) {
        // add the numerical value of the checkbox to options array
        this.props.onChangeAddNewUserDetails('add_video', 1);
      } else {
        // or remove the value from the unchecked checkbox from the array
        this.props.onChangeAddNewUserDetails('add_video', 0);
      }
    }
  
 


   render() {
//Dropzone
const config = this.componentConfig;
const djsConfig = this.djsConfig;

// For a list of all possible events (there are many), see README.md!
const eventHandlers = {
   init: dz => this.dropzone = dz,
   drop: this.callbackArray,
   addedfile: this.handleFileAdded.bind(this , 'file_name'),
   success: this.success,
   removedfile: this.removedfile
}

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
                            value={this.props.addNewUserDetails.description}
                            onChange={(e) => this.props.onChangeAddNewUserDetails('description', e)}
           
                        /> 
            </FormGroup>  
            {/* <FormGroup check> 
        
               <Label check>
               <input type="checkbox" name="add_video" checked={this.props.addNewUserDetails.add_video == 1?'true':''} value={1} onChange={this.onChangeVideoCheckbox.bind(this)} />{' '}
               <IntlMessages id="widgets.AddVideo"/>
                  
              </Label>
        </FormGroup> */}
        {this.props.addNewUserDetails.add_video == 1 &&
            <FormGroup>
                     <Label for="video_url">{<IntlMessages id="components.video" />}</Label>
                     <Input
                        type="text"
                        name="intro_video"
                        id="video_url"
                        placeholder="Enter Valid Video Url Of Vimeo Or Youtube"
                        value={this.props.addNewUserDetails.video_url}
                        onChange={(e) => this.props.onChangeAddNewUserDetails('video_url', e.target.value)}
                     />
                  </FormGroup>  
        }
              <FormGroup row>
              <Label for="file" sm={3}><IntlMessages id="components.files" /></Label>
                      
                      <Col sm={12}>
                           <DropzoneComponent
                          
                              config={config}
                              eventHandlers={eventHandlers}
                              djsConfig={djsConfig}
                              name='file_name'
                           /> 
                      </Col>
              </FormGroup>
              <FormGroup check> 
        
               <Label check>
               <input type="checkbox" name="is_subscribed" checked={this.props.addNewUserDetails.is_subscribed == 1?'true':''} value={1} onChange={this.onChangeCheckbox.bind(this)} />{' '}
               <IntlMessages id="widgets.SubscribeToThisTopic"/>
                 
                     </Label>
               </FormGroup>
           
             
         </Form>
      );
   }
}
export default AddNewComment;