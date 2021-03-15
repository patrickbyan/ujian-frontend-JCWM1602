import react from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './Component/Navbar'
import LandingPage from './Page/LandingPage';
import Login from './Page/Login';
import Cart from './Page/Cart'
import TransactionHistory from './Page/TransactionHistory';
import Footer from './Component/Footer';

export default class App extends react.Component{
  render(){
    return (
      <div>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route path='/Login' component={Login} />
            <Route path='/Cart' component={Cart} />
            <Route path='/transaction-history' component={TransactionHistory} />
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    )
  }
}