/**
	* App Config File
*/
localStorage.setItem("current_lang", 'en');
const AppConfig = {
	live:true,
    appLogo: require('Assets/img/site-logo.png'),          // App Logo
    brandName: 'Chameleon',                                    // Brand Name
    navCollapsed: false,                                      // Sidebar collapse
    darkMode: false,                                          // Dark Mode
    boxLayout: false,                                         // Box Layout
    rtlLayout: false,                                         // RTL Layout
    miniSidebar: false,                                       // Mini Sidebar
    enableSidebarBackgroundImage: true,                      // Enable Sidebar Background Image
    sidebarImage: require('Assets/img/sidebar-4.jpg'),     // Select sidebar image
    isDarkSidenav: true,                                   // Set true to dark sidebar
    enableThemeOptions: false,                              // Enable Theme Options
    locale: {
        languageId: 'english',
        locale: 'en',
        name: 'English',
        icon: 'en',
	},
    enableUserTour: process.env.NODE_ENV === 'production' ? false : false,  // Enable / Disable User Tour
    copyRightText1: '©'+new Date().getFullYear()+' Created with ',
	copyRightText2:' by People CD, Inc.  All rights reserved.',      // Copy Right Text
    // light theme colors
    themeColors: {
        'primary': '#5D92F4',
        'secondary': '#677080',
        'success': '#00D014',
        'danger': '#FF3739',
        'warning': '#FFB70F',
        'info': '#00D0BD',
        'dark': '#464D69',
        'default': '#FAFAFA',
        'greyLighten': '#A5A7B2',
        'grey': '#677080',
        'white': '#FFFFFF',
        'purple': '#896BD6',
        'yellow': '#D46B08'
	},
    // dark theme colors
    darkThemeColors: {
        darkBgColor: '#424242'
	},
	
    paginate: 10,
 
    front_web_url : 'https://zacbrowser.com/',
    //front_web_url : 'http://192.168.31.226/zacbrowser/',
    
	chameleon_web_url : 'https://chameleon.love/',
    //chameleon_web_url : 'http://192.168.31.226/chameleon/',

    chameleon_web_admin_url : 'https://chameleon.love/admin',
    // chameleon_web_admin_url : 'http://192.168.31.169:4000/',

    os_types_array : [ 
        {'id':1, value:'Pc'},
        {'id':2, value:'MacOs'},
        {'id':3, value:'Linux'},
        {'id':4, value:'Chrome'},
        {'id':5, value:'Android'},
        {'id':6, value:'Ios'},
        {'id':7, value:'Box'}
	],
	
	plans_array : [ 
        {'id':0, value:'Classic'},
        {'id':1, value:'Silver'},
        {'id':2, value:'Gold'},
        {'id':3, value:'Diamond'},
        
    ],

    plans_monthly_array : [ 
        {'id':0, value:'Classic'},
        {'id':1, value:'Zac Browser Silver (monthly)'},
        {'id':2, value:'Zac Browser Gold (monthly)'},
        {'id':3, value:'Zac Browser Diamond (monthly)'},
        
    ],

    plans_year_array : [ 
        {'id':0, value:'Classic'},
        {'id':1, value:'Zac Browser Silver (yearly)'},
        {'id':2, value:'Zac Browser Gold (yearly)'},
        {'id':3, value:'Zac Browser Diamond (yearly)'},
        
	],
    
    plan_price_array : [ 
        {'id':0, value:'0.00'},
        {'id':1, value:'4.99'},
        {'id':2, value:'14.99'},
        {'id':3, value:'24.99'},
	],
	
	plan_price_year_array : [ 
        {'id':0, value:'0.00'},
        {'id':1, value:'49.99'},
        {'id':2, value:'149.99'},
        {'id':3, value:'249.99'},
	],
	
    category_type_array:  [ 
        {'id':1, value:'Menu'},
        {'id':2, value:'Url'},
    ],
    
   
    PLAN_ID :{'1':'plan_Fn39mOP1QBX2Qk','2':'plan_Fn3C2VgWxjl0sT','3':'plan_Fn3De3xdok4Mx7'},
    PLAN_ID_YEAR :{'1':'plan_Fn3GW1hTxABwUp','2':'plan_Fn3IGfKGfONOw1','3':'plan_Fn3K0tsD9HSIts'},

    STRIPE_KEY:"pk_test_3Kktp6mQ9b9cZKiLDOHwTWTl"
    //STRIPE_KEY:"pk_live_uExywcBBfTI3fcgYVuBFZU4x"
}

export default AppConfig;
