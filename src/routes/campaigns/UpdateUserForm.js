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
          foldername:'campaign'
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

         
 render() {    
         const { foldername } = this.state;


  let cropperResult;
     if(this.props.cropResult){
        cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={this.props.user.image}
                    aspectRatio={540 / 300}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else if(this.props.cropResult !== true && this.props.user.image){
         cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    src={checkPath(foldername)+this.props.user.image}
                    aspectRatio={540 / 300}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else {
        cropperResult = '';
     }

  
  return(
    <Form>
        <FormGroup>
            <Label for="name">Title</Label>
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
            <Label for="description">Description</Label>
            <ReactQuill
                modules={modules}
                formats={formats}
                name="desciption"
                id="description"
                placeholder="Enter Description"
                value={this.props.user.desciption}
                onChange={(e) => this.props.onUpdateUserDetail('desciption', e)}
            />     
        </FormGroup>
          <FormGroup>
              <Label for="goal_amount">Goal Amount</Label>
              <Input
                type="text"
                name="goal_amount"
                id="goal_amount"
                placeholder="Enter Goal Amount"
                value={this.props.user.goal_amount}
                onChange={(e) => this.props.onUpdateUserDetail('goal_amount', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
              <Label for="category_id">Category</Label>
              <Input type="select" name="category_id" id="category_id" value={this.props.user.category_id} onChange={(e) => this.props.onUpdateUserDetail('category_id', e.target.value)}>
                {this.props.category.map((category,key) => (
                      <option key={key} value={category.id}>{category.name}</option>
                    ))} 
            </Input>
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
                 
            
    </Form>
);
}

}

export default UpdateUserForm;
