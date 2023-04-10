int PWM = 0;

// init serial and pin
void setup() {
  Serial.begin(9600);
  pinMode(10, INPUT);
}

void loop() {
    //read in the PWM signal on 10, 0.025 second timeout ( I think )
  PWM = pulseIn(10, HIGH, 25000);
  Serial.print(PWM);
  delay(5);
    /*IF this doesn't work, try this maybe:
    
void loop(){
    unsigned long duration = pulseIn(BUTTON_PIN, HIGH);
    Serial.println(duration);
    }

    */
}
