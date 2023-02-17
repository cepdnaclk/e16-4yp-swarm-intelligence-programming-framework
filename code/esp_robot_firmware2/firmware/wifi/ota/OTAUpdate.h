#pragma once
#include <Arduino.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>

namespace ota
{
    int getVersionStatus();

    int downloadAndInstall(char* dir);
}