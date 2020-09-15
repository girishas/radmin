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
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';



export default class Home extends Component {

  
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
        srcbg: null,
        cropResult:null,
        cropResults:null,
        loading: false, // loading activity
        result : null,
        resultbg : null,
        addNewUserDetail: {
             id: '',
             home_title: '',
             home_icon: '',
             home_bgimage: '',
             home_bgvideo: '',
             os_type: 1
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
            this.setState({src:data.intro_logo, srcbg:data.intro_logo, addNewUserDetail:data  });
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
    
    const { home_bgvideo } = this.state.addNewUserDetail;
    if (home_bgvideo ) {
      home_bgvideo.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

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
       
      
      this.setState({ loading: true });
      let self = this;
      api.post('updatexmlhome', this.state.addNewUserDetail).then((response) => {

        const data =  response.data;

            setTimeout(() => {
              self.setState({ loading: false, addNewUserDetail:data, cropResult: '' });
              NotificationManager.success('Profile Updated!');
           }, 1000);       
         })
         .catch(error => {
            
         })  

  }

  /*onChange(e) {
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
   }*/

  cropImage(e) {
      e.preventDefault();
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }

      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
           
      });
   }


  cropImageBg(e) {
      e.preventDefault();
      if (typeof this.croppers.getCroppedCanvas() === 'undefined') {
         return;
      }

      this.setState({
         cropResults: this.croppers.getCroppedCanvas().toDataURL(),
           
      });
   }

    onChangeAddNewUserDetail(key, value, e) {

     console.log(key);
     if(key == 'home_icon'){
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
                ['home_icon']:  reader.result,
             },
             src: reader.result,
             result: reader.result, });
          };
          reader.readAsDataURL(files[0])
        } 

        if(key == 'home_bgimage'){
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
                  ['home_bgimage']:  reader.result,
               },
                srcbg: reader.result,
                resultbg: reader.result });
            };
            reader.readAsDataURL(files[0])
          } 

        if(key !== 'home_icon' && key !== 'home_bgimage'){
           this.setState({
             addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
             }
          });

         }
     
   }
  render() {

         const { cropResult, result,cropResults, resultbg } = this.state;
         console.log(result);

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

    let cropperResultbg;
    if(resultbg){
        cropperResultbg = <Cropper
                        style={{ height: 200, width: '70%' }}
                        preview=".img-preview"
                        guides={true}
                        src={this.state.resultbg}
                        aspectRatio={4 / 3}
                        ref={croppers => { this.croppers = croppers; }}
                     />
     } else {
         cropperResultbg = <Cropper
                        style={{ height: 200, width: '70%' }}
                        preview=".img-preview"
                        guides={true}
                        aspectRatio={4 / 3}
                        src={checkPaths('images')+this.state.srcbg}
                        ref={croppers => { this.croppers = croppers; }}
                     />
     }  
      
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6">
        <div className="profile-wrapper">
          <Form>
            <FormGroup row>
              <Label for="url" sm={3}><IntlMessages id="components.title" /></Label>
              <Col sm={9}>
                <Input type="text" 
                  name="home_title" 
                  id="url" 
                  className="input-lg" 
                  value={this.state.addNewUserDetail.home_title}
                  onChange={(e) => this.onChangeAddNewUserDetail('home_title', e.target.value)}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
                { cropperResult }
              </FormGroup>
                <FormGroup row>
                       <Label for="iconFile" sm={3}><IntlMessages id="components.icon" /></Label>
                       <Col sm={6}>
                        <Input type="file" name="home_icon" id="iconFile" onChange={(e) => this.onChangeAddNewUserDetail('home_icon', e.target.value, e)} />
                      </Col>
                      <Col sm={3}>                  
                        <Button onClick={this.cropImage.bind(this)} variant="raised" color="primary" className="text-white">
                            <IntlMessages id="button.cropImage" />
                        </Button>    
                      </Col>
              </FormGroup>
            <FormGroup row>
                { cropperResultbg }
              </FormGroup>
                <FormGroup row>
                       <Label for="home_bgimage" sm={3}><IntlMessages id="components.backgroundImage" /></Label>
                       <Col sm={6}>
                        <Input type="file" name="home_bgimage" id="home_bgimage" onChange={(e) => this.onChangeAddNewUserDetail('home_bgimage', e.target.value, e)} />
                      </Col>
                      <Col sm={3}>                  
                        <Button onClick={this.cropImageBg.bind(this)} variant="raised" color="primary" className="text-white">
                            <IntlMessages id="button.cropImage" />
                        </Button>    
                      </Col>
              </FormGroup>
            <FormGroup row>
              <Label for="home_bgvideo" sm={3}><IntlMessages id="components.video" /></Label>
              <Col sm={9}>
                <Input type="text" name="home_bgvideo" id="home_bgvideo" className="input-lg" 
                  value={this.state.addNewUserDetail.home_bgvideo}
                  onChange={(e) => this.onChangeAddNewUserDetail('home_bgvideo', e.target.value)}
                />
              </Col>
            </FormGroup>
          </Form>
          
          <hr />
          <Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdateProfile()}><IntlMessages id="button.save" /></Button>
        </div>
        </div>
        {this.state.cropResult &&
                <RctCollapsibleCard
                   colClasses="col-sm-12 col-md-12 col-lg-3"
                   heading={<IntlMessages id="widgets.croppedImage" />}
                >
                   <img style={{ width: '100%'}} src={this.state.cropResult} alt="cropped_img" />
                </RctCollapsibleCard>
              }
         {this.state.cropResults &&
                <RctCollapsibleCard
                   colClasses="col-sm-12 col-md-12 col-lg-3"
                   heading={<IntlMessages id="widgets.croppedImage" />}
                >
                   <img style={{ width: '100%'}} src={this.state.cropResults} alt="cropped_img" />
                </RctCollapsibleCard>
              }
</div>

    );
  }
}
