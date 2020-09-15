//Image Cropper

import React, { Component } from 'react';
import { FormGroup, FormText, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { NotificationManager } from 'react-notifications';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import {user_id } from "Helpers/helpers";
import $ from 'jquery';
import api from 'Api';
import { hubCheckPaths } from "Helpers/helpers";
import Slim from 'Components/Slim/slim.react';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
class EmailPrefrences extends Component {

   constructor(props) {
      super(props);
      const userDetails = window.localStorage.getItem('user_id');
      const authUser = JSON.parse(userDetails);
      this.state = {
         user:  authUser,
         cropResult:null,
         cropResults:null,
         loading:false
      }
   }
  
	componentDidMount() {
      const userDetails = window.localStorage.getItem('user_id');
      const authUser = JSON.parse(userDetails);
		
      console.log('aks this.props.user',this.props.user)
      this.setState({ user: authUser});
	}



   onUpdateProfile() {
    const { user } = this.state;
    this.setState({loading:true})
    let self = this;
        //new code for file
        var data = new FormData()
        $.map(user, function(value, index) {
           data.append(index,value)
        });
      api.post('update-user-data', data,{
         headers: {'User-Id':user_id()}
      })
         .then((response) => {
            self.setState({ user:response.data.data, cropResult:null ,loading:false});
            
            localStorage.setItem('user_id',JSON.stringify(response.data.data));
        
            NotificationManager.success(<IntlMessages id="note.ProfileUpdatedSuccessfully"/>);
            //location.href = AppConfig.chameleon_web_admin_url+"/app/user/user-profile-1";
            window.location.reload();
         })
         .catch(error => {
            // error hanlding
         })
    
  }

    //on any transform on image croper
   slimTransform(data, slim){
      if(slim._hasInitialImage  && !slim._imageEditor)
      return true;
      var base64 = 0;
      var large_base64 = 0;
      if(slim._data.output.image){
        var  dataurl = slim._data.output.image.toDataURL("image/*") ;
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
              while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
              }
        var file =  new File([u8arr], slim._data.input.name, {type:mime});
        base64 =  file;
      }
      if(slim._data.input.image){
        var inputFile = new File([slim._data.input.file], slim._data.input.name);
        large_base64 = inputFile;
      }
      this.setState({
         user: {
           ...this.state.user,
           [slim._output.name]: base64,
           [slim._output.name+'_large']: large_base64
        }
       });
      console.log('Transform');
   }
   render() {
    const { user, cropResult, cropResults ,loading} = this.state;
      console.log('user',user)
  
      return (
         <div className="image-cropper-wrap">
         <h2 className="heading"><IntlMessages id="components.profilePicture" /> (100 x 100)</h2>
          <div className="row" style={{display:'block'}}>
          
            <div className="col-md-3" >
               {/* Image Div Start */}
               <FormGroup>
                
                <Slim ratio="100:100"
                      data-size="100,100"
                      initialImage={this.state.user.photo ?  hubCheckPaths('images_large')+this.state.user.photo : null}
                      forceSize= "100,100"
                      didTransform={ this.slimTransform.bind(this) }
                      didRemove={ this.slimTransform.bind(this) }
                      >
                   <input type="file" name="photo" accept="image/*, image/webp"/>
                </Slim>
                {loading &&
                  <RctSectionLoader />
               }
              </FormGroup>
              
              </div>
          </div>
       
          <hr />
      <Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdateProfile()}> <IntlMessages id="components.updateprofilePicture" /></Button>
       </div>
      );
   }
}
export default EmailPrefrences;