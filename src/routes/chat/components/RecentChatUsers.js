/**
 * Recent Chat Users
 */
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';

// components
import UserListItem from './UserListItem';
import api from 'Api';
// actions
import { chatWithSelectedUser, getRecentChatUsers } from 'Actions';

class RecentChatUsers extends Component {

    componentWillMount() {
        this.fetchRecentChatUsers();
    }

  
    /**
     * Fetch Recent User
     */
    fetchRecentChatUsers() {
         const { user } = this.props;
         this.props.getRecentChatUsers(user);
    }


    /**
     * Swicth Chat With User
     * @param {*object} user
     */
    switchChatWithUser(user) {
        this.props.chatWithSelectedUser(user);
    }

    render() {
        const { recentChatUsers, selectedUser } = this.props;
        console.log(recentChatUsers)
        if (recentChatUsers === null) {
            return (
                <div className="no-found-user-wrap">
                    <h4>No User Found</h4>
                </div>
            );
        }
        return (
            <List className="p-0 mb-0">
                {recentChatUsers.map((user, key) => (
                    <UserListItem
                        selectedUser={selectedUser}
                        user={user}
                        key={key}
                        authUser={this.props.user}
                        onClickListItem={() => this.switchChatWithUser(user)}
                    />
                ))}
            </List>
        );
    }
}

const mapStateToProps = ({ chatAppReducer }) => {
    return chatAppReducer;
};

export default connect(mapStateToProps, {
    chatWithSelectedUser,
    getRecentChatUsers
})(RecentChatUsers);
