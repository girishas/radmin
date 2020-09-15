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
import { timeAgo, getTheDate ,checkRoleAuth , get_plan_id_by_name , print_tr_id , user_id} from "Helpers/helpers";
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

class Donation extends Component {

      

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
           },headers: {'User-Id':user_id()}
         })
         .then((response) => {
          
            const data =  response.data.data;
            const offset = 0;
            const currentpagedata = data.slice(offset, offset + AppConfig.paginate);

            const dataSub =  response.data.dataSub;
            const currentpagedataSub = dataSub.slice(offset, offset + AppConfig.paginate);

           this.setState({ transactions:data,currentpagedata,currentpagedataSub,transactionsSub:dataSub,totalRecords:response.data.totalRecords,totalRecordsSub:response.data.totalRecordsSub });
             
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
      if(selectedUser.stripe_id === null){
        this.refs.deleteConfirmationDialog.close();               
        NotificationManager.error('Free plan not to be cancel !');
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

                 setTimeout(() => {
               self.setState({ loading: false, currentpagedataSub:response.data, selectedUser: null });
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
      const{anchorEl  , loadings, currentpagedata, loading, transactions, totalRecords, currentpagedataSub,transactionsSub,totalRecordsSub, selectedTransaction } = this.state;
      if(!transactions)
          return null;

     
      return (
         <div className="user-management">
             <IntlMessages id='sidebar.donationHistory' defaultMessage='Chameleon | Donations'>
               {(title) => (
                 <Helmet>
                   <title>Chameleon | {title}</title>
				   <meta name="description" content="Chameleon | Donations" />
                 </Helmet>
               )}
             </IntlMessages>
            <PageTitleBar
               title={<IntlMessages id="sidebar.donationHistory" />}
               match={this.props.match}
            />
            <RctCollapsibleCard fullBlock>
               <div className="table-responsive">
                  <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                     <div>
                        <p onClick={() => this.onReload()} className="btn-outline-default mr-10">Donations</p>
                     </div>
                     <div>
                     </div>
                  </div>
                  <table className="table table-middle table-hover mb-0">
                     <thead>
                        <tr className="bg-primary text-white">
                           <th>Transaction Id</th>
                           <th>Email Address</th>
                           <th>Amount</th>
                           <th>Campaign</th>
                           <th>Annonymous</th>
                           <th>Date Created</th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                     {currentpagedata && currentpagedata.map((transaction, key)=> (
                        <tr key={key}>
                          <td>{print_tr_id(transaction.amount , transaction.payment_type ,transaction.stripe_id , transaction.paypal_tx )}</td>
                           
                           <td>{transaction.email}</td>
                           <td>{transaction.amount}</td>
                           <td>{transaction.campaign.name}</td>
                            <td>{transaction.isAnonymous == 1 ?
                     <span className={`badge badge-success badge-pill`}>Annonymous</span> : <span className={`badge badge-danger badge-pill`}>Not</span>
                  }</td>
                           <td>{timeAgo(transaction.created_at)}</td>
                           <td className="list-action">
                                 <a href="javascript:void(0)" onClick={() => this.viewUserDetail(transaction)} title="View" ><i className="ti-eye"></i></a>
                                 {/* <a href="/subscription/invoice/1" onClick={() => this.viewInvoice(transaction)} title="Invoice" ><i className="icon-printer"></i></a>
                                  */}
                          
                              <Link to={{
                              pathname: '/app/subscription/invoice',
                              state: { transaction: transaction,}
                                 }} > <i className="icon-printer" ></i></Link>
                              </td>
                        </tr>
                     ))}
                     </tbody>
                      <tfoot className="border-top">
                        <tr>
                           <td colSpan="100%">
                              <Pagination
                                className="mb-0 py-10 px-10"
                                totalRecords={totalRecords}
                                pageLimit={AppConfig.paginate}
                                pageNeighbours={1}
                                onPageChanged={this.onPageChanged}
                              />
                           </td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
               {loading &&
                  <RctSectionLoader />
               }
            
               
            </RctCollapsibleCard>
          
          <DeleteConfirmationDialog
               ref="deleteConfirmationDialog"
               title="Are You Sure Want To Cancle this Subscription?"
               message="This will cancle subscription permanently."
               onConfirm={() => this.cancelTransactionPermanently()}
            />
          <Dialog
               onClose={() => this.setState({ openViewUserDialog: false })}
               open={this.state.openViewUserDialog}
            >
               <DialogContent>
                  {selectedTransaction !== null &&
                     <div>
                        <div className="clearfix d-flex">
                              <div className="media-body">
                                 <p>Email: <span className="fw-bold">{selectedTransaction.email}</span></p>
                                 <p>Name: <span className="fw-bold">{selectedTransaction.full_name}</span></p>
                                 <p>Phone: <span className="fw-bold">{selectedTransaction.phone}</span></p>
                                 <p>Address 1: <span className="fw-bold">{selectedTransaction.address_1}</span></p>
                                 <p>Address 1: <span className="fw-bold">{selectedTransaction.address_2}</span></p>
                                 <p>City: <span className="fw-bold">{selectedTransaction.city}</span></p>
                                 <p>State: <span className="fw-bold">{selectedTransaction.state}</span></p>
                                 <p>Country: <span className="fw-bold">{selectedTransaction.country}</span></p>
                                 <p>Zip: <span className="fw-bold">{selectedTransaction.zip}</span></p>
                                 {selectedTransaction.type == '0' ?
                                 <p>Campaign Name: <span className="fw-bold">{selectedTransaction.campaign.name}</span></p>
                                 :<p>Plan Name: <span className="fw-bold">{selectedTransaction.plan_name}</span></p>
                                 }
                                 <p>Amount: <span className="fw-bold">{selectedTransaction.amount}</span></p>

                                 
                                 {selectedTransaction.stripe_id !== null || selectedTransaction.paypal_tx !== null  ?
                                 <p>Transaction Id: <span className="fw-bold">{selectedTransaction.payment_type == 1 ? selectedTransaction.stripe_id:selectedTransaction.paypal_tx}</span></p>
                                 :<p>Transaction Id: <span className="fw-bold">Free</span></p>
                                 }
                                 {selectedTransaction.stripe_plan_id !== null &&
                                    <div>
                                       <p>Plan Name: <span className="fw-bold">{selectedTransaction.plan_name}</span></p>
                                       <p>Plan Start date: <span className="fw-bold">{getTheDate(selectedTransaction.stripe_start_date)}</span></p>
                                       <p>Plan End date: <span className="fw-bold">{getTheDate(selectedTransaction.stripe_end_date)}</span></p>
                                    
                                    </div>
                                 
                                 }
                                 {selectedTransaction.isAnonymous == 1 && (selectedTransaction.isAnonymous == 1 ?
                     <p>Annonymous: <span className={`badge badge-success badge-pill`}>Annonymous</span></p> : <p>Annonymous: <span className={`badge badge-danger badge-pill`}>Not</span></p>
                  )}
                                 <p>Created At: {timeAgo(selectedTransaction.created_at)}</p>
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

export default connect(mapStateToProps)(Donation);
