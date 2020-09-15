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
// api
import api from 'Api';

 
class UpdateUserForm extends Component {



       state = {
          cropResult:null,
          languageResult:[]
      }

     

   

      cropImage(e) {
      e.preventDefault();

          if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
             return;
          }
          this.props.user.home_icon = this.cropper.getCroppedCanvas().toDataURL();
          this.setState({
             cropResult: this.cropper.getCroppedCanvas().toDataURL(),
          });
       }

       cropImageOnHover() {
        if (typeof this.croppers.getCroppedCanvas() === 'undefined') {
           return;
        }
        this.props.user.home_bgimage = this.croppers.getCroppedCanvas().toDataURL();
        
        this.setState({
           cropResultonHover: this.croppers.getCroppedCanvas().toDataURL(),
        });
     }

         
 render() {    
console.log(this.props);

   let cropperResult;
     if(this.props.cropResult){
        cropperResult = <Cropper
					style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={this.props.user.home_icon}
                    aspectRatio={260 / 360}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else if(this.props.cropResult === null && this.props.user.home_icon) {
        cropperResult = <Cropper
					style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={hubCheckPaths('images')+this.props.user.home_icon}
                    aspectRatio={260 / 360}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else {
        cropperResult = '';
     }


      let cropperResultOnbg;
     if(this.props.cropResultOnHover){
        cropperResultOnbg = <Cropper
					style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={this.props.user.home_bgimage}
                    aspectRatio={260 / 360}
                    ref={croppers => { this.croppers = croppers; }}
                />
     } else if(this.props.cropResultOnHover === null && this.props.user.home_bgimage) {
        cropperResultOnbg = <Cropper
					style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    //src={pathForxml()+this.props.user.path+'/images/'+this.props.user.home_bgimage}
                    src={hubCheckPaths('images')+this.props.user.home_bgimage}
                    aspectRatio={260 / 360}
                    ref={croppers => { this.croppers = croppers; }}
                />
     } else {
        cropperResultOnbg = '';
     }

  
  return(
    <Form>
            <FormGroup>
                <Label for="title">{<IntlMessages id="components.title" />}</Label>
                <Input
                    type="text"
                    name="home_title"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.user.home_title}
                    onChange={(e) => this.props.onUpdateUserDetail('home_title', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="video">{<IntlMessages id="components.backgroundVideo" />}</Label>
                <Input
                    type="text"
                    name="home_bgvideo"
                    id="video"
                    placeholder="Enter video"
                    value={this.props.user.home_bgvideo}
                    onChange={(e) => this.props.onUpdateUserDetail('home_bgvideo', e.target.value)}
                />
            </FormGroup>
         

              { cropperResult } 

            <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFile">{<IntlMessages id="components.backgroundImage" />}</Label>
                <Input type="file" name="home_icon" id="exampleFile" onChange={(e) => this.props.onUpdateUserDetail('home_icon', e.target.value, e)} 
                   />
                   <FormText color="muted">
                     Choose an image to resize.
                   </FormText>
                </div>
              </FormGroup>
               <div className="d-flex align-items-center justify-content-center mb-10">
                  <Button onClick={this.cropImage.bind(this)} variant="raised" className="bg-success text-white w-100">
                    <IntlMessages id="button.cropImage" />
                  </Button>
                </div>

                {this.state.cropResult &&
                <RctCollapsibleCard
                   colClasses="col-sm-12 col-md-12 col-lg-12"
                   heading={<IntlMessages id="widgets.croppedImage" />}
                >
                   <img style={{ width: '100%' }} src={this.state.cropResult} alt="cropped_img" />
                </RctCollapsibleCard>
             }


              { cropperResultOnbg } 

            <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFiles">{<IntlMessages id="components.logo" />}</Label>
                <Input type="file" name="home_bgimage" id="exampleFiles" onChange={(e) => this.props.onUpdateUserDetail('home_bgimage', e.target.value, e)} 
                   />
                   <FormText color="muted">
                     Choose an image to resize.
                   </FormText>
                </div>
              </FormGroup>
               <div className="d-flex align-items-center justify-content-center mb-10">
                  <Button onClick={this.cropImageOnHover.bind(this)} variant="raised" className="bg-success text-white w-100">
                    <IntlMessages id="button.cropImage" />
                  </Button>
                </div>

                {this.state.cropResultonHover &&
                <RctCollapsibleCard
                   colClasses="col-sm-12 col-md-12 col-lg-12"
                   heading={<IntlMessages id="widgets.croppedImage" />}
                >
                   <img style={{ width: '100%' }} src={this.state.cropResultonHover} alt="cropped_img" />
                </RctCollapsibleCard>
             }
       
         </Form>
);
}

}

export default UpdateUserForm;
