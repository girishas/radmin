/**
 * Page Title Bar Component
 * Used To Display Page Title & Breadcrumbs
 */
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import $ from 'jquery';
// get display string
const getDisplayString = (sub) => {
    const arr = sub.split("-");
  
    if (arr.length > 1) {
        return <IntlMessages id={`sidebar.${arr[0].charAt(0) + arr[0].slice(1) + arr[1].charAt(0).toUpperCase() + arr[1].slice(1) }`} />
    } else {
        return <IntlMessages id={`sidebar.${sub.charAt(0) + sub.slice(1)}`} />
    }

};

// get url string
const getUrlString = (path, sub, index) => {
    if (index === 0) {
        return '/';
    } else {
        return path.split(sub)[0] + sub;
    }
};

	// When the user clicks on the button, scroll to the top of the document
    const topFunction = () => {
		//	$("div").scrollTop(0);
		$('div').animate({scrollTop:0}, 'slow');
	  return false;
	}
	// When the user clicks on the button, scroll to the top of the document
    const hideLoader = () => {
		$('.loader').hide();
	  return false;
	}

    const handleScroll = e => {
        let element = e.target
        console.log('element.scrollHeight',element.scrollHeight)
        console.log('element.scrollTop',element.scrollTop)
        console.log('element.clientHeight',element.clientHeight)
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
          // do something at end of scroll
        }
      }
      
const PageTitleBar = ({ title, match, enableBreadCrumb }) => {
    const path = match.path.substr(1);
    var subPatharr = path.split('/');
    const subPath = subPatharr.splice(1)
    
      return (
        <div className="page-title d-flex justify-content-between align-items-center" onWheel={ (e) => { handleScroll(e); }} >
            {title &&
                <div className="page-title-wrap">
                    {/* <i className="ti-angle-left"></i> */}
                    <h2 className="">{title}</h2>
                </div>
            }
            {enableBreadCrumb &&
                <Breadcrumb className="mb-0 tour-step-7" tag="nav">
                    {subPath.map((sub, index) => {
                       
                        return <BreadcrumbItem active={subPath.length === index + 2}
                            tag={subPath.length === index + 1 ? "span" : Link} key={index}
                            to={'#'}>{getDisplayString(sub)}</BreadcrumbItem>
                    }
                    )}
                </Breadcrumb>
            }
            <button id="backToTop" title='Back to top' style={{display:"none"}} className='scroll' 
				onClick={ () => { topFunction(); }}>
			 	<span className='arrow-up material-icons'>arrow_upward</span>
		   </button>
        </div>
    )
};

// default props value
PageTitleBar.defaultProps = {
    enableBreadCrumb: true
}

export default PageTitleBar;