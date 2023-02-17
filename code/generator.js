const fs = require('fs');

const features = [
  {
    name: "ALGORITHM",
    value: "ALGO_COLOR_TEST",
    isEnabled: true,
  },
  {
    name: "ENABLE_SERIAL_COMMUNICATION",
    value: "ENABLE_SERIAL_COMMUNICATION",
    isEnabled: false,
    extra: ["1"],
  },
  {
    name: "NEOPIXEL_INDICATIONS",
    value: "NEOPIXEL_INDICATIONS",
    isEnabled: true,
  },
  {
    name: "ENABLE_MEMORY",
    value: "ENABLE_MEMORY",
    isEnabled: true,
  },
  {
    name: "ENABLE_MOTORS",
    value: "ENABLE_MOTORS",
    isEnabled: true,
    dependencies: [
      {
        name: "WHEEL_ENCODER",
        value: "WHEEL_ENCODER",
        isEnabled: true,
      },
      {
        name: "DRIVE_PWM",
        value: "DRIVE_PWM",
        isEnabled: false,
      },
    ],
  },
  {
    name: "ENABLE_DISTANCE_SENSOR",
    value: "ENABLE_DISTANCE_SENSOR",
    isEnabled: true,
    dependencies: [
      {
        name: "DISTANCE_GP2Y0A21YK0F",
        value: "DISTANCE_GP2Y0A21YK0F",
        isEnabled: false,
      },
      {
        name: "DISTANCE_VL53LX0",
        value: "DISTANCE_VL53LX0",
        isEnabled: true,
      },
    ],
  },
  {
    name: "ENABLE_NEOPIXEL_RING",
    value: "ENABLE_NEOPIXEL_RING",
    isEnabled: true,
  },
  {
    name: "ENABLE_COLOR_SENSOR",
    value: "ENABLE_COLOR_SENSOR",
    isEnabled: true,
  },
  {
    name: "ENABLE_COMPASS_SENSOR",
    value: "ENABLE_COMPASS_SENSOR",
    isEnabled: true,
  },
  {
    name: "ENABLE_OTA_UPLOAD",
    value: "ENABLE_OTA_UPLOAD",
    isEnabled: true,
  },
  {
    name: "ENABLE_MQTT",
    value: "ENABLE_MQTT",
    isEnabled: true,
  },
  {
    name: "ENABLE_WIFI",
    value: "ENABLE_WIFI",
    isEnabled: true,
  },
];

const generateFeatureFile = (dir, features) => {
  var fileString = "";
  var header = `
    #pragma once
    /*
      This is an auto-generated file.
    */\n\n`;
  fileString = fileString.concat(header);
  console.log(features);
  features.forEach((f) => {
    if (f.isEnabled) {
      const featureDefine = `#define ${f.value.toUpperCase()}${f.extra ? f.extra.join(
        " "
      ): ''}\n\n`;
      fileString = fileString.concat(featureDefine);
      if (f.dependencies && f.dependencies?.length > 0) {
        let depDefine = `#ifdef ${f.value}\n`;
        f.dependencies.forEach((dep) => {
            if(dep.isEnabled) {
                depDefine = depDefine.concat(`#define ${dep.value.toUpperCase()}\n`);
            }
        });
        depDefine = depDefine.concat(`#endif\n\n`);
        fileString = fileString.concat(depDefine);
      }
    }
  });
  fileString = fileString.concat("/* ------- End of file ------- */");
  fs.writeFileSync(`${dir}/features.h`, fileString);
};
const generateCustomInitFileForRobot = (dir, robotId) => {
  let fileString = `
;PlatformIO Project Configuration File
[platformio]
src_dir = firmware

[env:nodemcu-32s]
platform = espressif32
board = nodemcu-32s
framework = arduino

; Serial Monitor options
monitor_speed = 115200

extra_script=pre:extra_script.py
build_flags =
    '-DROBID=${robotId}'
rob_id = ${robotId}
`;
  try {
    fs.writeFileSync(`${dir}/platformio.ini`, fileString);
  } catch (error) {}
};

// generateFeatureFile("esp_robot_firmware/firmware", features);
generateCustomInitFileForRobot('esp_robot_firmware', 10)