#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <Adafruit_CCS811.h>

#define I2C_SDA 22
#define I2C_SCL 21

Adafruit_BME280 bme; 
Adafruit_CCS811 ccs;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  Serial.println("Iniciando Sensores do Projeto FIRE...");

  Wire.begin(I2C_SDA, I2C_SCL);

  if (!bme.begin(0x76, &Wire)) {
    Serial.println("Erro: Não foi possível encontrar o sensor BME280. Verifique as conexões!");
    while (1);
  }

  if (!ccs.begin(CCS811_ADDRESS, &Wire)) {
    Serial.println("Erro: Não foi possível encontrar o sensor CCS811. Verifique as conexões!");
    while (1);
  }

  while (!ccs.available());
  
  Serial.println("Sensores prontos. Gerando dados de linha de base (ar limpo)...");
}

void loop() {
  
  float temp = bme.readTemperature();
  float hum = bme.readHumidity();
  float pres = bme.readPressure() / 100.0F;

  if (ccs.available()) {
    
    ccs.setEnvironmentalData(hum, temp);

    if (!ccs.readData()) {
      
      int co2 = ccs.geteCO2();
      int tvoc = ccs.getTVOC();

      Serial.println("--- NOVOS DADOS ---");
      Serial.print("Temperatura: ");
      Serial.print(temp);
      Serial.println(" *C");

      Serial.print("Umidade: ");
      Serial.print(hum);
      Serial.println(" %");

      Serial.print("Pressão: ");
      Serial.print(pres);
      Serial.println(" hPa");

      Serial.print("CO2: ");
      Serial.print(co2);
      Serial.println(" ppm");

      Serial.print("TVOC: ");
      Serial.print(tvoc);
      Serial.println(" ppb");

    } else {
      Serial.println("Erro ao ler dados do CCS811.");
    }
  }

  delay(5000); 
}