const express = require("express");
const fs = require("fs");
var bodyParser = require("body-parser");

const app = express();
const httpServer = require("http").createServer(app);
var cors = require("cors");
const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
  origins: "localhost:*",
});

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
      const featureDefine = `#define ${f.value.toUpperCase()}${
        f.extra ? f.extra.join(" ") : ""
      }\n\n`;
      fileString = fileString.concat(featureDefine);
      if (f.dependencies && f.dependencies?.length > 0) {
        let depDefine = `#ifdef ${f.value}\n`;
        f.dependencies.forEach((dep) => {
          if (dep.isEnabled) {
            depDefine = depDefine.concat(
              `#define ${dep.value.toUpperCase()}\n`
            );
          }
        });
        depDefine = depDefine.concat(`#endif\n\n`);
        fileString = fileString.concat(depDefine);
      }
    }
  });
  fileString = fileString.concat("/* ------- End of file ------- */");
  console.log(fileString);
  fs.writeFileSync(`${dir}/features.h`, fileString);
};

const generateAlgorithmFile = (dir, algorithm_name, fileString) => {
  try {
    fs.writeFileSync(`${dir}/${algorithm_name}.cpp`, fileString);
  } catch (error) {}
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

const childProcess = require("child_process");

const port = 5000;

socketIO.on("connection", (socket) => {
  console.log("Connection established!");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  return res.json({ msg: "Hello from remote cross compiler..." });
});

app.get("/update", (req, res) => {
  console.log(req.query);
  const file = `${__dirname}/${
    req.query.dir || "esp_robot_firmware"
  }/recent_builds/firmware_${req.query.robot_id}.bin`;
  res.download(file);
});

app.post("/build", async (req, res) => {
  const firmwareDir = req.query.dir || "esp_robot_firmware";
  console.log(req.body);

  res.json({ msg: `${firmwareDir} build started!` });
  // validate schema! //TODO : Important
  socketIO.emit("Feature file validation...SKIPPING.....\n");

  // generate feature file..
  socketIO.emit("Generating feature file...\n");
  generateFeatureFile(`${firmwareDir}/firmware`, req.body?.features || []);
  socketIO.emit("Feature file generated successfully...\n\n");

  // generate algorithm
  const algorithm_name = req.body?.algorithm_name;
  socketIO.emit(`Writing algorithm to file ${algorithm_name}...\n`);
  generateAlgorithmFile(
    `${firmwareDir}/firmware/algorithms`,
    algorithm_name,
    req.body?.algorithm_body
  );
  socketIO.emit("File written successfully...\n\n");
  const robot_id = req.body?.robot_id ?? 0;
  socketIO.emit("build", `Building for robot ${robot_id}\n`);
  generateCustomInitFileForRobot(firmwareDir, robot_id);
  const bash_run = childProcess.spawn(
    `cd ${req.query.dir || "esp_robot_firmware"} && pio run && cp ./.pio/build/nodemcu-32s/firmware_${robot_id}.bin ./recent_builds`,
    { shell: true }
  );
  bash_run.stdout.on("data", function (data) {
    socketIO.emit("build", data.toString());
  });
  bash_run.stderr.on("data", function (data) {
    socketIO.emit("build", data.toString());
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
