//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Form, FormGroup, Label, Input,FormText } from 'reactstrap';
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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
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
      selectOptions: []
  }

  handleChange = (e) => {
       
    let target = e.target
    let name = target.name

    //here
    let value = Array.from(target.selectedOptions, option => option.value);
    this.setState({
      selectOptions: value
    });
    this.props.addNewUserDetails.category = value;
  }

   

  cropImage(e) {
      e.preventDefault();
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
         return;
      }
      this.props.addNewUserDetails.image = this.cropper.getCroppedCanvas().toDataURL();
      this.setState({
         cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      });
   }

  

   render() {

    console.log(this.props.addNewUserDetails);

      return (
        <Form>
            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Name"
                    value={this.props.addNewUserDetails.title}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('title', e.target.value)}
                />
            </FormGroup>
            <FormGroup >
                <Label for="contents">Contents</Label>
                <ReactQuill
                    style={{ pStyle }}
                    modules={modules}
                    formats={formats}
                    name="contents"
                    id="contents"
                    placeholder="Enter Contents"
                    value={this.props.addNewUserDetails.contents}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('contents', e)}
                /> 
               
            </FormGroup>
           <FormGroup>
                <Label for="category">Category</Label>
               {/*<Input multiple={true} type="select" name="category" id="category" value={this.props.addNewUserDetails.category} onChange={(e) => this.props.onChangeAddNewUserDetails('category', e.target.value)}>
                  this.renderProducts() 
                   
                  <option value="0">Inactive</option>
                  <option value="1">active</option>
                  <option value="2">Processed</option>
                  <option value="3">Complete</option>
              </Input>*/}

             
              <Input multiple={true} type="select" name="category" id="category" value={this.state.selectOptions} onChange={this.handleChange} >
                <option value="1">Zen</option>
                <option value="2">Ana</option>
                <option value="3">Junk</option>
              </Input>
            
            </FormGroup> 
            <FormGroup>
                <Label for="status">Status</Label>
                <Input type="select" name="status" id="status" value={this.props.addNewUserDetails.status} onChange={(e) => this.props.onChangeAddNewUserDetails('status', e.target.value)}>
                   <option value="1">Active</option>
                   <option value="0">Inactive</option>
              </Input>
            </FormGroup>
            {this.props.addNewUserDetails.image &&
             <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={870 / 500}
                  guides={false}
                  src={this.props.addNewUserDetails.image}
                  ref={cropper => { this.cropper = cropper; }}

               />
             }
              <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                {this.props.cropResult &&
                   <Input value={this.state.cropResult} type="file" name="file" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image', e.target.value, e)} 

                   />
                 
               }
                {!this.props.cropResult &&
                <Input type="file" name="file" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image', e.target.value, e)} 
                   />
                 }
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
export default AddNewUserForm;