/**
 * Email Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    GET_RECENT_CHAT_USERS,
    SEND_MESSAGE_TO_USER,
    SEND_MESSAGE_TO_USERS
} from 'Actions/types';

import {
    getUsersSuccess,
    getUsersFailure,
    getChatSuccess,
    getChatFailure
} from 'Actions';




/**
 * Send Email Request To Server
 */
const getEmailsRequest = async (user_id) =>
    await api.post('recent-chats',{user_id})
        .then(response => response)
        .catch(error => error);

/**
 * Get Emails From Server
 */
function* getEmailsFromServer({ payload }) {
   let users = JSON.parse(payload);
   console.log(users);
   // const { email, password } = payload;
    try {
        const response = yield call(getEmailsRequest, users.id);
        yield put(getUsersSuccess(response));
    } catch (error) {
        yield put(getUsersFailure(error));
    }
}

/**
 * Ger Emails
 */
export function* getRecentChatUsers() {
    yield takeEvery(GET_RECENT_CHAT_USERS, getEmailsFromServer);
}



const sendMessage = async (user_id, receiver_user_id, message) =>
    await api.post('send-chats',{user_id, receiver_user_id, message})
        .then(response => response)
        .catch(error => error);


function* sendMessageToServer({ payload }) {
    console.log(payload);
    const { user_id, receiver_user_id, message } = payload;
    try {
        const response = yield call(sendMessage, user_id, receiver_user_id, message);
        yield put(getChatSuccess(response));
    } catch (error) {
        yield put(getChatFailure(error));
    }
}



export function* sendMessageToUsers() {
    yield takeEvery(SEND_MESSAGE_TO_USERS, sendMessageToServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getRecentChatUsers),
        fork(sendMessageToUsers)
    ]);
}