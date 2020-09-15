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

      

         
 render() {    
         const { foldername } = this.state;

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
               <FormGroup >
                <Input
                    type="text"
                    name="cat_id"
                    value ={this.props.user.cat_id}
                    id="category"
                    style={{display : 'none'}}
                />
            </FormGroup>
      <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.url" />}</Label>
                <Input
                    type="text"
                    name="url"
                    id="bg_video"
                    placeholder="Enter URL"
                    value={this.props.user.url}
                    onChange={(e) => this.props.onUpdateUserDetail('url', e.target.value)}
                />
            </FormGroup>
         <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Input
                    type="text"
                    name="language_id"
                    id="language"
                    placeholder="Enter Language"
                    value={this.props.user.language_id}
                    onChange={(e) => this.props.onUpdateUserDetail('language_id', e.target.value)}
                />
            </FormGroup>   
         
          <FormGroup>
                <Label for="allow">{<IntlMessages id="components.allow" />}</Label>
                <Input
                    type="text"
                    name="allow"
                    id="allow"
                    placeholder="Enter Instruction"
                    value={this.props.user.allow}
                    onChange={(e) => this.props.onUpdateUserDetail('allow', e.target.value)}
                />
            </FormGroup> 
            <FormGroup>
                <Label for="deny">{<IntlMessages id="components.deny" />}</Label>
                <Input
                    type="text"
                    name="deny"
                    id="deny"
                    placeholder="Enter Instruction"
                    value={this.props.user.deny}
                    onChange={(e) => this.props.onUpdateUserDetail('deny', e.target.value)}
                />
            </FormGroup>
      {cropperResult }   
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
      
         </Form>
);
}

}

export default UpdateUserForm;
