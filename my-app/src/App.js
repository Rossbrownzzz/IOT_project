import logo from './logo.svg';
import './App.css';
import { WaterFlowChart } from "./components/waterFlowChart";
import {TemperatureChart} from "./components/TemperatureChart";
import { WaterLevelChart } from './components/WaterLevelChart';
import styled from 'styled-components'
import { useState} from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase, ref, onValue, set, update, get } from'firebase/database';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';




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

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 350
  },
});

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
  const [turnHeatOn, turnHeatOff] = useState(true)
  const onChangeValue = (event) => {
    const { value } = event.target;


    // Reset the heater button if "automatic" is selected
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
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    const updates = {};
    if(value && isValidPhoneNumber(value)){
        updates['phoneNumber'] = value;
	      update(ref(database), updates);
        alert('Phone Number Submitted, You will now get text alerts about your tank')
    }
    else{
      updates['phoneNumber'] = "";
	    update(ref(database), updates);
    }
  }

  const [waterLevel, onChangeWater] = useState('');
  const [flowRate, onChangeFlow] = useState('');
  const [temperature, onChangeTemp] = useState('')


  const handleFlow = (event) => {
    const updates = {};
    updates['flowRate'] = event.target.value;
	  update(ref(database), updates);
    onChangeFlow(event.target.value);
 
  };
  const handleTemp = (value) => {
    const updates = {};
    onChangeTemp(value);
    if(/^\d+$/.test(value)){
      updates['temperature'] = Number(value);
	    update(ref(database), updates);
    }
  };
  const handleWaterLevel = (event) => {
    const updates = {};
    updates['waterLevel'] = event.target.value;
	  update(ref(database), updates);
    onChangeWater(event.target.value);
  };

  const handleSignOut = () => {

  };


  return (
    <div className="App">
      <Button onClick={handleSignOut}>
            Sign Out
          </Button>
      <div className="grid-container">
        <div id="chart1"><WaterFlowChart /></div>
        <div id="chart2"><WaterLevelChart /></div>
        <div id="chart3"><TemperatureChart /></div>
        <div id="chart4">
        <Button onClick={handleHeaterClick} disabled={!heaterOn}>
            {heaterOn ? 'Turn Heater On/Off' : 'Manual Control Turned Off'}
          </Button>
          <Container onChange={onChangeValue}>
            <Label id="automatic">
              <Input type="radio" name="location" id="automatic" value="automatic" />
              <RadioBox />
              <Paragraph>Automatic</Paragraph>
            </Label>

            <Label id="manual">
              <Input type="radio" name="location" id="manual" value="manual" />
              <RadioBox />
              <Paragraph>Manual</Paragraph>
            </Label>

            <Label id="both">
              <Input type="radio" name="location" id="both" value="both" />
              <RadioBox />
              <Paragraph>Both Automatic and Manual</Paragraph>
            </Label>
          </Container>
          <PhoneInput   style={{ width: 200 }}
            placeholder="Enter phone number"
            defaultCountry="US"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <div style={{textAlign: "left"}}>
            <p>Phone Number Selected: {phoneNumber}</p>
          </div>
          <SafeAreaView>
          <div style={{textAlign: "left"}}>
          <p>Water Level Notification Level</p>
          </div>
          <select value={waterLevel} onChange={handleWaterLevel} style={{ width: 200 }}>

                <option value="Medium">Medium</option>

                <option value="Low">Low</option>

                <option value="Blocked">Blocked</option>

            </select>
          <div style={{textAlign: "left"}}>
            <p>Flow Rate Notification Level</p>
          </div>
          <select value={flowRate} onChange={handleFlow} style={{ width: 200 }}>

                <option value="Medium Flow">Medium Flow</option>

                <option value="Low Flow">Low Flow</option>

                <option value="Blocked">Blocked</option>

            </select>
            <div style={{textAlign: "left"}}>
              <p>Temperature Notification Level</p>
            </div>
          <TextInput
            style={styles.input}
            onChangeText={handleTemp}
            value={temperature}
            placeholder="Enter Temperature Below Which You Are Notified"
            keyboardType="numeric"
            />
          </SafeAreaView>
        </div>
      </div>
     
    </div>
  );
}

export default App;
