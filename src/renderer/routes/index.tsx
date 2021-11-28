import { MemoryRouter as Router, Switch } from 'react-router-dom';
import Route from './Route';

import { SignIn } from '../pages/SignIn';
import { Home } from '../pages/Home';
import { Live } from '../pages/Live';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/home" isPrivate component={Home} />
        <Route path="/live" isPrivate component={Live} />
      </Switch>
    </Router>
  );
}
