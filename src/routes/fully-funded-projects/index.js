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

export default class Blog extends Component {


   render() {
      return (
         <div className="user-management">
             <IntlMessages id='sidebar.fully-funded-projects' defaultMessage='Chameleon | fully funded projects'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.fully-funded-projects" />}  
               match={this.props.match}
            />
            <RctCollapsibleCard fullBlock>
                  <Iframe url={AppConfig.front_web_url+"fully-funded-projects-frame" }
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
