import time
import smbus2
import numpy as np
import pandas as pd
import RPi.GPIO as GPIO
from time import sleep
GPIO.setmode(GPIO.BCM) 
GPIO.setup(26, GPIO.OUT) 
GPIO.setwarnings(False)

LIS3DH_ADRESS = 0x18 #Add the I2C bus address for the sensor here
REGISTER_ADRESS = 0x20 #Add the command to read temperature here

bus = smbus2.SMBus(1)
time.sleep(1)
#Set up a write transaction that sends the command to measure temperature
cmd_meas_acceleration = smbus2.i2c_msg.write(LIS3DH_ADRESS,[REGISTER_ADRESS, 0x27])

#Set up a read transaction that reads two bytes of data
def two_complement(val_unsigned, bits):
    if (val_unsigned >= 2**(bits - 1)): val = -(2**16 - val_unsigned)
    else: val = val_unsigned
    return val
    
#Execute the two transactions with a small delay between them
bus.i2c_rdwr(cmd_meas_acceleration)
time.sleep(0.1)

COUNT = 100
reps = 0
desired_reps = 2
z_cross = 0
j = 0
# Initialize window size and step
window_size = 10
step = 10

# Initialize transition count
transition_count = 0
z_avg = []
z_raw = []
mag_avg = []
mag_raw = []

while True:

    x_1 = []
    y_1 = []
    z_1 = []

    for i in range(COUNT):
        
        x_high = bus.read_byte_data(LIS3DH_ADRESS,0x29)
        x_low = bus.read_byte_data(LIS3DH_ADRESS,0x28)
        y_high = bus.read_byte_data(LIS3DH_ADRESS,0x2B)
        y_low = bus.read_byte_data(LIS3DH_ADRESS,0x2A)
        z_high = bus.read_byte_data(LIS3DH_ADRESS,0x2D)
        z_low = bus.read_byte_data(LIS3DH_ADRESS,0x2C)

        x_unsigned = (x_high<<8) + x_low
        x_acc = two_complement(x_unsigned, 16)
        x = x_acc*9.81/16384
        
        y_unsigned = (y_high<<8) + y_low
        y_acc = two_complement(y_unsigned, 16)
        y = y_acc*9.81/16384
        
        z_unsigned = (z_high<<8) + z_low
        z_acc = two_complement(z_unsigned, 16)
        z = (z_acc*(-9.81)/16384) + 9.81

        x_1.append(x)
        y_1.append(y)
        z_1.append(z)
        z_raw.append(z)
        mag_raw.append(x**2 + y**2 + z**2)
        

    x = sum(x_1)/len(x_1)
    y = sum(y_1)/len(y_1)
    z = sum(z_1)/len(z_1)
    z_avg.append(z)
    mag_avg.append((x**2 + y**2 + z**2))
    
    j += 1
    if j == 100:
        f = open("avg_z.csv", "w")
        for i in z_avg:
            f.write(str(i) + "\n")
        f.close()
        f = open("raw_z.csv", "w")
        for i in z_raw:
            f.write(str(i) + "\n")
        f.close()
        f = open("avg_mag.csv", "w")
        for i in mag_avg:
            f.write(str(i) + "\n")
        f.close()
        f = open("raw_mag.csv", "w")
        for i in mag_raw:
            f.write(str(i) + "\n")
        f.close()
        
        # z_df = pd.DataFrame(z_avg)
        # mag_df = pd.DataFrame(mag_avg)
        # z_raw_df = pd.DataFrame(z_raw)
        # mag_raw_df = pd.DataFrame(mag_raw)
        # z_df.to_csv("avg_z.csv")
        # mag_df.to_csv("avg_magnitude.csv")
        # z_raw_df.to_csv("raw_z.csv")
        # mag_raw_df.to_csv("raw_magnitude.csv")
    
    # #counting up and down movement:
    # if len(z_array)<window_size:
    #     z_array.append(z)
    
    # else:
    #     z_array = z_array[1:window_size] + [z]
    #     for i in range(len(z_array)):
    #         z_array[i] = abs(z_array[i])
    #     magnitude = np.array(z_array)
    #     # for i in range(0, len(magnitude) - window_size, step):
    #     #     window = magnitude[i:i+window_size]

    #     # Apply a threshold
    #     threshold = 0.7
    #     up_down = np.zeros(magnitude.shape)
    #     up_down[magnitude > threshold] = 1

    #     # Count transitions
    #     for j in range(2, len(up_down)):
    #         if (up_down[j] != up_down[j-1]) and (up_down[j-1] != up_down[j-2]):
    #             transition_count += 1
    #     print(transition_count)

    # #print("Number of transitions:", transition_count)




    # try:

    #     # z_array = []
    #     # z_array.append(z)
    #     # if len(z_array) == 5:
    #     #     if z_array[0] or z_array[1] or z_array[2] or z_array[3] or z_array[4]:
    #     #         i = z_array.index(0)
    #     #         if z_array[i+1] and z_array[i+2] > 0:
    #     #             z_cross += 1
    #     #     z_array.clear()

    #     # if int(z) == 0:
    #     # z_cross += 1


    
    #     if transition_count == desired_reps:
    #         print("flag")
    #         GPIO.output(26, 1)        
    #         sleep(0.5)                 
    #         GPIO.output(26, 0)           
    #         sleep(0.5)
    #         GPIO.output(26, 1)           
    #         sleep(0.5)  
    #         GPIO.output(26,0)
    #         reps = 0
    #     else:
    #         GPIO.output(26,0)

    # except KeyboardInterrupt:
    #     GPIO.cleanup()
        

    print("x: {} y: {} z: {}".format(round(x, 3),round(y,3),round(z,3)))
    
    
    
    

#convert the result to an int
#acceleration = int.from_bytes(read_result.buf[0x29] + read_result.buf[0x28], 'little')
# + read_result.buf[2] + read_result.buf[3] + read_result.buf[4] + read_result.buf[5] + read_result.buf[6]  ,'big')
# for i in read_result.buf:
# print(int.from_bytes(i, 'big'))




