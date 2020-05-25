import React, { Component, useState, useEffect } from 'react';
import { animateScroll } from "react-scroll";
//import { render } from "react-dom";
//import { TransitionMotion, spring } from "react-motion";
import axios from 'axios';
import getDataRequest from './test_req';
import './static/css/styling.css';
//import Flexbox from 'flexbox-react';
//import asyncPoll from 'react-async-poll';

/*
const WrappedListComponent = (result) => {
    console.log(result);
    const list = result.data.map(({ title }) => <li>{title}</li>);

    return <ul>{list}</ul>;
};

const getNewData = async () => {
  const result = await axios(
    `http://localhost:5000/all_messages`,
  );
  return result;
};

const onPollInterval = (props, dispatch) => {
    return dispatch(getNewData());
};
*/

const getNewData = async () => {
  const result = await axios(
    `http://localhost:5000/all_messages`,
  );
  return result;
};


class Input extends Component {
  // https://medium.com/@willhowardgb/building-a-beautiful-text-input-component-in-react-f85564cc7e86
  constructor(props) {
    super(props);

    this.state = {
      active: (props.locked && props.active) || false,
      value: props.value || "",
      error: props.error || "",
      label: props.label || "Label"
    };
  }

  postMessage = async () => {
    const result = await axios(
      `http://localhost:5000/post/${this.state.value}`,
    );
    this.setState({ value: "" })
  };

  fetchData = async (query) => {
    const result = await axios(
      `http://localhost:5000/${query}`,
    );
    return result.data;
  };

  changeValue(event) {
    const value = event.target.value;
    this.setState({ value, error: "" });
  }

  handleKeyPress = async(event) => {
    if (event.key === "Enter") {
      this.setState({ value: this.props.predicted });
    }
    const retval = await this.fetchData(this.state.value + event.key);
    console.log(this.state.value, retval.value)
    this.setState({ value: retval.value, error: "" });
  }

  render() {
    const { active, value, error, label } = this.state;
    const { predicted, locked } = this.props;
    const fieldClassName = `field ${(locked ? active : active || value) &&
      "active"} ${locked && !active && "locked"}`;

    return (
      <div className={fieldClassName}>
        {active &&
          value &&
          predicted &&
          predicted.includes(value) && <p className="predicted">{predicted}</p>}
        <input
          id={1}
          className="input"
          type="text"
          value={value}
          placeholder={label}
          onChange={this.changeValue.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          onFocus={() => !locked && this.setState({ active: true })}
          onBlur={() => !locked && this.setState({ active: false })}
        />
        <label htmlFor={1} className={error && "error"}>
          {error || label}
        </label>
      <button onClick={this.postMessage.bind(this)}>
         Send message
       </button>
      </div>
    );
  }
}


class App extends Component {
  state = {
    data: [],
    message_list: [],
    req_data: null,
    in_text: [],
    delay: 3000,
  };

  // Code is invoked after the component is mounted/inserted into the DOM tree.
  componentDidMount() {
    // This is an example for one-time, static API-returned data
    const url =
      'https://en.wikipedia.org/w/api.php?action=opensearch&search=Seona+Dancing&format=json&origin=*'

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState({
          data: result,
        })
      })

    this.interval = setInterval(this.tick, this.state.delay)

    const callback = (value) => {
                  this.setState({
                      req_data: value
                  })
              }
              getDataRequest(callback);

    this.scrollToBottom();
  }
  componentDidUpdate(prevProps, prevState) {
      if (prevState.delay !== this.state.delay) {
        clearInterval(this.interval);
        this.interval = setInterval(this.tick, this.state.delay);
      }
      this.scrollToBottom();
  }

  componentWillUnmount() {
      clearInterval(this.interval);
  }

  tick = async () => {
    const resp = await getNewData()
    const list = resp.data.map((entry, index) => {
      return <span key={index}>{entry}<br></br></span>;
    })

    this.setState({
      message_list: <div>{list}</div>
    });
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "msg_history"
    });
   }

  render() {
    // const PollingList = asyncPoll(10 * 1000, onPollInterval)(WrappedListComponent);

    const { data } = this.state

    const result = data.map((entry, index) => {
      return <p key={index}>{entry}</p>
    })

    return (

      <article>

      <h3>Minor header here</h3>
      <ul> data={this.state.req_data} </ul>

      <div className="container">
        <h1>A Simple Flexbox Layout for Sidebar + Main Content Area</h1>
        <div className="flex-grid">
          <aside className="col sidebar-left">
            <h2>Left Sidebar</h2>
            <p>In CSS, it has a flex property of 1, meaning it takes up 1 unit (whatever that might be) of the available space.</p>
          </aside>

          <section className="col main">
            <div className="history" id="msg_history">
              <h2>The Main Content Area</h2>
                {this.state.message_list}
              </div>


              <Input
                id={1}
                label="Speak here"
                predicted="OK"
                locked={false}
                active={false}
              />

            </section>

            <nav className="col sidebar-right">
              <h2>List of stuff</h2>
              {result}
            </nav>

    </div>
  </div>


  </article>

    )
  }
}

export default App
