/**
 * Profile Page
 */
import React, { Component, Fragment } from 'react';
import { FormGroup, Input, Form, Label, Col, InputGroup, InputGroupAddon } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
// intlmessages
import IntlMessages from 'Util/IntlMessages';
import { DatePicker } from 'material-ui-pickers';

import api from 'Api';

export default class Profile extends Component {

  state = {
        editUser: this.props.user ? this.props.user : null
    };


  /**
   * On Update Profile
   */
  onUpdateProfile() {
    const { editUser } = this.state;
     api.post('update-user-data', editUser)
         .then((response) => {
            this.setState({ users:response.data.data });
            localStorage.setItem('user_id',JSON.stringify(response.data.data)) 
            NotificationManager.success('Profile Updated Successfully!');
         })
         .catch(error => {
            // error hanlding
         })
    
  }


   handleDateChange = (date) => {
        const {editUser} = this.state;
        this.setState({
               editUser: {
                  ...this.state.editUser,
                  ['dob']: date
               }
            });
    };

   onUpdateUserDetail = (key, value, e) => {
      const {editUser} = this.state;
     this.setState({
               editUser: {
                  ...this.state.editUser,
                  [key]: value
               }
            });
   } 


  render() {
    const { selectedDate, editUser } = this.state;
    console.log(editUser);
    return (
      <div className="profile-wrapper w-50">
        <h2 className="heading"><IntlMessages id="widgets.personalDetails" /></h2>
        <Form>
          <FormGroup row>
            <Label for="email" sm={3}><IntlMessages id="components.email" /></Label>
            <Col sm={9}>
              <Input type="text" name="email" id="email" className="input-lg" 
                value={editUser.email}
                onChange={(e) => onUpdateUserDetail('email', e.target.value)}
                disabled="disabled"
              />
            </Col>
          </FormGroup>
		  <FormGroup row>
            <Label for="fullName" sm={3}><IntlMessages id="components.fullName" /></Label>
            <Col sm={9}>
              <Input type="text" name="full_name" id="fullName" className="input-lg"
               value={editUser.full_name}
               onChange={(e) => this.onUpdateUserDetail('full_name', e.target.value)}
              />
            </Col>
          </FormGroup>
          {/*<FormGroup row>
            <Label for="occupation" sm={3}><IntlMessages id="components.occupation" /></Label>
            <Col sm={9}>
              <Input type="text" name="occupation" id="occupation" className="input-lg" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="company" sm={3}><IntlMessages id="components.companyName" /></Label>
            <Col sm={9}>
              <Input type="text" name="company" id="company" className="input-lg mb-20" />
              <div className="help-text d-flex p-10">
                <i className="ti-info-alt mr-15 pt-5"></i>
                <span>If you want your invoices addressed to a company. Leave blank to use your full name.</span>
              </div>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="telephone" sm={3}><IntlMessages id="components.phoneNo" /></Label>
            <Col sm={9}>
              <Input type="tel" name="telephone" id="telephone" className="input-lg" />
            </Col>
          </FormGroup>
        </Form>
        <hr />
        <h2 className="heading"><IntlMessages id="components.address" /></h2>
        <Form>
          <FormGroup row>
            <Label for="address" sm={3}><IntlMessages id="components.address" /></Label>
            <Col sm={9}>
              <Input type="text" name="address" id="address" className="input-lg" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="city" sm={3}><IntlMessages id="components.city" /></Label>
            <Col sm={9}>
              <Input type="text" name="city" id="city" className="input-lg" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="state" sm={3}><IntlMessages id="components.state" /></Label>
            <Col sm={9}>
              <Input type="text" name="state" id="state" className="input-lg" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="zip" sm={3}><IntlMessages id="components.zipCode" /></Label>
            <Col sm={9}>
              <Input type="text" name="zip" id="zip" className="input-lg" />
            </Col>
          </FormGroup>*/}
           <FormGroup row>
                <Label for="zip" sm={3}><IntlMessages id="components.dob" /></Label>
                <Col sm={9}>
                    <DatePicker
                        name="dob"
                        format="YYYY/MM/DD"
                        minDate = "1900/04/01"
                        value={editUser.dob}
                        onChange={this.handleDateChange}
                        animateYearScrolling={false}
                        leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                        rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                        fullWidth
                    />
                 </Col>
            </FormGroup>
        </Form>
        <hr />
       { /* <h2 className="heading"><IntlMessages id="components.social Connection" /></h2>
        <div>
          <InputGroup className="mb-20">
            <InputGroupAddon addonType="prepend">
              <IconButton aria-label="facebook">
                <i className="zmdi zmdi-facebook"></i>
              </IconButton>
            </InputGroupAddon>
            <Input defaultValue="https://www.facebook.com" />
          </InputGroup>
          <InputGroup className="mb-20">
            <InputGroupAddon addonType="prepend">
              <IconButton aria-label="facebook">
                <i className="zmdi zmdi-twitter"></i>
              </IconButton>
            </InputGroupAddon>
            <Input defaultValue="https://www.twitter.com" />
          </InputGroup>
          <InputGroup className="mb-20">
            <InputGroupAddon addonType="prepend">
              <IconButton aria-label="facebook">
                <i className="zmdi zmdi-linkedin"></i>
              </IconButton>
            </InputGroupAddon>
            <Input defaultValue="https://www.linkedin.com" />
          </InputGroup>
        </div>*/}
        <hr />
        <Button variant="raised" color="primary" className="text-white" onClick={() => this.onUpdateProfile()}><IntlMessages id="widgets.updateProfile" /></Button>
      </div>
    );
  }
}
