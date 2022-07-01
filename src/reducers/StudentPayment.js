const initialState = {
  studentDetails: {},
  particulars: [],
  transaction: {},
  payment: 0,
  change: 0
}

export default function studentPayment(state = initialState, action) {
  switch (action.type) {
    case "GET_STUDENT_DETAILS":
      return { ...state, studentDetails: action.payload };

    case "GET_PARTICULARS":
      return { ...state, particulars: action.payload };

    case "GET_TRANSACTION":
      return { ...state, transaction: action.payload };

    case "GET_PAYMENT":
      return {...state, payment: action.payload};

    case "GET_CHANGE":
      return {...state, change: action.payload};

    default:
      return state;
  }
}
