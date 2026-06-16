# Projeto FIRE

Este projeto é um sistema completo (Full Stack + IoT) para monitoramento ambiental, integrando sensores físicos em tempo real (via LoRaWAN) e visualização de dados históricos de queimadas.

O sistema é composto por:
1.  **Hardware:** Módulos ESP32 LoRa com sensores de qualidade do ar, temperatura, pressão e umidade.
2.  **Backend:** Servidor Node.js para API e leitura serial dos dados LoRa.
3.  **Frontend:** Dashboard em React.js para visualização dos dados.

---

## Pré-requisitos
Para rodar este projeto, você precisará de:
* **Node.js** (v14 ou superior) instalado.
* **XAMPP** (com MySQL Server) rodando.
* **Arduino IDE** (caso precise regravar o firmware nas placas).
* **Drivers da Heltec** instalados (para o computador reconhecer a placa LoRa na USB).

---

## Guia de Hardware (Configuração Física)

O projeto utiliza duas placas **Heltec WiFi LoRa 32 (V2)** operando em 915MHz.

### 1. Placa Transmissora (Campo)
Esta placa fica isolada, lendo os sensores e enviando via rádio LoRa.
* **Sensor:** BME280 (Temperatura/Umidade/Pressão) + CCS811 (CO2/TVOC).
* **Conexão I2C:**
    * **SDA:** GPIO 23
    * **SCL:** GPIO 13
* **Alimentação:** Bateria ou USB.

### 2. Placa Receptora (Gateway)
Esta placa recebe os dados via rádio e repassa para o servidor via Cabo USB.
* **⚠️ IMPORTANTE:** Esta placa DEVE estar conectada à porta USB do computador onde o servidor (Backend) estiver rodando.
* **Firmware:** Carregar o código `Receptor.ino`.

---

## Guia de Instalação e Execução

### Passo 1: Banco de Dados
1.  Abra o **XAMPP** e inicie os serviços **Apache** e **MySQL**.
2.  Acesse o **phpMyAdmin** (http://localhost/phpmyadmin).
3.  Crie um banco de dados novo com o nome exato: `projeto_fire`.
    * *Nota: O sistema criará as tabelas automaticamente na primeira execução.*

### Passo 2: Backend (Servidor)
1.  Acesse a pasta `/server` no terminal.
2.  Instale as dependências:
    ```
    npm install
    ```
3.  Inicie o servidor:
    ```
    npm start
    ```
    *Se a placa receptora estiver conectada, você verá os dados chegando no terminal.*

### Passo 3: Frontend (Interface)
1.  Acesse a pasta `/client` em outro terminal.
2.  Instale as dependências:
    ```
    npm install
    ```
3.  Inicie a aplicação:
    ```
    npm start
    ```
    *O sistema abrirá em http://localhost:3000.*

---

## Acesso ao Sistema
Para o primeiro acesso, utilize o administrador padrão criado automaticamente:
* **Email:** `root@root.com`
* **Senha:** `rootAdmin`

---

## Notas

1.  **Porta Serial (USB):**
    O backend tenta conectar automaticamente na porta COM do receptor LoRa. Caso mude a porta USB, pode ser necessário verificar o arquivo `server/servicos/leitorSerialLoRa.js`.

2.  **Bibliotecas Arduino:**
    Se for compilar o código do firmware, instale as bibliotecas:
    * `Adafruit BME280 Library`
    * `Adafruit CCS811 Library`
    * `LoRa` (Sandeep Mistry)
    * `Adafruit SSD1306` & `Adafruit GFX`

3.  **Arquivos Removidos:**
    Para envio, as pastas `node_modules` e arquivos de build foram removidos para leveza. O comando `npm install` restaura tudo.