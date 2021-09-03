/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.on('/').render('profile')
Route.on('/signup').render('auth/signup')
Route.on('/login').render('auth/login')
Route.on('/profile').render('profile').middleware('auth')

Route.post('/verify-email','EmailVerifiesController.index').middleware('auth')
Route.get('/confirm-email/:userid/:token','EmailVerifiesController.confirm')

Route.post('/login','AuthController.login')
Route.post('/signup','AuthController.signup')
Route.post('/logout','AuthController.logout')