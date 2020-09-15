/**
 * Search Ideas
 */
import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

// actions
import { updateSearchIdeas, onSearchIdeas, showFeedbackLoadingIndicator } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

class SearchIdeas extends Component {

    /**
     * On Search Idea
     */
    onUpdateSearchIdeas(e) {
        this.props.updateSearchIdeas(e.target.value);
    }

    /**
     * On Search Ideas
     */
    onSearchIdeas() {
        this.props.showFeedbackLoadingIndicator();
        const { searchIdeaText } = this.props;
        let self = this;
        setTimeout(() => {
            self.props.onSearchIdeas(searchIdeaText);
        }, 1500);



    }
    handleSearch(event) {
        this.props.searchIdeas(event.target.value)
      }

    render() {
        const { searchIdeaText } = this.props;
        return (
            <RctCollapsibleCard >
               
                    <div className="row">
                        <div className="col-md-5 alignitemCenter" style={{  alignItem:"center"  }}>
                        <div class="page-title "><h2 ><span><IntlMessages id="sidebar.ideasIncubator" /></span></h2></div>
                            </div>
                        <div className="col-md-7" style={{marginTop:"2%"}}>
                        <FormGroup className="">
                            <div className="row">
                        <div className="col-md-4">
                        <h2 className="heading" style={{marginBottom:"10%",marginTop:"5%"}} ><IntlMessages id="widgets.searchIdeas" /></h2>
                        </div>
                        <div className="col-md-8">
                            <Input
                            className="search_input"
                                type="text"
                                name="search"
                                onKeyUp={this.handleSearch.bind(this)}
                            //  onChange={(e) => this.onUpdateSearchIdeas(e)}
                                //value={searchIdeaText}
                            />
                            </div>
                            </div>
                        </FormGroup>

                        </div>
                      
                    </div>
                    {/* <Button variant="raised" className="btn-primary text-white" onClick={() => this.onUpdateSearchIdeas()}>Search</Button> */}
               
            </RctCollapsibleCard>
        );
    }
}

// map state to props
const mapStateToProps = ({ feedback }) => {
    return feedback;
}

export default connect(mapStateToProps, {
    updateSearchIdeas,
    onSearchIdeas,
    showFeedbackLoadingIndicator
})(SearchIdeas);
