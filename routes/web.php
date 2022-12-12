<?php

/** @var \Laravel\Lumen\Routing\Router $router */

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

$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post("/login", "UserController@login");
    $router->post("/register", "UserController@register");
});

$router->group(['prefix' => 'products'], function () use ($router) {
    $router->get("/", "ProductController@index");
    $router->get("/{productId}", "ProductController@get");
    $router->post("/", "ProductController@create");
    $router->put("/{productId}", "ProductController@update");
    $router->delete("/{productId}", "ProductController@destroy");
});

$router->group(['prefix' => 'buyers'], function () use ($router) {
    $router->post("/buy", "UserController@buy");
    $router->get("/deposit", "UserController@deposit");
});

