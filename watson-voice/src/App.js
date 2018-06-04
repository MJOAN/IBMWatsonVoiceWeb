import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
  constructor() {
    super()
      this.state = {}
  } 
  
  listenOnClick() {

    fetch('https://localhost:3002/api/speech-to-text/token')
      .then((response) => {
          return response.text();

      }).then((token) => {
        console.log('token', token)

        var stream = recognizeMic({
            token: token,
            objectMode: true, // send objects instead of text
            extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
            format: false // optional - performs basic formatting on the results such as capitals an periods
        });
        
        stream.on('data', (data) => {
          this.setState({
            text: data.alternatives[0].transcript
          })
        });

        stream.on('error', function(err) {
            console.log(err);
        });

        document.querySelector('#stop').onclick = stream.stop.bind(stream);
      
      }).catch(function(error) {
          console.log("fetch query catch error: ", error);
      });    
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">IBM Watson Text to Speech API</h1>
          <h2 className="App-title">Start speaking and see magic happen!</h2>
        </header>    

        <button id="button" onClick={this.listenOnClick.bind(this)}>Start microphone listening!</button>
        <h2>Transcript:</h2>
        <div className={{fontSize: '40px'}}>{this.state.text}</div>
      </div>
    );
  }
}

export default App;