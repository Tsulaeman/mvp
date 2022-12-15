<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Models\User;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('config', function () use ($router) {
    return [
        'roles' => [
            'buyer' => User::BUYER,
            'seller' => User::SELLER
        ]
    ];
});

$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post("login", "AuthController@login");
    $router->post("register", "UserController@create");
    $router->get("me", "AuthController@me");
    $router->post("logout", "AuthController@logout");
    $router->get("refresh-token", "AuthController@refresh");
});

$router->group(['prefix' => 'users'], function () use ($router) {
    $router->get("/", "UserController@index");
    $router->get("user/{userId}", "UserController@get");
    $router->put("update/{userId}", "UserController@update");
    $router->delete("delete/{userId}", "UserController@desroy");
});

$router->group(['prefix' => 'products'], function () use ($router) {
    $router->get("/", "ProductController@index");
    $router->get("product/{productId}", "ProductController@get");
    $router->post("create", "ProductController@create");
    $router->put("update/{productId}", "ProductController@update");
    $router->delete("delete/{productId}", "ProductController@destroy");
});

$router->group(['prefix' => 'buyers', "middleware" => ["buyer"]], function () use ($router) {
    $router->post("buy", "UserController@buy");
    $router->patch("deposit", "UserController@deposit");
    $router->patch("reset", "UserController@reset");
});


