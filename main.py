motionDetected = False
gasLevel = 0
hum = 0
uid = ""
allowedUID = "12345678"
# استبدله بـ UID الحقيقي
# إعداد DHT11
dht11_dht22.select_temp_type(tempType.CELSIUS)
dht11_dht22.read_data_successful()
# تهيئة السيرفو والـ LCD
servos.P0.set_angle(0)
# إغلاق مبدئي
I2C_LCD1602.lcd_init(0)
I2C_LCD1602.show_string("Smart Home Ready", 0, 0)
basic.pause(2000)
I2C_LCD1602.clear()
# إعداد RFID
serial.redirect_to_usb()
MFRC522.init()
basic.show_icon(IconNames.HAPPY)

def on_forever():
    global motionDetected, gasLevel, hum, uid
    # قراءة الحركة
    motionDetected = pins.digital_read_pin(DigitalPin.P1) == 1
    # قراءة الغاز
    gasLevel = pins.analog_read_pin(AnalogPin.P4)
    # قراءة الحرارة والرطوبة
    temp = dht11_dht22.read_data(dataType.TEMPERATURE)
    hum = dht11_dht22.read_data(dataType.HUMIDITY)
    # حالة الحركة
    if motionDetected:
        pins.digital_write_pin(DigitalPin.P2, 1)
        I2C_LCD1602.show_string("Motion: Yes     ", 0, 0)
        if temp < 30:
            if MFRC522.isCard():
                MFRC522.readCardSerial()
                uid = MFRC522.get_id()
                # تأكد أن getID() ترجع UID كـ String
                serial.write_line("UID: " + uid)
                # إغلاق الباب
                if uid == allowedUID:
                    I2C_LCD1602.show_string("Access Granted ", 0, 1)
                    servos.P0.set_angle(90)
                    # فتح الباب
                    basic.pause(3000)
                    servos.P0.set_angle(0)
                else:
                    I2C_LCD1602.show_string("Access Denied  ", 0, 1)
        else:
            I2C_LCD1602.show_string("High Temp!      ", 0, 1)
    else:
        pins.digital_write_pin(DigitalPin.P2, 0)
        I2C_LCD1602.show_string("Motion: No      ", 0, 0)
        servos.P0.set_angle(0)
    # عرض بيانات إضافية
    basic.pause(2000)
    I2C_LCD1602.show_string("Gas:" + str(gasLevel) + " T:" + str(temp) + "C", 0, 1)
    basic.pause(2000)
    I2C_LCD1602.show_string("Humidity:" + str(hum) + "%     ", 0, 1)
    basic.pause(2000)
basic.forever(on_forever)
