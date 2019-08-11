<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\Models\User::class, function (Faker\Generator $faker) {

    //$number = $faker->numberBetween(1, 99);
    gc_collect_cycles();

    return [
        'name'  => str_replace('.', '', $faker->unique()->userName),
        'email'     => $faker->unique()->email,
        'password'  => $faker->regexify('[A-Z]{2}[a-z]{2}[0-9]+@[A-Za-z0-9]{10}'),
        'token' => $faker->unique()->md5,
        'verified' => 1,
        'temporary'=>0,
    ];
});

$factory->define(App\Models\Exam::class, function (Faker\Generator $faker) {

    //$number = $faker->numberBetween(1, 99);
    gc_collect_cycles();

    return [
        'name'=>str_replace('.', '', $faker->unique()->name),
        'date'=>$faker->dateTimeBetween('now', '+30 years')->format('Y-m-d H:i:s'),
        'locked'=>false
    ];
});