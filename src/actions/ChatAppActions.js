/**
 * Chat App Actions
 */
import {
    CHAT_WITH_SELECTED_USER,
    SEND_MESSAGE_TO_USER,
    UPDATE_USERS_SEARCH,
    SEARCH_USERS,
    GET_RECENT_CHAT_USERS,
    GET_RECENT_CHAT_USERS_SUCCESS,
    GET_RECENT_CHAT_USERS_FAILURE,
    SEND_MESSAGE_TO_USERS,
    SEND_MESSAGE_TO_USERS_SUCCESS,
    SEND_MESSAGE_TO_USERS_FAILURE
} from './types';

import api from 'Api';

/**
 * Redux Action To Emit Boxed Layout
 * @param {*boolean} isBoxLayout 
 */
export const chatWithSelectedUser = (user) => ({
    type: CHAT_WITH_SELECTED_USER,
    payload: user
});

export const sendMessageToUser = (data) => ({
    type: SEND_MESSAGE_TO_USER,
    payload: data
});

/**
 * Redux Action To Update User Search
 */
export const updateUsersSearch = (value) => ({
    type: UPDATE_USERS_SEARCH,
    payload: value
});

/**
 * export const to search users
 */
export const onSearchUsers = (value) => ({
    type: SEARCH_USERS,
    payload: value
});

/**
 * Get Recent Chat User
 */
export const getRecentChatUsers = (value) => ({
    type: GET_RECENT_CHAT_USERS,
    payload: value
});


export const getUsersSuccess = (response) => ({
    type: GET_RECENT_CHAT_USERS_SUCCESS,
    payload: response.data
})

export const getUsersFailure = (error) => ({
    type: GET_RECENT_CHAT_USERS_FAILURE,
    payload: error
})

/*export function fetchArticleDetails() {
  return dispatch => {
    return axios.get("https://api.myjson.com/bins/19dtxc").then(({ data }) => {
      dispatch(setArticleDetails(data));
    });
  };
}
*/


/*export const fetchArticleDetails = value => (dispatch) => {
   api.get('/path')
       .then(json => 
           dispatch({type: 'RESULT', payload: json}));
}*/

export const sendMessageToUsers = (data) => ({
    type: SEND_MESSAGE_TO_USERS,
    payload: data
});

export const getChatSuccess = (response) => ({
    type: SEND_MESSAGE_TO_USERS_SUCCESS,
    payload: response.data
})

export const getChatFailure = (error) => ({
    type: SEND_MESSAGE_TO_USERS_FAILURE,
    payload: error
})