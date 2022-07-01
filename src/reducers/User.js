const initialState = {

}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'GET_USER':
      return { ...state, ...action.payload };

    case 'GET_USER_LOG_OUT':
      return {};

    default:
      return state;
  }
}