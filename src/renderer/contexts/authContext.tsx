import { createContext, ReactNode, useContext, useRef } from 'react';

import { api } from '../../services/api';

const { ipcRenderer } = window.require('electron');

export type User = {
  id: string;
  name: string;
  email: string;
  bet_login: string;
  cpf: string;
  cel: string;
  is_admin: boolean;
  updated_at: Date;
  created_at: Date;
};

type UserForm = {
  email: string;
  password: string;
};

type UserResponse = {
  user: User;
  token: string;
};

type AuthContextProps = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: ({ email, password }: UserForm) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextProps);

type UserContextProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: UserContextProviderProps) {
  const user = useRef<User | null>(null);

  const isAuthenticated = !!user;

  async function signIn({ email, password }: UserForm) {
    const { data } = await api.post<UserResponse>('auth', {
      email,
      password,
    });

    ipcRenderer.send('setUser', JSON.stringify(data.user));
    ipcRenderer.send('setToken', data.token);

    api.defaults.headers.common.authorization = `Bearer ${data.token}`;
    user.current = data.user;
    document.location.reload();
  }

  async function signOut() {
    ipcRenderer.send('removeUser');
    ipcRenderer.send('removeToken');

    api.defaults.headers.common.authorization = ``;
    user.current = null;
    document.location.reload();
  }

  return (
    <AuthContext.Provider
      value={{ user: user.current, signIn, signOut, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
