/**
 * Chat App Reducers
 */
import update from 'react-addons-update';

// actions types
import {
    CHAT_WITH_SELECTED_USER,
    SEND_MESSAGE_TO_USER,
    UPDATE_USERS_SEARCH,
    SEARCH_USERS,
    GET_RECENT_CHAT_USERS,
    GET_RECENT_CHAT_USERS_SUCCESS,
    GET_RECENT_CHAT_USERS_FAILURE,
    SEND_MESSAGE_TO_USERS
} from 'Actions/types';

// chat users
//import recentChatUsers from 'Assets/data/chat-app/users';

const INITIAL_STATE = {
    admin_photo_url: require('../assets/img/user-7.jpg'),
    recentChatUsers: [],
    allRecentChatUsers: [],
    allChatUsers: [],
    selectedUser: null,
    searchUsers: '',
    loading: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get recent chat user
        case GET_RECENT_CHAT_USERS:
            return { ...state, loading: true, selectedUser: null };

        case GET_RECENT_CHAT_USERS_SUCCESS:
            return { ...state, loading: false, recentChatUsers: action.payload, allRecentChatUsers:action.payload, allChatUsers:action.payload };   

        // chat with selected user
        case CHAT_WITH_SELECTED_USER:
            let indexOfSelectedUser;
            indexOfSelectedUser = state.recentChatUsers.indexOf(action.payload);
            return update(state, {
                selectedUser: { $set: action.payload },
                recentChatUsers: {
                    [indexOfSelectedUser]: {
                        isSelectedChat: { $set: true },
                        new_message_count: { $set: 0 }
                    }
                }
            });

        // send message to user
        case SEND_MESSAGE_TO_USER:
            let adminReplyData = {
                isAdmin: action.payload.isAdmin,
                message: action.payload.message,
                sent: action.payload.time
            };
            let pos = state.selectedUser.previousChats.length;
            return update(state, {
                selectedUser: { previousChats: { $splice: [[pos, 0, adminReplyData]] } }
            })

        // update search
        case UPDATE_USERS_SEARCH:
            return { ...state, searchUsers: action.payload };

        // search user
        case SEARCH_USERS:
            if (action.payload === '') {
                return { ...state, recentChatUsers: state.allChatUsers };
            } else {
                console.log(state.allRecentChatUsers);
                const searchUsers = state.allRecentChatUsers.filter((user) =>
                    user.authUser.full_name.toLowerCase().indexOf(action.payload.toLowerCase()) > -1);
                return { ...state, recentChatUsers: searchUsers }
            }


        // send message to user
        case SEND_MESSAGE_TO_USERS:
            let adminReplyDatas = {
                isAdmin: action.payload.isAdmin,
                message: action.payload.message,
                sent: action.payload.time
            };
            let position = state.selectedUser.previousChats.length;
            return update(state, {
                selectedUser: { previousChats: { $splice: [[position, 0, adminReplyDatas]] } }
            })


        default: return { ...state };
    }
}
