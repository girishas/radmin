/**
 * Profile Page
 */
import React, { Component } from 'react';
import { FormGroup, Input, Form, Label, Col, InputGroup, InputGroupAddon, FormText } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import Cropper from 'react-cropper';
// intlmessages
import IntlMessages from 'Util/IntlMessages';
//const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import DropzoneComponent from 'react-dropzone-component';
import api from 'Api';

import { checkPaths } from "Helpers/helpers";

export default class Profiles extends Component {

  
constructor(props) {
      super(props);

      // For a full list of possible configurations,
      // please consult http://www.dropzonejs.com/#configuration
      this.djsConfig = {
         addRemoveLinks: true,
         acceptedFiles: ".mp3",
         maxFiles:1,
         autoProcessQueue: false
      };

      this.componentConfig = {
         iconFiletypes: ['.mp3'],
         showFiletypeIcon: true,
         postUrl: 'no-url'
      };

      this.state = {
        src: null,
        cropResult:null,
        loading: false, // loading activity
        result : null,
        addNewUserDetail: {
             id: '',
             intro_url: '',
             intro_logo: '',
             intro_sound: '',
             intro_video: '',
             os_type:1,
          },
     }
      this.dropzone = null;
   }


   getXmlData() {
    const { addNewUserDetail } = this.state;
    
     api.get('/get-xml-data', {
            params: {
              os_type: addNewUserDetail.os_type
            }
          })
         .then((response) => {
            const data =  response.data.data;
            this.setState({src:data.intro_logo, addNewUserDetail:data  });
          })
         .catch(error => {
            // error handling
         })
    
   }


   componentDidMount() {
    
      this.getXmlData();
  
   }

  /**
   * On Update Profile
   */
  onUpdateProfile() {
    
    const {intro_video, intro_sound} = this.state.addNewUserDetail;
    if (intro_video !== '' ) {
      intro_video.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

        if (RegExp.$3.indexOf('youtu') > -1) {
            var type = 'youtube';
        } else if (RegExp.$3.indexOf('vimeo') > -1) {
            var type = 'vimeo';
        }
        if (type =="youtube" || type =="vimeo")      { 
          
        }else{
          NotificationManager.error('Video url is not valid!');
          return;
        }
    }
    if (intro_sound !== '' ) {
      var  substring = "mp3";
        intro_sound.includes(substring);
      if (!intro_sound.includes(substring))
      { 
        NotificationManager.error('File type is not valid!');
        return;
      }
    }
      
      
      this.setState({ loading: true });
      let self = this;
      api.post('updatexml', this.state.addNewUserDetail).then((response) => {

        const data =  response.data;

            setTimeout(() => {
              self.setState({ loading: false, addNewUserDetail:data, cropResult: '' });
              NotificationManager.success('Data Updated!');
           }, 1000);       
         })
         .catch(error => {
            // error hanlding
         })  

  }

  cropImage(e) {
      e.preventDefault();
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }

      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
           
      });
   }

    onChangeAddNewUserDetail(key, value, e) {

     
     if(key == 'intro_logo'){
        let files;
          if (e.dataTransfer) {
             files = e.dataTransfer.files;
          } else if (e.target) {
             files = e.target.files;
          }
          const reader = new FileReader();
          reader.onload = () => {
             this.setState({ 
              addNewUserDetail: {
                ...this.state.addNewUserDetail,
                ['intro_logo']:  reader.result,
             },
             src: reader.result,
             result: reader.result,
              });
          };
          reader.readAsDataURL(files[0])
        } 

        if(key == 'intro_sound'){
          let files;
            if (e.dataTransfer) {
               files = e.dataTransfer.files;
            } else if (e.target) {
               files = e.target.files;
            }            
            const reader = new FileReader();
            reader.onload = () => {
               this.setState({ 
                addNewUserDetail: {
                  ...this.state.addNewUserDetail,
                  ['intro_sound']:  reader.result,
               },
              });
            };
            reader.readAsDataURL(files[0])
          } 

        if(key !== 'intro_logo'){
           this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
             }
          });

         }
     
   }
  render() {

     const { cropResult, result } = this.state;
     const config = this.componentConfig;
      const djsConfig = this.djsConfig;

      // For a list of all possible events (there are many), see README.md!
      const eventHandlers = {
         init: dz => this.dropzone = dz,
         drop: this.callbackArray,
         addedfile: this.callback,
         success: this.success,
         removedfile: this.removedfile

      }

    let cropperResult;
    if(result){
        cropperResult = <Cropper
                        style={{ height: 200, width: '70%' }}
                        preview=".img-preview"
                        guides={true}
                        src={this.state.result}
                        aspectRatio={4 / 3}
                        ref={cropper => { this.cropper = cropper; }}
                     />
     } else {
         cropperResult = <Cropper
                        style={{ height: 200, width: '70%' }}
                        preview=".img-preview"
                        guides={true}
                        aspectRatio={4 / 3}
                        src={checkPaths('images')+this.state.src}
                        ref={cropper => { this.cropper = cropper; }}
                     />
     } 

    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6">
        <div className="profile-wrapper">
          <Form>
            <FormGroup row>
              <Label for="url" sm={3}><IntlMessages id="components.url" /></Label>
              <Col sm={9}>
                <Input type="text" 
                  name="intro_url" 
                  id="url" 
                  className="input-lg" 
                  value={this.state.addNewUserDetail.intro_url}
                  onChange={(e) => this.onChangeAddNewUserDetail('intro_url', e.target.value)}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
                { cropperResult }
              </FormGroup>
  		          <FormGroup row>
                       <Label for="logoFile" sm={3}><IntlMessages id="components.logo" /></Label>
                       <Col sm={6}>
                        <Input type="file" name="intro_logo" id="logoFile" onChange={(e) => this.onChangeAddNewUserDetail('intro_logo', e.target.value, e)} />
                      </Col>
                      <Col sm={3}>                  
                        <Button onClick={this.cropImage.bind(this)} variant="raised" color="primary" className="text-white">
                            <IntlMessages id="button.cropImage" />
                        </Button>    
                      </Col>
              </FormGroup>
            <FormGroup row>
              <Label for="sound" sm={3}><IntlMessages id="components.sound" /></Label>

                {/*<DropzoneComponent
                     config={config}
                     eventHandlers={eventHandlers}
                     djsConfig={djsConfig}
                  />*/}
              
                       <Col sm={6}>
                        <Input type="file" name="intro_sound" id="sound" onChange={(e) => this.onChangeAddNewUserDetail('intro_sound', e.target.value, e)} />
                      </Col>
                     
              </FormGroup>
            <FormGroup row>
              <Label for="video" sm={3}><IntlMessages id="components.video" /></Label>
              <Col sm={9}>
                <Input type="text" name="intro_video" id="intro_video" className="input-lg" 
                  value={this.state.addNewUserDetail.intro_video}
                  onChange={(e) => this.onChangeAddNewUserDetail('intro_video', e.target.value)}
                />
              </Col>
            </FormGroup>
          </Form>
          
          <hr />
          <Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdateProfile()}><IntlMessages id="button.save" /></Button>
        </div>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6">
        {this.state.cropResult &&
           <img style={{ width: '100%' }} src={this.state.cropResult} alt="cropped_img" />
        }
        </div>
</div>

    );
  }
}
