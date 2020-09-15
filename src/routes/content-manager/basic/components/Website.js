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
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import DropzoneComponent from 'react-dropzone-component';

export default class Website extends Component {

  
constructor(props) {
      super(props);

      // For a full list of possible configurations,
      // please consult http://www.dropzonejs.com/#configuration
      this.djsConfig = {
         addRemoveLinks: true,
         acceptedFiles: "image/jpeg,image/png,image/gif"
      };

      this.componentConfig = {
         iconFiletypes: ['.jpg', '.png', '.gif'],
         showFiletypeIcon: true,
         postUrl: 'http://192.168.31.226/zacbrowser/pblic/upload'
      };

      this.state = {
        src,
        cropResult:null
     }
      this.dropzone = null;
   }

  /**
   * On Update Profile
   */
  onUpdateProfile() {
    NotificationManager.success('Profile Updated Successfully!');
  }

  onChange(e) {
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
         files = e.dataTransfer.files;
      } else if (e.target) {
         files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
         this.setState({ src: reader.result });
      };
      reader.readAsDataURL(files[0]);
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

  render() {

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
      
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6">
        <div className="profile-wrapper">
          <Form>
            <FormGroup row>
              <Label for="url" sm={3}><IntlMessages id="components.url" /></Label>
              <Col sm={9}>
                <Input type="text" name="url" id="url" className="input-lg" />
              </Col>
            </FormGroup>
            <FormGroup row>
                <Cropper
                        style={{ height: 200, width: '70%' }}
                        preview=".img-preview"
                        guides={true}
                        src={this.state.src}
                        ref={cropper => { this.cropper = cropper; }}
                     />
              </FormGroup>
  		          <FormGroup row>
                       <Label for="logoFile" sm={3}><IntlMessages id="components.logo" /></Label>
                       <Col sm={6}>
                        <Input type="file" name="file" id="logoFile" onChange={this.onChange.bind(this)} />
                      </Col>
                      <Col sm={3}>                  
                        <Button onClick={this.cropImage.bind(this)} variant="raised" color="primary" className="text-white">
                            <IntlMessages id="button.cropImage" />
                        </Button>    
                      </Col>
              </FormGroup>
            <FormGroup row>
              <Label for="sound" sm={3}><IntlMessages id="components.sound" /></Label>
              <Col sm={9}>
                <DropzoneComponent
                     config={config}
                     eventHandlers={eventHandlers}
                     djsConfig={djsConfig}
                  />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="video" sm={3}><IntlMessages id="components.video" /></Label>
              <Col sm={9}>
                <Input type="text" name="video" id="video" className="input-lg" />
              </Col>
            </FormGroup>
          </Form>
          
          <hr />
          <Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdateProfile()}><IntlMessages id="widgets.updateProfile" /></Button>
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
