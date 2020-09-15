

/**
 * Helpers Functions
 */
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import { isArray } from 'util';
import React, { Component } from 'react';
//Auth0
import Auth from '../Auth/Auth';
import $ from 'jquery';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import { Link } from 'react-router-dom';

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function inArray(needle, arr) {
    // is for loop so we can use this method on older browsers to render fallback message
    if (!arr) {
        return false;
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === needle) {
            return true;
        }
    }
    return false;
};

export function doesFileExist(urlToFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', urlToFile, false);
        xhr.send();
         
        if (xhr.status == "404") {
            return false;
        } else {
            return true;
        }
    }

 
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
    let time = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';
   // return moment.utc(time).fromNow();

    // return moment(timestamp).add(
    //                     moment(timestamp).utcOffset(), 
    //                     'minutes')
    //                     .utc()

    //return  moment(time).utcOffset();
    return moment(time).add( moment(time).utcOffset(), 'minutes').format(formatDate)
    
    ;
}

/**
 * Convert Date To Timestamp
*/
export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : 'YYYY-MM-DD';
    return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
    let location = url.pathname;
    let path = location.split('/');
    return path[1];
}


export function timeAgo(timestamp) {
    return moment.utc(timestamp).fromNow();
    return moment_timezone(timestamp).tz('UTC').fromNow();

    var a = moment(timestamp);
    var b = moment(timestamp).tz('UTC');
    return b // "a day ago"

    return  moment(timestamp).utc().format('YYYY-MM-DD HH:mm:ss');
    return moment(timestamp).tz('UTC +5').format("MM/DD hh:mm")
    return moment_timezone(timestamp).utc().fromNow();
    return moment_timezone(timestamp).tz('UTC').fromNow();
    return moment(timestamp).utc().format("MM/DD HH:mm")
    return 'aks'
   }
export function dateMonthsDiff(timestamp) {
    var months =  moment(moment()).diff(moment(timestamp), 'months', true)
    months=  months.toFixed(0)
    if (months <= 0) {
        return 1;
    }
    
    return months;
   return months.toFixed(0)
 
   }


export function checkPath(foldername) {

        var str1 = window.location.origin;
        var str2 = ":4000";
        if(str1.indexOf(str2) != -1){
            // return 'http://192.168.31.226/chameleon/public/upload/'+foldername+'/';
			return 'https://chameleon.love/sandbox/'+foldername+'/';
        } else {
            return 'https://chameleon.love/sandbox/public/upload/'+foldername+'/';
        }
   }  

 export function checkPaths(foldername) {

        var str1 = window.location.origin;
        var str2 = ":4000";
       // console.log(str1.indexOf(str2));
        if(str1.indexOf(str2) != -1){
            // return 'http://192.168.31.226/chameleon/'+foldername+'/';
			 return 'https://chameleon.love/sandbox/'+foldername+'/';
        } else {
            return 'https://chameleon.love/sandbox/'+foldername+'/';
        }
}    

export function hubCheckPaths(foldername) {

    var str1 = window.location.origin;
    var str2 = ":4000";
    if(str1.indexOf(str2) != -1){
        // return 'http://192.168.31.226/chameleon/'+foldername+'/';
		return 'https://chameleon.love/sandbox/'+foldername+'/';
    } else {
        return 'https://hubscure.co/chameleon/'+foldername+'/';
    }
}
export function pathForxml() {
    var str1 = window.location.origin;
    var str2 = ":4000";
    if(str1.indexOf(str2) != -1){
        // return 'http://192.168.31.226/chameleon/';
		return 'https://chameleon.love/sandbox/';
    } else {
        return 'https://chameleon.love/sandbox/';
    }
}    

export function get_plan_id_by_name(name) {

        var plan_array = {  'Classic':0  , 'Silver':1  , 'Gold':2 ,'Diamond':3 };
        if(plan_array[name]){
          return plan_array[name];
        }
        return 0;
}    
export function h_not_in_array(value,array){
    if(array){
        for(let i = 0; i < array.length; i++){
            if(array[i]  == value){
                return false ;
            }
        }
    }
    return true ;
}

