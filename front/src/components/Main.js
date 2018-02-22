import React, { Component } from 'react';
import api from 'redux-rest-fetcher';
import moment from 'moment';

import Chart from './Chart';
import Buttons from './Buttons';

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
    if (!selectedCoin) {
      // eslint-disable-next-line no-alert
      alert('select coin first');
      return false;
    }
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
      })
      .catch((e) => {
        console.log(e);
      });
    return true;
  };

  execFromDB = (name) => {
    api
      .get_from_db({ GET: { name } })
      .then((r) => {
        if (r.status === 200 || r.ok) {
          return r.json();
        }
        return {};
      })
      .then((j) => {
        this.setState({ coinData: j });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  refresh = _query => () => {
    const query = _query;
    query.force = true;
    api
      .historical({
        GET: query,
      })
      .then((r) => {
        if (r.status === 200 || r.ok) {
          return r.json();
        }
        return [];
      })
      .then((j) => {
        this.setState({ coinData: j });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const {
      coinList,
      selectedCoin,
      lowDate,
      highDate,
      coinData: { Data = null, hodl = false, originalQuery = false },
    } = this.state;
    return (
      <Aux>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div>
            <input value={lowDate} type="date" onChange={this.dateLowChange} />
            <input value={highDate} type="date" onChange={this.dateHighChange} />
            {originalQuery && <button onClick={this.refresh(originalQuery)}>Refresh</button>}
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
        {!hodl ? <Chart data={Data} /> : <span>HODL</span>}
        <div style={{ width: '50%', margin: '0 auto' }}>
          <Buttons exec={this.execFromDB} />
        </div>
      </Aux>
    );
  }
}

export default Main;
