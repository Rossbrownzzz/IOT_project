import logo from './logo.svg';
import './App.css';
import { WaterFlowChart } from "./components/waterFlowChart";
import {TemperatureChart} from "./components/TemperatureChart";
import { WaterLevelChart } from './components/WaterLevelChart';

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
      <div className="grid-container">
        <div id="chart1"><WaterFlowChart /></div>
        <div id="chart2"><WaterLevelChart /></div>
        <div id="chart3"><TemperatureChart /></div>
      </div>

    </div>
  );
}

export default App;
