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

// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';






class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      options: [1],
      cropResultonHover:null,
      chkbox:true,
      languageResult:[]
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
    this.props.onChangeAddNewUserDetails(slim._output.name, base64);
    this.props.onChangeAddNewUserDetails(slim._output.name+'_large', large_base64);
    console.log('Transform');
 }
  
  

   render() {
 
      const { languageResult } = this.state;
      return (
        <Form>
           <Input
                    type="hidden"
                    name="subscription_id"
                    value={this.props.addNewUserDetails.subscription_id}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('subscription_id', e.target.value)}
                />
           <Input
                    type="hidden"
                    name="subscription_type"
                    value={this.props.addNewUserDetails.subscription_type}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('subscription_type', e.target.value)}
                />
           <Input
                    type="hidden"
                    name="user_id"
                    value={this.props.addNewUserDetails.user_id}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('user_id', e.target.value)}
                />

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
            <Label >{<IntlMessages id="components.icon" />} {"("+this.props.icon_size.height+" X "+this.props.icon_size.width+")"} </Label>
            <Slim ratio={this.props.icon_size.height+":"+this.props.icon_size.width}
                   data-size={this.props.icon_size.height+","+this.props.icon_size.width}
                   forceSize= {this.props.icon_size.height+","+this.props.icon_size.width}
                    initialImage={null}
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
                    value={this.props.addNewUserDetails.bg_video}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('bg_video', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
              <Label >{<IntlMessages id="components.backgroundImage" />} (1920 X 1080)</Label>
                 <Slim ratio="1920:1080"
                     data-size="1920,1080"
                     forceSize="1920,1080"
                      initialImage={null}
                      didTransform={ this.slimTransform.bind(this) }
                      didRemove={ this.slimTransform.bind(this) }
                      >
                    <input type="file" name="bg_image" accept="image/*"/>
                </Slim>
            </FormGroup>
        
        {/* <FormGroup>
                <Label for="status">{<IntlMessages id="components.backgroundSelection" />}</Label>
                <Input type="select" name="bg_selection" id="status" value={this.props.addNewUserDetails.bg_selection} onChange={(e) => this.props.onChangeAddNewUserDetails('bg_selection', e.target.value)}>
                   <option value="1">Image</option>
                   <option value="2">Video</option>
              </Input>
            </FormGroup> */}
         <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
                <Input type="select" name="language" id="language" value={this.props.addNewUserDetails.language} onChange={(e) => this.props.onChangeAddNewUserDetails('language', e.target.value)}>
                <option  value=''>Select Language</option>
                  { languageResult && languageResult.map((user, key) => (
                      <option key={key} value={user.id}>{user.name}</option>
                    )) }
              </Input>
            </FormGroup>   
         <FormGroup>
                <Label for="cat_type">{<IntlMessages id="components.categoryType" />}</Label>
                <Input type="select" name="cat_type" id="cat_type" value={this.props.addNewUserDetails.cat_type} onChange={(e) => this.props.onChangeAddNewUserDetails('cat_type', e.target.value)}>
                   <option value="1">Menu</option>
                   <option value="2">Url</option>
              </Input>
            </FormGroup>
          {/* {this.props.addNewUserDetails.cat_type === '2' &&
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
          } */}
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
                  <input type="checkbox" name="os_type"  value={this.props.os_type}  defaultChecked={this.props.os_type == 1 ? this.state.chkbox : false } disabled={this.props.os_type == 1 ? this.state.chkbox : false }  />{' '}
                 {<IntlMessages id="sidebar.pc" /> }
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" name="os_type" value={2} defaultChecked={this.props.os_type == 2 ? this.state.chkbox : false } disabled={this.props.os_type == 2 ? this.state.chkbox : false } onChange={this.onChange.bind(this)} />{' '}
                 {<IntlMessages id="sidebar.macos" /> }
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" name="os_type" value={3} defaultChecked={this.props.os_type == 3 ? this.state.chkbox : false } disabled={this.props.os_type == 3 ? this.state.chkbox : false } onChange={this.onChange.bind(this)} />{' '}
                  {<IntlMessages id="sidebar.linux" /> }
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" name="os_type"  value={4} defaultChecked={this.props.os_type == 4 ? this.state.chkbox : false } disabled={this.props.os_type == 4 ? this.state.chkbox : false } onChange={this.onChange.bind(this)} />{' '}
                  {<IntlMessages id="sidebar.chromos" /> }
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" name="os_type" value={5} defaultChecked={this.props.os_type == 5 ? this.state.chkbox : false } disabled={this.props.os_type == 5 ? this.state.chkbox : false } onChange={this.onChange.bind(this)} />{' '}
                   {<IntlMessages id="sidebar.android" /> }
                    </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                   <input type="checkbox" name="os_type" value={6} defaultChecked={this.props.os_type == 6 ? this.state.chkbox : false } disabled={this.props.os_type == 6 ? this.state.chkbox : false } onChange={this.onChange.bind(this)} />{' '}
                   {<IntlMessages id="sidebar.ios" /> }
                    </Label>
              </FormGroup>
			  <FormGroup check>
                <Label check>
                   <input type="checkbox" name="os_type" value={7} defaultChecked={this.props.os_type == 7 ? this.state.chkbox : false } disabled={this.props.os_type == 7 ? this.state.chkbox : false } onChange={this.onChange.bind(this)} />{' '}
                   {<IntlMessages id="sidebar.box" /> }
                    </Label>
              </FormGroup>
            </Col>
          </FormGroup>
    
              

       
         </Form>
      );
   }
}
export default AddNewUserForm;