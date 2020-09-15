/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import {
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Badge
} from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { NotificationManager } from 'react-notifications';
import Avatar from '@material-ui/core/Avatar';
// rct card
import { Link } from 'react-router-dom';
import { RctCard } from 'Components/RctCard/index';
import { connect } from 'react-redux';
// api
import api from 'Api';
import { timeAgo, getTheDate ,checkRoleAuth , get_plan_id_by_name ,get_plan_name_by_id , print_tr_id} from "Helpers/helpers";
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// add new user form
import AddNewUserForm from './AddNewUserForm';

// update user form
import UpdateUserForm from './UpdateUserForm';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import Pagination from './Pagination';
import Paginations from './Paginations';
import AppConfig from 'Constants/AppConfig';

class Transaction extends Component {

      

      constructor() {
        super();
        this.state = {
          transactions:null, // initial user data       
          loading: false, // loading activity
          totalRecords:null,
          currentPage: null,
          totalPages: null,
          currentpagedata:null,
          transactionsSub:null,
          currentpagedataSub:null,
          totalRecordsSub:null,
          loadings:false,
          totalRecordsCancel:null,
          currentpagedataCancel:null,
          transactionsSubCancel:null,
          currentpagedataSubCancel:null,
          totalRecordsSubCancel:null,
          transactionsCancel:null, // initial user data
         openViewUserDialog: false, 
         selectedTransaction:null,
         anchorEl: null,
         selectedIndex: 1,
         products: [
            {
               id: 1,
               qty: 1,
               name: 'iPhone 5 32GB White & Silver (GSM) Unlocked',
               price: 749,
               total: 749
            },
            {
               id: 2,
               qty: 1,
               name: 'iPhone 5 32GB White & Silver (GSM) Unlocked',
               price: 749,
               total: 749
            },
            {
               id: 3,
               qty: 1,
               name: 'iPhone 5 32GB White & Silver (GSM) Unlocked',
               price: 749,
               total: 749
            },
            {
               id: 4,
               qty: 1,
               name: 'iPhone 5 32GB White & Silver (GSM) Unlocked',
               price: 749,
               total: 749
            }
         ]
       };

        this.onPageChanged = this.onPageChanged.bind(this);
        this.onPageChangedSub = this.onPageChangedSub.bind(this);
      }
      
      handleClose = () => {
         this.setState({ anchorEl: null });
      };
      handleClick = event => {
         this.setState({ anchorEl: event.currentTarget });
      };

      getTransaction() {
         const { user } = this.props;
        let users = JSON.parse(user);
      api.get('transactions', {
           params: {
             'id': users.id,
             'role_id':users.role_id
           }
         })
         .then((response) => {
           
            const data =  response.data.data;
            const offset = 0;
            const currentpagedata = data.slice(offset, offset + AppConfig.paginate);

            const dataSub =  response.data.dataSub;
            
            const currentpagedataSub = dataSub.slice(offset, offset + AppConfig.paginate);
          
            const dataCancel =  response.data.dataCancel;
            const dataSubCancel =  response.data.dataSubCancel;
            const currentpagedataSubCancel = dataSubCancel.slice(offset, offset + AppConfig.paginate);
           // const currentpagedataCancel = dataCancel.slice(offset, offset + AppConfig.paginate);
           
           this.setState({ transactionsCancel:dataCancel
            //,currentpagedataCancel
            ,totalRecordsCancel:response.data.totalRecordsCancel,
            transactions:data,currentpagedata,currentpagedataSub,currentpagedataSubCancel,transactionsSub:dataSub,
            totalRecords:response.data.totalRecords,totalRecordsSub:response.data.totalRecordsSub });
         })
        
         .catch(error => {
            // error hanlding
         })
   }


   componentDidMount() {
     this.getTransaction();
   }

   onReload() {
      this.setState({ loading: true });
      let self = this;
      setTimeout(() => {
         self.setState({ loading: false });
      }, 2000);
   }

   onReloads() {
      this.setState({ loadings: true });
      let self = this;
      setTimeout(() => {
         self.setState({ loadings: false });
      }, 2000);
   }

   onPageChanged = data => {

   
    const { transactions } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    
    const offset = (currentPage - 1) * pageLimit;
    
    const currentpagedata = transactions.slice(offset, offset + pageLimit);

    this.setState({  currentpagedata, currentPage, totalPages  });
  }; 


