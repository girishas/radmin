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

class AddNewUserForm extends Component {
   constructor(props) {
      super(props);
     
      this.djsConfig = {
         addRemoveLinks: true,
         acceptedFiles: "audio/*",
         maxFiles:'1',
         maxfilesexceeded: function(file) {
            this.removeAllFiles();
            this.addFile(file);
        },
      };

      this.componentConfig = {
         iconFiletypes: ['.mp3'],
         showFiletypeIcon: true,
      // postUrl: 'http://192.168.31.226/zacbrowser/api/droper_upload_file'
         postUrl: pathForxml()+'/api/droper_upload_file',
         
         
      };
      this.callback = () => console.log('Hello!');
      this.success = file => console.log('uploaded', file);
      this.removedfile = file => console.log('removing...', file);
      this.dropzone = null;
   }



   state = {
      cropResult:null,
      
  }
  handleFileAdded(name, file) {
   this.props.onChangeAddNewUserDetails(name, file)
}
  



   //on any transform on image croper
   slimTransform(data, slim){
      if(slim._hasInitialImage  && !slim._imageEditor)
      return true;
      var base64 = 0;
      var large_base64 = 0;
      if(slim._data.output.image){
        var  dataurl = slim._data.output.image.toDataURL("image/*") ;
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
              while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
              }
        var file =  new File([u8arr], slim._data.input.name, {type:mime});
        base64 =  file;
      }
      if(slim._data.input.image){
        var inputFile = new File([slim._data.input.file], slim._data.input.name);
        large_base64 = inputFile;
      }
      
      this.props.onChangeAddNewUserDetails(slim._output.name, base64);
      this.props.onChangeAddNewUserDetails(slim._output.name+'_large', large_base64);
      console.log('Transform');
   }
     
 

  
  //on any transform on image croper
  slimTransform(data, slim){
   var base64 = 0;
   var large_base64 = 0; 
   // continue saving the data
   if(slim._hasInitialImage  && !slim._imageEditor)
   return true;
   var data = new FormData()
   if(slim._data.output.image){
      var  dataurl = slim._data.output.image.toDataURL("image/png") ;
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                  u8arr[n] = bstr.charCodeAt(n);
            }
      var file =  new File([u8arr], slim._data.input.name, {type:mime});
      data.append('file' ,file)
      base64 =  file;
   }
   if(slim._data.input.image){
      var inputFile = new File([slim._data.input.file], slim._data.input.name);
      large_base64 = inputFile;
   }
   this.props.onChangeAddNewUserDetails('intro_logo', base64);
   this.props.onChangeAddNewUserDetails('intro_logo_large', large_base64);
   console.log('Transform');
}

   render() {
//Dropzone
const config = this.componentConfig;
const djsConfig = this.djsConfig;

// For a list of all possible events (there are many), see README.md!
const eventHandlers = {
   init: dz => this.dropzone = dz,
   drop: this.callbackArray,
   addedfile: this.handleFileAdded.bind(this , 'intro_sound'),
   success: this.success,
   removedfile: this.removedfile
}
      return (
        <Form>
           <Input
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
                />

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
             <FormGroup row>
              <Label for="sound" sm={3}><IntlMessages id="components.sound" /></Label>
                       {/* <Col sm={6}>
                        <Input type="file" name="intro_sound" id="sound" onChange={(e) => this.props.onChangeAddNewUserDetails('intro_sound', e.target.value, e)} />
                      </Col> */}
                      <Col sm={12}>
                           <DropzoneComponent
                              config={config}
                              eventHandlers={eventHandlers}
                              djsConfig={djsConfig}
                              name='intro_sound'
                           /> 
                      </Col>
                     
                     
              </FormGroup>
            <FormGroup>
               <Label for="exampleFile">{<IntlMessages id="components.logo" />} (512 X 512)</Label>
                  {/* Image Div Start */}
                  <Slim  ratio="512:512"
                      data-size="512,512"
                      forceSize= "512,512"
                      initialImage={null}
                      didTransform={ this.slimTransform.bind(this) }
                      didRemove={ this.slimTransform.bind(this) }
                      >
                    <input type="file" name="intro_logo"  accept="image/png" />
                </Slim>
            </FormGroup>
            <FormGroup>   
                  <Label for="exampleFile">{<IntlMessages id="components.cursor" />} (32 X 32)</Label>
                  {/* Image Div Start */}
                  <Slim ratio="32:32"
                      data-size="32,32"
                      forceSize= "32,32"
                      initialImage={null}
                      didTransform={ this.slimTransform.bind(this) }
                      didRemove={ this.slimTransform.bind(this) }
                      >
                    <input type="file" name="intro_cursor" accept="image/*"/>
                </Slim>
            </FormGroup>


           
             
         </Form>
      );
   }
}
export default AddNewUserForm;