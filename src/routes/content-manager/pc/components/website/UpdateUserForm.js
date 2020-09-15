/**
 * Update User Details Form
 */
import React, {Component} from 'react';
import { Form, FormGroup, Label, Input,FormText, Col ,Badge } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Cropper from 'react-cropper';
const src = 'http://reactify.theironnetwork.org/data/images/nature-poster.jpg';
import IntlMessages from 'Util/IntlMessages';

import ReactQuill from 'react-quill';
import { isArray } from 'util';
import $ from 'jquery';
import { checkPath, pathForxml, hubCheckPaths , is_valid_url,doesFileExist} from "Helpers/helpers";

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import Slim from 'Components/Slim/slim.react';
import { NotificationManager } from 'react-notifications';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

class UpdateUserForm extends Component {

       state = {
          cropResult:null,
	      selectOptions: (this.props.user.os_id.indexOf(',') > -1) ? this.props.user.os_id.split(','):this.props.user.os_id,
        selectLanguages:(this.props.user.language_id != null) ? this.props.user.language_id.toString().split(','):this.props.user.language_id,
        selectOptionsArray:this.props.os,
        languageResult:[],
        showBtn1:true,
        screenState :false,
        url_span:'',
        loading:false
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


           
        this.setState({iconImage: 
    
          <Slim ratio={this.props.icon_size.height+":"+this.props.icon_size.width}
            forceSize= {this.props.icon_size.height+","+this.props.icon_size.width}
           initialImage={this.props.user.icon && doesFileExist(hubCheckPaths('images_large')+this.props.user.icon)?  hubCheckPaths('images_large')+this.props.user.icon : null}
           didTransform={ this.slimTransform.bind(this) }
           didRemove={ this.slimTransform.bind(this) }
           >
         <input type="file" name="icon" />
       </Slim>
       });
     }
                   
     handleChange = (e) => {
    
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.props.user.os_id = value;
       this.setState({selectOptions: value});
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
       this.props.user.os_id = favorite;  
      
      this.setState({selectOptions: favorite});
  }  

  onChangeLanguage(e) {
    var favorite = [];
    $.each($("input[name='language_id']:checked"), function(){            
      favorite.push($(this).val());
    });

    console.log('favorite',favorite)

    // this.props.user.restrictions = favorite;
    this.props.onUpdateUserDetail('language_id', favorite);
    this.setState({selectLanguages: favorite});
    console.log('selectRestrictions',this.state.selectLanguages)
  }  

        //on any transform on image croper
 slimTransform(data, slim){
  if(slim._hasInitialImage  && !slim._imageEditor && !this.state.screenState )
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
         const { foldername, languageResult , loading } = this.state;

       
     
  
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
                <Label for="get_url">{<IntlMessages id="components.url" />}</Label>
                <Input
                    type="text"
                    name="url"
                    id="get_url"
                    placeholder="Enter URL"
                    value={this.props.user.url}
                    onChange={(e) => this.props.onUpdateUserDetail('url', e.target.value)}
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
            
      
            <FormGroup row>
              <Label for="language" style={{marginTop:"-8px"}} sm={2}>{<IntlMessages id="components.language" />}</Label>
              <Col sm={10}>
                  <div className='row'>
                { languageResult && languageResult.map((user,key) => {
                  return <FormGroup check sm={3}> 
                              <Label check>
                                <input type="checkbox" name='language_id'  
                               checked={isArray(this.state.selectLanguages)?  this.state.selectLanguages.includes(user.id.toString())?'true':'' :this.state.selectLanguages ==user.id ?'true':''}  
                                value={user.id}  onChange={this.onChangeLanguage.bind(this)}  />{' '}
                              {user.name}
                           
                              </Label> 
                          </FormGroup>
                  })
                  }
                  </div>
              </Col>
            </FormGroup>   */}
         
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
      
            <FormGroup>
                  <Label >{<IntlMessages id="components.icon" />} {"("+this.props.icon_size.height+" X "+this.props.icon_size.width+")"} </Label>
                  {/* <Slim ratio="512:512"
                        initialImage={this.props.user.icon ?  hubCheckPaths('images_large')+this.props.user.icon : null}
                        data-size="512,512"
                        didTransform={ this.slimTransform.bind(this) }
                        didRemove={ this.slimTransform.bind(this) }
                        >
                     <input type="file" name="icon"/>
                  </Slim> */}
                   {this.state.iconImage}
            </FormGroup>


     
            { /* is_valid_url(this.props.user.url) &&
      <Button variant="raised" id="screenShotBtn1" className="text-white btn-success" onClick={() => this.getScreenshot(1)}><i className="ti-fullscreen mr-2"></i>  Get a screenshot from:  {'  '}<span className="btn-url-text ml-2" style={{textTransform: "initial"}}> {this.props.user.url}</span>{loading && <RctSectionLoader />}</Button>  
            */ }
    <Badge className="mb-15 mt-15 ml-25 pl-1 pr-1 text-center" id="badgeBtn"  color="warning"></Badge>

      </Form>
  );
}

}

export default UpdateUserForm;
