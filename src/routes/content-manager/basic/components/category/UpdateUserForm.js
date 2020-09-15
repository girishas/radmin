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

import { checkPath, checkPaths } from "Helpers/helpers";

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

 
class UpdateUserForm extends Component {

       state = {
          cropResult:null,
          foldername:'images',
          options: []
      }


    

             
       onChange(e) {
        // current array of options
        const options = this.state.options
        let index

        // check if the check box is checked or unchecked
        if (e.target.checked) {
          // add the numerical value of the checkbox to options array
          options.push(+e.target.value)
        } else {
          // or remove the value from the unchecked checkbox from the array
          index = options.indexOf(+e.target.value)
          options.splice(index, 1)
        }

        this.props.user.os_type = options;
        // update the state with the new array of options
        this.setState({ options: options })
      }  

      cropImage(e) {
      e.preventDefault();

          if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
             return;
          }
          this.props.user.icon = this.cropper.getCroppedCanvas().toDataURL();
          this.setState({
             cropResult: this.cropper.getCroppedCanvas().toDataURL(),
          });
       }

       cropImageOnHover() {
        if (typeof this.croppers.getCroppedCanvas() === 'undefined') {
           return;
        }
        this.props.user.bg_image = this.croppers.getCroppedCanvas().toDataURL();
        
        this.setState({
           cropResultonHover: this.croppers.getCroppedCanvas().toDataURL(),
        });
     }

         
 render() {    
         const { foldername } = this.state;
console.log(this.props);

   let cropperResult;
     if(this.props.cropResult){
        cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={this.props.user.icon}
                    aspectRatio={260 / 360}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else if(this.props.cropResult === null && this.props.user.icon) {
        cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={checkPaths(foldername)+this.props.user.icon}
                    aspectRatio={260 / 360}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else {
        cropperResult = '';
     }

     let cropperResultOnHover;
     if(this.props.cropResultOnHover){
        cropperResultOnHover = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={this.props.user.bg_image}
                    aspectRatio={260 / 360}
                    ref={croppers => { this.croppers = croppers; }}
                />
     } else if(this.props.cropResultOnHover === null && this.props.user.bg_image) {
        cropperResultOnHover = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={checkPaths(foldername)+this.props.user.bg_image}
                    aspectRatio={260 / 360}
                    ref={croppers => { this.croppers = croppers; }}
                />
     } else {
        cropperResultOnHover = '';
     }
  
  return(
    <Form>
            <FormGroup>
                <Label for="title">{<IntlMessages id="components.title" />}</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.user.title}
                    onChange={(e) => this.props.onUpdateUserDetail('title', e.target.value)}
                />
            </FormGroup>
      <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.backgroundVideo" />}</Label>
                <Input
                    type="text"
                    name="bg_video"
                    id="bg_video"
                    placeholder="Enter valid Video Url"
                    value={this.props.user.bg_video}
                    onChange={(e) => this.props.onUpdateUserDetail('bg_video', e.target.value)}
                />
            </FormGroup>
        <FormGroup>
                <Label for="status">{<IntlMessages id="components.backgroundSelection" />}</Label>
                <Input type="select" name="bg_selection" id="status" value={this.props.user.bg_selection} onChange={(e) => this.props.onUpdateUserDetail('bg_selection', e.target.value)}>
                   <option value="1">Image</option>
                   <option value="2">Video</option>
              </Input>
            </FormGroup>
         <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Input type="select" name="language" id="language" value={this.props.user.language} onChange={(e) => this.props.onUpdateUserDetail('language', e.target.value)}>
                   <option value="1">Image</option>
                   <option value="2">Video</option>
              </Input>
            </FormGroup>   
         <FormGroup>
                <Label for="cat_type">{<IntlMessages id="components.categoryType" />}</Label>
                <Input type="select" name="cat_type" id="cat_type" value={this.props.user.cat_type} onChange={(e) => this.props.onUpdateUserDetail('cat_type', e.target.value)}>
                   <option value="1">Menu</option>
                   <option value="2">Url</option>
              </Input>
            </FormGroup>
          {this.props.user.cat_type === '2' &&
            <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.videoUrl" />}</Label>
                <Input
                    type="text"
                    name="bg_video"
                    id="bg_video"
                    placeholder="Enter valid Video Url"
                    value={this.props.user.video_url}
                    onChange={(e) => this.props.onUpdateUserDetail('video_url', e.target.value)}
                />
            </FormGroup>
          }
          <FormGroup>
                <Label for="sound">{<IntlMessages id="components.sound" />}</Label>
                <Input type="select" name="sound" id="sound" value={this.props.user.sound} onChange={(e) => this.props.onUpdateUserDetail('sound', e.target.value)}>
                   <option value="1">yes</option>
                   <option value="0">no</option>
              </Input>
            </FormGroup>
          {/*  <FormGroup row>
            <Label for="checkbox2" sm={2}>Checkbox</Label>
            <Col sm={10}>
              <FormGroup check> 
                <Label check>
                   <input type="checkbox" value={1} onChange={this.onChange.bind(this)} />{' '}
                  PC
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" value={2} onChange={this.onChange.bind(this)} />{' '}
                  Mac OS
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" value={3}  onChange={this.onChange.bind(this)} />{' '}
                  Linux
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" value={4} onChange={this.onChange.bind(this)} />{' '}
                  Chrome Os
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" value={5} onChange={this.onChange.bind(this)} />{' '}
                  Android
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" value={6} onChange={this.onChange.bind(this)} />{' '}
                  Ios
                    </Label>
              </FormGroup>
            </Col>
          </FormGroup> */}
      { cropperResult } 
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFile">Image</Label>
                <Input type="file" name="icon" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('icon', e.target.value, e)} 
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

      {cropperResultOnHover}
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Label for="exampleFiles">Image On Hover</Label>
                <Input type="file" name="bg_image" id="exampleFiles" onChange={(e) => this.props.onChangeAddNewUserDetails('bg_image', e.target.value, e)} 
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
