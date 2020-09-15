/**
 * User Management Page
 */
import React, { Component } from 'react';
import {  Redirect } from 'react-router-dom';
import $ from 'jquery';

import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Badge,
   FormGroup,
   Label
} from 'reactstrap';
import moment from "moment";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { NotificationManager } from 'react-notifications';
import Avatar from '@material-ui/core/Avatar';

// api
import api from 'Api';
import {user_id } from "Helpers/helpers";
import { WithContext as ReactTags } from 'react-tag-input';
import { isArray } from 'util';
// update user form
//import UpdateUserForm from './UpdateUserForm';

import { timeAgo, textTruncate, checkPath, hubCheckPaths, pathForxml  , get_player_url , is_moderator} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Slim from 'Components/Slim/slim.react';
import ReactQuill from 'react-quill';
import { array } from 'prop-types';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import DropzoneComponent from 'react-dropzone-component';
//for editor
const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]
//for tags
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  
export default class AddTopics extends Component {
  
  constructor(props) {
 
        super(props);
        this.state = {
            multiFile:[],
            multiFileImages:[],
            loading: false,
            redirectToTopics:false,
            categories:[],
            topic_types:[],
            forums:[],
            user_forums:[],
           
            addNewUserDetail:{
                id: '',
                user_id: user_id(),
                forum_id: '',
                cat_id: '',
                topic_type_id: 1,
                title: '',
                description: '',
                tags: '',
                file: '',

                ans_1: "",
                ans_2: "",
                ans_3: "",
                ans_4: "",
                right_ans: "",
                video_url: "",
                website_url: "",


            },
            topic_type_id:1,

            mytags: [
               ],
            suggestions: [
             ],
             slim_images:[]

        }

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);

        
        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: ".png,.jpeg,.gif,.jpg,.pdf,.docx,.zip,.rar,.ppt,.mp3",
            maxFiles:'10',
            maxfilesexceeded: function(file) {
               this.removeAllFiles();
               this.addFile(file);
           },
         };
   
        this.djsConfigImages = {
            addRemoveLinks: true,
            acceptedFiles: ".png,.jpeg,.gif,.jpg",
            maxFiles:'10',
            maxfilesexceeded: function(file) {
               this.removeAllFiles();
               this.addFile(file);
           },
         };
   
         this.componentConfig = {
            postUrl: pathForxml()+'/api/droper_upload_file',
         };
         
         this.callback = () => console.log('Hello!');
         this.success = file => {
            // console.log('aks onDrrop',acceptedFiles);
               console.log('uploaded', file);
               var multiFile = this.state.multiFile;
               multiFile.push(file);
               
               this.setState({ multiFile:multiFile });
            
               setTimeout(() => {
                  this.state.multiFile
                  let _this = this;
                  $.map(this.state.multiFile, function(value, index) {
                     _this.onChangeAddNewUserDetails('file_name'+index, value)
                  });
               }, 500); 
          
          } 
         this.removedfile = file => {
            var multiFile = this.state.multiFile;
            let indexOfDeleteUser = multiFile.indexOf(file);
            multiFile.splice(indexOfDeleteUser, 1);
            this.setState({ multiFile:multiFile });
            setTimeout(() => {
               this.state.multiFile
               let _this = this;
               $.map(this.state.multiFile, function(value, index) {
                  _this.onChangeAddNewUserDetails('file_name'+index, value)
               });
            }, 500); 
   
            console.log('removing...', file);
         }
         
         this.successImages = file => {
            // console.log('aks onDrrop',acceptedFiles);
               console.log('uploaded', file);
               var multiFileImages = this.state.multiFileImages;
               multiFileImages.push(file);
               
               this.setState({ multiFileImages:multiFileImages });
            
               setTimeout(() => {
                  this.state.multiFileImages
                  let _this = this;
                  $.map(this.state.multiFileImages, function(value, index) {
                     _this.onChangeAddNewUserDetails('mfile'+index, value)
                  });
               }, 500); 
               console.log('uplodingg...', this.state.multiFileImages);
          } 
         this.removedfileImages = file => {
            var multiFileImages = this.state.multiFileImages;
            let indexOfDeleteUser = multiFileImages.indexOf(file);
            multiFileImages.splice(indexOfDeleteUser, 1);
            this.setState({ multiFileImages:multiFileImages });
            setTimeout(() => {
               this.state.multiFileImages
               let _this = this;
               $.map(this.state.multiFileImages, function(value, index) {
                  _this.onChangeAddNewUserDetails('mfile'+index, value)
               });
            }, 500); 
   
            console.log('removing...', this.state.multiFileImages);
         }
         
         this.dropzone = null;
  }

  



