import React, { Component } from 'react';
import axios from 'axios';
import ex from './scripts/extentions'
import './css/default.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Tile extends Component {

  constructor(props){
    super(props)
    this.state = {
      "fileInfo": props.fileInfo,
      "index": props.index,
      "isShared": props.isShared,
      "file": undefined,
      "location": props.location || {},
      "scrollRef": props.scrollRef,
    }

    this.loadProjectDetails.bind(this);
    this.scrollTrigger.bind(this);
  }

  componentDidMount() {
    this.loadProjectDetails()
  }

  scrollTrigger() {
    ex.sleep(1500).then(() => {
      if(!!this.state.scrollRef.current && !!this.state.scrollRef.current.offsetTop) {
        window.scrollTo(0, this.state.scrollRef.current.offsetTop);
      }
    });
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
        //console.log(`Loaded: ${file.name}`)
        this.setState({"file": file})
      }

    }).catch(err => {
      console.log(err);
      console.log(`Failed To Fetch Projects Details from '${url}' :(`);
    }).then(() => {
      if(!!this.state.scrollRef){
        this.scrollTrigger();
      }
    })
  }

  render() {

    if(!this.state.file){
      return (<div>Loading Project Details...</div>);
    }

    var id = this.state.index;

    return (
    <div className={`tile-surround ${!!this.state.isShared ? "tile-surround-shared" : ""}`}>
    <div className="row">
        <div className="tile-number">
          <h6>{`${this.state.index}.`}</h6>
        </div>
        <div className="tile-name">
          <h5>
            <CopyToClipboard text={`${this.state.location.origin}?share=${encodeURI(this.state.fileInfo.name.slice(0,-5))}`} onCopy={() => { toast("Share link was copied!", { 
              autoClose: 1500, 
              className: "copy-notification",
              hideProgressBar: true
            
            }) 
              }}>
              <i className="fa fa-share-alt-square share-glyph"></i>  
            </CopyToClipboard>
          
            <a href={this.state.file.website} target="_blank" rel="noopener noreferrer">{this.state.file.name}</a>
            <a href={this.state.fileInfo.edit} target="_blank" rel="noopener noreferrer"><i className="fa fa-pencil-square-o edit-glyph"></i></a>
          </h5>
        </div>
        <div className="text-center tile-glyphs">
          {this.state.file.medium && <a href={this.state.file.medium} target="_blank" rel="noopener noreferrer"><i className="fa fa-medium social-glyph"></i></a>}
          {this.state.file.twitter && <a href={this.state.file.twitter} target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter social-glyph"></i></a>}
          {this.state.file.telegram && <a href={this.state.file.telegram} target="_blank" rel="noopener noreferrer"><i className="fa fa-telegram social-glyph"></i></a>}
          {this.state.file.slack && <a href={this.state.file.slack} target="_blank" rel="noopener noreferrer"><i className="fa fa-slack social-glyph"></i></a>}
          {this.state.file.linkedin && <a href={this.state.file.linkedin} target="_blank" rel="noopener noreferrer"><i className="fa fa-linkedin social-glyph"></i></a>}
          {this.state.file.reddit && <a href={this.state.file.reddit} target="_blank" rel="noopener noreferrer"><i className="fa fa-reddit social-glyph"></i></a>}
          {this.state.file.github && <a href={this.state.file.github} target="_blank" rel="noopener noreferrer"><i className="fa fa-github social-glyph"></i></a>}
          {this.state.file.bitbucket && <a href={this.state.file.bitbucket} target="_blank" rel="noopener noreferrer"><i className="fa fa-bitbucket social-glyph"></i></a>}
          {this.state.file.chat && <a href={this.state.file.chat} target="_blank" rel="noopener noreferrer"><i className="fa fa-comment-o social-glyph"></i></a>}
          {this.state.file.facebook && <a href={this.state.file.facebook} target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook social-glyph"></i></a>}
          {this.state.file.whitepaper && <a href={this.state.file.whitepaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph"></i></a>}
          {this.state.file.lightpaper && <a href={this.state.file.lightpaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph"></i></a>}
          {this.state.file.yellowpaper && <a href={this.state.file.yellowpaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph"></i></a>}
          {this.state.file.fundingpaper && <a href={this.state.file.fundingpaper} target="_blank" rel="noopener noreferrer"><i className="fa fa-file-o social-glyph"></i></a>}
          {this.state.file.email && <a href={`mailto:${this.state.file.email}`} target="_blank" rel="noopener noreferrer"><i className="fa fa-at social-glyph"></i></a>}
          {this.state.file.youtube && <a href={this.state.file.youtube} target="_blank" rel="noopener noreferrer"><i className="fa fa-youtube-play social-glyph"></i></a>}
          {this.state.file.gitlab && <a href={this.state.file.gitlab} target="_blank" rel="noopener noreferrer"><i className="fa fa-gitlab social-glyph"></i></a>}
        </div>
        <div className="tile-buttons">
          <p>
            {this.state.file.description_long && <button className="tile-button" type="button" data-toggle="collapse" data-target={`#collapseInfo${id}`} aria-expanded="false" aria-controls={`collapseInfo${id}`}>
              Details
            </button>}
          </p>
        </div>
        <div className="tile-buttons">
          <p>
            {this.state.file.proof && <button className="tile-button" type="button" data-toggle="collapse" data-target={`#collapseProof${id}`} aria-expanded="false" aria-controls={`collapseProof${id}`}>
              Proof
            </button>}
          </p>
        </div>
      </div>
      {this.state.file.description && <div className="row">
        <div className="col-lg-12 text-center">
          <div className="card card-body tile-text-area ">
            {this.state.file.description}
          </div>
      </div>
      </div>}
      {this.state.file.description_long && <div className="row">
        <div className="col-lg-12 text-center">
        <div className="collapse" id={`collapseInfo${id}`}>
          <div className="card card-body tile-text-area ">
          {this.state.file.description_long.map(function(line, index) {
            return <p key={`description-${id}-${index}`}>{`${line}`} </p>
          })}
          </div>
        </div>
      </div>
      </div>}
      {this.state.file.proof && <div className="row">
        <div className="col-lg-12 text-center">
        <div className="collapse" id={`collapseProof${id}`}>
          <div className="card card-body tile-text-area ">
          {this.state.file.proof.map(function(line, index) {
            return <p key={`proof-${id}-${index}`}>{`${line}`} </p>
          })}
          </div>
        </div>
      </div>
      </div>}
      
    </div>);
  }
}

export default Tile;