export function getOsNamesByIds(daysArray , dayIdsString) {
    var finalNameArray = [];
    var idsArray = [];

    if(dayIdsString != 'undefined' || daysArray != 'undefined' || dayIdsStrings.length >0 ){
        idsArray  =  (dayIdsString.toString().indexOf(',') > -1) ? dayIdsString.toString().split(','):dayIdsString;
        if(isArray(idsArray)){
            for(let i = 0; i < idsArray.length; i++){
                if(daysArray[idsArray[i] - 1 ]){
                    if(typeof daysArray[idsArray[i] - 1] != 'undefined')
                    finalNameArray.push(daysArray[idsArray[i] - 1] ['value']);
                }
            }
        }else{
            if(typeof daysArray[idsArray - 1] != 'undefined'){
                finalNameArray.push(daysArray[idsArray - 1 ]['value']);
            }
            
            return finalNameArray.join(', ') 
        }
        return finalNameArray.join(', ') ;
    }
    return;
} 
export function getLanguageNamesByIds(daysArray , dayIdsString) {
    var finalNameArray = [];
    var idsArray = [];

    if(dayIdsString != 'undefined' || daysArray != 'undefined' || dayIdsStrings.length >0 ){
        idsArray  =  (dayIdsString.toString().indexOf(',') > -1) ? dayIdsString.toString().split(','):dayIdsString;
        if(isArray(idsArray)){
            for(let i = 0; i < idsArray.length; i++){
                if(daysArray[idsArray[i] - 1 ]){
                    if(typeof daysArray[idsArray[i] - 1] != 'undefined')
                    finalNameArray.push(daysArray[idsArray[i] - 1] ['name']);
                }
            }
        }else{
            if(typeof daysArray[idsArray - 1] != 'undefined'){
                finalNameArray.push(daysArray[idsArray - 1 ]['name']);
            }
            
            return finalNameArray.join(', ') 
        }
        return finalNameArray.join(', ') ;
    }
    return;
} 
export function get_lang_name_by_id( dataArray, id) {
  
        let lang_name = dataArray.map(item => {
            if (item.id == id ) {
               
                return item.name ;
            }
         });
    return lang_name ; 
}    


export function get_category_type_name_by_id( dataArray, id) {


        let lang_name = dataArray.map(item => {
            if (item.id == id ) {
              
                return item.value ;
               
            }
         });

    return lang_name ; 
}   

export function get_plan_name_by_id( dataArray, id) {
    let valuee = '';
        let lang_name = dataArray.map(item => {
            if (item.id == id ) {
                valuee = item.value ;
                return item.value ;
               
            }
         });

    return valuee ; 
}   

export function daysArray() {
    var array = {'0':'Sunday','1':'Monday','2':'Tuesday','3':'Wednesday','4':'Thursday','5':'Friday','6':'Saturday'}
    return array ;
}    
export function getDayNameByIds(daysArray , dayIdsString) {
    var finalNameArray = [];
    var idsArray = [];
    idsArray  =  dayIdsString.split(',');
    if(isArray(idsArray)){
        for(let i = 0; i < idsArray.length; i++){
            finalNameArray.push(daysArray[idsArray[i]]['value']);
        }
    }else{
        finalNameArray.push(daysArray[dayIdsString]['value']);
    }
    return finalNameArray.join(', ') ;
} 

export function get_player_url(url) {
    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
        var yt_id =   RegExp.$6;
         return '//www.youtube.com/embed/' + yt_id 
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
        var vimeo_id =  RegExp.$6;
        return '//player.vimeo.com/video/'+ vimeo_id;
    }else{
        return url;
    }
}

export function checkRoleAuth(){
    const userDetails = window.localStorage.getItem('user_id');
    const authUser = JSON.parse(userDetails);
    const auth = new Auth();
    if( authUser != null && authUser.role_id != 2){
        auth.logoutDirect(); 
    }
    if(authUser == null ){
        auth.logoutDirect(); 
    }
}

export function user_id(){
    const userDetails = window.localStorage.getItem('user_id');
    if(userDetails){
        const authUser = JSON.parse(userDetails);
        return authUser.id;
    }else{
        return 0;
    }
}


