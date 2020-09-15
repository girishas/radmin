/**
 * Add New Feedback
 */
import React, { Component } from 'react';
import { Input, Form, Label, Col, FormGroup } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
// redux actions
import { addNewFeedback, showFeedbackLoadingIndicator } from 'Actions';
import {user_id } from "Helpers/helpers";
import api from 'Api';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { Redirect } from 'react-router-dom';
class AddNewFeedback extends Component {

    state = {
        loading: false,
        redirectToDetailPage: false,
        idea_id: 0,
        addNewUserDetail:{
            user_id: user_id(),
            title: '',
            description: '',
            
        },
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
                NotificationManager.error('Idea Title requried!');
            } 
         break;
         case 'description':
           if(str[key] == '' || str[key] == null){
                formIsValid = false;
                NotificationManager.error('Description requried!');
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
        if(key == 'title'){
            if(value.length>75){
                $('#idea').css({"border-color": "red", 
                "border-width":"2px", 
                "border-style":"solid"});
                return false
            }else{
                $('#idea').css({"border":"none"});
            }
           

        }
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
        //new code for file
        var data = new FormData()
        $.map(newUser, function(value, index) {
            if(value != 'undefined' && value != '' && value.length !== 0  )
            data.append(index,value)
        });
        api.post('forum/add_idea',data,{
            headers: {'User-Id':user_id()}
        },).then((response) => {
            const data =  response.data;     
            NotificationManager.success('Added Successfully!');
            setTimeout(() => {
                self.setState({ loading: false ,redirectToDetailPage:true, idea_id:data.id});
            }, 500);       
        })
        .catch(error => {
            // error hanlding
        })
    }
}

    render() {
        const {addNewUserDetail,redirectToDetailPage,idea_id} = this.state;
        return (
            <div className="row">
            {(redirectToDetailPage == true && idea_id > 0) &&
					<Redirect
						to={{
							pathname: '/app/ideas/details/'+idea_id,
							
						}}
					/>
				}
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h2 className="heading mb-40">
                    <IntlMessages id="widgets.addNewIdeaHeadLine" /></h2>
                    <Form>
                        <FormGroup row>
                            <Label for="idea" sm={3}> <IntlMessages id="label.ideaTitle" /></Label>
                            <Col sm={9}>
                                <Input type="text" name="idea" id="idea" className="input-lg" 
                                   value={addNewUserDetail.title}
                                onChange={(e) => this.onChangeAddNewUserDetails('title', e.target.value)} 
                                
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="subject_id" sm={3} style={{ textTransform :"capitalize"}}>{<IntlMessages id="widgets.subject" />}</Label>
                            <Col sm={9}>
                                <Input type="select" name="subject_id" id="subject_id" value={addNewUserDetail.subject_id} 
                                className="input-lg" 
                                onChange={(e) =>  this.onChangeAddNewUserDetails('subject_id', e.target.value)}>
                                    <option key={0} value="">Select Subject</option>   
                                    {this.props.subjects && this.props.subjects.map((user, key) => (
                                    <option key={key} value={user.id}>{user.name}</option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="description" sm={3}><IntlMessages id="widgets.description" /></Label>
                            <Col sm={9}>
                                <Input type="textarea" rows="7" name="description" id="description"
                                 onChange={(e) => this.onChangeAddNewUserDetails('description', e.target.value)}  />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={4}>&nbsp;</Label>
                            
                            <Col sm={4}>
                                <Button variant="raised" className="btn-primary btn-sm text-white" onClick={(e) => this.addNewUser(e)}>
                                    <IntlMessages id="components.submit" /></Button>
                            </Col>
                            <Label sm={4}>&nbsp;</Label>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ feedback }) => {
    return feedback;
}

export default connect(mapStateToProps, {
    addNewFeedback,
    showFeedbackLoadingIndicator
})(AddNewFeedback);
