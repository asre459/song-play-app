import axios from 'axios';
import { put, takeLatest, call } from 'redux-saga/effects';

const API_URL = 'http://localhost:5000/api/songs';


// Delete Song
function* deleteSong(action) {
  try {
    yield call(axios.delete, `${API_URL}/${action.payload}`);
    yield put({ type: 'DELETE_SONG_SUCCESS', payload: action.payload });
  } catch (error) {
    console.error('Error deleting song:', error);
  }
}

// Update Song
function* updateSong(action) {
  try {
    const updatedSong = yield call(axios.put, `${API_URL}/${action.payload.id}`, action.payload.data);
    yield put({ type: 'UPDATE_SONG_SUCCESS', payload: updatedSong.data });
  } catch (error) {
    console.error('Error updating song:', error);
  }
}

export function* watchSongSagas() {
    yield takeLatest('DELETE_SONG_REQUEST', deleteSong);
    yield takeLatest('UPDATE_SONG_REQUEST', updateSong);
  }

  

export default watchSongSagas;
