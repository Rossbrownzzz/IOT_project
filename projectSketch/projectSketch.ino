
#define bit0 2
#define bit1 3

unsigned long PWM = 0;
unsigned long count = 0;
int values[150];

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(10, INPUT);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
}

void loop() {
  delay(5000);
  // put your main code here, to run repeatedly:
  PWM = pulseIn(10, HIGH, 250000);
  //values[count] = PWM;
  //count = count + 1;
  Serial.print(PWM);
  Serial.print('\n');
  /*if(count >50){
    
    PWM = 0;
    for(int i = 0; i < 50; i++){
          PWM = PWM + values[i];
    }
    PWM = PWM / 50;
    */
    Serial.print('\n');
    Serial.print(PWM);
    Serial.print('\n');
    Serial.print('\n');
    if(PWM >26000){
      digitalWrite(4, HIGH);
      digitalWrite(3, LOW); // LED ON
      digitalWrite(2, LOW);
      Serial.println('3');
    }
    else if(PWM >24000){
      digitalWrite(4, LOW);
      digitalWrite(3, HIGH);
      digitalWrite(2, LOW); // LED ON
      Serial.println('2');
    }
    else if(PWM > 22000){
      digitalWrite(4, LOW);
      digitalWrite(3, LOW);
      digitalWrite(2, HIGH); // LED ON
      Serial.println('1');
    }
    else{
      digitalWrite(4, LOW);
      digitalWrite(3, LOW);
      digitalWrite(2, LOW);
      Serial.println('0');
      
    }
    PWM = 0;
    count = 0;
  //}
  //delay(5);
}
