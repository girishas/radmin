/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import ReactDOM from 'react-dom'
import Iframe from 'react-iframe'

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';


import AppConfig from 'Constants/AppConfig';
import {checkRoleAuth} from "Helpers/helpers";

export default class SupportAProject extends Component {
   constructor() {
      super();
      this.state = {
          iFrameHeight: '100px'
      }
  }

   resizeIframe(obj) {
      //alert()
    // obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';

   }
   componentDidMount() {
        $("div").scrollTop(0);
   }


   render() {
      checkRoleAuth();
      return (
         <div className="user-management">
             <IntlMessages id='sidebar.SupportAProject' defaultMessage='Chameleon | SupportAProject'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | SupportAProject </title>
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.SupportAProject" />}
               match={this.props.match}
            />
            <RctCollapsibleCard fullBlock>
                  <Iframe url={AppConfig.chameleon_web_url+"projects-frame" }
                  width="100%"
                  height="2500px"
                  id="myId"
                  className="myClassname"
                  display="initial"
                  frameBorder="0"
                  position="relative"
                  allowFullScreen
                   scrolling="yes" 
                  />
                     
            </RctCollapsibleCard>
        
             
             
             
              
         </div>
      );
   }
}