// for tags start
  handleDelete(i) {
    const { mytags } = this.state;
    this.setState({
        mytags: mytags.filter((tag, index) => index !== i),
    });
   
    
}

handleAddition(tag) {
    if(this.state.mytags.length >= 10 ){
        NotificationManager.error(<IntlMessages id="validation.tagLimit" />);
        return false;
    }

    if(tag.text.length > 35){
        NotificationManager.error(<IntlMessages id="validation.tagCharactersLimit" />);
    }else{
        this.setState(state => ({ mytags: [...state.mytags, tag] }));
    }
    //this.setState(state => ({ mytags: [...state.mytags, tag] }));
}


// for tags end
  componentDidMount() {
  
    api.get('forum/get-forums-list' )
        .then((response) => {
            this.setState({forums:response.data });
        }) 
    api.get('forum/get-categories-list' )
        .then((response) => {
            this.setState({categories:response.data });
        }) 

    api.get('forum/get-all-topic-types' )
        .then((response) => {
            this.setState({topic_types:response.data });
        }) 

    api.get('forum/get-all-tags-list' )
        .then((response) => {
            this.setState({suggestions:response.data });
        }) 

        const userDetails = window.localStorage.getItem('user_id');
        var user_forums = []
        if(userDetails){
            const authUser = JSON.parse(userDetails);
            user_forums=(authUser.moderator_forums != null) ? authUser.moderator_forums.toString().split(','):authUser.moderator_forums
        }
        this.setState({user_forums:user_forums });
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
        this.onChangeAddNewUserDetails(slim._output.name, base64);
        //this.props.onChangeAddNewUserDetails(slim._output.name+'_large', large_base64);
      console.log('Transform');
   }
    //on any transform on image croper
    slimTransformMulti(data, slim){
       
     
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
        this.onChangeAddNewUserDetails(slim._output.name, base64);
        //this.props.onChangeAddNewUserDetails(slim._output.name+'_large', large_base64);
        console.log('Transform');
   }

    
    /**
    * Validation
    */
   validateField(str){
    let formIsValid = true;
  
   for (var key in str) {
  
       switch(key) {
         case 'title':
           if(str[key] == '' || str[key] == null){
                formIsValid = false;
                NotificationManager.error('Title is not empty!');
            } 
         break;
         case 'cat_id':
           if(str[key] == '' || str[key] == null){
                formIsValid = false;
                NotificationManager.error('Please select a category!');
            } 
         break;
         case 'forum_id':
           if(str[key] == '' || str[key] == null){
                formIsValid = false;
                NotificationManager.error('Please select a Forum!');
            } 
         break;
         case 'topic_type_id':
           if(str[key] == '' || str[key] == null){
                formIsValid = false;
                NotificationManager.error('Please select a topic type!');
            } 
         break;
         case 'video_url':
                if(str['topic_type_id'] == 5){
                    if(str[key] == '' || str[key] == null){
                        formIsValid = false;
                        NotificationManager.error('Video Url is not empty!');
                    } 
                    
                    if(str[key] !== '' && str[key] != null){
                        if(!str[key].match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)){
                        formIsValid = false;
                        NotificationManager.error('Video url should be vimeo or youtube url!');
                        }
                    }
                }

          break;
         case 'website_url':
                if(str['topic_type_id'] == 6){
                    if(str[key] == '' || str[key] == null){
                        formIsValid = false;
                        NotificationManager.error('Website Url is not empty!');
                    } 
                    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
          
                    if (!re.test(str[key])) { 
                       formIsValid = false;
                       NotificationManager.error('Url is not valid!');
                     }
                }
          break;
         default:
           break;
       }
   }
   return formIsValid;
      
}
    
    /**
    * On Change Add New User Details
    */
    onChangeAddNewUserDetails(key, value, e) {
        this.setState({
            addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value,
            }
        });
    }
 
    /**
    * Add New User
    */
   addNewUser() {
        var validateField = this.validateField(this.state.addNewUserDetail);
    if(validateField){
            let newUser = {
            ...this.state.addNewUserDetail
            }
        let self = this;
        this.setState({loading: true });
        //make tags array from id value json
        var tagsdataAarray = [];
        $.map( this.state.mytags , function(value, index) {
        tagsdataAarray[index] =  value.id;
        });
        //new code for file
        var data = new FormData()
        $.map(newUser, function(value, index) {
            if(value != 'undefined' && value != '' && value.length !== 0  )
            data.append(index,value)
        });
        data.append('tags',tagsdataAarray)
        api.post('forum/add-topic',data).then((response) => {
            const data =  response.data;     
                NotificationManager.success('Topic Added Successfully!');
                setTimeout(() => {
                  self.setState({ loading: false, redirectToTopics : true });
                  <Redirect to="/app/forum/topics" />
               }, 500);       
        })
        .catch(error => {
            // error hanlding
        })
    }
   }
   changeTopicTypes(type , divclass){
    $('.topic_types').removeClass('active');
    $('.'+divclass).addClass('active');
    this.onChangeAddNewUserDetails('topic_type_id', type);
    this.setState({ topic_type_id: type });

   }
