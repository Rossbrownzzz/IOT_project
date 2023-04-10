unsigned long PWM = 0;

// init serial and pin
void setup() {
  Serial.begin(9600);
  pinMode(10, INPUT);
}


/*
16555 is roughly 30 Hz
17123 is roughly 29 Hz
17738 is roughly 28 Hz WHICH IS OUR BASELINE ROUGHLY
18393 is roughly 27 Hz
19090 is roughly 26 Hz
*/

void loop() {
    //read in the PWM signal on 10, 0.025 second timeout ( I think )
  PWM = pulseIn(10, HIGH, 250000);
  Serial.print(PWM);
  Serial.print('\n');
  delay(5);
}
