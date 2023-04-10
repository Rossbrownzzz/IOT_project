import logo from './logo.svg';
import './App.css';
import { InfluxChart } from "./components/InfluxChart";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <h1> Hello World! </h1>
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <InfluxChart />
    </div>
  );
}

export default App;
