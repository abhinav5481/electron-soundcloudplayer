import React from 'react'
import ReactDOM from 'react-dom'
import ProgressSoundPlayer from './components/ProgressSoundPlayer'
import SC from 'node-soundcloud'

import Spinner from 'react-spinkit';

const { Component } = React;

var client_id = 'your soundcloud api key';

SC.init({
  id: client_id
});

var main = document.getElementById('main');


class Main extends Component {

	constructor(props){
		super(props)

		this.state = {
			query: '',
			hasResults: false,
			searchResults: [],
			isLoading: false
		}

		this.handleTextChange = this.handleTextChange.bind(this);
		this.search = this.search.bind(this);
		this.renderSearchResults = this.renderSearchResults.bind(this);
		this.renderNoSearchResults = this.renderNoSearchResults.bind(this);
		this.renderPlayer = this.renderPlayer.bind(this);
	}

	handleTextChange(event){
		this.setState({
			query: event.target.value
		});
	}

	search(){
		
		this.setState({
			isLoading: true
		});

		SC.get('/tracks', {
		    q: this.state.query,
		    embeddable_by: 'all'
		  }, (err, tracks) => {
		  	if(!err){
		    	
		    	this.setState({
		    		hasResults: true,
		    		searchResults: tracks,
		    		isLoading: false
		 	   	});
			}
		});

	}

	render(){
		return (
			<div>
				<h1>Electron SoundCloud Player</h1>
				<input type="search" onChange={this.handleTextChange} className="search-field" placeholder="Enter song name or artist..." />
				<button className="search-button" onClick={this.search}>Search</button>
				{this.state.isLoading && <Spinner spinnerName='three-bounce' />}
				{this.state.hasResults && !this.state.isLoading ? this.renderSearchResults() : this.renderNoSearchResults()}
			</div>
		);
	}

	renderNoSearchResults(){
		return (
			<div id="no-results"></div>
		);
	}

	renderSearchResults(){
		return (
			<div id="search-results">
				{this.state.searchResults.map(this.renderPlayer, this)}
			</div>
		);
	}

	renderPlayer(track){

		return (
			<ProgressSoundPlayer key={track.id} clientId={client_id} resolveUrl={track.permalink_url} />
		);
	}
}

ReactDOM.render(<Main />, main);
