import logo from './logo.svg';
import './App.css';
import { WaterFlowChart } from "./components/waterFlowChart";
import {TemperatureChart} from "./components/TemperatureChart";
import { WaterLevelChart } from './components/WaterLevelChart';
import styled from 'styled-components'



function heater() {

	// const updates = {};
	// updates['tempOn'] = true;

	// update(ref(database), updates);
	// console.log("Turned On Heater");
  alert('You clicked refill')
}
function refill() {

  // const updates = {};
	// updates['fillTank'] = true;

	// update(ref(database), updates);
	// console.log("Refilled Tank");

  alert('You clicked refill')
}

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

firebaseConfig = {
  apiKey: "",
  authDomain: "iotfinalproject-5a9e4.firebaseapp.com",
  projectId: "iotfinalproject-5a9e4",
  storageBucket: "iotfinalproject-5a9e4.appspot.com",
  messagingSenderId: "340940497636",
  appId: "1:340940497636:web:f361857a0309a1710ac2f1",
  measurementId: "G-0FQ0WXNWBM"
}

firebase.initializeApp(firebaseConfig);

const database = getDatabase();

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
        <div id="chart4"> <Button onClick={heater}>Turn On Heater</Button>
        <Button onClick={refill}>Refill Tank</Button></div>
      </div>
     
    </div>
  );
}

export default App;
