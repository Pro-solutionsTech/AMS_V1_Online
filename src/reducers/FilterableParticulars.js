export const filterableParticularsInitialState = [];

export function filterableParticularsReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_PARTICULAR': {
      return state.map(particular => {
        if (particular.particular.id === action.id) {
          return {
            ...particular,
            selected: !particular.selected
          }
        }
        return particular
      })
    }
    case 'SET_PARTICULAR_AMOUNT': {
      return state.map(particular => {
        if (particular.particular.id === action.id) {
          return {
            ...particular,
            amount: action.amount
          }
        }
        return particular
      })
    }
    default:
      throw Error("Invalid credentials reducer action")
  }
}
