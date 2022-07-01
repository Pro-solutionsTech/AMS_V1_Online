export const credentialsInitialState = {
  apiUrl: 'https://a.lampara.atmosclouds.com',
  clientId: 'kthNk1MjT7UkEXobzIuvSQMV7XS1p9XeX5hzlSvk',
  clientSecret: 'Br0zAoiFHEaq4b58ctUaL2eRdiV2pmQw3SxrDBtjTZjFCRM0MYByK2GtIP2KqQ0CDK1K11ekMaRl6Sj9hLoVsvtyRfVf3ZKE43VoXmrigg3z7dk7drBRaN2Dr9Ax58GS',

};

export function credentialsReducer(state, action) {
  switch (action.type) {
    case 'SET_API_URL': {
      return {
        ...state,
        apiUrl: action.apiUrl
      }
    }
    case 'SET_CLIENT_ID': {
      return {
        ...state,
        clientId: action.clientId
      }
    }
    case 'SET_CLIENT_SECRET': {
      return {
        ...state,
        clientSecret: action.clientSecret
      }
    }
    case 'LOGOUT': {
      return {
        ...state,
        authorization: null,
      }
    }
    case 'SET_AUTHORIZATION': {
      return {
        ...state,
        authorization: action.authorization
      }
    }
    default:
      throw Error("Invalid credentials reducer action")
  }
}
