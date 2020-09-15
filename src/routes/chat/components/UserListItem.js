/**
 * User List Item
 */
import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import classnames from 'classnames';

// helpers
import { textTruncate, checkPath } from 'Helpers/helpers';

class UserListItem extends Component {

    render() {

        const { user, selectedUser, onClickListItem, authUser } = this.props; 
return (

    <ListItem
        onClick={onClickListItem}
        className={classnames('user-list-item',
            { 'item-active': selectedUser && selectedUser.authUser.id === user.receiver_user_id }
        )}
    >
        <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="media align-items-center w-90">
                <div className="media-left position-relative mr-10">
                {user.authUser.photo &&
                    <img src={checkPath('users')+user.authUser.photo} className="img-fluid rounded-circle" alt="user profile" width="40" height="40" />
                }
                    {user.isActive && (<span className="badge badge-success badge-xs p-5 rct-notify">&nbsp;</span>)}
                </div>
                <div className="media-body pt-5">
                    <h5 className="mb-0">{user.authUser.full_name}</h5>
                   {user.user_id === authUser &&
                    <span> You:</span>
                   } <span className="font-xs d-block">{user.message}</span>
                </div>
            </div>
            {/*<div className="text-right msg-count">
                user.new_message_count !== 0 ?
                    <span className="badge badge-danger rounded-circle">{user.new_message_count}</span>
                    : null
                }
            </div>*/}
        </div>
    </ListItem>
);
}
}

export default UserListItem;
