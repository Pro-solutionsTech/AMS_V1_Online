const intitialState = {
  username: '',
  password: ''
};

export default function userCredential(state = intitialState, action) {
  switch(action.type) {
    case 'SET_CREDENTIAL':
      return {...state, ...action.payload};

    case 'CLEAR_USER_CREDENTIAL':
      return {username: '', password: ''};

    default:
      return state;
  }
}