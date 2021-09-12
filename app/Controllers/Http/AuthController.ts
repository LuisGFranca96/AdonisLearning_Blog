//  import { Response } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import authConfig from 'Config/auth'

export default class SignupController {
    //signup call
    public async signup({ request, response }:HttpContextContract){
        const req = await request.validate({ 
            schema:schema.create({
            name: schema.string(),
            username: schema.string(),
            email: schema.string({},[
                rules.email(),
            ]),
            
            password: schema.string(),   
        }),
        messages: {
            'name.required':'Por favor digite o nome',
            'email.required':'Por favor digite o email',
            'username.required':'Por favor digite seu nome de usuário',
            'password.required':'Por favor digite uma senha',
        }
    })
        const user = new User()
        user.name = req.name
        user.email = req.email
        user.username= req.username
        user.password = req.password
        await user.save();

        // send verification email
        user?.sendVerificationEmail()
        return response.redirect('/')
    }
        //login call
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
        const user = await auth.attempt(email,password)          
        return response.redirect(`/${user.username}`)

    }

    public async logout({ auth, response }:HttpContextContract){
        await auth.logout()
        return response.redirect('/')
    }
}
