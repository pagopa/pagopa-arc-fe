import { UserMemo } from 'models/User';

export interface State {
  [STATE.USER_INFO]: UserMemo | undefined;
}

export interface StoreContextProps {
  state: State;
  setState: (key: keyof State, value: unknown) => void;
}

export enum STATE {
  USER_INFO = 'userInfo'
}
