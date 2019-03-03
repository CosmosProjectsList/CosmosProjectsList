import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      projectList: []
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.projectListFetchTimer.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  projectListFetchTimer() {
    fetch("/api/confirmedProjects")
    .then(res => res.json())
    .then(body => {
      console.log(body);
    }).catch(err => {
      console.log(err);
      console.log("projectListFetchTimer => Failed API Fetch :(");
    })
  }

  render() {
    return (
      <div className="App">
        Stay Tuned, Projects List Is Comming...
      </div>
    );
  }
}

export default App;
