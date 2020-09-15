/**
 * Messages Page
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import classnames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import { NotificationManager } from 'react-notifications';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label,
  Form
} from 'reactstrap';
import {user_id } from "Helpers/helpers";
// api
import api from 'Api';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

export default class Messages extends Component {

  state = {
    addNewAddressDetail: this.props.user ? this.props.user : null,
    password:'',
    confirm_password:''
  };

  
  /**
   * Add New Message
   */
  addNewAddress() {
    console.log(this.props);
   const {addNewAddressDetail, password, confirm_password} = this.state;
   if(password !== '' && confirm_password!==''){
      if(password !== confirm_password){
        NotificationManager.error(<IntlMessages id="validation.PasswordAndConfirmationPassword"/>);
      } else {
        api.post('change-password', {
            'id':addNewAddressDetail.id,
            'password':password
        },{
          headers: {'User-Id':user_id()}
      })
           .then((response) => {
              this.setState({ addNewAddressDetail:response.data.data });
              localStorage.setItem('user_id',JSON.stringify(response.data.data)) 
              NotificationManager.success(<IntlMessages id="change.password.subject"/>);
           })
           .catch(error => {
              // error hanlding
           })
      }
   } else {
    NotificationManager.error(<IntlMessages id="validation.PasswordShouldNotBeEmpty"/>);
   }

  }

  
  render() {
    const { addNewAddressDetail } = this.state;
    return (
      <div className="address-wrapper">
         <h2 className="heading"><IntlMessages id="widgets.personalDetails" /></h2>
        <div className="w-50">
          
            <Form>
                
              <FormGroup>
                <Label className="col-form-label" for="address1"><IntlMessages id="widgets.enterYourPassword"/></Label>
                <Input
                  type="password"
                  id="address1"
                  className="input-lg"
                  onChange={(e) => this.setState({
                    password: e.target.value
                  })}
                />
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label" for="address2"><IntlMessages id="compenets.confirmPasswords"/></Label>
                <Input
                  type="password"
                  id="address2"
                  className="input-lg"
                  onChange={(e) => this.setState({
                    confirm_password: e.target.value
                  })}
                />
              </FormGroup>
              
              <Button variant="raised" color="primary" className="text-white" onClick={() => this.addNewAddress()}><IntlMessages id="components.updatePassword" /></Button>
            </Form>
        </div>
        
      </div>
    );
  }
}
