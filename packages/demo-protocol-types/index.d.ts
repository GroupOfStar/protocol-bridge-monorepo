
export declare type IDemoProtocolEventMap = {
  selectDate: (payload: string) => string
  showLoading: () => void
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}