// ================================================================================================
    new_function(e){
        var data = new FormData()
        $.map(e.target.files, function(value, index) {
            if(value != 'undefined' && value != '' && value.length !== 0  )
            data.append(index,value)
        });
        this.setState({
            slim_images: [],
        });
        api.post('forum/upload-multiple-file',data).then((response) => {
            const data =  response.data;     
            //console.log(data)
                this.setState({
                    slim_images:   
                    response.data.files,
                });
        })
        .catch(error => {
            // error hanlding
        })
    }
     
   handleFileAdded(name, file) {
     
}
 //===============================================================================================
   render() {
    const { slim_images , loading ,categories ,forums,topic_types , topic_type_id  ,addNewUserDetail , redirectToTopics,mytags, suggestions} = this.state;  
    //Dropzone
const config = this.componentConfig;
const djsConfig = this.djsConfig;
const djsConfigImages  = this.djsConfigImages ;

// For a list of all possible events (there are many), see README.md!
const eventHandlers = {
   init: dz => this.dropzone = dz,
   drop: this.callbackArray,
   addedfile: this.handleFileAdded.bind(this , 'file_name'),
   success: this.success,
   removedfile: this.removedfile
}
// For a list of all possible events (there are many), see README.md!
const eventHandlersImages = {
   init: dz => this.dropzone = dz,
   drop: this.callbackArray,
   addedfile: this.handleFileAdded.bind(this , 'mfile'),
   success: this.successImages,
   removedfile: this.removedfileImages
}
    return (
        
<div>
        { (redirectToTopics === true) &&
            <Redirect to="/app/forum/topics" />
        }  
       
    <main id="tt-pageContent">
    <div className="background-white container" style={{width:"88%"}}>
        <div className="tt-wrapper-inner">
            <h1 className="tt-title-border">
                <IntlMessages id="widgets.CreateNewTopic"/>
            </h1>
            <form className="form-default form-create-topic" id="formId" >
                <div className="form-group">
                    <label for="inputTopicTitle"><IntlMessages id="widgets.TopicTitle"/></label>
                    <div className="tt-value-wrapper">
                        <input type="text" name="title" className="form-control" id="inputTopicTitle" placeholder="Subject of your topic" value={addNewUserDetail.title}
                    onChange={(e) => this.onChangeAddNewUserDetails('title', e.target.value)} />
                        <span className="tt-value-input"></span>
                    </div>
                    <div className="tt-note"><IntlMessages id="widgets.TopicBodyPlaceholder"/></div>
                </div>
                <div className="form-group">
                    <label><IntlMessages id="widgets.TopicType" /></label>
                    <div className="tt-js-active-btn tt-wrapper-btnicon">
                        <div className="row tt-w410-col-02">
                        { topic_types && topic_types.map((topic_type, key) => (
                             <div key={topic_type.id}  className={(key == 0)?'col-4 col-lg-3 col-xl-2 topic_types active topicDiv'+topic_type.id :'col-4 col-lg-3 col-xl-2 topic_types topicDiv'+topic_type.id   } for="comment" onClick={(e) => this.changeTopicTypes(topic_type.id , 'topicDiv'+topic_type.id)}>
                                <a href="javascript:void(0)" className="tt-button-icon">
                                    <span className="tt-icon">
                                        <span className="material-icons" style={{fontSize:'100px',color: "darkgray"}} >{topic_type.icon}</span>
                                    </span>
                                    <span className="tt-text">{topic_type.name}</span>
                                </a>
                            </div>
                            )) }
                            {/*
                            <div className="col-4 col-lg-3 col-xl-2 topic_types " for="comment" onClick={(e) => this.changeTopicTypes()}>
                                <a href="javascript:void(0)" className="tt-button-icon">
                                <span className="tt-icon">
                                    <span className="material-icons" style={{fontSize:'150px'}} >comment</span>
                                </span>
                                <span className="tt-text">Discussion</span>
                                </a>
                            </div> 
                            */}
                          
                            
                            
                        </div>
                    </div>
                </div>
             
{/*============================================== new image=============================================== */}
   {/* { topic_type_id == 4 &&
        <div className="file-drop-area">
            <label for="files"><IntlMessages id="widgets.ClickToUploadYourFilesHere" /></label>
            <input name="files[]" id="files" style={{display:'none'}} type="file" multiple onChange={(e) => this.new_function(e,e.target.value)} />
            <div className="row">
                { slim_images && slim_images.map((image, key) => {
                    return <div key={key} className="col-sm-4">
                        <Slim
                                ratio="512:512"
                                data-size="512,512"
                                //didInit = {checkPath('multiple')+image}
                                initialImage= {checkPath('multiple')+image}
                                didTransform={ this.slimTransformMulti.bind(this) }
                                didRemove={ this.slimTransformMulti.bind(this) }
                            >
                            <input type="file" name={"mfile"+key}  accept="image/*" />
                        </Slim> 
                    </div>
                    }) }
            </div>
        </div>
        } */}
        { topic_type_id == 4 &&
                    <div className="col-md-12">
                        <div className=" form-group">
                            <label for="inputTopicTags"><IntlMessages id="components.files" /></label>
                            <DropzoneComponent
                                config={config}
                                eventHandlers={eventHandlersImages}
                                djsConfig={djsConfigImages}
                                name='file_name'
                            /> 
                        </div>
                    </div>
                }
{/*============================================== new image=============================================== */}







               <div className="row">
               <div className="col-md-12">
              
                 {/* =========================================type 1=================================================================== */}
                { topic_type_id == 1 &&
                    <div className="form-group">
                    <label for="inputTopicTitle"><IntlMessages id="widgets.TopicBody" /></label>
                    <ReactQuill
                            modules={modules}
                            formats={formats}
                            name="description"
                            id="content"
                            placeholder="Enter Content"
                            value={addNewUserDetail.description}
                            onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                        /> 
                    </div>
                }
                  {/* =========================================type 2=================================================================== */}
                { topic_type_id == 2 &&
                    <div className="form-group">
                    <label for="inputTopicTitle"><IntlMessages id="widgets.TopicBody" /></label>
                    <ReactQuill
                            modules={modules}
                            formats={formats}
                            name="description"
                            id="content"
                            placeholder="Enter Content"
                            value={addNewUserDetail.description}
                            onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                        /> 
                    </div>
                }
                {/* =========================================type 3=================================================================== */}
                { topic_type_id == 3 &&
                <div>
                 
                    <div className="form-group">
                        <label for="inputTopicTitle"><IntlMessages id="widgets.questions"/></label>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            name="description"
                            id="content"
                            placeholder="Enter Question"
                            value={addNewUserDetail.description}
                            onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                            style={{height:'200px'}}
                        /> 
                      
                    
                    </div>

                    <div key='ans_1' className="form-group">
                        <label for="inputans1"><IntlMessages id="widgets.answer"/> 1</label>
                        <div className="tt-value-wrapper">
                            <input type="text" name="ans_1" className="form-control" id="inputans1" placeholder="Answer" 
                            value={addNewUserDetail.ans_1}
                        onChange={(e) => this.onChangeAddNewUserDetails('ans_1', e.target.value)} />
                            <span className="tt-value-input"></span>
                        </div>
                    </div>

                    <div  key='ans_2' className="form-group">
                        <label for="inputans2"><IntlMessages id="widgets.answer"/> 2</label>
                        <div className="tt-value-wrapper">
                            <input type="text" name="ans_2" className="form-control" id="inputans2" placeholder="Answer" 
                            value={addNewUserDetail.ans_2}
                            onChange={(e) => this.onChangeAddNewUserDetails('ans_2', e.target.value)} />
                            <span className="tt-value-input"></span>
                        </div>
                    </div>

                    <div  key='ans_3' className="form-group">
                        <label for="inputans3"><IntlMessages id="widgets.answer"/> 3</label>
                        <div className="tt-value-wrapper">
                            <input type="text" name="ans_3" className="form-control" id="inputans3" placeholder="Answer" 
                            value={addNewUserDetail.ans_3}
                        onChange={(e) => this.onChangeAddNewUserDetails('ans_3', e.target.value)} />
                            <span className="tt-value-input"></span>
                        </div>
                    </div>

                    <div  key='ans_4' className="form-group">
                        <label for="inputans4"><IntlMessages id="widgets.answer"/> 4</label>
                        <div className="tt-value-wrapper">
                            <input type="text" name="ans_4" className="form-control" id="inputans4" placeholder="Answer" 
                            value={addNewUserDetail.ans_4}
                        onChange={(e) => this.onChangeAddNewUserDetails('ans_4', e.target.value)} />
                            <span className="tt-value-input"></span>
                        </div>
                    </div>

                    <div key="right_ans" className="form-group">
                        <label for="inputTopicTitle">Select Right Answer</label>
                        <select className="form-control" name="right_ans"  value={addNewUserDetail.right_ans}
                            onChange={(e) => this.onChangeAddNewUserDetails('right_ans', e.target.value)} >
                            <option value=''>Select Answer</option>
                            <option key={1} value={1}>{1}</option>
                            <option key={2} value={2}>{2}</option>
                            <option key={3} value={3}>{3}</option>
                            <option key={3} value={4}>{4}</option>
                        </select>
                    </div>
                </div>
                }
               
                {/* =========================================type 4=================================================================== */}
                { topic_type_id == 4 &&
                <div>
                    <div className="form-group">
                    <label for="inputTopicTitle"><IntlMessages id="widgets.TopicBody" /></label>
                    <ReactQuill
                            modules={modules}
                            formats={formats}
                            name="description"
                            id="content"
                            placeholder="Enter Content"
                            value={addNewUserDetail.description}
                            onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                        /> 
                    </div>
                   
                 </div>
                 }
                  {/* =========================================type 5=================================================================== */}
                { topic_type_id == 5 &&
                <div>
                    <div className="form-group">
                        <label ><IntlMessages id="components.videoUrl"/></label>
                        <div className="tt-value-wrapper">
                            <input type="text" name="video_url" className="form-control" placeholder="Enter Valid Video Url Of Vimeo Or Youtube"
                             value={addNewUserDetail.video_url}
                        onChange={(e) => this.onChangeAddNewUserDetails('video_url', e.target.value)} />
                            <span className="tt-value-input"></span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label for="inputTopicTitle"><IntlMessages id="widgets.TopicBody" /></label>
                        <ReactQuill
                                modules={modules}
                                formats={formats}
                                name="description"
                                id="content"
                                placeholder="Enter Content"
                                value={addNewUserDetail.description}
                                onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                            /> 
                    </div>

                  
                </div>
                 }
                  {/* =========================================type 6=================================================================== */}
                { topic_type_id == 6 &&
                <div>
                    <div className="form-group">
                        <label ><IntlMessages id="components.websiteUrl"/></label>
                        <div className="tt-value-wrapper">
                            <input type="text" name="website_url" className="form-control" placeholder="Enter Website Url"
                             value={addNewUserDetail.website_url}
                        onChange={(e) => this.onChangeAddNewUserDetails('website_url', e.target.value)} />
                            <span className="tt-value-input"></span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label for="inputTopicTitle"><IntlMessages id="widgets.TopicBody" /></label>
                        <ReactQuill
                                modules={modules}
                                formats={formats}
                                name="description"
                                id="content"
                                placeholder="Enter Content"
                                value={addNewUserDetail.description}
                                onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                            /> 
                    </div>
                </div>
                 }
 
 
     
                    {/* <div className="form-group">
                    <label for="inputTopicTitle"><IntlMessages id="widgets.TopicBody" /></label>
                    <ReactQuill
                            modules={modules}
                            formats={formats}
                            name="description"
                            id="content"
                            placeholder="Enter Content"
                            value={addNewUserDetail.description}
                            onChange={(e) => this.onChangeAddNewUserDetails('description', e)}
                        /> 
                    </div> */}
                   
                </div>
                <div className="col-md-6 form-group">
                        <label for="inputTopicTitle"><IntlMessages id="sidebar.Forum" /></label>
                        <select className="form-control" name="forum_id"  value={addNewUserDetail.forum_id}
                     onChange={(e) => this.onChangeAddNewUserDetails('forum_id', e.target.value)} >
                            <option  value=''>Select Forum</option>
                        { forums && forums.map((user, key) => {

                        //     var is_user_have_forum =  isArray(this.state.user_forums)?  this.state.user_forums.includes(user.id.toString())?true:false :this.state.user_forums ==user.id ?true:false
                        //    if(is_user_have_forum){
                            return <option key={key} value={user.id}>{user.name}</option>
                           //}
                        }) }
                        </select>
                    </div>
                        
                    <div className="col-md-6 form-group">
                        <label for="inputTopicTitle"><IntlMessages id="widgets.category" /></label>
                        <select className="form-control" name="cat_id"  value={addNewUserDetail.cat_id}
                    onChange={(e) => this.onChangeAddNewUserDetails('cat_id', e.target.value)} >
                            <option  value=''>Select Category</option>
                        { categories && categories.map((user, key) => (
                            <option key={key} value={user.id}>{user.name}</option>
                            )) }
                        </select>
                    </div>

                {/* <div className="col-md-6">
                    <FormGroup>
                        <Label ><IntlMessages id="sidebar.image" /></Label>
                            <Slim
                                ratio="512:512"
                                data-size="512,512"
                                initialImage={null}
                                didTransform={ this.slimTransform.bind(this) }
                                didRemove={ this.slimTransform.bind(this) }
                                >
                            <input type="file" name="file"  accept="image/*" />
                        </Slim>
                    </FormGroup>
                </div> */}
                <div className="col-md-12">
                    <div className=" form-group">
                            <label for="inputTopicTags"><IntlMessages id="blog.tags" /></label>
                            {/* <input data-role="tagsinput" type="text" name="tags" className="form-control" id="inputTopicTags" placeholder="Use comma to separate tags"  value={addNewUserDetail.tags}
                        onChange={(e) => this.onChangeAddNewUserDetails('tags', e.target.value)} /> */}
                        
                        <ReactTags 
                        className="form-control"
                        tags={mytags}
                        suggestions={suggestions}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                    
                        delimiters={delimiters} />
                        </div>
                </div>
                { topic_type_id != 4 &&
                    <div className="col-md-12">
                        <div className=" form-group">
                                <label for="inputTopicTags"><IntlMessages id="components.files" /></label>
                        
                        
                            <DropzoneComponent
                            
                                config={config}
                                eventHandlers={eventHandlers}
                                djsConfig={djsConfig}
                                name='file_name'
                            /> 
                        
                        </div>
                    </div>
                }
                </div>
                     <div className="row">
                        <div className="col-auto ml-md-auto">
                            <a href="#" onClick={(e) => this.addNewUser(e)} className="btn btn-secondary btn-width-lg"><IntlMessages id="widgets.CreatePost" /></a>
                        </div>
                    </div>
                    {loading &&
                  <RctSectionLoader />
               }
            </form>
        </div>
        </div>
</main>
    
</div>
           );
   }
}
