/**
 * Update User Details Form
 */
import React, {Component}  from 'react';
import { Form, FormGroup, Label, Input,FormText } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import IntlMessages from 'Util/IntlMessages';

import ReactQuill from 'react-quill';

import { checkPath } from "Helpers/helpers";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';


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
 

class UpdateUserForm extends Component {

       state = {
          cropResult:null,
          cropResultonHover:null,
          foldername:'team'
      }

        

      cropImage(e) {
      e.preventDefault();

          if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
             return;
          }
          this.props.user.image = this.cropper.getCroppedCanvas().toDataURL();
          this.setState({
             cropResult: this.cropper.getCroppedCanvas().toDataURL(),
          });
       }

       cropImageOnHover() {
        if (typeof this.croppers.getCroppedCanvas() === 'undefined') {
           return;
        }
        this.props.user.image_hover = this.croppers.getCroppedCanvas().toDataURL();
        
        this.setState({
           cropResultonHover: this.croppers.getCroppedCanvas().toDataURL(),
        });
     }

         
 render() {    
         const { foldername } = this.state;
         
    let cropperResult;
     if(this.props.cropResult){
        cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={this.props.user.image}
                    aspectRatio={260 / 360}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else if(this.props.cropResult !== true && this.props.user.image) {
        cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={checkPath('team')+this.props.user.image}
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
                    src={this.props.user.image_hover}
                    aspectRatio={260 / 360}
                    ref={croppers => { this.croppers = croppers; }}
                />
     } else if(this.props.cropResultOnHover !== true && this.props.user.image_hover) {
        cropperResultOnHover = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={checkPath('team')+this.props.user.image_hover}
                    aspectRatio={260 / 360}
                    ref={croppers => { this.croppers = croppers; }}
                />
     } else {
        cropperResultOnHover = '';
     }
  
       
  return(
    <Form>
        <FormGroup>
            <Label for="name">{<IntlMessages id="sidebar.name" />}</Label>
            <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                value={this.props.user.name}
                onChange={(e) => this.props.onUpdateUserDetail('name', e.target.value)}
            />
        </FormGroup>
		<FormGroup>
            <Label for="designation">{<IntlMessages id="sidebar.type" />}</Label>
            <Input
                type="text"
                name="designation"
                id="designation"
                placeholder="Enter Designation"
                value={this.props.user.designation}
                onChange={(e) => this.props.onUpdateUserDetail('designation', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="status">Status</Label>
            <Input type="select" name="status" id="status" value={this.props.user.status} onChange={(e) => this.props.onUpdateUserDetail('status', e.target.value)}>
               <option value="1">Active</option>
               <option value="0">Inactive</option>
          </Input>
        </FormGroup>
        { cropperResult }

         <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
               
                
                <Input  type="file" name="image" id="exampleFile" onChange={(e) => this.props.onUpdateUserDetail('image', e.target.value, e)} 
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

         {  cropperResultOnHover  }

         <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
               
                
                <Input  type="file" name="image_hover" id="exampleFiles" onChange={(e) => this.props.onUpdateUserDetail('image_hover', e.target.value, e)} 
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
