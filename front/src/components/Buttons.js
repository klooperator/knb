import React, { Component } from 'react';
import api from 'redux-rest-fetcher';
import PropTypes from 'prop-types';

const Aux = props => props.children;

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryList: [],
    };
  }
  componentDidMount() {
    api
      .ping()
      .then(r => r.text())
      .then((t) => {
        console.log(t);
      });
    api
      .ping()
      .then((r) => {
        if (r.status === 200 || r.ok) {
          return r.json();
        }
        return [];
      })
      .then((j) => {
        this.setState({ queryList: j });
      });
  }

  goQuery = name => () => {
    this.props.exec(name);
  };

  render() {
    console.log(this);
    const { queryList } = this.state;
    return (
      <Aux>
        {queryList.map((e, i) => (
          <button key={`${e}_${i + 1}`} onClick={this.goQuery(e)}>
            {e}
          </button>
        ))}
      </Aux>
    );
  }
}

Buttons.defaultProps = {
  exec: () => {},
};

Buttons.propTypes = {
  exec: PropTypes.func,
};

export default Buttons;
