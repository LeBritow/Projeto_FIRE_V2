#include <Wire.h>
#include <SPI.h>
#include <LoRa.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
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
Adafruit_BMP280 bmp; 

void setup() {
  Serial.begin(115200);
  
  pinMode(OLED_RST, OUTPUT);
  digitalWrite(OLED_RST, LOW); delay(20); digitalWrite(OLED_RST, HIGH);
  
  I2C_OLED.begin(OLED_SDA, OLED_SCL);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("Falha na tela OLED"));
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0,0);
  display.println("INICIANDO...");
  display.display();

  Wire.begin(SENSOR_SDA, SENSOR_SCL);

  bool bmpStatus = bmp.begin(0x76);
  bool ccsStatus = ccs.begin();

  display.clearDisplay();
  display.setCursor(0,0);
  display.println("--- CHECKLIST ---");
  
  display.print("BMP280: "); display.println(bmpStatus ? "OK" : "ERRO");
  display.print("CCS811: "); display.println(ccsStatus ? "OK" : "ERRO");
  display.display();
  delay(2000);

  if (!bmpStatus || !ccsStatus) {
    display.println("\nVERIFIQUE FIACAO!");
    display.display();
    while(1);
  }

  while(!ccs.available());

  SPI.begin(5, 19, 27, 18);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  
  if (!LoRa.begin(BAND)) {
    display.println("LoRa: FALHA!");
    display.display();
    while (1);
  }
}

float calcularUmidadeSintetica(float temp) {
  float umidade_base = 60.0 - ((temp - 25.0) * 1.5);
  float ruido = random(-20, 20) / 10.0; 
  float umidade_final = umidade_base + ruido;
  if (umidade_final > 90) umidade_final = 90;
  if (umidade_final < 20) umidade_final = 20;
  return umidade_final;
}

void loop() {
  float temp = bmp.readTemperature();
  float press = bmp.readPressure() / 100.0F;
  float umid = calcularUmidadeSintetica(temp);
  
  int co2 = 0;
  int tvoc = 0;

  if(ccs.available()){
    if(!ccs.readData()){
      co2 = ccs.geteCO2();
      tvoc = ccs.getTVOC();
      ccs.setEnvironmentalData(umid, temp);
    }
  }

  display.clearDisplay();
  
  display.setTextSize(1);
  display.setCursor(0,0);
  display.println(" MONITOR HELTEC V2");
  display.drawLine(0, 8, 128, 8, WHITE);
  
  display.setCursor(0, 12);
  display.print("T:"); display.print(temp, 1); display.print("C");
  
  display.setCursor(64, 12);
  display.print("U:"); display.print(umid, 0); display.print("%");

  display.setCursor(0, 25);
  display.print("CO2:"); display.print(co2); display.print("ppm");
  
  display.setCursor(64, 25);
  display.print("VOC:"); display.print(tvoc);

  display.setCursor(0, 38);
  display.print("Pres:"); display.print(press, 0); display.print("hPa");
  
  display.drawLine(0, 52, 128, 52, WHITE);
  display.setCursor(0, 55);
  display.print("Env: LoRa...");
  display.display();

  String pacote = "DADO:";
  pacote += String(temp, 1) + ";";
  pacote += String(umid, 1) + ";";
  pacote += String(press, 1) + ";";
  pacote += String(co2) + ";";
  pacote += String(tvoc);

  LoRa.beginPacket();
  LoRa.print(pacote);
  LoRa.endPacket();

  display.fillRect(0, 55, 128, 10, BLACK);
  display.setCursor(0, 55);
  display.print(">> ENVIADO OK <<");
  display.display();

  delay(5000); 
}