
// This is the configuration file for the robot
// Fill all the required the parameters and 
// rename this file as 'config.h' before use

#ifndef _ROBOT_CONFIG_H
#define _ROBOT_CONFIG_H

// ---------------------------------------------------------- MQTT Communication
#ifdef ENABLE_MQTT
#define MQTT_SERVER "68.183.188.135"
#define MQTT_PORT 1883
#define MQTT_CLIENT "Robot_"
#define MQTT_USERNAME "swarm_user"
#define MQTT_PASSWORD "swarm_usere15"
#endif

// ------------------------------------------------------------- WiFi Client API
#ifdef ENABLE_WIFI_CLIENT

#define HOST "http://192.168.8.1/";
#define PORT 8081

#endif

// ------------------------------------------------------------ WiFi Credentials
//#define WIFI_SSID "Dialog 4G PRE"
//#define WIFI_PASS "thisakuttige"

#define WIFI_SSID "DiaSul 4G"
#define WIFI_PASS "1997Podi=dialog"

#define OTA_SERVER_IP "192.168.8.103"
#define OTA_SERVER_PORT "5001"

// const char* ssid = WIFI_SSID;
// const char* password = WIFI_PASS;

#endif
