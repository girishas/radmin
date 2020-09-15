/**
 * Update User Details Form
 */
import React, {Component} from 'react';
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import IntlMessages from 'Util/IntlMessages';

import ReactQuill from 'react-quill';

import { checkPath, pathForxml,hubCheckPaths } from "Helpers/helpers";

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//Dropzone file uploader
import DropzoneComponent from 'react-dropzone-component';

// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';
import { func } from 'prop-types';
import $ from 'jquery';
class UpdateUserForm extends Component {
   constructor(props) {
     
      super(props);

      
      this.djsConfig = {
     
         init: function () {
            if(props.user.intro_sound != '' && props.user.intro_sound != null){
            var mockFile = { name: props.user.intro_sound, size: 0, type: 'audio/*' };
            this.addFile.call(this, mockFile);
            //for hide 0 size of file label
            var size = $('.dz-size span strong').text()
            if(size == 0){
               $('.dz-size span').css('display','none');
            }
        
            //this.options.thumbnail.call(this, mockFile, hubCheckPaths('sound')+props.user.intro_sound);
              
         }
        },
    
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
        // showFiletypeIcon: true,
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
          languageResult:[]
      }

   //for demo use only
      filechange(e){
             var fileName = e.target.files[0]
             console.log('file',fileName);
             const config = {
                     headers: {
                        'Content-Type': 'multipart/form-data'
                     },
                     data:e.target.files[0]
                  }
                  const data = new FormData()
                  data.append('file', e.target.files[0])
                  data.append('a','a')
                  data.append('b','c')
                  api.post('form-add-post', data).then((response) => {
                     const data =  response;
                     console.log('response' , response)      
                  })
                  .catch(error => {
                     // error hanlding
                  }) 
      }
      handleFileAdded(name, file) {
         //   this.filechange()
         this.props.onUpdateUserDetail(name, file);
      }

      handleFileRemoved(name, file) {
         var data = 0
         this.props.onUpdateUserDetail(name, data)
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
         this.props.onUpdateUserDetail(slim._output.name, base64);
         this.props.onUpdateUserDetail(slim._output.name+'_large', large_base64);
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
           removedfile: this.handleFileRemoved.bind(this , 'intro_sound'),
        }
  return(
    <Form id='updateForm' enctype="multipart/form-data">
            {/* <FormGroup>
                <Label for="title">{<IntlMessages id="components.url" />}</Label>
                <Input
                    type="text"
                    name="intro_url"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.user.intro_url}
                    onChange={(e) => this.props.onUpdateUserDetail('intro_url', e.target.value)}
                />
            </FormGroup> */}
            <FormGroup>
                <Label for="video">{<IntlMessages id="components.video" />}</Label>
                <Input
                    type="text"
                    name="intro_video"
                    id="title"
                    placeholder="Enter video"
                    value={this.props.user.intro_video}
                    onChange={(e) => this.props.onUpdateUserDetail('intro_video', e.target.value)}
                />
            </FormGroup>
            {/* <input type='file' name="file" id="file" onChange={(e) => this.filechange(e)} ></input> */}
            
             <FormGroup >
             <Label for="sound" sm={3}><IntlMessages id="components.sound" /></Label>
                  {/* <Col sm={6}>
                     <Input type="file" name="intro_sound" id="sound" onChange={(e) => this.props.onUpdateUserDetail('intro_sound', e.target.value, e)} />
                  </Col>  */}
                    
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
                  <Slim ratio="512:512"
                      initialImage={this.props.user.intro_logo ?  hubCheckPaths('images_large')+this.props.user.intro_logo : null}
                      data-size="512,512"
                      forceSize="512,512"
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
                      initialImage={this.props.user.intro_cursor ?  hubCheckPaths('images_large')+this.props.user.intro_cursor : null}
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

export default UpdateUserForm;
