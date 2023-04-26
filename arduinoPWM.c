#define bit0 2
#define bit1 3

unsigned long PWM = 0;

// init serial and pin
void setup() {
  Serial.begin(9600);
  pinMode(10, INPUT);
  pinMode(bit0, OUTPUT);
  pinMode(bit1, OUTPUT);
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
  if(PWM >26000){
    digitalWrite(bit1, HIGH); // LED ON
    digitalWrite(bit0, HIGH);
  }
  else if(PWM >24000){
    digitalWrite(bit1, HIGH);
    digitalWrite(bit0, LOW); // LED ON
  }
  else if(PWM > 22000){
    digitalWrite(bit1, LOW);
    digitalWrite(bit0, HIGH); // LED ON
  }
  else{
    digitalWrite(bit1, LOW);
    digitalWrite(bit0, LOW);
  }

  Serial.print(PWM);
  Serial.print('\n');
  delay(5);
}
