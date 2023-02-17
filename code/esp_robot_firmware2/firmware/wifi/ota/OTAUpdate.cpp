#include "OTAUpdate.h"
#include "modules/neopixel/neopixel.h"
namespace ota
{
    int downloadAndInstall(char* dir)
    {
        #ifdef NEOPIXEL_INDICATIONS
        pixelColorWave(100, 100, 100); // white
        #endif
        
        /*
            We connect to the server endpoint which returns a .bin file.
            We start the update and return 1 if successfull.
        */
        WiFiClient client;

        std::string endpoint = "http://10.30.14.200:5001/update?dir=";
        endpoint.append(dir);
        Serial.printf("Starting to download from %s", endpoint.c_str());


        t_httpUpdate_return ret = httpUpdate.update(client, endpoint.c_str());

        switch (ret)
        {
        case HTTP_UPDATE_FAILED:
            #ifdef NEOPIXEL_INDICATIONS
            pixelColorWave(100, 0, 0);
            #endif
            Serial.printf("HTTP_UPDATE_FAILD Error (%d): %s", httpUpdate.getLastError(), httpUpdate.getLastErrorString().c_str());
            return 0;

        case HTTP_UPDATE_NO_UPDATES:
            Serial.println("HTTP_UPDATE_NO_UPDATES");
            return 0;

        case HTTP_UPDATE_OK:
            #ifdef NEOPIXEL_INDICATIONS
            pixelColorWave(100, 100, 0); // yellow
            #endif
            Serial.println("Update: OK");
            ESP.restart();
            return 1;
        }

        return 0;
    }
}