import { render } from 'react-dom';
import { AuthProvider } from './contexts/authContext';
import App from './routes';

import './styles/globals.scss';

render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
