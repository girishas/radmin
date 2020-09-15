/**
 * Tables Routes
 */
import React, { Component } from 'react';


import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";
// intlmessages
import IntlMessages from 'Util/IntlMessages';
// async components
import FHeader from './header/index';

import stylecss from './style.css';
export default class Forum extends Component {
  
  constructor(props) {
 
        super(props);
    
       

  }
   render() {
    
      return (
         <div>
            <IntlMessages id='sidebar.Forum' defaultMessage='Forum '>
              {(title) => (
                <Helmet>
                  <title>Chameleon | {title}</title>
                </Helmet>
              )}
            </IntlMessages>
          <FHeader/>
         </div>
           );
   }
}

