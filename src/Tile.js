import React, { Component } from 'react';
import axios from 'axios';
import ex from './scripts/extentions'
import './css/default.css';

class Tile extends Component {

  constructor(props){
    super(props)
    this.state = {
      "fileInfo": props.fileInfo,
      "index": props.index,
      "file": undefined
    }

    this.loadProjectDetails.bind(this);
  }

  componentDidMount() {
    this.loadProjectDetails()
  }

  loadProjectDetails() {
    var url = (this.state.fileInfo || {}).download_url;

    if(!url) {
      console.error("FileInfo Object was not defined.");
      return;
    }

    axios.get(url).then(res => { //fetch file list from github
      var file = res.data;
      if(!ex.jsonEqual(this.state.file, file)){
        console.log(`Loaded: ${file.name}`)
        this.setState({"file": file})
      }
    }).catch(err => {
      console.log(err);
      console.log(`Failed To Fetch Projects Details from '${url}' :(`);
    })
  }

  render() {

    if(!this.state.file){
      return (<div>Loading Project Details...</div>);
    }

    var id = this.state.index;

    return (
    <div>
    <div className="row">
        <div className="col-lg-3 text-center">
          <h5><a href={this.state.file.website} target="_blank" rel="noopener noreferrer">{this.state.file.name}</a></h5>
        </div>
        <div className="col-lg-3 text-center">
          {this.state.file.medium && <a href={this.state.file.medium} target="_blank" rel="noopener noreferrer"><i className="fa fa-medium social-glyph medium-colour"></i></a>}
          {this.state.file.twitter && <a href={this.state.file.twitter} target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter social-glyph twitter-colour"></i></a>}
          {this.state.file.telegram && <a href={this.state.file.telegram} target="_blank" rel="noopener noreferrer"><i className="fa fa-telegram social-glyph telegram-colour"></i></a>}
          {this.state.file.slack && <a href={this.state.file.slack} target="_blank" rel="noopener noreferrer"><i className="fa fa-slack social-glyph slack-colour"></i></a>}
          {this.state.file.linkedin && <a href={this.state.file.linkedin} target="_blank" rel="noopener noreferrer"><i className="fa fa-linkedin social-glyph linkedin-colour"></i></a>}
          {this.state.file.reddit && <a href={this.state.file.reddit} target="_blank" rel="noopener noreferrer"><i className="fa fa-reddit social-glyph reddit-colour"></i></a>}
          {this.state.file.github && <a href={this.state.file.github} target="_blank" rel="noopener noreferrer"><i className="fa fa-github social-glyph github-colour"></i></a>}
          {this.state.file.bitbucket && <a href={this.state.file.bitbucket} target="_blank" rel="noopener noreferrer"><i className="fa fa-bitbucket social-glyph bitbucket-colour"></i></a>}
          {this.state.file.chat && <a href={this.state.file.chat} target="_blank" rel="noopener noreferrer"><i className="fa fa-comment-o social-glyph"></i></a>}
          {this.state.file.facebook && <a href={this.state.file.facebook} target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook social-glyph facebook-colour"></i></a>}
          {this.state.file.whitepaper && <a href={this.state.file.whitepaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph whitepaper-colour"></i></a>}
          {this.state.file.lightpaper && <a href={this.state.file.lightpaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph lightpaper-colour"></i></a>}
          {this.state.file.yellowpaper && <a href={this.state.file.yellowpaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph yellowpaper-colour"></i></a>}
          {this.state.file.fundingpaper && <a href={this.state.file.fundingpaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph fundingpaper-colour"></i></a>}
          {this.state.file.email && <a href={this.state.file.email} target="_blank" rel="noopener noreferrer"><i className="fa fa-email social-glyph"></i></a>}
        </div>
        <div className="col-lg-2 text-center">
          <p>
            {this.state.file.description_long && <button className="btn btn-primary" type="button" data-toggle="collapse" data-target={`#collapseInfo${id}`} aria-expanded="false" aria-controls={`collapseInfo${id}`}>
              Details
            </button>}
          </p>
        </div>
        <div className="col-lg-2 text-center">
          <p>
            {this.state.file.proof && <button className="btn btn-primary" type="button" data-toggle="collapse" data-target={`#collapseProof${id}`} aria-expanded="false" aria-controls={`collapseProof${id}`}>
              Proof
            </button>}
          </p>
        </div>
      </div>
      {this.state.file.description && <div className="row">
        <div className="col-lg-12 text-center">
          <div className="card card-body">
            {this.state.file.description}
          </div>
      </div>
      </div>}
      {this.state.file.description_long && <div className="row">
        <div className="col-lg-12 text-center">
        <div className="collapse" id={`collapseInfo${id}`}>
          <div className="card card-body">
          {this.state.file.description_long.map(function(line, index) {
            return <p>{`${line}`} </p>
          })}
          </div>
        </div>
      </div>
      </div>}
      {this.state.file.proof && <div className="row">
        <div className="col-lg-12 text-center">
        <div className="collapse" id={`collapseProof${id}`}>
          <div className="card card-body">
          {this.state.file.proof.map(function(line, index) {
            return <p>{`${line}`} </p>
          })}
          </div>
        </div>
      </div>
      </div>}
    </div>);
  }
}

export default Tile;
