    /**
     * Sidebar Content
     */
    import React, { Component } from 'react';
    import List from '@material-ui/core/List';
    import ListSubheader from '@material-ui/core/ListSubheader';
    import { withRouter } from 'react-router-dom';
    import { connect } from 'react-redux';
    import { Link } from 'react-router-dom';
    import IntlMessages from 'Util/IntlMessages';
    import $ from 'jquery';
    import NavMenuItem from './NavMenuItem';

    import { get_plan_id_by_name  } from "Helpers/helpers";
    // redux actions
    import { onToggleMenu } from 'Actions';
    //api
    import api from 'Api';
    class SidebarContent extends Component {

        state = {
            navopen: false,
            userSubcriptions: null
        }
        toggleMenu(menu, stateCategory) {
            let data = {
                menu,
                stateCategory
            }
            this.props.onToggleMenu(data);
        }
        componentDidMount() {
        
        
            api.get('user-get-subscriptions', {
                params: {
                user_id: this.props.authUser.id
                }
            })
            .then((response) => {
            
                this.setState({ userSubcriptions: response.data });
                $('.custom-sub-menu').hide();
            })
            .catch(error => {
                console.log(error);
            })

        }
        toggleCustomMenu(liclass) {
            
            $('.allContent').removeClass('item-active');
            $('.custom-sub-menu').hide();
            
            if(this.state.navopen){
                this.setState({ navopen: false });
                $(liclass).closest('ul').find('.custom-sub-menu').hide();
                $(liclass).removeClass('item-active')
            }else{
                this.setState({ navopen: true });
                $(liclass).closest('ul').find('.custom-sub-menu').show()
                $(liclass).addClass('item-active')
            }
        }
        //for active on clcik custom menu
        toggleCustomMenuListClick(e,thisClass){
            $('.inner-menu-li').removeClass('item-active');
            $(thisClass).addClass('item-active');
        
        }
        render() {
            const { sidebarMenus } = this.props.sidebar;
            const { authUser } = this.props;
            return (
                <div className="rct-sidebar-nav">
                    <nav className="navigation">
                

                    <ul className="MuiList-root-1 MuiList-padding-2 rct-mainMenu p-0 m-0 list-unstyled">
                        <li className="MuiButtonBase-root-17 MuiListItem-root-5 MuiListItem-default-8 MuiListItem-gutters-13 MuiListItem-button-14" tabindex="0" role="button">
                            <Link to={{
                                pathname: '/app/user/user-profile-1',
                                state: { activeTab: 0,
                                user: authUser }
                            }}>
                                <div className="MuiListItemIcon-root-20 menu-icon"><i className="zmdi zmdi-accounts"></i><span className="menu" style={{marginLeft:'10px'}}><IntlMessages id="widgets.profile" /></span></div>
                                
                            
                            </Link>
                            <span className="MuiTouchRipple-root-128"></span>
                        </li>
                    </ul>


                        {/* <List
                            className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category1.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category1')}
                                />
                            ))}
                        </List>
                        */}
                        {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category2.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category2')}
                                />
                            ))}
                        </List>  */}
            
                    
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category3.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category3')}
                                />
                            ))}
                        </List>
                        <List className="rct-mainMenu p-0 m-0 list-unstyled" >
                            {sidebarMenus.category4.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category4')}
                                />
                            ))}
                        </List>
                        
    {this.state.userSubcriptions != null &&                        
        this.state.userSubcriptions.map((userSubcription, key) => (
                
        
    <ul className="MuiList-root-118 MuiList-padding-119 rct-mainMenu p-0 m-0 list-unstyled"   >

    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 list-item allContent content" + key} tabindex="0" role="button" onClick={() => this.toggleCustomMenu('.content'+key)}>
        <div className="MuiListItemIcon-root-134 menu-icon custome-menu-icon"><i className="zmdi zmdi-file-text"></i></div>
                    <span className="menu"><span>{<IntlMessages id="sidebar.content" />} {userSubcription.child_name}</span></span><span className="MuiTouchRipple-root-111"></span>
    </li>
    
    <div className="MuiCollapse-container-135 MuiCollapse-entered-136 sub-menu custom-sub-menu" >
        <div className="MuiCollapse-wrapper-137">
            <div className="MuiCollapse-wrapperInner-138">
                <ul className="MuiList-root-118 MuiList-padding-119 list-unstyled py-0">
                <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131  inner-menu-li PC"+userSubcription.id} tabindex="0" role="button"  onClick={(e) => this.toggleCustomMenuListClick(e,".PC"+userSubcription.id)} > 
                <Link to={{
                                pathname: '/app/content-manager/pc',
                                state: { 
                                    os_type: 1,
                                    os_name: 'PC',
                                    subs_id: userSubcription.id,
                                    subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                    child_name: userSubcription.child_name,
                                    login_user_id: this.props.authUser.id,
                                    browser_id: userSubcription.padmin_browser_id,
                                }
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.pc" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 inner-menu-li MAC"+userSubcription.id} tabindex="0" role="button" onClick={(e) => this.toggleCustomMenuListClick(e,".MAC"+userSubcription.id)}  > 
                <Link to={{
                                pathname: '/app/content-manager/macos',
                                state: { os_type: 2,
                                os_name: 'MAC OS',
                                subs_id: userSubcription.id,
                                subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                child_name: userSubcription.child_name, 
                                login_user_id: this.props.authUser.id,
                                browser_id: userSubcription.padmin_browser_id,
                            }
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.macos" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 inner-menu-li Linux"+userSubcription.id} tabindex="0" role="button" onClick={(e) => this.toggleCustomMenuListClick(e,".Linux"+userSubcription.id)}  > 
                <Link to={{
                                pathname: '/app/content-manager/linux',
                                state: { os_type: 3,
                                os_name: 'Linux',
                                subs_id: userSubcription.id,
                                subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                child_name: userSubcription.child_name, 
                                login_user_id: this.props.authUser.id,
                                browser_id: userSubcription.padmin_browser_id,}
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.linux" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 inner-menu-li Chrome"+userSubcription.id} tabindex="0" role="button" onClick={(e) => this.toggleCustomMenuListClick(e,".Chrome"+userSubcription.id)}  > 
                <Link to={{
                                pathname: '/app/content-manager/chromos',
                                state: { os_type: 4,
                                os_name: 'Chrome OS',
                                subs_id: userSubcription.id,
                                subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                child_name: userSubcription.child_name, 
                                login_user_id: this.props.authUser.id,
                                browser_id: userSubcription.padmin_browser_id,}
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.chromos" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 inner-menu-li Android"+userSubcription.id} tabindex="0" role="button" onClick={(e) => this.toggleCustomMenuListClick(e,".Android"+userSubcription.id)}  > 
                <Link to={{
                                pathname: '/app/content-manager/android',
                                state: { os_type: 5,
                                os_name: 'Android',
                                subs_id: userSubcription.id,
                                subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                child_name: userSubcription.child_name, 
                                login_user_id: this.props.authUser.id,
                                browser_id: userSubcription.padmin_browser_id,}
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.android" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 inner-menu-li Box"+userSubcription.id} tabindex="0" role="button" onClick={(e) => this.toggleCustomMenuListClick(e,".Box"+userSubcription.id)}  > 
                <Link to={{
                                pathname: '/app/content-manager/box',
                                state: { os_type: 7,
                                os_name: 'Box',
                                subs_id: userSubcription.id,
                                subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                child_name: userSubcription.child_name, 
                                login_user_id: this.props.authUser.id,
                                browser_id: userSubcription.padmin_browser_id,}
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.box" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                    <li className={"MuiButtonBase-root-69 MuiListItem-root-122 MuiListItem-default-125 MuiListItem-gutters-130 MuiListItem-button-131 inner-menu-li IOS"+userSubcription.id} tabindex="0" role="button" onClick={(e) => this.toggleCustomMenuListClick(e,".IOS"+userSubcription.id)} > 
                <Link to={{
                                pathname: '/app/content-manager/ios',
                                state: { os_type: 6,
                                os_name: 'IOS',
                                subs_id: userSubcription.id,
                                subs_type : get_plan_id_by_name(userSubcription.plan_name),
                                child_name: userSubcription.child_name,
                                login_user_id: this.props.authUser.id,
                                browser_id: userSubcription.padmin_browser_id, }
                            }}><span className="menu"><span>{<IntlMessages id="sidebar.ios" />}</span></span></Link><span className="MuiTouchRipple-root-111"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    </ul>
    ))}
                        {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category5.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category5')}
                                />
                            ))}
                        </List> */}
                    {/*   <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category6.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category6')}
                                />
                            ))}
                        </List> */}
                        {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category7.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category7')}
                                />
                            ))}
                        </List>  */}
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category8.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category8')}
                                />
                            ))}
                        </List>
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category9.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category9')}
                                />
                            ))}
                        </List>
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category10.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category10')}
                                />
                            ))}
                        </List>
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category11.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category11')}
                                />
                            ))}
                        </List>
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category12.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category12')}
                                />
                            ))}
                        </List>
                        <List className="rct-mainMenu p-0 m-0 list-unstyled">
                            {sidebarMenus.category13.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, 'category13')}
                                />
                            ))}
                        </List>
                    </nav>
                </div>
            );
        }
    }

    // map state to props
    const mapStateToProps = ({ sidebar }) => {
        return { sidebar };
    };

    export default withRouter(connect(mapStateToProps, {
        onToggleMenu
    })(SidebarContent));
