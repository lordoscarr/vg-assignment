import React from 'react';
import './App.css';
import { Line, defaults } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';

class App extends React.Component {
  state = {
    data: {
      datasets: [{
        label: 'Bitcoin Value',
        backgroundColor: '#F7931A',
        borderColor: '#F7931A',
        fill: true,
        data: []
      }]
    },
    options: this.getOptions()
  }

  componentDidMount() {
    this.getData();
  }

  getOptions() {
    const timeFormat = 'MM/DD/YYYY HH:mm:ss';

    const options = {
      title: {
        text: 'BITCOIN',
        fontSize: 16,
        display: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          type: 'time',
          gridLines: {
            color: 'rgba(255,255,255,0.1)'
          },
          time: {
            parser: timeFormat,
            // round: 'day',
            tooltipFormat: 'MMM DD YYYY',
            displayFormats: {
              day: 'MMM DD',
              hour: 'MMM DD',
            }
          },
          scaleLabel: {
            display: false,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '$ USD'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.1)'
          },
          ticks: {
            beginAtZero: false,
          }
        }]
      },
      legend: {
        display: false
      }
    }
    return options;
  }

  getData() {
    axios.get("https://api.coindesk.com/v1/bpi/historical/close.json").then((result) => {
      let data = [];
      Object.entries(result.data.bpi).forEach((entry) => {
        let x = moment(entry[0]);
        let y = entry[1];
        data.push({ x: x, y: y });
      });

      this.setState({
        data: {
          datasets: [{
            label: 'Bitcoin Value',
            backgroundColor: 'rgba(247,147,26,.3)',
            borderColor: '#F7931A',
            fill: true,
            data: data
          }]
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }
  render() {
    defaults.global.defaultFontColor = '#fff';
    return (
      <div>
        <h1 className="titleHeader">DOLLAR - BITCOIN GRAPH</h1> 
        <Line data={this.state.data} options={this.state.options} />
      </div>
      );
  }
}

export default App;
