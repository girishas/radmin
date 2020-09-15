import axios from 'axios';
import {user_id} from "Helpers/helpers";

export default
axios.create({	

	  // baseURL: 'https://chameleon.love/api',
	// baseURL: 'https://chameleon.love/sandbox/api',
	 // baseURL: 'http://192.168.31.226/chameleon/api',
	 // baseURL: 'http://192.168.31.169/chameleon/api',
	  baseURL: 'http://192.168.43.245/chameleon/api',
	timeout: 1000000,
	//headers: {'User-Id':user_id()},
	
 });