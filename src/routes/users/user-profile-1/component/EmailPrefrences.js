//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { FormGroup, FormText, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { NotificationManager } from 'react-notifications';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import api from 'Api';
import { checkPath } from "Helpers/helpers";
import Slim from 'Components/Slim/slim.react';
class EmailPrefrences extends Component {

   state = {
      user: null,
   
   }

   
	componentDidMount() {
		if(this.props.user ){
			localStorage.setItem("userProfilePage.user",this.props.user)
		}
      this.setState({ user: localStorage.getItem("userProfilePage.user")});
	}


   onUpdateProfile() {
    const { user } = this.state;
    let self = this;
     api.post('update-user-data', user)
         .then((response) => {
            self.setState({ user:response.data.data });
             localStorage.setItem('user_id',JSON.stringify(response.data.data));
 
            NotificationManager.success('Profile Updated Successfully!');
         })
         .catch(error => {
            // error hanlding
         })
    
  }

   onChange(e) {
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
         files = e.dataTransfer.files;
      } else if (e.target) {
         files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
              user: {
                ...this.state.user,
                ['photo']: reader.result
             },
            
            });
      };
      reader.readAsDataURL(files[0]);
   }


   slimRemoveImage(slim) {
      this.props.onUpdateUserDetail('photo', 0)
      this.setState({
         user: {
           ...this.state.user,
           ['photo']: 0
        }
       });
      console.log('remove');
   }
    //on any transform on image croper
   slimTransform(data, slim){
      var base64 = '';
      if(slim._data.output.image){
          base64 = slim._data.output.image.toDataURL("image/*");
      }
      this.setState({
         user: {
           ...this.state.user,
           [slim._output.name]: base64
        }
       });
      console.log('Transform');
   }
   
   render() {
    console.log(this.state);
    const { user, } = this.state;

     return (
      <div className="image-cropper-wrap">
         <div className="row">
            <RctCollapsibleCard colClasses="col-sm-12 col-md-12 col-lg-6" contentCustomClasses="crop-wrapper" >
             <h2 className="heading"><IntlMessages id="components.profilePicture" /></h2>asdas
              {/* Image Div Start */}
              <FormGroup>
               
               <Slim ratio="360:360"
                     initialImage={this.state.user.photo ?  hubCheckPaths('images')+this.state.user.photo : null}
                     //data-size="640,640"
                     didTransform={ this.slimTransform.bind(this) }
                     didRemove={ this.slimRemoveImage.bind(this) }
                     >
                  <input type="file" name="photo" />
               </Slim>
             </FormGroup>
             
            </RctCollapsibleCard>
         </div>
      
         <hr />
     <Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdateProfile()}><IntlMessages id="widgets.updateProfile" />dfgdfg</Button>
      </div>
   );
   }
}
export default EmailPrefrences;