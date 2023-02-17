#pragma once

#include <Arduino.h>

#include "define.h"
#include "features.h"

#include "config/pins.h"
#include "mqtt/mqtt.h"
#include "algorithms/algorithm.h"
#include "wifi/ota/robot_ota.h"
#include "wifi/ota/OTAUpdate.h"

int modeController();
void loopModes();
void loop();
void mode_sensorTest();
