//Image Cropper

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Form, FormGroup, Label, Input,FormText, Col ,Badge} from 'reactstrap';
import Button from '@material-ui/core/Button';
import ReactQuill from 'react-quill';
import $ from 'jquery';
// intl messages
import IntlMessages from 'Util/IntlMessages';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {pathForxml , is_valid_url} from "Helpers/helpers";
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
// api
import api from 'Api';
import Slim from 'Components/Slim/slim.react';
import { NotificationManager } from 'react-notifications';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';


class AddNewUserForm extends Component {

   state = {
      cropResult:null,
      selectOptions: this.props.addNewUserDetails.os_id,
      selectOptionsArray:this.props.addNewUserDetails.os_id,
      languageResult:[],
      iconImage:'',
      screenState :false,
 
      loading:false
  }

  handleChange = (e) => {
    
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.props.addNewUserDetails.os_id = value;
       this.setState({selectOptions: value});
   }


  componentDidMount() {

        this.setState({iconImage: 
    
          <Slim ratio={this.props.icon_size.height+":"+this.props.icon_size.width}
          forceSize= {this.props.icon_size.height+","+this.props.icon_size.width}
            initialImage={ null }
            didTransform={ this.slimTransform.bind(this) }
            didRemove={ this.slimTransform.bind(this) }
            >
          <input type="file" name="icon" />
        </Slim>
        });




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
    }

  


   renderSwitch(param) {
    switch(param) {
      case '1':
        return 'PC';
      case '2':
        return 'MacOs';
      case '3':
        return 'Linux';
      case '4':
        return 'Chrome';      
      case '5':
        return 'Android';
      case '6':
        return 'IOS';
	  case '7':
        return 'Box';
      default:
      return 'PC';  
    }
  }
  onChange(e) {
    var favorite = [];
    $.each($("input[name='os_id1']:checked"), function(){            
      favorite.push($(this).val());
    });
      this.props.addNewUserDetails.os_id = favorite;
      this.setState({selectOptions: favorite});
  }  

  onChangeLanguage(e) {
    var favorite = [];
    $.each($("input[name='language_id']:checked"), function () {
      favorite.push($(this).val());
    });
    this.props.addNewUserDetails.language_id = favorite;
  }
  
  //on any transform on image croper
  slimTransform(data, slim){
    if(slim._hasInitialImage  && !slim._imageEditor && this.screenState )
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
  
 
getScreenshot(btnNum){
  var web_url =  $('#get_url').val();
  this.setState({iconImage: 
    
    <Slim ratio={this.props.icon_size.height+":"+this.props.icon_size.width}
    forceSize= {this.props.icon_size.height+","+this.props.icon_size.width}
          initialImage= {null}
          didTransform={ this.slimTransform.bind(this) }
          didRemove={ this.slimTransform.bind(this) }
          >
        <input type="file" name="icon" />
      </Slim>
      });
  this.setState({ loading:true })
  let  _this = this;
  api.get('get-screenshot', {
    params: {
      web_url: web_url
    }
  })
  .then((response) => {

    if(response.data.error){
        var allErrors  = (response.data.error);
        NotificationManager.error(allErrors);
        return;
    }
    _this.setState({ loading:false })
    _this.setState({screenState :true});
    _this.setState({iconImage: <div className={Math.random()}>
        
        <Slim ratio={_this.props.icon_size.height+":"+_this.props.icon_size.width}
          forceSize= {_this.props.icon_size.height+","+_this.props.icon_size.width}
              initialImage={ pathForxml()+response.data.data }
              didTransform={ _this.slimTransform.bind(_this) }
              didRemove={ _this.slimTransform.bind(_this) }
              >
            <input type="file" name="icon" />
          </Slim>
        </div>
        });
   
  })
  .catch(error => {
    // error hanlding
  })
 } 

  






   render() {
  
     const { languageResult , loading} = this.state;
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
             
                <Input
                    type="text"
                    name="cat_id"
                    value ={this.props.addNewUserDetails.cat_id}
                    id="category"
                    style={{display : 'none'}}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('cat_id', e.target.value)}
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
                <Label for="get_url">{<IntlMessages id="components.url" />}</Label>
                <Input
                    type="text"
                    name="url"
                    id="get_url"
                    placeholder="Enter URL"
                    value={this.props.addNewUserDetails.url}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('url', e.target.value)}
                />
            </FormGroup>

