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
    options: this.getOptions(),
    value: 'Fetching...',
    error: undefined
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
      let latestval = 0;
      Object.entries(result.data.bpi).forEach((entry) => {
        let x = moment(entry[0]);
        let y = entry[1];
        latestval = y;
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
        },
        value: '1 BTC = ' + latestval + ' USD',
        error: undefined
      });
    }).catch((error) => {
      this.setState({error: error});
      console.log(error);
    });
  }
  render() {
    defaults.global.defaultFontColor = '#fff';
    return (
      <div>
        <h1 className="titleHeader">DOLLAR - BITCOIN GRAPH</h1>
        <p className="todayText">Today</p>
        <h3 className="currentValue">{this.state.value}</h3>
        <p className="errorMessage">{this.state.error}</p>
        <Line data={this.state.data} options={this.state.options} />
      </div>
      );
  }
}

export default App;
