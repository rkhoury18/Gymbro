import requests as rq
import time
import smbus2
# import numpy as np
import RPi.GPIO as GPIO
from acc import *
from acc_new import *
GPIO.setmode(GPIO.BCM) 
GPIO.setup(26, GPIO.OUT) 
GPIO.setwarnings(False)

IP = "18.168.150.73:3000"
URL_RCV_EXEC = "http://"+IP+"/pi/start_exec"
URL_SEND_EXEC = "http://"+IP+"/pi/finish_exec"

URL_RCV_SET = "http://"+IP+"/pi/start_set"
URL_SEND_SET = "http://"+IP+"/pi/finish_set"

LIS3DH_ADRESS = 0x18 #I2C bus address for the sensor here
REGISTER_ADRESS = 0x20 #register address
REST_CONST = 10

while True:
        x = rq.get(URL_RCV_EXEC)
        try:
            meta = x.json()
        except:
            print("No workout")
            time.sleep(1)
            continue
        print("meta: ", meta)
        name = meta['name']
        start = meta['start']
        target_sets = meta['sets']
        rest_time = meta['rest']
        max_weight = 0
        max_volume = 0
        if start:
            with smbus2.SMBus(1) as bus:
                #Set up a write transaction that sends the command to measure temperature
                cmd_meas_acceleration = smbus2.i2c_msg.write(LIS3DH_ADRESS,[REGISTER_ADRESS, 0x27])
                #Execute the two transactions with a small delay between them
                bus.i2c_rdwr(cmd_meas_acceleration)
                time.sleep(0.1)
                for i in range(target_sets):
                    print("Starting set: ", i)
                    x = rq.get(URL_RCV_SET)
                    wrkt = x.json()
                    print("wrkt: ", wrkt)
                    target_reps = wrkt['reps']
                    weight = wrkt['weight']
                    stalled = 0
                    
                    #r = start_set(target_reps)
                    r = start_set_y(target_reps) #signal processing using PCA

                    volume = weight*r
                    print("volume: ", volume)
                    if volume > max_volume:
                        max_volume = volume
                    if weight > max_weight:
                        max_weight = weight
                        best_reps = r                   
                    rq.post(URL_SEND_EXEC, data = {'weight':weight, 'reps':r})
                    print("Resting for: ", rest_time, " seconds")
                    time.sleep(rest_time)
                    print("Resting done")

                    
                #once sets are done, vibrate:
                vibrate_finish_set()

                rq.post(URL_SEND_EXEC, data = {'name':name, 'max_weight':max_weight, 'best_reps':best_reps, 'sets':target_sets, 'rest':rest_time, 'volume':max_volume})
        else:
            pass  



