import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  songs: [],
  loading: false,
  error: null,
};

export const fetchSongsRequest = createAsyncThunk('', ()=>{
  return axios.get("http://localhost:5000/api/songs")
  .then(res => res.data)
})
const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
  
    createSong: (state, action) => {
      state.songs.push(action.payload);
    },
    updateSong: (state, action) => {
      const index = state.songs.findIndex(song => song.id === action.payload.id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
    },
    deleteSong: (state, action) => {
      state.songs = state.songs.filter(song => song.id !== action.payload);
    },
  },
  extraReducers:builder=>{
    builder.addCase(fetchSongsRequest.pending, (state)=>{
      state.loading = true;
    })
    builder.addCase(fetchSongsRequest.fulfilled, (state, action)=>{
      state.loading = false;
      state.songs = action.payload;
      state.error = null;
    })
    builder.addCase(fetchSongsRequest.rejected, (state, action)=>{
      state.loading = false;
      state.error = action.payload;
      state.songs = [];
    })
  }
});


export const {
  fetchSongsSuccess,
  fetchSongsFailure,
  createSong,
  updateSong,
  deleteSong,
} = songSlice.actions;

export default songSlice.reducer;
