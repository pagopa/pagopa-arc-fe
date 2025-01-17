import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { STATE } from './types';
import { StoreProvider, useStore } from './GlobalStore';
import { setUserInfo } from './UserInfoStore';

vi.mock('./UserInfoStore.ts', () => ({
  userInfoState: { state: { value: { name: 'John' } } },
  setUserInfo: vi.fn()
}));

describe('StoreProvider and useStore', () => {
  const TestUserInfoComponent: React.FC = () => {
    const { state, setState } = useStore();

    return (
      <div>
        <p>{state.userInfo?.name}</p>
        <button onClick={() => setState(STATE.USER_INFO, { name: 'John' })}>Update User</button>
      </div>
    );
  };

  it('allows user info state to be updated', () => {
    render(
      <StoreProvider>
        <TestUserInfoComponent />
      </StoreProvider>
    );

    const button = screen.getByText('Update User');
    button.click();

    expect(setUserInfo).toHaveBeenCalledWith({ name: 'John' });
  });

  it('throws an error when useStore is used outside of StoreProvider', () => {
    const renderWithoutProvider = () => render(<TestUserInfoComponent />);

    expect(renderWithoutProvider).toThrow('useStore must be used within a StoreProvider');
  });
});
