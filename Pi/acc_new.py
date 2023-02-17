#Code that re-runs peak finder over and over
import smbus2
#import pandas as pd
import RPi.GPIO as GPIO
import time
import numpy as np
GPIO.setmode(GPIO.BCM) 
GPIO.setup(23, GPIO.OUT) 
GPIO.setup(24, GPIO.OUT) 
GPIO.setwarnings(False)

LIS3DH_ADRESS = 0x18 #Add the I2C bus address for the sensor here
REGISTER_ADRESS = 0x20 #Add the command to read temperature here
PIN_VIBRATE = 23
PIN_VIBRATE2 = 24

bus = smbus2.SMBus(1)
time.sleep(1)
#Set up a write transaction that sends the command to measure temperature
cmd_meas_acceleration = smbus2.i2c_msg.write(LIS3DH_ADRESS,[REGISTER_ADRESS, 0x77])
    
#Execute the two transactions with a small delay between them
bus.i2c_rdwr(cmd_meas_acceleration)
time.sleep(0.1)


#-------------------------------Signal Processing---------------------------


#----Helper functions-----

#Calculate twos_complement
def two_complement(val_unsigned, bits):
    if (val_unsigned >= 2**(bits - 1)): val = -(2**16 - val_unsigned)
    else: val = val_unsigned
    return val

#Read data
def read_accelerometer_data():
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
    
    return (x, y, z)



def relative_heights(x, peaks):

    rel_heights = [0]*len(peaks)
    left_bases = [0]*len(peaks)
    right_bases = [0]*len(peaks)

    for peak_nr in range(len(peaks)):
        peak = peaks[peak_nr]
        i_min = 0
        i_max = len(x) - 1


        # Find the left base in interval [i_min, peak]
        i = left_bases[peak_nr] = peak
        left_min = x[peak]
        while i_min <= i and x[i] <= x[peak]:
            if x[i] < left_min:
                left_min = x[i]
                left_bases[peak_nr] = i
            i -= 1

        # Find the right base in interval [peak, i_max]
        i = right_bases[peak_nr] = peak
        right_min = x[peak]
        while i <= i_max and x[i] <= x[peak]:
            if x[i] < right_min:
                right_min = x[i]
                right_bases[peak_nr] = i
            i += 1

        rel_heights[peak_nr] = x[peak] - max(left_min, right_min)

    return rel_heights

