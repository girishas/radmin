// horizontal nav links
export default {
  
	category1: [
		{
			"menu_title": "sidebar.dashboard",
			"menu_icon": "zmdi zmdi-accounts-list-alt",
			"path": "/app/dashboard",
			"child_routes": null
		}	
	],

	category2: [
		{
			"menu_title": "sidebar.userManager",
			"menu_icon": "zmdi zmdi-accounts",
			"path": "/app/user/user-profile-1",
			"child_routes": null,
			"state": {"activeTab":0}

			 
		}	
	],
	category3: [
		{
			"menu_title": "sidebar.download",
		//	"menu_icon": "zmdi zmdi-download",
			"path": "/app/download",
			"child_routes": null
		}	
	],
	category4: [
		
		
				{
					"path": "/app/subscription/your",
                    "menu_title": "sidebar.subscription.yours",
                    "child_routes":null
				},
				{
					"path": "/app/subscription/expired",
                    "menu_title": "sidebar.subscription.expired",
                    "child_routes":null
				}
			
		
	],



	category5: [
		{
			"menu_title": "sidebar.projects.SupportAProject",
			//"menu_icon": "zmdi zmdi-view-agenda",
			"path": "/app/support-a-project",
			"child_routes": null
				
		},
		/* {
			"menu_title": "sidebar.ZacPCDonation",
			//"menu_icon": "zmdi zmdi-view-agenda",
			"path": "/app/zac-pc-donation",
			"child_routes": null
				
		}, */
		{
			"menu_title": "sidebar.top-supporters",
			//"menu_icon": "zmdi zmdi-group",
			"path": "/app/top-supporters",
			"child_routes": null
		}
	],
	/*category6: [
		{
			"menu_title": "sidebar.ZacPCDonation",
			//"menu_icon": "zmdi zmdi-view-agenda",
			"path": "",
			"child_routes": null
				
		}
	],
	category7: [
		{
			"menu_title": "sidebar.top-supporters",
			//"menu_icon": "zmdi zmdi-group",
			"path": "/app/top-supporters",
			"child_routes": null
		}	
	],
    
   /*
	category5: [
		{
			"menu_title": "sidebar.projects",
			"menu_icon": "zmdi zmdi-view-agenda",
			"child_routes": [
				{
					"path": "/app/projects",
					"menu_title": "sidebar.projects.SupportAProject"
				},
				{
					"path": "/app/fully-funded-projects",
					"menu_title": "sidebar.fullyFunded"
				}
			]
		},
	],*/
	
/*
	category6: [
		{
			"menu_title": "sidebar.ZacBox",
			"menu_icon": "zmdi zmdi-account-box-o",
			"child_routes": [
				{
					"path": "",
					"menu_title": "sidebar.ZacBox.Overview"
				},
				{
					"path": "",
					"menu_title": "components.buyNow"
				},
				{
					"path": "",
					"menu_title": "sidebar.ZacBox.CantAfford"
				},
				{
					"path": "",
					"menu_title": "sidebar.ZacBox.PayItForward"
				}
			]
		},
	],
*/
	

	category8: [
				{
				"menu_title": "sidebar.subscriptions",
				"menu_icon": "zmdi zmdi-ticket-star",
				"path": "/app/subscription/your",
				"child_routes": null
				},
			{
			"menu_title": "components.payment",
			"menu_icon": "zmdi zmdi-paypal-alt",
			"path": "/app/payment/purchase-history",
			"child_routes": null
		},
			
	],

	category9: [
		{
			"menu_title": "sidebar.blog",
			//"menu_icon": "zmdi zmdi-blogger",
			"path": "/app/blog",
			"child_routes": null
		},
		{
			"menu_title": "sidebar.changelogs",
			//"menu_icon": "zmdi zmdi-chart-donut",
			"path": "/app/changelogs",
			"child_routes": null
		}	,		
	],
	category10: [
		{
			"menu_title": "sidebar.changelogs",
			//"menu_icon": "zmdi zmdi-chart-donut",
			"path": "/app/changelogs",
			"child_routes": null
		}	
	],
	category11: [
		{
			"menu_title": "sidebar.support",
			//"menu_icon": "zmdi zmdi-group",
			"path": "/app/support",
			"child_routes": null
		}	
	],
	category12: [
		{
			"menu_title": "sidebar.LegalAgreements",
			// "menu_icon": "zmdi zmdi-book-image",
			"path": "/app/legal-agreements",
			"child_routes": null
		}	
	],
	category13: [
		
		{
			"path": "",
			"menu_title": "sidebar.instructions",
			"child_routes":null
		},
		{
			"path": "",
			"menu_title": "sidebar.FAQ",
			"child_routes":null
		},
		{
			"path": "/app/forum/topics",
			"menu_title": "sidebar.forums",
			"child_routes":null
		}
	],


	category14: [
		
		{
			"menu_title": "sidebar.changelogs",
			//"menu_icon": "zmdi zmdi-chart-donut",
			"path": "/app/changelogs",
			"child_routes": null
		}	,
		{
			"menu_title": "sidebar.LegalAgreements",
			// "menu_icon": "zmdi zmdi-book-image",
			"path": "/app/legal-agreements",
			"child_routes": null
		}	
		
	],

category15: [
		{
		"menu_title": "sidebar.subscriptions",
		"menu_icon": "zmdi zmdi-ticket-star",
		"path": "/app/subscription/your",
		"child_routes": null
		},
		{
			"menu_title": "components.payment",
			"menu_icon": "zmdi zmdi-paypal-alt",
			"path": "/app/payment/purchase-history",
			"child_routes": null
		},
	
	],
	

	// category2: [
	// 	{
	// 		"menu_title": "sidebar.transactions",
	// 		"menu_icon": "zmdi zmdi-paypal-alt",
	// 		"path": "/app/transactions",
	// 		"child_routes": null
	// 	}	
	// ],
	// category3: [
	// 	{
	// 		"menu_title": "sidebar.payIt",
	// 		"menu_icon": "zmdi zmdi-book-image",
	// 		"path": "/app/pay-it-forward",
	// 		"child_routes": null
	// 	}	
	// ],
	// category4: [
	// 	{
	// 		"menu_title": "sidebar.download",
	// 		"menu_icon": "zmdi zmdi-book-image",
	// 		"path": "/app/download",
	// 		"child_routes": null
	// 	}	
	// ],

	// category13: [
	// 	{
	// 		"menu_title": "page",
	// 		"menu_icon": "zmdi zmdi-book-image",
	// 		"path": "/app/page",
	// 		"child_routes": null
	// 	}	
	// ],

}