  onPageChangedSub = data => {

   
    const { transactionsSub } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    
    const offset = (currentPage - 1) * pageLimit;
    
    const currentpagedataSub = transactionsSub.slice(offset, offset + pageLimit);

    this.setState({  currentpagedataSub, currentPage, totalPages  });
  };

  viewUserDetail(data) {
      this.setState({ openViewUserDialog: true, selectedTransaction: data });
   }

  viewInvoice(data) {
      this.setState({ openViewInvoice: true, selectedTransaction: data });
   }

   /**
    * On Delete
    */
   onDelete(data) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
   }


   cancelTransactionPermanently() {
      const { selectedUser } = this.state;
      if(selectedUser.plan_name == 'Classic'){
        this.refs.deleteConfirmationDialog.close();               
        NotificationManager.error('Classic plan not to be cancel !');
        return false;
      }
      let users = this.state.currentpagedataSub;
      /*let indexOfDeleteUser = users.indexOf(selectedUser);
      console.log(indexOfDeleteUser);*/
      this.refs.deleteConfirmationDialog.close();
      this.setState({ loading: true });
      let self = this;
       api.post('cancle-subscription',{
               'id':selectedUser.id,
            }).then((response) => {
              console.log(response.data);
               
               /* users.splice(indexOfDeleteUser, 1);*/
               self.getTransaction();
                 setTimeout(() => {
               self.setState({ loading: false,  selectedUser: null });
               self.getTransaction();
               NotificationManager.success('Subscription Deleted!');
            }, 2000);
         })
         .catch(error => {
            // error hanlding
         })
   }
   
   handleMenuItemClick = (event, index) => {
      console.log('event',event)
      console.log('index',index)
		//this.setState({ selectedIndex: index, anchorEl: null });
	};
   render() {
      checkRoleAuth()
      const{anchorEl ,currentpagedataSubCancel ,totalRecordsCancel, loadings, currentpagedata, loading, currentpagedataSub , transactions, totalRecords,transactionsSub,totalRecordsSub, selectedTransaction } = this.state;
    // const {currentpagedataSub} =[];
    console.log('currentpagedataSubaa',currentpagedataSub)
      if(!transactions)
          return null;

     
      return (
         <div className="user-management">
             <IntlMessages id='sidebar.subscriptions' defaultMessage='Chameleon | Subscriptions'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
				   <meta name="description" content="Chameleon | Subscriptions" />
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.subscriptions" />}
               match={this.props.match}
            />
           {currentpagedataSub ?
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <div>
                      <p onClick={() => this.onReloads()} className="btn-outline-default mr-10"><IntlMessages id="widgets.Active" /> <IntlMessages id="sidebar.subscription" /></p>
                     </div>
                     <div>
                     </div>
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-success text-white">
                           <th><IntlMessages id="components.friendlyName" /></th>
                           <th><IntlMessages id="components.PlanName" /></th>
                          
                           <th><IntlMessages id="topsupporters.amount" /></th>
                           <th><IntlMessages id="components.TransactionId" /></th>
                           {/* <th>Status</th> */}
                           <th><IntlMessages id="components.CreatedAt" /></th>
                           {/* <th>Upgrade</th> */}
                           <th><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
                     <tbody>
                     {currentpagedataSub && currentpagedataSub.map((transaction, key)=> (
                        <tr key={key}>
                          <td>{transaction.child_name}</td>
                           <td>{transaction.browser_name } ({transaction.plan_name})</td>
                         
                           <td>${transaction.amount}</td>
                        
                           <td>{print_tr_id(transaction.amount , transaction.payment_type ,transaction.stripe_id , transaction.paypal_tx )}</td>
                           {/* <td>{transaction.is_subscription_canceled == 1 ? <span className={`badge badge-danger badge-pill`}>Cancelled</span>:<span className={`badge badge-success badge-pill`}><IntlMessages id="widgets.Active" /></span>}</td>
                            */}
                            <td>{timeAgo(transaction.created_at)}</td>
                           {/* <td>

                       
                        { (get_plan_id_by_name(transaction.plan_name) == 0) &&
                        <div>
                           <Link  className="nav-link no-arrow" to={{
                              pathname: '/app/subscription/upgrade',
                              state: { 
                                 subs_id: transaction.id,
                                 subs_type : 1,
                                 plan_name : get_plan_name_by_id(AppConfig.plans_array, 1),
                                 plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 1),
                                 child_name: transaction.child_name,
                                 login_user_id: transaction.user_id,
                                 browser_id: transaction.padmin_browser_id, 
                                 browser_name: transaction.browser_name,
                                 transaction: transaction,
                                 device_name: transaction.device,
                                 plan_type: 1
                              }
                        }}><span  className={`badge badge-warning badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 1)}</span> 
                        </Link>

                           <Link  className="nav-link no-arrow" to={{
                              pathname: '/app/subscription/upgrade',
                              state: { 
                                 subs_id: transaction.id,
                                 subs_type : 2,
                                 plan_name : get_plan_name_by_id(AppConfig.plans_array, 2),
                                 plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 2),
                                 child_name: transaction.child_name,
                                 login_user_id: transaction.user_id,
                                 browser_id: transaction.padmin_browser_id, 
                                 browser_name: transaction.browser_name,
                                 transaction: transaction,
                                 device_name: transaction.device,
                                 plan_type: 1
                              }
                        }}><span  className={`badge badge-info badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 2)}</span> 
                        </Link>
                        <Link  className="nav-link no-arrow" to={{
                              pathname: '/app/subscription/upgrade',
                              state: { 
                                 subs_id: transaction.id,
                                 subs_type : 3,
                                 plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                 plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                 child_name: transaction.child_name,
                                 login_user_id: transaction.user_id,
                                 browser_id: transaction.padmin_browser_id, 
                                 browser_name: transaction.browser_name,
                                 transaction: transaction,
                                 device_name: transaction.device,
                                 plan_type: 1
                              }
                        }}><span  className={`badge badge-zac badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 3)}</span> 
                        </Link>

                        </div>
                     }
                              
                     { (get_plan_id_by_name(transaction.plan_name) == 1) &&
                      <div>
                         
                              <Link  className="nav-link no-arrow" to={{
                                    pathname: '/app/subscription/upgrade',
                                    state: { 
                                       subs_id: transaction.id,
                                       subs_type : 2,
                                       plan_name : get_plan_name_by_id(AppConfig.plans_array, 2),
                                       plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 2),
                                       child_name: transaction.child_name,
                                       login_user_id: transaction.user_id,
                                       browser_id: transaction.padmin_browser_id, 
                                       browser_name: transaction.browser_name,
                                       transaction: transaction,
                                       device_name: transaction.device,
                                       plan_type: 1
                                    }
                              }}><span  className={`badge badge-info badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 2)}</span> 
                              </Link>
                              <Link  className="nav-link no-arrow" to={{
                                    pathname: '/app/subscription/upgrade',
                                    state: { 
                                       subs_id: transaction.id,
                                       subs_type : 3,
                                       plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                       plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                       child_name: transaction.child_name,
                                       login_user_id: transaction.user_id,
                                       browser_id: transaction.padmin_browser_id, 
                                       browser_name: transaction.browser_name,
                                       transaction: transaction,
                                       device_name: transaction.device,
                                       plan_type: 1
                                    }
                              }}><span  className={`badge badge-zac badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 3)}</span> 
                              </Link>
                      </div>
                     }
                              
                     { (get_plan_id_by_name(transaction.plan_name) == 2) &&
                      <div>
                              <Link  className="nav-link no-arrow" to={{
                                    pathname: '/app/subscription/upgrade',
                                    state: { 
                                       subs_id: transaction.id,
                                       subs_type : 3,
                                       plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                       plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                       child_name: transaction.child_name,
                                       login_user_id: transaction.user_id,
                                       browser_id: transaction.padmin_browser_id, 
                                       browser_name: transaction.browser_name,
                                       transaction: transaction,
                                       device_name: transaction.device,
                                       plan_type: 1
                                    }
                              }}><span  className={`badge badge-zac badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 3)}</span> 
                              </Link>
                      </div>
                     }
                              
                              
                         

                           </td>*/}
                            <td className="list-action"> 
                                 <a href="javascript:void(0)" onClick={() => this.viewUserDetail(transaction)}><i className="ti-eye"></i></a>
                                 {transaction.is_subscription_canceled == 0 &&
                                    <a href="javascript:void(0)" onClick={() => this.onDelete(transaction)}><i className="ti-close"></i></a>
                                 }
                                 <Link to={{
                                             pathname: '/app/subscription/invoice',
                                             state: { transaction: transaction,}
                                           }} > <i className="icon-printer" ></i>
                                 </Link>
                              </td>
                        </tr>
                     ))}
                     </tbody>
                    <tfoot className="border-top">
                        <tr>
                           <td colSpan="100%">
                              <Paginations
                                className="mb-0 py-10 px-10"
                                totalRecords={totalRecordsSub}
                                pageLimit={AppConfig.paginate}
                                pageNeighbours={1}
                                onPageChangedSub={this.onPageChangedSub}
                              />
                           </td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
               {loadings &&
                  <RctSectionLoader />
               }
            </RctCollapsibleCard>
            :
            <RctCollapsibleCard><center> {<IntlMessages id="widgets.NoRecordFound" />}</center></RctCollapsibleCard>
          }

{currentpagedataSubCancel ?
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <div>
                      <p onClick={() => this.onReloads()} className="btn-outline-default mr-10"><IntlMessages id="widgets.cancelled" /> <IntlMessages id="sidebar.subscription" /></p>
                     </div>
                     <div>
                     </div>
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-success text-white">
                           <th><IntlMessages id="components.friendlyName" /></th>
                           <th><IntlMessages id="components.PlanName" /></th>
                          
                           <th><IntlMessages id="topsupporters.amount" /></th>
                           <th><IntlMessages id="components.TransactionId" /></th>
                           {/* <th>Status</th> */}
                           <th><IntlMessages id="components.CreatedAt" /></th>
                           {/* <th>Upgrade</th> */}
                           <th><IntlMessages id="widgets.action" /></th>
                        </tr>
                     </thead>
                     <tbody>
                     {currentpagedataSubCancel && currentpagedataSubCancel.map((transaction, key)=> (
                        <tr key={key}>
                          <td>{transaction.child_name}</td>
                           <td>{transaction.browser_name} ({transaction.plan_name})</td>
                         
                           <td>${transaction.amount}</td>
                        
                           <td>{print_tr_id(transaction.amount , transaction.payment_type ,transaction.stripe_id , transaction.paypal_tx )}</td>
                           {/* <td>{transaction.is_subscription_canceled == 1 ? <span className={`badge badge-danger badge-pill`}>Cancelled</span>:<span className={`badge badge-success badge-pill`}><IntlMessages id="widgets.Active" /></span>}</td> */}
                           <td>{timeAgo(transaction.created_at)}</td>
                          {/* <td>
                    
                       
                           { (get_plan_id_by_name(transaction.plan_name) == 0) &&
                        <div>
                           <Link  className="nav-link no-arrow" to={{
                              pathname: '/app/subscription/upgrade',
                              state: { 
                                 subs_id: transaction.id,
                                 subs_type : 1,
                                 plan_name : get_plan_name_by_id(AppConfig.plans_array, 1),
                                 plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 1),
                                 child_name: transaction.child_name,
                                 login_user_id: transaction.user_id,
                                 browser_id: transaction.padmin_browser_id, 
                                 browser_name: transaction.browser_name,
                                 transaction: transaction,
                                 device_name: transaction.device,
                                 plan_type: 1
                              }
                        }}><span  className={`badge badge-warning badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 1)}</span> 
                        </Link>

                           <Link  className="nav-link no-arrow" to={{
                              pathname: '/app/subscription/upgrade',
                              state: { 
                                 subs_id: transaction.id,
                                 subs_type : 2,
                                 plan_name : get_plan_name_by_id(AppConfig.plans_array, 2),
                                 plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 2),
                                 child_name: transaction.child_name,
                                 login_user_id: transaction.user_id,
                                 browser_id: transaction.padmin_browser_id, 
                                 browser_name: transaction.browser_name,
                                 transaction: transaction,
                                 device_name: transaction.device,
                                 plan_type: 1
                              }
                        }}><span  className={`badge badge-info badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 2)}</span> 
                        </Link>
                        <Link  className="nav-link no-arrow" to={{
                              pathname: '/app/subscription/upgrade',
                              state: { 
                                 subs_id: transaction.id,
                                 subs_type : 3,
                                 plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                 plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                 child_name: transaction.child_name,
                                 login_user_id: transaction.user_id,
                                 browser_id: transaction.padmin_browser_id, 
                                 browser_name: transaction.browser_name,
                                 transaction: transaction,
                                 device_name: transaction.device,
                                 plan_type: 1
                              }
                        }}><span  className={`badge badge-zac badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 3)}</span> 
                        </Link>

                        </div>
                     }
                              
                     { (get_plan_id_by_name(transaction.plan_name) == 1) &&
                      <div>
                         
                              <Link  className="nav-link no-arrow" to={{
                                    pathname: '/app/subscription/upgrade',
                                    state: { 
                                       subs_id: transaction.id,
                                       subs_type : 2,
                                       plan_name : get_plan_name_by_id(AppConfig.plans_array, 2),
                                       plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 2),
                                       child_name: transaction.child_name,
                                       login_user_id: transaction.user_id,
                                       browser_id: transaction.padmin_browser_id, 
                                       browser_name: transaction.browser_name,
                                       transaction: transaction,
                                       device_name: transaction.device,
                                       plan_type: 1
                                    }
                              }}><span  className={`badge badge-info badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 2)}</span> 
                              </Link>
                              <Link  className="nav-link no-arrow" to={{
                                    pathname: '/app/subscription/upgrade',
                                    state: { 
                                       subs_id: transaction.id,
                                       subs_type : 3,
                                       plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                       plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                       child_name: transaction.child_name,
                                       login_user_id: transaction.user_id,
                                       browser_id: transaction.padmin_browser_id, 
                                       browser_name: transaction.browser_name,
                                       transaction: transaction,
                                       device_name: transaction.device,
                                       plan_type: 1
                                    }
                              }}><span  className={`badge badge-zac badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 3)}</span> 
                              </Link>
                      </div>
                     }
                              
                     { (get_plan_id_by_name(transaction.plan_name) == 2) &&
                      <div>
                              <Link  className="nav-link no-arrow" to={{
                                    pathname: '/app/subscription/upgrade',
                                    state: { 
                                       subs_id: transaction.id,
                                       subs_type : 3,
                                       plan_name : get_plan_name_by_id(AppConfig.plans_array, 3),
                                       plan_amount : get_plan_name_by_id(AppConfig.plan_price_array, 3),
                                       child_name: transaction.child_name,
                                       login_user_id: transaction.user_id,
                                       browser_id: transaction.padmin_browser_id, 
                                       browser_name: transaction.browser_name,
                                       transaction: transaction,
                                       device_name: transaction.device,
                                       plan_type: 1
                                    }
                              }}><span  className={`badge badge-zac badge-pill`}>{get_plan_name_by_id(AppConfig.plans_array, 3)}</span> 
                              </Link>
                      </div>
                     }
                              
                         

                  </td>*/}

                            <td className="list-action">
                                 <a href="javascript:void(0)" onClick={() => this.viewUserDetail(transaction)}><i className="ti-eye"></i></a>
                                 {transaction.is_subscription_canceled == 0 &&
                                    <a href="javascript:void(0)" onClick={() => this.onDelete(transaction)}><i className="ti-close"></i></a>
                                 }
                                 <Link to={{
                                             pathname: '/app/subscription/invoice',
                                             state: { transaction: transaction,}
                                           }} > <i className="icon-printer" ></i>
                                 </Link>
                              </td>
                        </tr>
                     ))}
                     </tbody>
                    <tfoot className="border-top">
                        <tr>
                           <td colSpan="100%">
                              {/* <Paginations
                                className="mb-0 py-10 px-10"
                                totalRecords={totalRecordsCancel}
                                pageLimit={AppConfig.paginate}
                                pageNeighbours={1}
                                onPageChangedSub={this.onPageChangedSub}
                              /> */}
                           </td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
               {loadings &&
                  <RctSectionLoader />
               }
            </RctCollapsibleCard>
            :
            <RctCollapsibleCard><center> {<IntlMessages id="widgets.NoRecordFound" />}</center></RctCollapsibleCard>
          }

          
            <DeleteConfirmationDialog
               ref="deleteConfirmationDialog"
               title={<IntlMessages id="wedgit.sureToCancelSubs" />}
               message={<IntlMessages id="wedgit.sureToCancelSubsNote" />}
               onConfirm={() => this.cancelTransactionPermanently()}
               btnCancel={<IntlMessages id="button.noCancelSubs" />}
               btnYes={<IntlMessages id="button.yesCancelSubs" />}
            />
          <Dialog
               onClose={() => this.setState({ openViewUserDialog: false })}
               open={this.state.openViewUserDialog}
            >
               <DialogContent>
               
                  {selectedTransaction !== null &&
                     <div className="pricing-wrapper">
                        
                        <div className="clearfix d-flex">
                              <div className="media-body">
                              <h2 className="mb-20"><IntlMessages id="widgets.personalDetails"/></h2>
                                 <div className="row">
                                    <div className="col-md-6">
                                       <p><IntlMessages id="components.email" />: <span className="fw-bold">{selectedTransaction.email}</span></p>
                                    </div>
                                    {selectedTransaction.payment_type == 2 &&
                                    <div className="col-md-6">
                                       <p><IntlMessages id="components.paypal_email" />: <span className="fw-bold">{selectedTransaction.paypal_email_id}</span></p>
                                    </div>
                                    }
                                    <div className="col-md-6">
                                       <p><IntlMessages id="sidebar.name" />: <span className="fw-bold">{selectedTransaction.full_name}</span></p>
                                       </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="widgets.phone" />: <span className="fw-bold">{selectedTransaction.phone}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="components.street1" />: <span className="fw-bold">{selectedTransaction.address_1}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="components.street2" />: <span className="fw-bold">{selectedTransaction.address_2}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="components.city" />: <span className="fw-bold">{selectedTransaction.city}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="components.state" />: <span className="fw-bold">{selectedTransaction.state}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="components.country" />: <span className="fw-bold">{selectedTransaction.country}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    <p><IntlMessages id="components.zip" />: <span className="fw-bold">{selectedTransaction.zip}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                    </div>
                                 </div>
                                    <br/>
                                    <div className="row">
                                       <div className="col-md-12">
                                          <p><h2 className="mb-20"><IntlMessages id="widgets.subscriptionDetails"/></h2></p>
                                       </div>
                                    </div>
                                 <div className="row">
                                  
                                    {selectedTransaction.type == '0' ?
                                    <div className="col-md-6">
                                       <p><IntlMessages id="widgets.campaignName" />: <span className="fw-bold">{selectedTransaction.campaign.name}</span></p>
                                    </div>
                                     :""
                                    }

                                       <div className="col-md-6">
                                       <p><IntlMessages id="topsupporters.amount" />: <span className="fw-bold">{selectedTransaction.amount}</span></p>
                                       </div>
                                       <div className="col-md-6">
                                       
                                       {selectedTransaction.stripe_id !== null || selectedTransaction.paypal_tx !== null  ?
                                       <p><IntlMessages id="components.TransactionId" />: <span className="fw-bold">{selectedTransaction.payment_type == 1 ? selectedTransaction.stripe_id:selectedTransaction.paypal_tx}</span></p>
                                       :<p><IntlMessages id="components.TransactionId" />: <span className="fw-bold">Classic</span></p>
                                       }
                                       </div>
                                 
                                       
                                    
                                       <div className="col-md-6">
                                          <p><IntlMessages id="components.PlanName" />: <span className="fw-bold">{selectedTransaction.plan_name}</span></p>
                                       </div>
                                       <div className="col-md-6">
                                          <p><IntlMessages id="widgets.startDate" />: <span className="fw-bold">{getTheDate(selectedTransaction.stripe_start_date)}</span></p>
                                       </div>
                                       <div className="col-md-6">
                                          <p><IntlMessages id="widgets.endDate" />: <span className="fw-bold">{getTheDate(selectedTransaction.stripe_end_date)}</span></p>
                                       </div>
                                    
                                       
                                       
                                    
                                    
                                       {selectedTransaction.isAnonymous == 1 && (selectedTransaction.isAnonymous == 1) ?
                                       <div className="col-md-6">
                                          <p><IntlMessages id="components.Annonymous" />: <span className={`badge badge-success badge-pill`}><IntlMessages id="components.Annonymous" /></span></p> : <p><IntlMessages id="components.Annonymous" />: <span className={`badge badge-danger badge-pill`}>Not</span></p>
                                       </div>
                                       :""
                                       }
                                    
                                       <div className="col-md-6">
                                          <p><IntlMessages id="components.CreatedAt" />: <span className="fw-bold">{timeAgo(selectedTransaction.created_at)}</span></p>
                                       </div>
                                   
                                 </div>
                              </div>
                        </div>
                     </div>
                  }
               </DialogContent>
            </Dialog>

            {/* =====================INVOICE=========================== */}
         
            {/* ================================================= */}
         </div>
      );
   }
}


const mapStateToProps = ({ authUser }) => {
   const { user } = authUser;
   return { user };
};

export default connect(mapStateToProps)(Transaction);
