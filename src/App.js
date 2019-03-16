import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import ex from './scripts/extentions'
import qs from 'query-string'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {

  constructor(props){
    super(props)
    var query = qs.parse(props.location.search);
    this.state = {
      "projectList": [],
      "query": query,
      "location": window.location,
      "isScrolled": false,
      "scrollRef": React.createRef()
    }

  }

  componentDidMount() {
    this.interval = setInterval(this.projectListFetchTimer.bind(this), 15000);
    this.projectListFetchTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    
  }

  projectListFetchTimer() {
    fetch("/api/confirmedProjects")
    .then(res => res.json())
    .then(body => {
      var arr=ex.json2array(body);
      if(!ex.jsonEqual(this.state.projectList, arr)){
        console.log("Found New Projects :)")

        //console.log(arr)
        arr.sort((a, b) => Number(b["like-hits"]) - Number(a["like-hits"]));
        //console.log(arr)

        this.setState({"projectList": arr})
      }
    }).catch(err => {
      console.log(err);
      console.log("projectListFetchTimer => Failed API Fetch :(");
    })
  }

  render() {
    if(!this.state.projectList || this.state.projectList.length <= 0){
      return (<div className="App">Loading...</div>);
    }

    var sharedProjectName = (this.state.query.share || "");
    var location = this.state.location;
    var scrollRef = this.state.scrollRef;

    return (
      <div className="App">
      <div className="page-background">
       <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center page-title">
              <h2 className="mt-5">
                {`Found ${this.state.projectList.length} Ecosystem Projects :)`}
                <br/>
                <br/>
              </h2>
            </div>
            
          </div>
          <div className="row tile-container">
            <div className="col-lg-12 text-center">
          {this.state.projectList.map(function(project, index){
            return <div className="row" key={`${index + 1}`}>
              <div className="col-lg-12 text-center" ref={(project.name || {}).replace(".json", "") === sharedProjectName ? scrollRef : undefined} >
                <Tile fileInfo={project} index={index + 1} isShared={(project.name || {}).replace(".json", "") === sharedProjectName} location={location} scrollRef={scrollRef}/>
              </div>
            </div>;
          })}
          </div>
          </div>
        
      </div>
      </div>
      <ToastContainer />
      </div>
    );
  }
}

export default App;
