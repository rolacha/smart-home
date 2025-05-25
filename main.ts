let allowedUID = ""
let motionDetected = false
let gasLevel = 0
let temp = 0
let hum = 0
let uidArray = 0
let uid = ""
input.onButtonPressed(Button.AB, function () {
    // استبدله بـ UID الحقيقي
    allowedUID = "12345678"
    // إعداد DHT11
    dht11_dht22.selectTempType(tempType.celsius)
    // تهيئة السيرفو والـ LCD
    // إغلاق مبدئي
    servos.P0.setAngle(0)
    I2C_LCD1602.LcdInit(0)
    I2C_LCD1602.ShowString("Smart Home Ready", 0, 0)
    basic.pause(2000)
    I2C_LCD1602.clear()
    // إعداد RFID
    serial.redirectToUSB()
    MFRC522.Init()
    basic.showIcon(IconNames.Happy)
})
basic.forever(function () {
    // قراءة الحركة
    motionDetected = pins.digitalReadPin(DigitalPin.P1) == 1
    // قراءة الغاز
    gasLevel = pins.analogReadPin(AnalogPin.P4)
    dht11_dht22.readDataSuccessful();
temp = dht11_dht22.readData(dataType.temperature)
    hum = dht11_dht22.readData(dataType.humidity)
    // حالة الحركة
    if (motionDetected) {
        pins.digitalWritePin(DigitalPin.P2, 1)
        I2C_LCD1602.ShowString("Motion: Yes     ", 0, 0)
        if (temp < 30) {
            if (MFRC522.read) {
                MFRC522.getID;
// Get UID as array
                uidArray = MFRC522.getID()
                // Reset uid
                uid = ""
                // Now this will print the actual UID
                serial.writeLine("UID: " + uid)
            }
        }
        if (uid == allowedUID) {
            I2C_LCD1602.ShowString("Access Granted ", 0, 1)
            // فتح الباب
            servos.P0.setAngle(90)
            basic.pause(3000)
            // إغلاق الباب
            servos.P0.setAngle(0)
        } else {
            I2C_LCD1602.ShowString("Access Denied  ", 0, 1)
        }
    } else {
        I2C_LCD1602.ShowString("High Temp!      ", 0, 1)
    }
    if (!(motionDetected)) {
        pins.digitalWritePin(DigitalPin.P2, 0)
        I2C_LCD1602.ShowString("Motion: No      ", 0, 0)
        servos.P0.setAngle(0)
    }
    // عرض بيانات إضافية
    basic.pause(2000)
    I2C_LCD1602.ShowString("                ", 0, 1)
    I2C_LCD1602.ShowString("Gas:" + gasLevel + " T:" + temp + "C", 0, 1)
    basic.pause(2000)
    I2C_LCD1602.ShowString("                ", 0, 1)
    I2C_LCD1602.ShowString("Humidity:" + hum + "%     ", 0, 1)
    basic.pause(2000)
})
