//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import ReactQuill from 'react-quill';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


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

const pStyle = {
  minHeight: '8em'
}


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      options: [1],
      cropResultonHover:null,
      chkbox:true,
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

    this.props.addNewUserDetails.os_type = options;
    // update the state with the new array of options
    this.setState({ options: options })
  }

  cropImage(e) {
      e.preventDefault();
    console.log(this.cropper);
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.icon = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }


   cropImageOnHover() {
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.bg_image = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResultonHover: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }

  

   render() {
      console.log(this.props.addNewUserDetails);
      return (
        <Form>
            <FormGroup>
                <Label for="title">{<IntlMessages id="components.title" />}</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.addNewUserDetails.title}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('title', e.target.value)}
                />
            </FormGroup>
      <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.backgroundVideo" />}</Label>
                <Input
                    type="text"
                    name="bg_video"
                    id="bg_video"
                    placeholder="Enter valid Video Url"
                    value={this.props.addNewUserDetails.bg_video}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('bg_video', e.target.value)}
                />
            </FormGroup>
        <FormGroup>
                <Label for="status">{<IntlMessages id="components.backgroundSelection" />}</Label>
                <Input type="select" name="bg_selection" id="status" value={this.props.addNewUserDetails.bg_selection} onChange={(e) => this.props.onChangeAddNewUserDetails('bg_selection', e.target.value)}>
                   <option value="1">Image</option>
                   <option value="2">Video</option>
              </Input>
            </FormGroup>
         <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Input type="select" name="language" id="language" value={this.props.addNewUserDetails.language} onChange={(e) => this.props.onChangeAddNewUserDetails('language', e.target.value)}>
                   <option value="1">Image</option>
                   <option value="2">Video</option>
              </Input>
            </FormGroup>   
         <FormGroup>
                <Label for="cat_type">{<IntlMessages id="components.categoryType" />}</Label>
                <Input type="select" name="cat_type" id="cat_type" value={this.props.addNewUserDetails.cat_type} onChange={(e) => this.props.onChangeAddNewUserDetails('cat_type', e.target.value)}>
                   <option value="1">Menu</option>
                   <option value="2">Url</option>
              </Input>
            </FormGroup>
          {this.props.addNewUserDetails.cat_type === '2' &&
            <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.videoUrl" />}</Label>
                <Input
                    type="text"
                    name="bg_video"
                    id="bg_video"
                    placeholder="Enter valid Video Url"
                    value={this.props.addNewUserDetails.video_url}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('video_url', e.target.value)}
                />
            </FormGroup>
          }
          <FormGroup>
                <Label for="sound">{<IntlMessages id="components.sound" />}</Label>
                <Input type="select" name="sound" id="sound" value={this.props.addNewUserDetails.sound} onChange={(e) => this.props.onChangeAddNewUserDetails('sound', e.target.value)}>
                   <option value="1">yes</option>
                   <option value="0">no</option>
              </Input>
          </FormGroup>
          <FormGroup row>
            <Label for="checkbox2" sm={2}>Checkbox</Label>
            <Col sm={10}>
              <FormGroup check> 
                <Label check>
                   <input type="checkbox" value={1} defaultChecked={this.state.chkbox} disabled="disabled"/>{' '}
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
                   <input type="checkbox" value={3} onChange={this.onChange.bind(this)} />{' '}
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
          </FormGroup>
      {this.props.addNewUserDetails.icon &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={260 / 360}
                  guides={false}
                  src={this.props.addNewUserDetails.icon}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }   
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


      {this.props.addNewUserDetails.bg_image &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={260 / 360}
                  guides={false}
                  src={this.props.addNewUserDetails.bg_image}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }    



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
export default AddNewUserForm;