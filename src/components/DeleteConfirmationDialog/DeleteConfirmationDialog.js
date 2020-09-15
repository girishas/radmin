/**
 * Delete Confirmation Dialog
 */
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class DeleteConfirmationDialog extends Component {

   state = {
      open: false
   }

   // open dialog
   open() {
      this.setState({ open: true });
   }

   // close dialog
   close() {
      this.setState({ open: false });
      // if(this.isFunction( this.props.onCancel())){
      //    this.props.onCancel();
      // }
    
   }
 
    isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
     }

   render() {
      const { title, message, onConfirm ,onCancel ,btnCancel,btnYes,btnExtra} = this.props;
      return (
         <Dialog
            open={this.state.open}
            onClose={() => this.close()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
           
         >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {message}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               {onCancel?
                  <Button onClick={onCancel} className="btn-danger text-white">
                  {btnCancel ?btnCancel : 'Cancel'} 
                </Button>
                :
                <Button onClick={() => this.close()} className="btn-danger text-white">
                 {btnCancel ?btnCancel : 'Cancel'} 
               </Button>
               }

               {btnExtra &&
                  <Button onClick={() => this.close()} className="btn-info text-white">
                  {btnExtra ?btnExtra : 'Cancel'} 
                  </Button>
               }
               
               <Button onClick={onConfirm} className="btn-primary text-white" autoFocus>
               {btnYes ?btnYes : 'Yes'} 
               </Button>
            </DialogActions>
         </Dialog>
      );
   }
}

export default DeleteConfirmationDialog;
