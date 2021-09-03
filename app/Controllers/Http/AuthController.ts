//  import { Response } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';
import Mail from '@ioc:Adonis/Addons/Mail'
import authConfig from 'Config/auth';
//import authConfig from 'Config/auth';

export default class SignupController {
    public async signup({ request, response }:HttpContextContract){
        const req = await request.validate({ 
            schema:schema.create({
            name: schema.string(),
            email: schema.string({},[
                rules.email(),
            ]),
            password: schema.string({},[
                rules.confirmed()
            ]),
            
        }),
        messages: {
            'name.required':'Por favor digite o nome',
            'email.required':'Por favor digite o email',
            'password.required':'Por favor digite uma senha',
        }
    })
        const user = new User()
        user.name = req.name
        user.email = req.email
        user.password = req.password
        await user.save();
  // send verification email
 
      user?.sendVerificationEmail()

        return response.redirect('/')
    }

    public async login({ request, auth, response }:HttpContextContract){
        const req = await request.validate({
            schema:schema.create({
                email: schema.string({},[
                    rules.email(),
                ]),
                password: schema.string({},[
                    rules.minLength(3)
                ])
            }),
            messages: {
                'email.required':'Por favor digite o email',
                'password.required':'Por favor digite a senha',
                'password.minLength':'Senha precisa ter pelo menos 3 caracteres'
            }
        })
        const email = req.email
        const password= req.password
        await auth.attempt(email,password)          
        return response.redirect('/profile')

    }

    public async logout({ auth, response }:HttpContextContract){
        await auth.logout()
        return response.redirect('/')
    }
}
