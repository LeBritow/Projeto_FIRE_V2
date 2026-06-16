#include <Wire.h>
#include <SPI.h>
#include <LoRa.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include "Adafruit_CCS811.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_SDA 4
#define OLED_SCL 15
#define OLED_RST 16
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

TwoWire I2C_OLED = TwoWire(1);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &I2C_OLED, OLED_RST);

#define SENSOR_SDA 23
#define SENSOR_SCL 13

#define LORA_SS 18
#define LORA_RST 14
#define LORA_DIO0 26
#define BAND 915E6

Adafruit_CCS811 ccs;
Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);

  pinMode(OLED_RST, OUTPUT);
  digitalWrite(OLED_RST, LOW); delay(20); digitalWrite(OLED_RST, HIGH);
  I2C_OLED.begin(OLED_SDA, OLED_SCL);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("Falha OLED")); 
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.println("INICIANDO SENSORES...");
  display.display();

  Wire.begin(SENSOR_SDA, SENSOR_SCL);

  bool bmeStatus = bme.begin(0x76, &Wire);
  bool ccsStatus = ccs.begin();

  if (!bmeStatus || !ccsStatus) {
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("ERRO SENSOR!");
    display.print("BME: "); display.println(bmeStatus ? "OK" : "FALHA");
    display.print("CCS: "); display.println(ccsStatus ? "OK" : "FALHA");
    display.display();
    while(1);
  }

  while(!ccs.available());

  SPI.begin(5, 19, 27, 18);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(BAND)) {
    display.println("LoRa FALHOU!");
    display.display();
    while (1);
  }
  
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("SISTEMA OK!");
  display.display();
  delay(1000);
}

void loop() {
  float temp = bme.readTemperature();
  float press = bme.readPressure() / 100.0F;
  float umid = bme.readHumidity();
  
  int co2 = 0;
  int tvoc = 0;
  
  if(ccs.available()){
    if(!ccs.readData()){
      co2 = ccs.geteCO2();
      tvoc = ccs.getTVOC();
      ccs.setEnvironmentalData(umid, temp);
    }
  }

  String pacote = "DADO:";
  pacote += String(temp, 1) + ";";
  pacote += String(umid, 1) + ";";
  pacote += String(press, 1) + ";";
  pacote += String(co2) + ";";
  pacote += String(tvoc);

  LoRa.beginPacket();
  LoRa.print(pacote);
  LoRa.endPacket();

  display.clearDisplay();
  display.setCursor(0,0);
  display.println("- TRANSMISSOR -");
  
  display.print("T:"); display.print(temp, 1); display.print("C ");
  display.print("U:"); display.print(umid, 0); display.println("%");
  
  display.print("CO2:"); display.print(co2); display.println("ppm");
  display.print("TVOC:"); display.println(tvoc);
  
  display.setCursor(0, 55);
  display.print(">> ENVIADO <<");
  display.display();

  delay(5000);
}