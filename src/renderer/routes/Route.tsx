import React, { useEffect, useState } from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { isAfter } from 'date-fns';

import { api } from '../../services/api';
import { User } from '../contexts/authContext';

const { ipcRenderer } = window.require('electron');

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

type IJsonPayload = {
  expiredIn: Date;
};

function Route({
  isPrivate = false,
  component: Component,
  ...rest
}: RouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [lodaing, setLodaing] = useState(true);

  useEffect(() => {
    (async () => {
      let token = '';
      let userData = '';

      const result = await ipcRenderer.invoke('getToken');
      token = result;

      const resultUser = await ipcRenderer.invoke('getUser');
      userData = resultUser;

      console.log(resultUser, result);

      if (userData && token) {
        const decoded = jwt_decode(token) as IJsonPayload;

        if (isAfter(new Date(decoded.expiredIn), new Date())) {
          ipcRenderer.send('removeUser');
          ipcRenderer.send('removeToken');

          api.defaults.headers.common.authorization = '';

          setUser(null);
          console.log('Token expirado');
        } else {
          api.defaults.headers.common.authorization = `Bearer ${token}`;
          setUser(JSON.parse(userData));
        }
      }
    })();

    setLodaing(false);
  }, []);

  if (lodaing) return <div />;

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/home',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

export default Route;
