/**
 * User Block
 */
import React, { Component } from 'react';
import { hubCheckPaths } from "Helpers/helpers";
import Avatar from '@material-ui/core/Avatar';
class UserBlock extends Component {

    state = {
       // users:this.props.user ? this.props.user : null
       users:localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : null
    }
  
    render() {
        const {users} = this.state
        return (
            /* <div className="profile-top mb-20">
                 <img src={require('Assets/img/profile-bg.jpg')} alt="profile banner" className="img-fluid" width="1920" height="345" />*/
                
                
                <div className="profile-content">
                     <div className="media">
                     {users.photo !== '' && users.photo !== null ?
                 <img src={hubCheckPaths('images')+users.photo} alt="user profile" className="rounded-circle mr-30 bordered" width="140" height="140" />
                : <Avatar className=" mr-15" style={{ width:"90px" ,height:"90px"}}>{users.full_name.charAt(0)}</Avatar>
                                    }    <div className="media-body pt-25">
                             <div className="mb-20">
                                 <h2>{users.full_name}</h2> 
                                 <p>{users.email}</p>
                             </div>
                         </div>
                     </div>
                </div>
              /*</div>*/
         );
    }
}

export default UserBlock;
