/**
* Feedback Page
*/
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Helmet } from "react-helmet";
// components
import FeedbacksListing from './components/FeedbacksListings';
import AddNewFeedback from './components/AddNewFeedback';
import FeedbackDetail from './components/FeedbackDetail';
import SearchIdeas from './components/SearchIdeas';
import Search from './components/SearchBar';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { hubCheckPaths , user_id } from "Helpers/helpers";
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// actions
import { onChangeFeedbackPageTabs, getFeedbacks } from 'Actions';
import api from 'Api';
// For Tab Content
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class FeedbackPage extends Component {
  constructor() {
		super();
		this.state = {
			selectedTab: 1,
      loading:false,
      selectedFeedback:null,
      newIdeasCount:"",
      plannedIdeasCount:"",
      progressIdeasCount:"",
      completedIdeasCount:"",
      totalIdeasCount :"",
      ideas:[],
      subjects:[]
		};
	}


  getInfo() {
    api.get('forum/get_ideas', {
      params: {
        user_id:user_id(),
      },headers: {'User-Id':user_id()}
    }).then((response) => {
            const ideas =  response.data.ideas;
            const subjects =  response.data.subjects;
            const plannedIdeasCount =  response.data.plannedIdeasCount;
            const newIdeasCount =  response.data.newIdeasCount;
            const progressIdeasCount =  response.data.progressIdeasCount;
            const completedIdeasCount =  response.data.completedIdeasCount;
            const totalIdeasCount =  response.data.totalIdeasCount;

            this.setState({
              subjects:subjects,
              ideas:ideas,
              newIdeasCount:newIdeasCount,
              plannedIdeasCount:plannedIdeasCount,
              progressIdeasCount:progressIdeasCount,
              completedIdeasCount:completedIdeasCount,
              totalIdeasCount:totalIdeasCount
          });

  
       })
       .catch(error => {
          // error hanlding
       })
 }


//  componentDidMount() {
//    this.getInfo();
//  }

  componentWillMount() {
    this.getInfo();
  //  this.props.getFeedbacks();
  }

  handleChange = (event, value) => {
    this.setState({ selectedTab: value });
   // this.props.onChangeFeedbackPageTabs(value);
  }

  
  searchIdeas(query){
    
    const { ideas } = this.state;
     let currentList =null;
     let newList = null;

      if (query !== "") {
        
        currentList = ideas;
        newList = currentList.filter(item => {
            return item.title.toLowerCase().includes(query.toLowerCase()) 
          });
      } else {
        newList = this.state.ideas;
      }
      this.setState({
        results: newList,
        search:query
      });
  }

  render() {
    const { selectedTab, selectedFeedback, loading,newIdeasCount ,
      plannedIdeasCount, progressIdeasCount,completedIdeasCount ,totalIdeasCount ,ideas,search,results,subjects } = this.state;

      let filteredResult;
      if(search){
         filteredResult = results;
      }else{
         filteredResult = ideas;
      }

    return (
      <div  className="feedback-wrapper container" >
       <Helmet>
                     <title>Chameleon | Idea Incubator </title>
                     <meta name="description" content="Chameleon |" />
                  </Helmet>
         {/* <PageTitleBar title={<IntlMessages id="sidebar.ideasIncubator" />} match={this.props.match} /> */}
        {selectedFeedback === null ?
          <div>
               {/* <Search searchIdeas={this.searchIdeas.bind(this)}/> */}
            <SearchIdeas searchIdeas={this.searchIdeas.bind(this)}/>
            <RctCollapsibleCard customClasses="rct-tabs">
              {loading &&
                <div className="d-flex justify-content-center loader-overlay">
                  <CircularProgress />
                </div>
              }
              <AppBar position="static">
                <Tabs
                  value={selectedTab}
                  onChange={this.handleChange}
                
                  scrollButtons="off"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label={`All (${totalIdeasCount})`} />
                  <Tab label={`Ideas (${newIdeasCount})`} />
                  <Tab label={`Planned (${plannedIdeasCount})`} />
                  <Tab label={`In Progress (${progressIdeasCount})`} />
                  <Tab label={`Completed (${completedIdeasCount})`} />
                  <Tab label="Add New" className="btn-round btn-sm btn btn-primary text-white" />
                </Tabs>
              </AppBar>
              {selectedTab === 0 && <TabContainer><FeedbacksListing ideas={filteredResult} type={"all"}/></TabContainer>}
              {selectedTab === 1 && <TabContainer><FeedbacksListing ideas={filteredResult} type={0}/></TabContainer>}
              {selectedTab === 2 && <TabContainer><FeedbacksListing ideas={filteredResult} type={2}/></TabContainer>}
              {selectedTab === 3 && <TabContainer><FeedbacksListing ideas={filteredResult} type={1}/></TabContainer>}
              {selectedTab === 4 && <TabContainer><FeedbacksListing ideas={filteredResult} type={3}/></TabContainer>}
              {selectedTab === 5 &&
                <TabContainer>
                  <AddNewFeedback   subjects={subjects}/>
                </TabContainer>}
            </RctCollapsibleCard>
          </div>
          : <FeedbackDetail />
        }
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ ideas }) => {
  return ideas;
}

export default connect(mapStateToProps, {
  onChangeFeedbackPageTabs,
  getFeedbacks
})(FeedbackPage);
