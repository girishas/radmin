/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import Iframe from 'react-iframe'

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';


import AppConfig from 'Constants/AppConfig';
import {checkRoleAuth} from "Helpers/helpers";
export default class Blog extends Component {


	componentDidMount() {
       $("div").scrollTop(0);
	}

   render() {
      checkRoleAuth();
      return (
         <div className="user-management">
             <IntlMessages id='sidebar.top-supporters' defaultMessage='Chameleon | Blog'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.top-supporters" />}
               match={this.props.match}
            />
            <RctCollapsibleCard fullBlock>
                  <Iframe url={AppConfig.chameleon_web_url+"top-supporters-frame" }
                  width="100%"
                  height="1000px"
                  id="myId"
                  className="myClassname"
                  display="initial"
                  frameBorder="0"
                  position="relative"
                  allowFullScreen/>
            </RctCollapsibleCard>
         </div>
      );
   }
}
