<?php

return [
    'password' => [
        'length' => env('VALIDATE_PASSWORD_LENGTH', 5),
        'lowercase' => env('VALIDATE_PASSWORD_LOWERCASE_COUNT', 1),
        'uppercase' => env('VALIDATE_PASSWORD_UPPERCASE_COUNT', 1),
        'digit' => env('VALIDATE_PASSWORD_DIGIT_COUNT', 1),
        'special' => env('VALIDATE_PASSWORD_SPECIAL_COUNT', 1),
        'specialchar' => env('VALIDATE_PASSWORD_SPECIAL_CHARACTERS', '@$!%*#?&'),
    ],
];
