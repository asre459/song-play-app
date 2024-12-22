import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import SongList from './components/SongList';

function App() {
  return (
  <Provider store={store}>
    <SongList/>
  </Provider>
  );
}

export default App;
