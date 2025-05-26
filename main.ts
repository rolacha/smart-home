let hum = 0
let temp = 0
let gasLevel = 0
let motionDetected = false
basic.showString("Welcome smart home :)")
// قفل الباب
servos.P0.setAngle(15)
I2C_LCD1602.LcdInit(0)
I2C_LCD1602.clear()
basic.showIcon(IconNames.Heart)
basic.forever(function () {
    // قراءة الحركة
    motionDetected = pins.digitalReadPin(DigitalPin.P1) == 1
    // قراءة الغاز
    gasLevel = pins.analogReadPin(AnalogPin.P4)
    // قراءة الحرارة والرطوبة
    dht11_dht22.selectTempType(tempType.celsius)
    dht11_dht22.readDataSuccessful()
temp = dht11_dht22.readData(dataType.temperature)
    hum = dht11_dht22.readData(dataType.humidity)
    if (motionDetected) {
        pins.digitalWritePin(DigitalPin.P2, 1)
        I2C_LCD1602.ShowString("Motion: Yes     ", 0, 0)
        if (temp < 30) {
            I2C_LCD1602.ShowString("Door Open       ", 0, 1)
            // فتح الباب
            servos.P0.setAngle(90)
            basic.pause(500)
            // قفل الباب
            servos.P0.setAngle(0)
        } else {
            I2C_LCD1602.ShowString("High Temp!      ", 0, 1)
        }
    } else {
        pins.digitalWritePin(DigitalPin.P2, 0)
        I2C_LCD1602.ShowString("Motion: No      ", 0, 0)
        servos.P0.setAngle(0)
    }
    basic.pause(2000)
    I2C_LCD1602.ShowString("                ", 0, 1)
    I2C_LCD1602.ShowString("Gas:" + gasLevel + " T:" + temp + "C", 0, 1)
    basic.pause(500)
    I2C_LCD1602.ShowString("                ", 0, 1)
    I2C_LCD1602.ShowString("Humidity:" + hum + "%     ", 0, 1)
    basic.pause(500)
})
