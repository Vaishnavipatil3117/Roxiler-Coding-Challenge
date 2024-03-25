import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TransactionData from './components/TransactionTable/TransactionData';
import TransactionsStatistics from "./components/TransactionsStatistics/TransactionsStatistics";
import TransactionsBarChart from "./components/TransactionsBarChart/TransactionsBarChart";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={TransactionData} />
          <Route exact path="/statistics/:month" component={TransactionsStatistics} />
          <Route exact path='/api/statistics/:month' component={TransactionsBarChart} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
