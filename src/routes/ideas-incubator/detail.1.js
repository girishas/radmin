/**
 * Feedback Details
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Form, FormGroup, Input } from 'reactstrap';
import Avatar from '@material-ui/core/Avatar';

// actions
import { showFeedbackLoadingIndicator, navigateToBack, onCommentAction } from 'Actions';
import {user_id ,hubCheckPaths } from "Helpers/helpers";
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
// intl messages
import IntlMessages from 'Util/IntlMessages';

class FeedbackDetails extends Component {
  constructor(props) {
 
    super(props);  
    this.state = {
      loading:false,
      idea: [],
      comments: [],
      addNewUserDetail:{
        user_id: user_id(),
        idea_id: $(location).attr("href").split('/').pop(),
        description: '',
        
    },
    }

 
}
 

  /**
   * Navigate To Back
   */
  navigateToBack() {
    this.props.showFeedbackLoadingIndicator();
    let self = this;
    setTimeout(() => {
      self.props.navigateToBack();
    }, 1500);
  }

      /**
    * Validation
    */
   validateField(str){
    let formIsValid = true;
  
   for (var key in str) {
  
       switch(key) {
         case 'description':
           if(str[key] == '' || str[key] == null){
                formIsValid = false;
                NotificationManager.error('Description requried!');
            } 
         break;
        
         default:
           break;
       }
   }
   return formIsValid;
      
}
  /**
   * On Comment
   */
   onComment() {
    var validateField = this.validateField(this.state.addNewUserDetail);
    if(validateField){
        let newUser = {
        ...this.state.addNewUserDetail
        }
        let self = this;
        this.setState({loading: true });
        //new code for file
        var data = new FormData()
        $.map(newUser, function(value, index) {
            if(value != 'undefined' && value != '' && value.length !== 0  )
            data.append(index,value)
        });
        api.post('forum/add_idea_comment',data).then((response) => {
            const data =  response.data;     
            console.log(response.data);
            NotificationManager.success('Comment Successfully Added!');
            setTimeout(() => {
              
                self.setState({ loading: false ,comments :response.data ,
                  addNewUserDetail: {
                    ...this.state.addNewUserDetail,
                    ['description']: "",
                }
                });

             
               
            }, 500);       
        })
        .catch(error => {
            // error hanlding
        })
    }
}

  
  getInfo() {

    api.post('forum/get_idea_with_comment',{
      'id':$(location).attr("href").split('/').pop(),
      'user_id':user_id()
      })  .then((response) => {
        const idea =  response.data.idea;
        const comments =  response.data.comments;
        this.setState({
          idea:idea,
          comments:comments,
       
      });


   })
   
    
 }

  componentDidMount() {
    this.getInfo();
  //  this.props.getFeedbacks();
  }
 /**
    * On Change Add New User Details
    */
   onChangeAddNewUserDetails(key, value, e) {
    this.setState({
        addNewUserDetail: {
            ...this.state.addNewUserDetail,
            [key]: value,
        }
    });
}



idea_action(e, action, idea_id){
  console.log('e',e)
  console.log('action',action)
  console.log('comment_id',idea_id)
   var action_status = 1;
   if($('.ideaLike').hasClass("text-danger")){
     
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
           $('.ideaLikeCount').text(response.data.likesCount);
           if(action_status == 0){
               $('.ideaLike').removeClass("text-danger");
           }else{
               $('.ideaLike').addClass("text-danger");
           }
   }) 
}
  render() {
    const { idea,comments, loading ,addNewUserDetail} = this.state;
    return (
      <div  className="feedback-wrapper container" >
      <RctCollapsibleCard>
        <div className="rct-block-title">
        <Link to={{pathname: '/app/ideas-incubator' }} >
          <Button >
            <i className="zmdi zmdi-arrow-left mr-10" ></i> <IntlMessages id="widgets.AllIdeas" />
            </Button> 
                        </Link>
          {/* <Button onClick={() => this.navigateToBack()}>
            <i className="zmdi zmdi-arrow-left mr-10" ></i> All Ideas
          </Button> */}
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-9">
            <div className="d-flex justify-content-start">
              <a href="javascript:void(0)" style={{color:"inherit" ,height: "fit-content"}}>
                <div className="like-box"  onClick={(e) => this.idea_action(e, 'likes' , idea.id)} >
                  <h2 className="ideaLikeCount">{idea.likes_count}</h2>
                  <span className="mr-2"><IntlMessages id="widgets.likes" /></span>
                  {/* <i className="zmdi zmdi-thumb-up"></i> */}
                  <i  className={idea.user_likes == 1? "zmdi zmdi-favorite text-danger ideaLike": "zmdi zmdi-favorite ideaLike"} ></i>
                </div>
              </a>
              <div style={{width:"100%"}}>
                <div className="mb-30">
                  <h2 className="title">{idea.title}</h2>
                  <p>{idea.description}</p>
                </div>
                {comments.length > 0 ?
                  <h2 className="heading"><IntlMessages id="widgets.Comment" /> ({comments.length})</h2>
                  : <h2 className="heading"><IntlMessages id="widgets.NoCommentsFound" /></h2>
                }
                <ul className="list-unstyled  comment-sec">
                  {comments.length > 0 && comments.map((comment, key) => (
                    <li className="media" key={key}>
                      {comment.user_photo !== '' && comment.user_photo !== null && comment.user_photo !== 'undefined' ?
                        <img src={hubCheckPaths('images')+comment.user_photo} alt={comment.user_photo} className="full-rounded-circle mr-20" width="60" height="60" />
                        : <Avatar className="full-rounded-circle mr-20" style={{height:"60px",width:"60px"}}>{comment.user_full_name !== null? comment.user_full_name.charAt(0) :''}</Avatar> 
                        } 
                      <div className="media-body">
                        <p className="comment-box">{comment.description}</p>
                        {/* {comment.reply !== null && comment.reply.map((reply, subkey) => (
                          <div className="media mt-30 mb-0" key={subkey}>
                            {reply.avatar !== '' ?
                              <img src={reply.avatar} alt="user profile" className="img-fluid rounded-circle mr-20" width="50" height="50" />
                              : <Avatar className="mr-20">{reply.userName.charAt(0)}</Avatar>
                            }
                            <div className="media-body">
                              <p className="comment-box">{reply.comment}</p>
                            </div>
                          </div>
                        ))} */}
                      </div>
                    </li>
                  ))}
                </ul>
                <Form className="ml-70 ">
                  <FormGroup>
                    <Input type="textarea" rows="7" name="text" id="Text" placeholder="Type Your comment..." 
                    value={addNewUserDetail.description}
                     onChange={(e) => this.onChangeAddNewUserDetails('description', e.target.value)}
                    
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button variant="raised" className="btn-primary text-white btn-lg" onClick={() => this.onComment()}><IntlMessages id="widgets.Comment" /></Button>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
        {loading &&
          <RctSectionLoader />
        }
      </RctCollapsibleCard>
     
    </div>

    );
  }
}

// map state to props
const mapStateToProps = ({ idea }) => {
  return idea;
}

export default connect(mapStateToProps, {
  showFeedbackLoadingIndicator,
  navigateToBack,
  onCommentAction
})(FeedbackDetails);
