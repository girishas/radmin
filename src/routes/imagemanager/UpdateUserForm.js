/**
 * Update User Details Form
 */
import React, {Component} from 'react';
import { Form, FormGroup, Label, Input,FormText, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import IntlMessages from 'Util/IntlMessages';


import { checkPath } from "Helpers/helpers";

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';


class UpdateUserForm extends Component {

       state = {
          cropResult:null,
          foldername:'image'
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

          return false;
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
                    aspectRatio={this.props.user.width / this.props.user.height}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else if(this.props.cropResult !== true && this.props.user.image){
         cropperResult = <Cropper
                    style={{ height: 400, width: '100%' }}
                    preview=".img-preview"
                    guides={true}
                    aspectRatio={this.props.user.width / this.props.user.height}
                    src={checkPath(foldername)+this.props.user.image}
                    ref={cropper => { this.cropper = cropper; }}
                />
     } else {
        cropperResult = '';
     }
  
  return(
    <Form>
       {/* <FormGroup>
         <Label for="slug">{<IntlMessages id="sidebar.content" />}</Label>*/}
            { <Input
                type="hidden"
                name="slug"
                id="slug"
                placeholder="Enter Slug"
                value={this.props.user.slug}
                onChange={(e) => this.props.onUpdateUserDetail('slug', e.target.value)}
            />}
          
        {/*</FormGroup>*/}
         <FormGroup>
            <Label for="location">Location</Label>
            <Input
                type="text"
                name="name"
                id="location"
                placeholder="Enter Location"
                value={this.props.user.page_title}
                onChange={(e) => this.props.onUpdateUserDetail('page_title', e.target.value)}
            />
        </FormGroup>
    
        <FormGroup>
            <Label for="status">{<IntlMessages id="widgets.status" />}</Label>
            <Input type="select" name="status" id="status" value={this.props.user.status} onChange={(e) => this.props.onUpdateUserDetail('status', e.target.value)}>
               <option value="1">Active</option>
               <option value="0">Inactive</option>
          </Input>
        </FormGroup>

        <FormGroup>
            <Label for="type">{<IntlMessages id="sidebar.type" />}</Label>
            <Input type="select" name="type" id="type" value={this.props.user.type} onChange={(e) => this.props.onUpdateUserDetail('type', e.target.value)}>
               <option value="1">Image</option>
               <option value="2">Video / Icon</option>
          </Input>
        </FormGroup>
       {this.props.user.type == '2' &&
         <FormGroup>
          <Label for="video">{<IntlMessages id="components.video" />}</Label>
           <Input
            type="text"
            name="video"
            id="video"
            placeholder="Enter Video link or icon (<i class='ion-ios-clock-outline'></i>)"
            value={this.props.user.video}
            onChange={(e) => this.props.onUpdateUserDetail('video', e.target.value)}
          />
          <a style={{float: "right"}} href="https://aalmiray.github.io/ikonli/cheat-sheet-ionicons.html" target="_blank">Icon List</a>
        </FormGroup>

      }


         { this.props.user.type == '1' && cropperResult }

        { this.props.user.type == '1'  &&             
        <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
                <div className="w-30 mb-10 mb-md-0">
                 <Input  type="file" name="image" id="exampleFile" onChange={(e) => this.props.onUpdateUserDetail('image', e.target.value, e)} 
                   />
                   <FormText color="muted">
                     Choose an image to resize.
                   </FormText>
                </div>
        </FormGroup>

      }
       { this.props.user.type == '1'  && 
        <div className="d-flex align-items-center justify-content-center mb-10">
            <Button onClick={this.cropImage.bind(this)} variant="raised" className="bg-success text-white w-100">
              <IntlMessages id="button.cropImage" />
            </Button>
          </div>
        }      
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
