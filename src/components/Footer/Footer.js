/**
 * Footer
 */
import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';

//import LanguageProvider from '../Header/LanguageProvider';
// app config
import AppConfig from 'Constants/AppConfig';
var BotStar={appId:"s0e18cb10-5990-11ea-9cf2-3d68fb1069df",mode:"popup"};!function(t,a){var e=function(){(e.q=e.q||[]).push(arguments)};e.q=e.q||[],t.BotStarApi=e;!function(){var t=a.createElement("script");t.type="text/javascript",t.async=1,t.src="https://widget.botstar.com/static/js/widget.js";var e=a.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();}(window,document)

const Footer = () => (
		//var BotStar={appId:"s0e18cb10-5990-11ea-9cf2-3d68fb1069df",mode:"popup"};!function(t,a){var e=function(){(e.q=e.q||[]).push(arguments)};e.q=e.q||[],t.BotStarApi=e;!function(){var t=a.createElement("script");t.type="text/javascript",t.async=1,t.src="https://widget.botstar.com/static/js/widget.js";var e=a.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();}(window,document)
		
		<div className="rct-footer d-flex justify-content-between align-items-center" 
		style={{   
			//  position: "fixed",
			// width: "100%",
			// marginLeft:'-24px',
			bottom: "0"}} > 
			 <ul className="list-inline footer-menus mb-0">
				<li className="list-inline-item">
					<h5 className="mb-0">{AppConfig.copyRightText1}<i class="zmdi zmdi-favorite" style={{ color: 'red' }}></i>{AppConfig.copyRightText2}</h5>
				</li>
				{ /* <li className="list-inline-item">
					<Button component={Link} to="/app/about-us"><IntlMessages id="sidebar.aboutUs" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/faq"><IntlMessages id="sidebar.faq(s)" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/terms-condition"><IntlMessages id="sidebar.terms&Conditions" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/feedback"><IntlMessages id="sidebar.feedback" /></Button>
				</li> */ }
			</ul>
			{/* <LanguageProvider  />  */}
			<Button component={Link} to="/app/legal-agreements"><IntlMessages id="sidebar.LegalAgreements" /></Button>
		</div>
);

export default Footer;
