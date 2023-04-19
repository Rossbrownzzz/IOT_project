import logo from './logo.svg';
import './App.css';
import { WaterFlowChart } from "./components/waterFlowChart";
import {TemperatureChart} from "./components/TemperatureChart";
import { WaterLevelChart } from './components/WaterLevelChart';
import styled from 'styled-components'
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase, ref, onValue, set, update, get } from'firebase/database';

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

export const Container = styled.div`
  background: white;
  display: inline-flex;
  height: 10rem;
  width: 10rem;
  border-radius: 0.5rem;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-direction: column;
`;
export const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Paragraph = styled.p`
  color: #334680;
  font-size: 0.875rem;
  line-height: 1.313rem;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  margin-left: 0.2rem;
`;

export const RadioBox = styled.div`
  height: 1.125rem;
  width: 1.125rem;
  border: 1px solid #b9bdcf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 0.4rem;
  transition: background 0.15s, border-color 0.15s;
  padding: 2px;

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background: #2266dc;
    border-radius: 50%;
    cursor: pointer;
    transform: scale(0);
  }
`;
export const Input = styled.input`
  display: none;
  &:checked + ${RadioBox} {
      &::after {
        transform: scale(1);
      }
`;

const firebaseConfig = {
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
  const [heaterOn, setHeaterOff] = useState(true);
  const [refillEnabled, setRefillDisabled] = useState(true);
  const [turnHeatOn, turnHeatOff] = useState(true)
  const [refillOn, turnRefillOff] = useState(true)
  const onChangeValue = (event) => {
    const { value } = event.target;
    // Disable the refill button if "Tokyo" is selected
    setRefillDisabled(value != 'automatic');

    // Reset the heater button if "London" is selected
    setHeaterOff(value != 'automatic');

    if(value !=  "manual"){
      alert("Automatic settings turned on")
      const updates = {};
	    updates['automatic'] = true;
	    update(ref(database), updates);
      //firebase set automatic flag
    }
    else{
      alert("Disabling automatic settings")
      //firebase deset firebase flag
      const updates = {};
	    updates['automatic'] = false;
	    update(ref(database), updates);
    }

  };
  const handleRefillClick = () => {
    if(refillEnabled == true){
      const updates = {};

      //firebase code to send refill trigger (timed out on pi end)
      if(refillOn == true){
        updates['fillTank'] = true;
	      update(ref(database), updates);
        alert('Refilling Tank')
        turnRefillOff(false);
      }
      else{
        updates['fillTank'] = false;
	      update(ref(database), updates);
        alert('Stopping Refill')
        turnRefillOff(true);
      }
    }
    else{
      alert("Refill Disabled")
    }
  };

  const handleHeaterClick = () =>{
    if(heaterOn == true){
      //firebase code to send heater on trigger (turn off enabled pi end)
      const updates = {};
      if(turnHeatOn == true){
	      updates['tempOn'] = true;
	      update(ref(database), updates);
        alert('Heater Turned On')
        turnHeatOff(false)
        
      }
      else{
        updates['tempOn'] = false;
	      update(ref(database), updates);
        alert('Heater Turned Off')
        turnHeatOff(true)
      }
    }
    else{
      alert("Heater Control Disabled")
    }
  }



  return (
    <div className="App">
      <div className="grid-container">
        <div id="chart1"><WaterFlowChart /></div>
        <div id="chart2"><WaterLevelChart /></div>
        <div id="chart3"><TemperatureChart /></div>
        <div id="chart4">
        <Button onClick={handleHeaterClick} disabled={!heaterOn}>
            {heaterOn ? 'Turn Heater On/Off' : 'Manual Control Turned Off'}
          </Button>
          <Button onClick={handleRefillClick} disabled={!refillEnabled}>
                       {refillEnabled ? "Refill Tank Start/Stop": "Manual Control Turned Off"}
          </Button>
          <Container onChange={onChangeValue}>
            <Label id="london">
              <Input type="radio" name="location" id="automatic" value="automatic" />
              <RadioBox />
              <Paragraph>Automatic</Paragraph>
            </Label>

            <Label id="berlin">
              <Input type="radio" name="location" id="manual" value="manual" />
              <RadioBox />
              <Paragraph>Manual</Paragraph>
            </Label>

            <Label id="tokyo">
              <Input type="radio" name="location" id="both" value="both" />
              <RadioBox />
              <Paragraph>Both Automatic and Manual</Paragraph>
            </Label>
          </Container>
        </div>
      </div>
     
    </div>
  );
}

export default App;
