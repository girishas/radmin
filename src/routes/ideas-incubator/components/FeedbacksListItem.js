/**
 * Feedback List Item
 */
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import Avatar from '@material-ui/core/Avatar';
import {user_id, hubCheckPaths , timeAgo } from "Helpers/helpers";
import { Link } from 'react-router-dom';
// intl messages
import IntlMessages from 'Util/IntlMessages';
const FeedbackListItem = ({ data, onFeedbackFavorite, onDeleteFeedback, viewFeedbackDetails, onReply, onReplySend ,idea_action}) => (
    <li className={"d-flex justify-content-between idea_lsit-"+data.id}>
        <div className="media">
        {/* <img src={hubCheckPaths('images')+data.user_photo} alt="feedback user" className="rounded-circle mr-20" width="60" height="60" /> */}
        <Link to={{ pathname: '/app/forum/user/activity/' + data.user_id }} style={{textDecoration: "none",color: "#464d69"}} >
            {data.user_photo !== '' && data.user_photo !== null && data.user_photo !== 'undefined' ?
            <img src={hubCheckPaths('images')+data.user_photo} alt={data.user_photo} className="full-rounded-circle mr-20" width="60" height="60" />
            : <Avatar className="full-rounded-circle mr-20" style={{height:"60px",width:"60px"}}>{data.user_full_name !== null? data.user_full_name.charAt(0) :''}</Avatar> 
            }    
        </Link>           
            <div className="media-body">
                <div className="mb-10">
                    <p className="mb-2 text-base"><Link to={{ pathname: '/app/forum/user/activity/' + data.user_id }}  >
                        {data.user_full_name}</Link> <IntlMessages id="widgets.addedANewIdea" /> <Link to={{pathname: '/app/ideas/details/'+data.id }} >
                        <span className="text-primary font-weight-bold">{" "+data.title}</span> </Link>  {data.subject_name != null ? " for "+data.subject_name+" " : ""}
                    </p>
                    <span className="fs-12 text-muted">{timeAgo(data.created_at)}</span>
                </div>
                <div className="feed-content mb-10">
                <Link to={{pathname: '/app/ideas/details/'+data.id }} >
                    <a href="javascript:void(0)" onClick={viewFeedbackDetails}>{data.description}</a>
                </Link>
                </div>
                <div className={"social-action ideaAction"+data.id}>
                    <a href="javascript:void(0)" 
                     onClick={(e) => idea_action(e, 'likes' , data.id)}   >
                        <i className={data.user_likes == 1? "zmdi zmdi-favorite text-danger ideaLike": "zmdi zmdi-favorite ideaLike"} ></i>
                    </a>
                        <span className="tt-text ideaLikeCount">{data.likes_count}</span>
                    <Link to={{pathname: '/app/ideas/details/'+data.id }} >
                        <a href="javascript:void(0)"><i className="zmdi zmdi-mail-reply"></i></a>
                        </Link>
                </div>
                {data.replyBox &&
                    <InputGroup>
                        <Input placeholder="Reply..." />
                        <InputGroupAddon addonType="append"><Button color="primary" onClick={onReplySend}>Send</Button></InputGroupAddon>
                    </InputGroup>
                }
            </div>
        </div>
        <div className="list-action">
        <Link to={{pathname: '/app/ideas/details/'+data.id }} >
            <IconButton aria-label="eye">
                <i className="ti-eye"></i>
            </IconButton>
            </Link>
            {data.type == 0 && user_id() == data.user_id &&
                <IconButton aria-label="close" onClick={onDeleteFeedback}>
                    <i className="ti-close"></i>
                </IconButton>
            }
        </div>
    </li>
);

export default FeedbackListItem;
