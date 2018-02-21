import React, { Component } from 'react';
import api from 'redux-rest-fetcher';
import moment from 'moment';

import Chart from './Chart';

const Aux = props => props.children;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coinList: ['-'],
      selectedCoin: undefined,
      lowDate: moment().format('YYYY-MM-DD'),
      highDate: moment().format('YYYY-MM-DD'),
      coinData: { Data: undefined },
    };
  }
  componentDidMount() {
    api
      .coin_list()
      .then((r) => {
        if (r.status === 200 || r.ok) {
          return r.json();
        }
        return [];
      })
      .then((j) => {
        let { coinList } = this.state;
        coinList = coinList.concat(j);
        this.setState({ coinList });
      });
  }

  changeCoin = (event) => {
    this.setState({ selectedCoin: event.target.value });
  };
  dateLowChange = (event) => {
    const { highDate } = this.state;
    const ld = moment(event.target.value);
    const hd = moment(highDate);
    if (ld.isBefore(hd)) {
      this.setState({ lowDate: event.target.value });
    } else {
      this.setState({ lowDate: hd.subtract(1, 'days').format('YYYY-MM-DD') });
    }
  };
  dateHighChange = (event) => {
    const { lowDate } = this.state;
    const ld = moment(lowDate);
    const hd = moment(event.target.value);
    if (ld.isBefore(hd)) {
      this.setState({ highDate: event.target.value });
    } else {
      this.setState({ highDate: ld.add(1, 'days').format('YYYY-MM-DD') });
    }
  };

  toTheMoon = () => {
    const { selectedCoin, lowDate, highDate } = this.state;
    const ts = moment(lowDate).valueOf();
    const limit = moment(highDate).diff(moment(lowDate), 'days');
    api
      .historical({
        GET: {
          fsym: selectedCoin,
          tsym: 'EUR',
          e: 'CCCAGG',
          ts,
          limit,
        },
      })
      .then((r) => {
        if (r.status === 200 || r.ok) {
          return r.json();
        }
        return [];
      })
      .then((j) => {
        this.setState({ coinData: j });
      });
  };

  render() {
    console.log(this);
    const {
      coinList,
      selectedCoin,
      lowDate,
      highDate,
      coinData: { Data = undefined },
    } = this.state;
    return (
      <Aux>
        <div>
          <div>
            <input value={lowDate} type="date" onChange={this.dateLowChange} />
            <input value={highDate} type="date" onChange={this.dateHighChange} />
          </div>
          <select style={{ width: '100%' }} onChange={this.changeCoin} value={selectedCoin}>
            {coinList.map(e => (
              <option key={`option_value_${e}`} value={e}>
                {e}
              </option>
            ))}
          </select>
          <button style={{ width: '100%', margin: 0 }} onClick={this.toTheMoon}>
            To the moon
          </button>
        </div>
        <Chart data={Data} />
      </Aux>
    );
  }
}

export default Main;
