// routes
/*import Widgets from 'Routes/widgets';
import Pages from 'Routes/pages';
import AdvanceUIComponents from 'Routes/advance-ui-components';
import CalendarComponents from 'Routes/calendar';
import ChartsComponents from 'Routes/charts';
import FormElements from 'Routes/forms';
import Components from 'Routes/components';
import Tables from 'Routes/tables';
import Icons from 'Routes/icons';
import Maps from 'Routes/maps';
import DragAndDrop from 'Routes/drag-drop';
import Editor from 'Routes/editor';
import ImageCropper from 'Routes/image-cropper';
import VideoPlayer from 'Routes/video-player';
import Dropzone from 'Routes/dropzone';
import Translation from 'Routes/translations';
import Project from 'Routes/projects';
import Product from 'Routes/products';
import Blog from 'Routes/blogs';
import Client from 'Routes/clients';
import Partner from 'Routes/partners';
import Testimonial from 'Routes/testimonials';
import Category from 'Routes/categories';
import Campaign from 'Routes/campaigns';
import Team from 'Routes/teams';
import Image from 'Routes/imagemanager';
import Content from 'Routes/content-manager';
import Changelog from 'Routes/changelogs';*/



import PayItForward from 'Routes/pay-it-forward';
import Download from 'Routes/download';
import Ecommerce from 'Routes/ecommerce';
import Dashboard from 'Routes/dashboard';
import Users from 'Routes/users';
import User from 'Routes/user';
//import Support from 'Routes/support';
import Pages from 'Routes/pages';

import Transaction from 'Routes/transactions';
import Subscription from 'Routes/subscription/your'; 
import EXSubscription from 'Routes/subscription/expired'; 
import invoice from 'Routes/subscription/invoice'; 
import Upgrade from 'Routes/subscription/upgrade'; 

import Contentpc from 'Routes/content-manager/pc';
import AppPage from 'Routes/subscription/app-page';
import AppPageInstall from 'Routes/subscription/app-page/install';
import AppPageFriendlyname from 'Routes/subscription/app-page/friendlyname';
import PurchaseApp from 'Routes/subscription/app-page/purchase';
import installWeb from 'Routes/subscription/app-page/installweb';

import Changelogs from 'Routes/changelogs';
import Notifications from 'Routes/notifications';
import Blog from 'Routes/blogs';
import Legal from 'Routes/legal';
import SupportAProject from 'Routes/support-a-project';
import ZacPCDonation from 'Routes/zac-pc-donation';
import TopSupporters from 'Routes/top-supporters';
import Donation from 'Routes/payment/donation';
import PurchaseHistory from 'Routes/payment/purchase';
import Donate from 'Routes/donate';

import Projects from 'Routes/projects';
import fullyFundedProjects from 'Routes/fully-funded-projects';
import Page from 'Routes/page';

//forum pages routes start
import Forum from 'Routes/forum';
import Topic from 'Routes/forum/topics/list.js';
import TopicDetails from 'Routes/forum/topics/details.js';
import TopicAdd from 'Routes/forum/topics/add.js';
import TopicUpdate from 'Routes/forum/topics/update.js';
import ForumCats from 'Routes/forum/categories/list.js';
import ForumCatsDetails from 'Routes/forum/categories/details.js';
	// user section
	import UserActivity from 'Routes/forum/user/activity';
	import UserThreads from 'Routes/forum/user/threads';
	import UserReplies from 'Routes/forum/user/replies';
	import UserFollowers from 'Routes/forum/user/followers';
	import UserFollowing from 'Routes/forum/user/following';
	import UserForums from 'Routes/forum/user/forums';
	import UserIdeas from 'Routes/forum/user/ideas';

import IdeasIncubator from 'Routes/ideas-incubator';
import IdeasIncubatorDetails from 'Routes/ideas-incubator/detail';
// async component
import {
	AsyncAboutUsComponent,
	AsyncChatComponent,
	AsyncMailComponent,
	AsyncTodoComponent,
} from 'Components/AsyncComponent/AsyncComponent';

