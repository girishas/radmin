/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";
// intlmessages
import IntlMessages from 'Util/IntlMessages';
// async components

import {
    AsyncBasicTablesComponent,
    AsyncLanguageTablesComponent,
    AsyncDataTablesComponent,
    AsyncResponsiveTablesComponent,
	AsyncBasicTablesComponentPc,
	AsyncBasicTablesComponentMacOs,
	AsyncBasicTablesComponentLinux,
	AsyncBasicTablesComponentChromOs,
	AsyncBasicTablesComponentAndroid,
	AsyncBasicTablesComponentBox,
	AsyncBasicTablesComponentIos
} from 'Components/AsyncComponent/AsyncComponent';

const Content = ({ match }) => (
    <div className="content-wrapper">

        <IntlMessages id='sidebar.contentManager' defaultMessage='Chameleon | Campaign'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
                    <meta name="description" content="Chameleon | Content Manager" />
                 </Helmet>
               )}
             </IntlMessages>
        {/* <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/pc`} />
            <Route path={`${match.url}/pc`} component={AsyncBasicTablesComponentPc} />
            <Route path={`${match.url}/macos`} component={AsyncBasicTablesComponentMacOs} />
            <Route path={`${match.url}/linux`} component={AsyncBasicTablesComponentLinux} />
            <Route path={`${match.url}/chromos`} component={AsyncBasicTablesComponentChromOs} />
            <Route path={`${match.url}/android`} component={AsyncBasicTablesComponentAndroid} />
            <Route path={`${match.url}/boxs`} component={AsyncBasicTablesComponentBox} />
            <Route path={`${match.url}/ios`} component={AsyncBasicTablesComponentIos} />
            <Route path={`${match.url}/language`} component={AsyncLanguageTablesComponent} />
            
        </Switch> */}
    </div>
);

export default Content;

