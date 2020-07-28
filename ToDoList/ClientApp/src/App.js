import React, { Component } from 'react';
import { ToDoList } from './components/ToDoList';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <ToDoList/>
    );
  }
}
