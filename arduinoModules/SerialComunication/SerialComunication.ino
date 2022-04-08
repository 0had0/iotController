const String BUTTONS_MAP = "{\"a\":\"ON\",\"d\":\"OFF\"}";

void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT); // put your setup code here, to run once:
}

int readFromSensor() {
  return random(25, 50);
}

void loop() {
  // put your main code here, to run repeatedly:
 if(Serial.available()>0)
   {
      char data= Serial.read(); // reading the data received from the bluetooth module
      switch(data)
      {
        case 'a': digitalWrite(8, HIGH);break; // when a is pressed on the app on your smart phone
        case 'd': digitalWrite(8, LOW);break; // when d is pressed on the app on your smart phone
        default : break;
      }
   } else {
        int i = readFromSensor(); // First sensor value
        int j = readFromSensor(); // Second sensor value
       Serial.println("{\"buttons\":" + BUTTONS_MAP + ",\"sensors\":[" + String(i) + "," + String(j) + "]}");
   }
   delay(50);
}
