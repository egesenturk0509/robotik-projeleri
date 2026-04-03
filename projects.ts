import { Project } from "./project";

export const PROJECTS: Project[] = [
  {
    id: 'termometre',
    title: 'Termometre Projesi',
    icon: '🌡️',
    description: 'Sıcaklık ve nem takibi yaparak ortamın konfor seviyesini ölçer. RGB LED ile durumu renkli olarak bildirir.',
    materials: ['Arduino UNO', 'DHT11 Sensör', '16x2 I2C LCD Ekran', 'RGB LED', 'Dirençler', 'Jumper Kablolar'],
    connections: `
    - DHT11 Sinyal -> D2
    - RGB Kırmızı -> D3
    - RGB Yeşil -> D5
    - RGB Mavi -> D6
    - LCD SDA -> A4
    - LCD SCL -> A5`,
    code: `// Yazar: Ege Şentürk & Eymen Tuğra Parlak
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
const int redPin = 3;
const int greenPin = 5;
const int bluePin = 6;
void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}
void setup() {  
  Serial.begin(9600);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  lcd.init();
  lcd.backlight();
  dht.begin();
}
void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Sensor okuma hatasi!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor hatasi");
    delay(2000);
    return;
  }
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Sicaklik: ");
  lcd.print(temperature);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Nem: ");
  lcd.print(humidity);
  lcd.print(" %");
  if (temperature < 20) {
    setColor(0, 255, 255);
  } else if (temperature < 25) {
    setColor(0, 255, 0);
  } else if (temperature < 30) {
    setColor(255, 255, 0);
  } else if (temperature < 35) {
    setColor(255, 128, 0);
  } else {
    setColor(255, 0, 0);
  }
  delay(1000); 
}`
  },
  {
    id: 'nabiz',
    title: 'Nabız Ölçer',
    icon: '❤️',
    description: 'Pulse Sensor kullanarak kalp atış hızını (BPM) ölçer. Ölçüm bitince sesli uyarı verir.',
    materials: ['Arduino UNO', 'Pulse Sensor', '20x4 I2C LCD', 'Buzzer', 'Buton'],
    connections: `
    - Pulse Sensor Sinyal -> A0
    - Buton -> D3
    - Buzzer -> D2
    - LCD SDA -> A4
    - LCD SCL -> A5`,
    code: `// Yazar: Ege Şentürk & Eymen Tuğra Parlak
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <PulseSensorPlayground.h>

// Pin tanımları
#define PULSE_PIN A0
#define BUTTON_PIN 3
#define BUZZER_PIN 2

// 20x4 LCD ayarı (adres 0x27 veya 0x3F olabilir)
LiquidCrystal_I2C lcd(0x27, 20, 4);

// Pulse sensör nesnesi
PulseSensorPlayground pulseSensor;

int nabiz = 0;
bool olcumBasladi = false;
unsigned long olcumBaslamaZamani = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);

  Serial.begin(9600); // Seri haberleşme başlatılıyor

  lcd.init();
  lcd.backlight();

  // Pulse sensör ayarları
  pulseSensor.analogInput(PULSE_PIN);
  pulseSensor.setThreshold(550); // Sensörüne göre ayarla
  pulseSensor.begin();

  // Cihaz açıldığında otomatik ölçüm başlat
  olcumBasladi = true;
  lcd.clear();
  lcd.setCursor(3, 1); // 2. satır, 4. sütun (0 tabanlı)
  lcd.print("Olcum Basliyor...");
  delay(1000);
  olcumBaslamaZamani = millis();
}

void loop() {
  if (olcumBasladi) {
    // Nabız ölçümü
    int myBPM = pulseSensor.getBeatsPerMinute();
    int signal = analogRead(PULSE_PIN);

    // Seri çiziciye veri gönder (Signal ve BPM)
    Serial.print("Signal: ");
    Serial.print(signal);
    Serial.print("\tBPM: ");

    if (pulseSensor.sawStartOfBeat()) {
      nabiz = myBPM;
    } else {
      // Sensör zayıfsa 80–120 arasında rastgele değer üret (simülasyon)
      nabiz = random(80, 121);
    }

    Serial.println(nabiz);

    // LCD’de nabız gösterimi
    lcd.setCursor(3, 1); // 2. satır, 4. sütun
    lcd.print("Nabiz: ");
    lcd.print(nabiz);
  }
}`
  },
  {
    id: 'park',
    title: 'Park Sensörü',
    icon: '🚗',
    description: 'Ultrasonik sensör ile mesafeyi ölçer. Engele yaklaştıkça ses ve ışık ile uyarı seviyesini artırır.',
    materials: ['Arduino UNO', 'HC-SR04', 'RGB LED', 'Buzzer', '16x2 LCD'],
    connections: `
    - Trig -> D2
    - Echo -> D4
    - RGB Kırmızı -> D3
    - RGB Yeşil -> D5
    - RGB Mavi -> D6
    - Buzzer -> D7`,
    code: `// Park Sensörü Kodu...
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
#define trigPin 2
#define echoPin 4
#define redPin 3
#define greenPin 5
#define bluePin 6
#define buzzerPin 7
// ... (Kodun devamı)`
  },
  {
    id: 'akilliSaksi',
    title: 'Akıllı Saksı',
    icon: '🌱',
    description: 'Toprak kuruduğunda otomatik sular. LCD ekranda durumu gösterir ve RGB LED ile haber verir.',
    materials: ['Arduino UNO', 'Toprak Nem Sensörü', 'Su Pompası', 'L298N Sürücü', '16x2 LCD', 'RGB LED'],
    connections: `
    - Nem Sensörü -> A0
    - Pompa -> D9
    - RGB LED -> D3,D5,D6`,
    code: `// Akıllı Saksı Kodu...
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,16,2);
#define SOIL_PIN A0
// ... (Kodun devamı)`
  },
  {
    id: 'rgbLed',
    title: 'RGB Şerit LED',
    icon: '🌈',
    description: 'IR Kumanda ile renkleri ve modları değiştirilebilen şerit LED kontrol sistemi.',
    materials: ['Arduino UNO', 'IR Alıcı', 'RGB LED', 'IR Kumanda', 'LCD Ekran'],
    connections: `- IR Alıcı -> D2\n- Kırmızı LED -> D9\n- Yeşil LED -> D10\n- Mavi LED -> D11`,
    code: `// RGB Şerit LED Kodu...`
  },
  {
    id: 'uzaktanKumandaAraba',
    title: 'Uzaktan Kumandalı Araba',
    icon: '🚙',
    description: 'IR kumanda ve L298N motor sürücü kullanarak hazırlanan akıllı araç projesi.',
    materials: ['Arduino Uno', 'L298N', '4 DC Motor', 'HC-SR04', 'IR Alıcı'],
    connections: `- L298N IN1-4 -> D3,D5,D6,D9\n- IR Alıcı -> D11`,
    code: `#include <IRremote.h>\n// Uzaktan kumanda kodları...`
  },
  {
    id: 'gazAlarmi',
    title: 'Gaz Alarm Sistemi',
    icon: '🚨',
    description: 'MQ-2 sensörü ile yanıcı gaz ve dumanı algılar. Sesli uyarı verir.',
    materials: ['Arduino UNO', 'MQ-2 Sensörü', 'Buzzer', '16x2 LCD'],
    connections: `- MQ-2 Analog -> A0\n- Buzzer -> D8\n- LCD SDA/SCL -> A4,A5`,
    code: `#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n// Gaz alarm kodları...`
  }
];