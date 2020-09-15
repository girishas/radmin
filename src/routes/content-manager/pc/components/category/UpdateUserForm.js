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

import { checkPath, hubCheckPaths, pathForxml } from "Helpers/helpers";

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';
import $ from 'jquery';
import { isArray } from 'util';
class UpdateUserForm extends Component {

       state = {
          cropResult:null,
          foldername:'images',
          options:[],
          languageResult:[],
          os_type : [ 
            {'id':1, value:'Pc'},
            {'id':2, value:'MacOs'},
            {'id':3, value:'Linux'},
            {'id':4, value:'Chrome'},
            {'id':5, value:'Android'},
            {'id':6, value:'Ios'},
            {'id':7, value:'Box'}
             
          ],
         
      }


      componentDidMount() {
       
         api.get('get-language-array', {
            params: {
              browser_id: this.props.browser_id
            }
          })
           .then((response) => {
              this.setState({languageResult:response.data });
           })
           .catch(error => {
              // error hanlding
           })


           // pre ostype in state
           var preostye  =  this.props.user.os_type;
           preostye  =  (preostye.toString().indexOf(',') > -1) ? preostye.toString().split(','):preostye;
           var options = [];
           if(isArray(preostye)){
            { preostye && preostye.map((ostype, key) => (
              // <option key={key} value={user.id}>{user.name}</option>
              
              options.push(parseInt(ostype))
             
            )) }
           }else{
            options[0] = preostye ; 
           }
           this.setState({ options: options })

     }

             
       onChange(e) {

        // current array of options
        const options = this.state.options;
        console.log('aks option ', options)
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

   
    //on any transform on image croper
    slimTransform(data, slim){
     
    
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
         const { foldername, languageResult, os_type } = this.state;

 
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
            <FormGroup>
                  <Label >{<IntlMessages id="components.icon" />} {"("+this.props.icon_size.height+" X "+this.props.icon_size.width+")"}</Label>
                  <Slim ratio={this.props.icon_size.height+":"+this.props.icon_size.width}
                   data-size={this.props.icon_size.height+","+this.props.icon_size.width}
                   forceSize= {this.props.icon_size.height+","+this.props.icon_size.width}
                        initialImage={this.props.user.icon ?  hubCheckPaths('images_large')+this.props.user.icon : null}
                        
                        didTransform={ this.slimTransform.bind(this) }
                        didRemove={ this.slimTransform.bind(this) }
                        >
                     <input type="file" name="icon"  accept="image/png" />
                  </Slim>
            </FormGroup>
            <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.backgroundVideo" />}</Label>
                <Input
                    type="text"
                    name="bg_video"
                    id="bg_video"
                    placeholder="Enter valid Video Url"
                    value={this.props.user.bg_video}
                    onChange={(e) => this.props.onUpdateUserDetail('bg_video', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
               <Label >{<IntlMessages id="components.backgroundImage" />} (1920 X 1080)</Label>
               <Slim ratio="1920:1080"
                     data-size="1920,1080"
                     forceSize="1920,1080"
                     initialImage={this.props.user.bg_image ?  hubCheckPaths('images_large')+this.props.user.bg_image : null}
                     
                     didTransform={ this.slimTransform.bind(this) }
                     didRemove={ this.slimTransform.bind(this) }
                     >
                  <input type="file" name="bg_image" accept="image/*"/>
               </Slim>
            </FormGroup>
              
        {/* <FormGroup>
                <Label for="status">{<IntlMessages id="components.backgroundSelection" />}</Label>
                <Input type="select" name="bg_selection" id="status" value={this.props.user.bg_selection} onChange={(e) => this.props.onUpdateUserDetail('bg_selection', e.target.value)}>
                   <option value="1">Image</option>
                   <option value="2">Video</option>
              </Input>
            </FormGroup> */}
         <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Input type="select" name="language" id="language" value={this.props.user.language} onChange={(e) => this.props.onUpdateUserDetail('language', e.target.value)}>
                    <option  value=''>Select Language</option>
                   { languageResult && languageResult.map((user, key) => (
                      <option key={key} value={user.id}>{user.name}</option>
                    )) }
              </Input>
            </FormGroup>   
         <FormGroup>
                <Label for="cat_type">{<IntlMessages id="components.categoryType" />}</Label>
                <Input type="select" name="cat_type" id="cat_type" value={this.props.user.cat_type} onChange={(e) => this.props.onUpdateUserDetail('cat_type', e.target.value)}>
                   <option value="1">Menu</option>
                   <option value="2">Url</option>
              </Input>
            </FormGroup>
          {/* {this.props.user.cat_type === '2' &&
            <FormGroup>
                <Label for="bg_video">{<IntlMessages id="components.videoUrl" />}</Label>
                <Input
                    type="text"
                    name="bg_video"
                    id="bg_video"
                    placeholder="Enter valid Video Url"
                    value={this.props.user.video_url}
                    onChange={(e) => this.props.onUpdateUserDetail('video_url', e.target.value)}
                />
            </FormGroup>
          } */}
          <FormGroup>
                <Label for="sound">{<IntlMessages id="components.sound" />}</Label>
                <Input type="select" name="sound" id="sound" value={this.props.user.sound} onChange={(e) => this.props.onUpdateUserDetail('sound', e.target.value)}>
                   <option value="1">yes</option>
                   <option value="0">no</option>
              </Input>
            </FormGroup>
           <FormGroup row>
            <Label for="checkbox2" sm={2}><IntlMessages id="components.OsType" /></Label>
            <Col sm={10}>
            {os_type && os_type.map((os,key) => {
             return <FormGroup check> 
                        <Label check>
                           <input  type="checkbox" checked={this.props.user.os_type.includes(os.id)?'true':''} value={os.id} onChange={this.onChange.bind(this)} />{' '}
                          {os.value}
                          </Label> 
                      </FormGroup>
            })
              
              }
            
            </Col>
          </FormGroup> 
     
       
         </Form>
);
}

}

export default UpdateUserForm;
