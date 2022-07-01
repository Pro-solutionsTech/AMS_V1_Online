import {combineReducers} from 'redux';
import user from './User';
import studentPayment from './StudentPayment';
import userCredential from './UserCredential';
import loading from './Loading';

const rootReducer = combineReducers({
    user,
    studentPayment,
    userCredential,
    loading
});

export default rootReducer;