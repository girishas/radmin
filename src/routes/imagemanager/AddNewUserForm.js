/**
 * Add New User Form
 */
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input,FormText } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
     
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

    console.log(this.props);

      return (
    <Form>
        <FormGroup>
            <Label for="slug">{<IntlMessages id="sidebar.name" />}</Label>
            <Input
                type="text"
                name="slug"
                id="slug"
                placeholder="Enter Name"
                value={this.props.addNewUserDetails.slug}
                onChange={(e) => this.props.onChangeAddNewUserDetails('slug', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="location">{<IntlMessages id="sidebar.location" />}</Label>
           <Input
                type="text"
                name="page_title"
                id="location"
                placeholder="Enter location"
                value={this.props.addNewUserDetails.page_title}
                onChange={(e) => this.props.onChangeAddNewUserDetails('page_title', e.target.value)}
            />
        </FormGroup>
	
        <FormGroup>
            <Label for="status">{<IntlMessages id="widgets.status" />}</Label>
            <Input type="select" name="status" id="status" value={this.props.addNewUserDetails.status} onChange={(e) => this.props.onChangeAddNewUserDetails('status', e.target.value)}>
               <option value="1">Active</option>
               <option value="0">Inactive</option>
          </Input>
        </FormGroup>
		
		<FormGroup>
            <Label for="type">{<IntlMessages id="sidebar.type" />}</Label>
            <Input type="select" name="type" id="type" value={this.props.addNewUserDetails.type} onChange={(e) => this.props.onChangeAddNewUserDetails('type', e.target.value)}>
               <option value="1">Image</option>
               <option value="2">Video / Icon</option>
          </Input>
        </FormGroup>
		
		{this.props.addNewUserDetails.type === '2' &&
			 <FormGroup>
				<Label for="video">{<IntlMessages id="components.video" />}</Label>
			   <Input
					type="text"
					name="video"
					id="video"
					placeholder="Enter Video link or icon (<i class='ion-ios-clock-outline'></i>)"
					value={this.props.addNewUserDetails.video}
					onChange={(e) => this.props.onChangeAddNewUserDetails('video', e.target.value)}
				/>
			</FormGroup>
		}
		
        
		{this.props.addNewUserDetails.image && this.props.addNewUserDetails.type === '1' &&
            <Cropper
                  style={{ height: 300, width: '100%' }}
                  preview=".img-preview"
                  aspectRatio={16 / 9}
                  guides={false}
                  src={this.props.addNewUserDetails.image}
                  ref={cropper => { this.cropper = cropper; }}

               />
                
        }
     { this.props.addNewUserDetails.type === '1' &&   
        <FormGroup className="mt-20 mb-20 d-flex justify-space-between align-items-center">
            <div className="w-130 mb-10 mb-md-0">
               <Input type="file" name="file" id="exampleFile" onChange={(e) => this.props.onChangeAddNewUserDetails('image', e.target.value,e)} />
               <FormText color="muted">
                 Choose an image to resize.
               </FormText>
            </div>
        </FormGroup>
      }
      { this.props.addNewUserDetails.type === '1' &&
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
export default AddNewUserForm;