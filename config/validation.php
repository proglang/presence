<?php

return [
    'password' => [
        'length' => env('VAL_PW_LENGTH', 5),
        'lowercase' => env('VAL_PW_LC_COUNT', 1),
        'uppercase' => env('VAL_PW_UC_COUNT', 1),
        'digit' => env('VAL_PW_DIGIT_COUNT', 1),
        'special' => env('VAL_PW_SC_COUNT', 1),
        'specialchar' => env('VAL_PW_SC', '@$!%*#?&'),
    ],
];
