#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_SDA 4
#define OLED_SCL 15
#define OLED_RST 16
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

TwoWire I2C_OLED = TwoWire(1);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &I2C_OLED, OLED_RST);

#define LORA_SS 18
#define LORA_RST 14
#define LORA_DIO0 26
#define BAND 915E6

void setup() {
  Serial.begin(115200);
  
  pinMode(OLED_RST, OUTPUT);
  digitalWrite(OLED_RST, LOW); delay(20); digitalWrite(OLED_RST, HIGH);
  I2C_OLED.begin(OLED_SDA, OLED_SCL);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println("AGUARDANDO LORA...");
  display.display();

  SPI.begin(5, 19, 27, 18);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  
  if (!LoRa.begin(BAND)) {
    Serial.println("Erro ao iniciar LoRa!");
    while (1);
  }
}

void loop() {
  int packetSize = LoRa.parsePacket();
  
  if (packetSize) {
    String recebido = "";
    
    while (LoRa.available()) {
      recebido += (char)LoRa.read();
    }
    
    int rssi = LoRa.packetRssi();

    Serial.print(recebido);
    Serial.print("|RSSI:");
    Serial.println(rssi);

    display.clearDisplay();
    display.setCursor(0,0);
    display.println("- RECEPTOR -");
    display.println("Recebido:");
    display.println(recebido);
    display.print("Sinal: "); display.println(rssi);
    display.display();
  }
}