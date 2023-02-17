FROM ubuntu:20.04
COPY ./ /src

RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-venv
RUN apt-get install -y curl
RUN curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core-installer/master/get-platformio.py -o get-platformio.py
RUN python3 get-platformio.py
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g nodemon

RUN mkdir -p /usr/local/bin
RUN ln -s ~/.platformio/penv/bin/platformio /usr/local/bin/platformio
RUN ln -s ~/.platformio/penv/bin/pio /usr/local/bin/pio
RUN ln -s ~/.platformio/penv/bin/piodebuggdb /usr/local/bin/piodebuggdb

RUN pio pkg install -g --tool "platformio/tool-esptoolpy@1.20600.0"
# RUN pio pkg install -g --tool "platformio/tool-mkspiffs@^2.230.0"
RUN pio pkg install -g --tool "platformio/toolchain-xtensa32@^2.50200.97"
RUN pio pkg install -g --tool "platformio/framework-arduinoespressif32@3.10004.210126"
RUN pio pkg install -g --platform "platformio/espressif32@2.0.0"

EXPOSE 5000

WORKDIR /src
CMD [ "node", "app.js" ]