#Find index of peaks in a signal
def peak_finder(x, height=None, relative_height = None):
    i = 1 
    i_max = len(x) - 1
    maxima = []
    while (i < i_max):
        if (x[i - 1] < x[i]):
            i_next = i + 1 

            while (i_next < i_max) and (x[i_next] == x[i]):
                i_next += 1


            if (x[i_next] < x[i]):
                if (height == None):
                    maxima.append((i + i_next - 1) // 2)
                    i = i_next
                elif (height < x[i]):
                    maxima.append((i + i_next - 1) // 2)
                    i = i_next
        i += 1
    if (relative_height != None):     
        rel_heights = relative_heights(x, maxima)
        peaks = []
        for i in range(len(rel_heights)):
            if rel_heights[i] >= relative_height:
                peaks.append(maxima[i])
    else:
        peaks = maxima
        
    return peaks

#Vibrate
def vibrate_goal():
    GPIO.output(PIN_VIBRATE, 1)     
    GPIO.output(PIN_VIBRATE2, 1)       
    time.sleep(0.5)        
    GPIO.output(PIN_VIBRATE, 0)          
    GPIO.output(PIN_VIBRATE2, 0)           
    time.sleep(0.5)
    GPIO.output(PIN_VIBRATE, 1)
    GPIO.output(PIN_VIBRATE2, 1)            
    time.sleep(0.5)  
    GPIO.output(PIN_VIBRATE,0)
    GPIO.output(PIN_VIBRATE2, 0)    
    
def vibrate_start():
    GPIO.output(PIN_VIBRATE, 1)
    GPIO.output(PIN_VIBRATE2, 1)         
    time.sleep(0.5)                 
    GPIO.output(PIN_VIBRATE, 0) 
    GPIO.output(PIN_VIBRATE2, 0)          

def vibrate_rest():
    GPIO.output(PIN_VIBRATE, 1) 
    GPIO.output(PIN_VIBRATE2, 1)        
    time.sleep(0.5)                 
    GPIO.output(PIN_VIBRATE, 0)
    GPIO.output(PIN_VIBRATE2, 0)


#Remove in final version
# def to_csv(array, name):
#     f = open(name + ".csv", 'w')
#     for element in array:
#         f.write(str(element) + "\n")
#     f.close()
    
    
#-----Parameters-----
FILTER_TAPS = 150

SAMPLES_SAVED = 800
MIN_PEAK_HEIGHT = 1.0
MIN_REL_HEIGHT = 0.75

MAX_IDLE = 20
REP_GOAL = 10

def start_set(target_reps):
    #Variables Initialised
    z_arr = []
    mag_arr = []
    reps = 0
    previous_reps = 0
    recent_reps = 1
    goal_hit = False
    set_started = False
    vibrate_start()
    while True:

        # N-tap averaging filter
        x_1 = []
        y_1 = []
        z_1 = []

        for i in range(FILTER_TAPS):
            (x, y, z) = read_accelerometer_data()
            x_1.append(x)
            y_1.append(y)
            z_1.append(z)

        x = sum(x_1)/len(x_1)
        y = sum(y_1)/len(y_1)
        z = sum(z_1)/len(z_1)
        mag = (x**2 + y**2 + z**2)**0.5

        #Change window and count reps
        if (len(z_arr) < SAMPLES_SAVED):
            z_arr.append(z)
            mag_arr.append(mag)
        else:
            z_arr = z_arr[1:] + [z]
            mag_arr = mag_arr[1:] + [mag]

        #Count reps (peaks)
        reps = len(peak_finder(z_arr, height = MIN_PEAK_HEIGHT, relative_height = MIN_REL_HEIGHT))
        if (previous_reps != reps):
            print("Reps:", reps)
            previous_reps = reps
            set_started = True

        if (len(z_arr) > MAX_IDLE) and (set_started):
            recent_reps = len(peak_finder(z_arr[-MAX_IDLE:], height = MIN_PEAK_HEIGHT, relative_height = MIN_REL_HEIGHT))


        #Vibrate when rep_goal hit and when rest started
        try:
            if (reps == target_reps) and (not goal_hit):
                print("Rep goal hit!")
                vibrate_goal()
                goal_hit = True

            else:
                GPIO.output(PIN_VIBRATE,0)
                GPIO.output(PIN_VIBRATE2,0)

            if (recent_reps == 0):
                print("Rest started..")
                vibrate_rest()
                break

            else:
                GPIO.output(PIN_VIBRATE,0)
                GPIO.output(PIN_VIBRATE2,0)

        except KeyboardInterrupt:
            GPIO.cleanup()


        print("x: {} y: {} z: {}".format(round(x, 3),round(y,3),round(z,3)))
    return reps


# def start_set_y(target_reps):
#     #Variables Initialised
#     z_arr = []
#     y_arr = []
#     reps = 0
#     previous_reps = 0
#     recent_reps = 1
#     goal_hit = False
#     set_started = False

#     #Initialise signal processing variables:
#     d = 3 #dimension of input data
#     l = 1 #dimension of output data
#     k = 50 #window size 
#     U = np.zeros((d,l))
#     B_t = np.zeros((k,d)) 
#     sigma_array = np.zeros(l) #array of size l
#     #vibrate_start()

#     while True:

#         # N-tap averaging filter
#         x_1 = []
#         y_1 = []
#         z_1 = []

#         for i in range(FILTER_TAPS):
#             (x, y, z) = read_accelerometer_data()
#             x_1.append(x)
#             y_1.append(y)
#             z_1.append(z)

#         x = sum(x_1)/len(x_1)
#         y = sum(y_1)/len(y_1)
#         z = sum(z_1)/len(z_1)

#         B_t, U, sigma_array, y_t = process_1_input_vector(x,y,z,k,l,d,sigma_array, B_t, U)

#         #Change window and count reps
#         if (len(y_arr) < SAMPLES_SAVED):
#             y_arr.append(y_t)
#         else:
#             y_arr = y_arr[1:] + [y_t]

#         #Count reps (peaks)
#         reps = len(peak_finder(y_arr, height = MIN_PEAK_HEIGHT))
#         if (previous_reps != reps):
#             print("Reps:", reps)
#             previous_reps = reps
#             set_started = True

#         if (len(y_arr) > MAX_IDLE) and (set_started):
#             recent_reps = len(peak_finder(y_arr[-MAX_IDLE:], height = MIN_PEAK_HEIGHT))


#         #Vibrate when rep_goal hit and when rest started
#         try:
#             if (reps == target_reps) and (not goal_hit):
#                 print("Rep goal hit!")
#                 # vibrate_goal()
#                 goal_hit = True

#             else:
#                 GPIO.output(PIN_VIBRATE,0)

#             if (recent_reps == 0):
#                 print("Rest started..")
#                 to_csv(z_arr, "z_arr")
#                 # vibrate_rest()
#                 break

#             else:
#                 GPIO.output(PIN_VIBRATE,0)

#         except KeyboardInterrupt:
#             GPIO.cleanup()

#         print("y_t: {} ".format(y_t))

#     return reps


    

# if __name__ == "__main__":
#     start_set(10)