export default [
	{
		path: 'dashboard',
		component: Dashboard
	},
	
	{
		path: 'ecommerce',
		component: Ecommerce
	},
	
	{
		path: 'users',
		component: Users
	},

	{
		path: 'user',
		component: User
	},
	
	{
		path: 'pay-it-forward',
		component: PayItForward
	},
	{
		path: 'download',
		component: Download
	},
	{
		path: 'transactions',
		component: Transaction
	},
	{
		path: 'subscription/your',
		component: Subscription
	},
	{
		path: 'subscription/expired',
		component: EXSubscription
	},
	
	{
		path: 'support',
		component: AsyncChatComponent
	},
	{
		path: 'about-us',
		component: AsyncAboutUsComponent
	},
	{
		path: 'pages',
		component: Pages
	},
	{
		path: 'changelogs',
		component: Changelogs
	},
	{
		path: 'notifications',
		component: Notifications
	},
	{
		path: 'blog',
		component: Blog
	},
	{
		path: 'subscription/invoice',
		component: invoice
	},
	{
		path: 'subscription/upgrade',
		component: Upgrade
	},
	{
		path: 'payment/purchase-history',
		component: PurchaseHistory
	},
	{
		path: 'payment/donation-history',
		component: Donation
	},
	{
		path: 'donate',
		component: Donate
	},
	{
		path: 'legal-agreements',
		component: Legal
	},
	{
		path: 'support-a-project',
		component: SupportAProject
	},
	{
		path: 'zac-pc-donation',
		component: ZacPCDonation
	},
	{
		path: 'top-supporters',
		component: TopSupporters
	},
	{
		path: 'projects',
		component: Projects
	},
	{
		path: 'fully-funded-projects',
		component: fullyFundedProjects
	},

	{
		path: 'content-manager/pc',
		component: Contentpc
	},
	{
		path: 'content-manager/macos',
		component: Contentpc
	},
	{
		path: 'content-manager/linux',
		component: Contentpc
	},
	{
		path: 'content-manager/chromos',
		component: Contentpc
	},
	{
		path: 'content-manager/android',
		component: Contentpc
	},
	{
		path: 'content-manager/box',
		component: Contentpc
	},
	{
		path: 'content-manager/ios',
		component: Contentpc
	},
	
	{
		path: 'page',
		component: Page
	},
	{
		path: 'forum',
		component: Forum
	},
	{
		path: 'forum/topics',
		component: Topic
	},
	{
		path: 'forum/topic-details',
		component: TopicDetails
	},
	{
		path: 'forum/add-topic',
		component: TopicAdd
	},
	{
		path: 'forum/update-topic',
		component: TopicUpdate
	},
	{
		path: 'forum/forums',
		component: ForumCats
	},
	{
		path: 'forum/details',
		component: ForumCatsDetails
	},
	// user section
	// {
	// 	path: 'forum/user',
	// 	component: userHead
	// },
	{
		path: 'forum/user/activity',
		component: UserActivity
	},
	{
		path: 'forum/user/topics',
		component: UserThreads
	},
	{
		path: 'forum/user/replies',
		component: UserReplies
	},
	{
		path: 'forum/user/followers',
		component: UserFollowers
	},
	{
		path: 'forum/user/following',
		component: UserFollowing
	},
	{
		path: 'forum/user/forums',
		component: UserForums
	},
	{
		path: 'forum/user/ideas',
		component: UserIdeas
	},
	{
		path: 'subscription/app-page',
		component: AppPage
	},
	{
		path: 'subscription/install',
		component: AppPageInstall
	},
	{
		path: 'subscription/friendlyname',
		component: AppPageFriendlyname
	},
	{
		path: 'subscription/installweb',
		component: installWeb
	},
	{
		path: 'subscription/purchase',
		component: PurchaseApp
	},
	{
		path: 'ideas-incubator',
		component: IdeasIncubator
	},
	{
		path: 'ideas/details',
		component: IdeasIncubatorDetails
	}




]