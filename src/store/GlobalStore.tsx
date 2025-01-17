import React, { createContext, useContext, ReactNode } from 'react';
import { STATE, State, StoreContextProps } from './types';
import { setUserInfo, userInfoState } from './UserInfoStore';
import { UserInfo } from '../../generated/apiClient';

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const combinedState: State = {
    [STATE.USER_INFO]: userInfoState.state?.value
  };

  const setState = (key: STATE, value: unknown) => {
    if (key === STATE.USER_INFO) {
      setUserInfo(value as UserInfo);
    }
  };

  return (
    <StoreContext.Provider value={{ state: combinedState, setState }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextProps => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
