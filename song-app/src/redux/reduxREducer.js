// Reducer for handling songs
const initialState = {
  songs: [],
  loading: false,
  error: null,
  };
  
  const songReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_SONGS_SUCCESS':
        return {
          ...state,
          songs: action.payload, // action.payload should be an array,
          error: '',
          loading: false,
        };
      case 'FETCH_SONGS_REQUEST':
        return {
          loading: true,
          ...state,
          songs: action.payload, // action.payload should be an array
        };

      case 'FETCH_SONGS_FAILED':
        return {
          songs: null,
          loading: false,
          error: action.payload, // action.payload should be an error message
      };
        
        
      default:
        return state;
        
    }
  };
  
  export default songReducer;
  