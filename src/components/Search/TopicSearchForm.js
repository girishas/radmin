/**
 * Search Form Component
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge, Form, FormGroup, Label, Input,FormText, Col, Button
} from 'reactstrap';
// actions
import { toggleSearchForm } from 'Actions';
import IntlMessages from 'Util/IntlMessages';
import $ from 'jquery'
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';
class TopicSearchForm extends Component {
  constructor(props) {
 
    super(props);  
    this.state = {
        loading: false,
        redirectToTopics:false,
        searchFilter:this.props.searchFilter,
        categories:[],
        topic_types:[],
        forums:[],
        //selectedDate: moment(),
        selectedDate: this.props.searchFilter.created_at?moment(this.props.searchFilter.created_at):null,
        // addNewUserDetail:{
        //     parent_id:0,
        //     topic_id: $(location).attr("href").split('/').pop(),
         
        //     topic_type_id: 1,
        //     description: '',
        //     is_subscribed:0
        // },
      
    };
  
 
}
handleDateChange = (date) => {
    this.setState({ selectedDate: date });
};
componentDidMount(){
  console.log('in serarch',this.props.searchForm)

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

}


 serialize = function (form) {

    // Setup our serialized data
    var serialized = {};

    // Loop through each field in the form
    for (var i = 0; i < form.elements.length; i++) {

        var field = form.elements[i];

        // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
        if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

        // If a multi-select, get all selections
        if (field.type === 'select-multiple') {
            for (var n = 0; n < field.options.length; n++) {
                if (!field.options[n].selected) continue;
                serialized[encodeURIComponent(field.name)]=   (field.options[n].value);
            }
        }

        // Convert field data to a query string
        else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
            serialized[encodeURIComponent(field.name)]=  (field.value);
        }
    }

    var created_at = '';
    if(this.state.selectedDate && this.state.selectedDate != 'null'){
        if(this.state.selectedDate._d){
            created_at =  moment(this.state.selectedDate._d).format('YYYY-MM-DD');
        }
    }
    serialized['created_at']=  created_at
    //return serialized.join('&');
    return serialized;

};
    /**
    * Add New comment
    */
   search() {
    //var validateField = this.validateFlagField(this.state.addNewFlagDetail);

    var form = $('#searchTopic')[0]; // You need to use standard javascript object here
        // var formData = new FormData(form);
        // var formData =  $ ('#searchTopic').serialize()   
        //this.serialize(form)
        console.log('formData',form)
        console.log('formData',this.serialize(form))
        var data = this.serialize(form);

        this.setState({ redirectToTopics: true  , searchFilter:data});


   }

    /**
    * On Change Add New User Details
    */
   onChangeValue(key, value, e) {
    this.setState({
        searchFilter: {
            ...this.state.searchFilter,
            [key]: value,
        }
    });
}



  render() {
    const { categories ,forums,topic_types , selectedDate } = this.state;  
    return (
       
      <form method="POST"  className="form-default" id="searchTopic">
        { (this.state.redirectToTopics === true) &&
            <Redirect 
            to={{
                pathname: '/app/forum/topics',
                state: { searchFilter: this.state.searchFilter }
            }}
            />
        }  
      {/* <div className="form-group">
          <i className="pt-customInputIcon">
             <svg className="tt-icon">
                <use xlink:href="#icon-search"></use>
              </svg>
          </i>
          <input type="text" name="name" className="form-control pt-customInputSearch" id="searchForum" placeholder="Search all forums">
      </div> */}
        <div class="form-group">
            <i class="pt-customInputIcon">
             
                <span className="material-icons"  >search</span>
               
            </i>
            <input type="text" name="title" class="form-control pt-customInputSearch" 
                id="searchForum" placeholder="Search all topic"
                value={this.state.searchFilter.title ?this.state.searchFilter.title:''}
                onChange={(e) => this.onChangeValue('title', e.target.value)}
            />
        </div>
        <div className="form-group">
            <label for="searchName">Posted by</label>
            <input type="text" name="full_name" className="form-control" id="searchName" placeholder="Username" 
                value={this.state.searchFilter.full_name ?this.state.searchFilter.full_name:''}
                onChange={(e) => this.onChangeValue('full_name', e.target.value)}
           />
        </div>
        <div className="form-group">
            <label for="searchForum">In Forum</label>
            <select className="form-control" name="forum_id" id="searchForum"
              value={this.state.searchFilter.forum_id ?this.state.searchFilter.forum_id:''}
              onChange={(e) => this.onChangeValue('forum_id', e.target.value)}
            >
                <option value="">All</option>
                { forums && forums.map((user, key) => (
                    <option key={key} value={user.id}>{user.name}</option>
                )) }
            </select>
        </div>
        <div className="form-group">
          <label for="searchCategory">In Category</label>
          <select className="form-control" name="cat_id" id="searchCategory"
           value={this.state.searchFilter.cat_id ?this.state.searchFilter.cat_id:''}
           onChange={(e) => this.onChangeValue('cat_id', e.target.value)}
          >
              <option value="">All</option>
                { categories && categories.map((user, key) => (
                    <option key={key} value={user.id}>{user.name}</option>
                )) }
          </select>
        </div>
               
    
  
  
      <div className="form-group">
          <label>Only return topics/posts that...</label>
          <div className="checkbox-group">
              <input type="checkbox" id="searcCheckBox02" name="i_liked"/>
              <label for="searcCheckBox02">
                  <span className="check"></span>
                  <span className="box"></span>
                  <span className="tt-text">I liked</span>
              </label>
          </div>
          <div className="checkbox-group">
              <input type="checkbox" id="searcCheckBox03" name="i_commented"/>
              <label for="searcCheckBox03">
                  <span className="check"></span>
                  <span className="box"></span>
                  <span className="tt-text">Are in my messages</span>
              </label>
          </div>
          <div className="checkbox-group">
              <input type="checkbox" id="searcCheckBox04" name="i_favorite"   />
              <label for="searcCheckBox04">
                  <span className="check"></span>
                  <span className="box"></span>
                  <span className="tt-text">I marked favorite</span>
              </label>
          </div>
          <div className="rct-picker">
                    <DatePicker
                        label="Posted"
                        clearable
                        value={selectedDate}
                        onChange={this.handleDateChange}
                        animateYearScrolling={false}
                        leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                        rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                        fullWidth
                    />
                </div>
      </div>
        <div className="form-group">
            <label for="searchTopicType">Topic type</label>
            <select className="form-control" name="topic_type_id" id="searchTopicType"
                  value={this.state.searchFilter.topic_type_id ?this.state.searchFilter.topic_type_id:''}
                  onChange={(e) => this.onChangeValue('topic_type_id', e.target.value)}
            >
                <option value="">All</option>
                { topic_types && topic_types.map((topic_type, key) => (
                    <option key={key} value={topic_type.id}>{topic_type.name}</option>
                )) }
            </select>
        </div>
   
                
      {/* <div className="form-group">
          <label for="searchAdvTime">Posted</label>
          <input type="text" name="created_at" className="form-control" id="searchAdvTime" placeholder="dd-mm-yyyy"/>
     
      </div> */}
      {/* <div className="form-group">
          <label for="minPostCount">Minimum Post Count</label>
          <select className="form-control" id="minPostCount" name="minimum_posts">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option selected="">10</option>
          </select>
      </div> */}
      <div className="form-group">
          {/* <a href="#" className="btn btn-secondary btn-block">Search</a> */}
          <Button variant="raised" className="btn btn-secondary btn-block" onClick={() => this.search()}>Search</Button>
      </div>
  </form>
                
  
    );
  }
}

export default connect(null, {
  toggleSearchForm
})(TopicSearchForm);