           {/* <FormGroup>
                <Label for="category">OS Type</Label>
              <Input multiple={true} type="select" name="os_id" id="category" value={this.state.selectOptions} onChange={this.handleChange} >
        {this.state.selectOptionsArray.map((user,key) => (
                      <option key={key} value={user}>{this.renderSwitch(user)}</option>
                    ))} 
              </Input>
            
          </FormGroup>  */}

          <FormGroup row>
              <Label for="category" sm={2}><IntlMessages id="components.OsType" /></Label>
              <Col sm={10}>
                  <div className='row'>
                { this.state.selectOptionsArray.map((user,key) => {
                  return <FormGroup check sm={3}> 
                              <Label check>
                                <input type="checkbox" name='os_id1'  checked={this.state.selectOptions.includes(user)?'true':''}  value={user}  onChange={this.onChange.bind(this)}  />{' '}
                              {this.renderSwitch(user)}
                              </Label> 
                          </FormGroup>
                  })
                  
                  }
                  </div>
              </Col>
            </FormGroup>

            {/* <FormGroup>
                <Label for="language">{<IntlMessages id="components.language" />}</Label>
               <Input type="select" name="language_id" required id="language" value={this.props.addNewUserDetails.language_id} onChange={(e) => this.props.onChangeAddNewUserDetails('language_id', e.target.value)}>
               <option  value=''>Select Language</option>
                   { languageResult && languageResult.map((language, key) => (
                      <option key={key} value={language.id}>{language.name}</option>
                    )) }
              </Input>
            </FormGroup>    */}

            
        <FormGroup row>
          <Label for="category" style={{ marginTop: "-8px" }} sm={3}>{<IntlMessages id="components.language" />}</Label>
          <Col sm={9}>
            <div className='row'>
              {languageResult && languageResult.map((user, key) => {
                return <FormGroup check sm={3}>
                  <Label check>
                    <input type="checkbox" name='language_id' value={user.id} onChange={this.onChangeLanguage.bind(this)} />{' '}
                    {user.name}
                  </Label>
                </FormGroup>
              })
              }
            </div>
          </Col>
        </FormGroup>
         
          <FormGroup>
                <Label for="allow">{<IntlMessages id="components.allow" />}</Label>
                <Input
                    type="text"
                    name="allow"
                    id="allow"
                    placeholder="Enter Instruction"
                    value={this.props.addNewUserDetails.allow}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('allow', e.target.value)}
                />
            </FormGroup> 
            <FormGroup>
                <Label for="deny">{<IntlMessages id="components.deny" />}</Label>
                <Input
                    type="text"
                    name="deny"
                    id="deny"
                    placeholder="Enter Instruction"
                    value={this.props.addNewUserDetails.deny}
                    onChange={(e) => this.props.onChangeAddNewUserDetails('deny', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
            <Label >{<IntlMessages id="components.icon" />} {"("+this.props.icon_size.height+" X "+this.props.icon_size.width+")"}  </Label>
                {/* <div className='removeFirstSlim' id="my-cropper">
                  <Slim ratio="512:512"
                      data-size="512,512"
                      initialImage= {this.state.iconImage}
                      didTransform={ this.slimTransform.bind(this) }
                      didRemove={ this.slimTransform.bind(this) }
                      >
                    <input type="file" name="icon"   />
                  </Slim> 
                </div> */}
                {this.state.iconImage}
             
            </FormGroup>
    
 { /* is_valid_url(this.props.addNewUserDetails.url) &&
      <Button variant="raised" id="screenShotBtn1" className="text-white btn-success" onClick={() => this.getScreenshot(1)}><i className="ti-fullscreen mr-2"></i>  Get a screenshot from:  {'  '}<span className="btn-url-text ml-2" style={{textTransform: "initial"}}> {this.props.addNewUserDetails.url}</span>{loading && <RctSectionLoader />}</Button>  
    */ }
    <Badge className="mb-15 mt-15 ml-25 pl-1 pr-1 text-center" id="badgeBtn"  color="warning"></Badge>
          



          
         </Form>
      );
   }
}
export default AddNewUserForm;