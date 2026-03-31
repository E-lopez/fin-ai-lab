export type InitialModel = {
  tokenData: Record<string, string>,
  userAuthenticated: boolean,
}

export const initialModel = {
  tokenData: {
    access_token: '',
  },
  userAuthenticated: false,
}