export function is_moderator(){
    const userDetails = window.localStorage.getItem('user_id');
    if(userDetails){
        const authUser = JSON.parse(userDetails);

        if(authUser.is_moderator==1){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

export function is_moderator_can_update(forum_id){
    const userDetails = window.localStorage.getItem('user_id');
    if(userDetails){
        const authUser = JSON.parse(userDetails);
        var idsArray = [];
       
        if(authUser.is_moderator==1){
            
            idsArray  =  (authUser.moderator_forums.toString().indexOf(',') > -1) ? authUser.moderator_forums.toString().split(','):authUser.moderator_forums;
            if(isArray(idsArray)){
                if($.inArray(forum_id ,idsArray ) ){
                    return true;
                }else{
                    return false;
                }
                
            }else{
               if(forum_id == idsArray){
                    return true;
               }else{
                    return false;
               }
            }
        }else{
            return false;
        }
    }else{
        return false;
    }
}




export function print_tr_id(amount ,payment_type , stripe_id , paypal_tx ){
    if(amount > 0){
       if(payment_type == 1){
            return stripe_id;
       }
       if(payment_type == 2){
        return paypal_tx;
       }
    }else{
        return 'Classic';
    }
}

export function get_icon_by_id(name) {
    var plan_array = {  1:'thumb_up', 2:'thumb_down',3:'favorite',4:'reply',7:'reply',8:'favorite',9:'highlight'};
    if(plan_array[name]){
      return plan_array[name];
    }
    return 0;
} 

export function notification_text(notification) {
    var notification_text ='';
    const regex = /(<([^>]+)>)/ig;
    if(notification != null  ){
       // console.log('notification',notification)
      
        switch(notification.notification_type) {
            case 1:
          
                if(notification.topic_id != null){
                    notification_text =  <Link to={{ pathname: '/app/forum/topic-details/' + notification.topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have liked Topic - '"+notification.title+"'"}</Link>;
                }else{
                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.comment_topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have liked Comment - '"+textTruncate( notification.comment_desc.replace(regex, ''), 50)+"'"}</Link>;
                    //notification_text = "'"+notification.user_full_name+"' have liked Comment - '"+textTruncate( notification.comment_desc.replace(regex, ''), 50)+"'";
                }
               
            break;
            case 2:
                if(notification.topic_id != null){
                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have disliked Topic - '"+notification.title+"'"}</Link>;
                }else{

                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.comment_topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have disliked Comment - '"+textTruncate( notification.comment_desc.replace(regex, ''), 50)+"'"}</Link>;
                }
              
            break;
            case 3: 
                if(notification.topic_id != null){
                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have marked favorite Topic - '"+notification.title+"'"}</Link>;
                }else{
                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.comment_topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have marked favorite Comment - '"+textTruncate( notification.comment_desc.replace(regex, ''), 50)+"'"}</Link>;
                }
            break;
            case 4:
                if(notification.topic_id != null){
                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have commented on Topic - '"+notification.title+"'"}</Link>;
                }else{
                    notification_text = <Link to={{ pathname: '/app/forum/topic-details/' + notification.comment_topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have commented on Comment - '"+textTruncate( notification.comment_desc.replace(regex, ''), 50)+"'"}</Link>;
                }
            break;
            case 5:
                notification_text = "'"+notification.user_full_name+"' have started following you";
        break;
            case 6:
                notification_text = <IntlMessages id={notification.badge_name} />+" has been assign to you.";
        break;
            case 7:
                notification_text = <Link to={{ pathname: '/app/ideas/details/' + notification.topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have commented on Idea - '"+notification.idea_title+"'"}</Link>;
        break;
            case 8:
                notification_text =  <Link to={{ pathname: '/app/ideas/details/' + notification.topic_id }} style={{color: '#727891'}}  >{"'"+notification.user_full_name+"' have liked Idea - '"+notification.idea_title+"'"}</Link>;
        break;
            default:
              break;
          }
    }
    return notification_text;
} 


export function is_valid_url(value) {
    var is_valid = false;
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if(value !== '' && value !== null ){
        is_valid = re.test(value);
    }
    return is_valid;
} 

export function  getFileType(file_name){
    // ".png,.jpeg,.gif,.jpg,.pdf,.docx,.zip,.rar,.ppt,.mp3"
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(file_name)[1]; 
    ext = ext.toLowerCase();
    if(ext == 'png' ||ext == 'jpeg' ||ext == 'gif' ||ext == 'jpg'  ){
        return 'image';
    }
    if(ext == 'pdf' ||ext == 'docx' ||ext == 'zip' ||ext == 'rar' ||ext == 'ppt' ){
        return 'file';
    }
    if(ext == 'mp3' ){
        return 'audio';
    }
}

export function  getFileExt(file_name){
    // ".png,.jpeg,.gif,.jpg,.pdf,.docx,.zip,.rar,.mp3"
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(file_name)[1];  
    return  ext.toLowerCase() ;
}

export function formatBytes(bytes,decimals) {

    if(bytes == 0 || bytes == "" || bytes == null) return '0 Bytes';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }

 
export function get_user_level(points) {
        var level = 0
        if(points > 0 ){
            level =  Math.floor(points/100)
        }
        return level;
 }


  
export function pagination_display(currentPage ,pagination, totalRecords) {
    var string = '';
    var one = '';
    var two = '';
    var three = totalRecords;

    if(currentPage == 1){
        one = currentPage;
    }
    if(currentPage > 1){
        one = (currentPage-1) * pagination ;
    }
    if(currentPage == 1){
        two = currentPage * pagination ;
    }
    if(currentPage > 1){
        two = currentPage * pagination ;
    }
    if(two > totalRecords){
        two = totalRecords;
    }
    return "("+one+"-"+two+" of "+three+")";
} 
