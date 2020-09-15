/**
 * Feedbacks Listings
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
// actions
import {
    onFeedbackFavorite,
    onDeleteFeedback,
    viewFeedbackDetails,
    showFeedbackLoadingIndicator,
    replyFeedback,
    sendReply
} from 'Actions';
// api
import api from 'Api';
// components
import FeedbacksListItem from './FeedbacksListItem';
import {user_id, hubCheckPaths , timeAgo } from "Helpers/helpers";
// intl messages
import IntlMessages from 'Util/IntlMessages';

class FeedbacksListing extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            deleteFeedback: null,
            loading: false,
            
        }
    }
    
    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({
        //         ideas: this.props.ideas, 
        //         type: this.props.type, 
        //     });
        //  }, 500);

         
    }
    /**
     * On Feedback Favorite
     */
    onFeedbackFavorite(feedback) {
        this.props.onFeedbackFavorite(feedback);
    }

    /**
     * On Delete Feedback
     */
    onDeleteFeedback(feedback) {
        this.refs.deleteConfirmation.open();
        this.setState({ deleteFeedback: feedback });
    }

    /**
     * Delete Feedback After Alert
     */
    // deleteFeedback() {
    //     this.refs.deleteConfirmation.close();
    //     this.props.showFeedbackLoadingIndicator();
    //     let self = this;
    //     setTimeout(() => {
    //         self.props.onDeleteFeedback(this.state.deleteFeedback);
    //     }, 1500);
    // }


   /**
    * Delete User Permanently
    */
   deleteFeedback() {
    const { deleteFeedback } = this.state;
    this.refs.deleteConfirmation.close();
    this.setState({ loading: true });
    let self = this;
    api.post('forum/delete_idea',{
             'id':deleteFeedback.id,
          }).then((response) => {
             $('.idea_lsit-'+deleteFeedback.id).remove();
            setTimeout(() => {
                self.setState({ loading: false, deleteFeedback: null });
                NotificationManager.success('Deleted Successfully!');
            }, 2000);
       })
       .catch(error => {
          // error hanlding
       })
  
 }


    /**
     * View Feedback Details
     */
    viewFeedbackDetails(feedback) {
        this.props.showFeedbackLoadingIndicator();
        let self = this;
        setTimeout(() => {
            self.props.viewFeedbackDetails(feedback);
        }, 1500);
    }

    /**
     * Reply Feedback
     */
    replyFeedback(feedback) {
        this.props.replyFeedback(feedback);
    }

    /**
     * Send Reply
     */
    onReplySend(feedback) {
        this.props.showFeedbackLoadingIndicator();
        let self = this;
        setTimeout(() => {
            self.props.sendReply(feedback);
        }, 1500);
    }

    

    idea_action(e, action, idea_id){
        var action_status = 1;
        if( $('.ideaAction'+idea_id+' .ideaLike').hasClass("text-danger")){
           // $(e.target).removeClass("text-danger"); 
            action_status = 0;
        }else{
           // $(e.target).addClass("text-danger"); 
            action_status = 1;
        }  
        let self = this;
        api.get('forum/idea_actions', {
            params: {
                idea_id: idea_id,
                user_id: user_id(),
                action: action,
                action_status: action_status,
            }
        })
        .then((response) => {
            // this.setState({topic:response.data });
            // if(action == 'likes' || action == 'dislikes'){
                $('.ideaAction'+idea_id+' .ideaLikeCount').text(response.data.likesCount);
                if(action_status == 0){
                    $('.ideaAction'+idea_id+' .ideaLike').removeClass("text-danger");
                }else{
                    $('.ideaAction'+idea_id+' .ideaLike').addClass("text-danger");
                }   
        }) 
    }

    render() {
        const { ideas , type} = this.props;
        const { loading } = this.state;
        return (
            <div>
                <ul className="list-unstyled mb-0">
                    { ideas && ideas.map((idea, key) => (

                    type == "all"  ?
                        <FeedbacksListItem
                            data={idea}
                            key={key}
                            onFeedbackFavorite={() => this.onFeedbackFavorite(idea)}
                            onDeleteFeedback={() => this.onDeleteFeedback(idea)}
                            viewFeedbackDetails={() => this.viewFeedbackDetails(idea)}
                            onReply={() => this.replyFeedback(idea)}
                            onReplySend={() => this.onReplySend(idea)}
                            idea_action={(e, action, idea_id) => this.idea_action(e, action, idea_id)}
                        />
                        :
                        idea.type == type  ?
                            <FeedbacksListItem
                                data={idea}
                                key={key}
                                onFeedbackFavorite={() => this.onFeedbackFavorite(idea)}
                                onDeleteFeedback={() => this.onDeleteFeedback(idea)}
                                viewFeedbackDetails={() => this.viewFeedbackDetails(idea)}
                                onReply={() => this.replyFeedback(idea)}
                                onReplySend={() => this.onReplySend(idea)}
                                idea_action={(e, action, idea_id) => this.idea_action(e, action, idea_id)}
                            />
                            :
                            ""
                    ))}
                      {loading &&
                  <RctSectionLoader />
               }
                </ul>
                <DeleteConfirmationDialog
                    ref="deleteConfirmation"
                    title="Are you sure want to delete?"
                    message="This will delete permanently your feedback from feedback list."
                    onConfirm={() => this.deleteFeedback()}
                />
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ ideas }) => {
    return ideas;
}

export default connect(mapStateToProps, {
    onFeedbackFavorite,
    onDeleteFeedback,
    viewFeedbackDetails,
    showFeedbackLoadingIndicator,
    replyFeedback,
    sendReply
})(FeedbacksListing);
