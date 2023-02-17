#include "modules/neopixel/neopixel.h"
#include "algorithm.h"

    #ifdef ALGO_COLOR_CHANGE



      int s_5DbRmbZ___601c__7Bz__d__ = 1;

      void algorithm_loop() {
        	  if (s_5DbRmbZ___601c__7Bz__d__ == 0) {
      algorithm_execute();
      delay(50);

    }else if (s_5DbRmbZ___601c__7Bz__d__ == 1) {
      algorithm_setup();
      s_5DbRmbZ___601c__7Bz__d__ = 10;

    } else {
      delay(100);

    }

      }


  void algorithm_interrupt(robot_interrupt_t x_leYs_7BfIiSO1QApRb_c, char* C_7Dk8__25_r_5D6mMiJiCA2b_25) {

    }


// Describe this function...
void algorithm_setup() {
  Serial.println("algorithm: setup");
}
// Describe this function...
void algorithm_start() {
  Serial.println("algorithm: start");
  s_5DbRmbZ___601c__7Bz__d__ = 0;
}
// Describe this function...
void algorithm_stop() {
  Serial.println("algorithm: stop");
  s_5DbRmbZ___601c__7Bz__d__ = 10;
}
// Describe this function...
void algorithm_reset() {
  Serial.println("algorithm: reset");
  s_5DbRmbZ___601c__7Bz__d__ = 1;
}
// Describe this function...
void algorithm_execute() {
  Serial.println("algorithm: execute");

      #ifdef NEOPIXEL_INDICATIONS
      	pixelColorWave(100, 0, 0);
      #endif

    delay(1000);

      #ifdef NEOPIXEL_INDICATIONS
      	pixelColorWave(0, 100, 0);
      #endif

    delay(1000);

      #ifdef NEOPIXEL_INDICATIONS
      	pixelColorWave(100, 100, 100);
      #endif

    delay(1000);
}


    #endif
