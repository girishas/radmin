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

import { checkPath, pathForxml,hubCheckPaths } from "Helpers/helpers";

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';
 
class UpdateUserForm extends Component {



       state = {
          cropResult:null,
          languageResult:[]
      }

     

   
    //on any transform on image croper
    slimTransform(data, slim){
      // continue saving the data
      if(slim._hasInitialImage  && !slim._imageEditor)
      return true;

      var base64 = 0;
      var large_base64 = 0;
      if(slim._data.output.image){
        var  dataurl = slim._data.output.image.toDataURL("image/png") ;
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
      this.props.onUpdateUserDetail(slim._output.name, base64);
      this.props.onUpdateUserDetail(slim._output.name+'_large', large_base64);
      console.log('Transform');
   }
   


         
 render() {    


  
  return(
    <Form>
            <FormGroup>
                <Label for="title">{<IntlMessages id="components.title" />}</Label>
                <Input
                    type="text"
                    name="home_title"
                    id="title"
                    placeholder="Enter Title"
                    value={this.props.user.home_title}
                    onChange={(e) => this.props.onUpdateUserDetail('home_title', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="video">{<IntlMessages id="components.backgroundVideo" />}</Label>
                <Input
                    type="text"
                    name="home_bgvideo"
                    id="video"
                    placeholder="Enter video"
                    value={this.props.user.home_bgvideo}
                    onChange={(e) => this.props.onUpdateUserDetail('home_bgvideo', e.target.value)}
                />
            </FormGroup>
         
            <FormGroup>
                 <Label >{<IntlMessages id="components.logo" />} {"("+this.props.icon_size.height+" X "+this.props.icon_size.width+")"}</Label>
                 
                 <Slim ratio={this.props.icon_size.height+":"+this.props.icon_size.width}
                   data-size={this.props.icon_size.height+","+this.props.icon_size.width}
                   forceSize= {this.props.icon_size.height+","+this.props.icon_size.width}
                        initialImage={this.props.user.home_icon ?  hubCheckPaths('images_large')+this.props.user.home_icon : null}
                        didTransform={ this.slimTransform.bind(this) }
                        didRemove={ this.slimTransform.bind(this) }
                        >
                     <input type="file" name="home_icon"  accept="image/png"/>
                  </Slim>
            </FormGroup>

             {/* Image Div Start */}
             <FormGroup>
                  <Label >{<IntlMessages id="components.backgroundImage" />} (1920 X 1080)</Label>
                  <Slim atio="1920:1080"
                        data-size="1920,1080"
                        forceSize="1920,1080"
                        initialImage={this.props.user.home_bgimage ?  hubCheckPaths('images_large')+this.props.user.home_bgimage : null}
                       
                        didTransform={ this.slimTransform.bind(this) }
                        didRemove={ this.slimTransform.bind(this) }
                        >
                     <input type="file" name="home_bgimage"  accept="image/*" />
                  </Slim>
                </FormGroup>

             
       
         </Form>
);
}

}

export default UpdateUserForm;
