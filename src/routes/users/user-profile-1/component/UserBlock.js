/**
 * User Block
 */
import React, { Component } from 'react';
import { checkPath } from "Helpers/helpers";

class UserBlock extends Component {

    state = {
        users:localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : null
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.users !== this.state.users ){
            console.log('Atul');
        }
    }

    render() {
        const {users} = this.state
        return (
            <div className="profile-top mb-20">
                <img src={require('Assets/img/profile-bg.jpg')} alt="profile banner" className="img-fluid" width="1920" height="345" />
                <div className="profile-content">
                    <div className="media">
                        <img src={checkPath('users')+users.photo} alt="user profile" className="rounded-circle mr-30 bordered" width="140" height="140" />
                        <div className="media-body pt-25">
                            <div className="mb-20">
                                <h2>{users.full_name}</h2>
                                <p>{users.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserBlock;
