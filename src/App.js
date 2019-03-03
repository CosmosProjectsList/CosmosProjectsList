import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import ex from './scripts/extentions'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      "projectList": []
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.projectListFetchTimer.bind(this), 15000);
    this.projectListFetchTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  projectListFetchTimer() {
    fetch("/api/confirmedProjects")
    .then(res => res.json())
    .then(body => {
      var arr=ex.json2array(body);
      if(!ex.jsonEqual(this.state.projectList, arr)){
        console.log("Found New Projects :)")
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

    return (
      <div className="App">
       <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="mt-5">
                {`Found ${this.state.projectList.length} Ecosystem Projects :)`}
                <br/>
                <br/>
              </h2>
            </div>
            
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">
          {this.state.projectList.map(function(project, index){
            return <div className="row" key={`${index + 1}`}>
            <div className="col-lg-1 text-center">
              <h6>{`${index + 1}.`}</h6>
            </div>
            <div className="col-lg-11 text-center">
              <Tile fileInfo={project} index={index + 1}/>
            </div>
            </div>;
          })}
          </div>
          </div>
        
      </div>
      </div>
    );
  }
}

export default App;
