import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App font-main">
        <Switch>
          {/* Route pour la page d'accueil */}
          <Route exact path="/" component={() => (
            <>
              <Header />
              <Home />
              <About />
            </>
          )} />
          
          {/* Route pour la page Admin */}
          <Route path="/admin" component={Admin} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
