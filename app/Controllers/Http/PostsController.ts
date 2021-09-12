
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import Application from '@ioc:Adonis/Core/Application'
import { schema } from '@ioc:Adonis/Core/Validator'


export default class PostsController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({view}: HttpContextContract) {

    return view.render('posts/create')
  }

  public async store ({request, auth ,response}: HttpContextContract) {
    
    const req = await request.validate({
      schema:schema.create({
          caption: schema.string(),
          image: schema.file({
            extnames: ['jpg','png', 'jped'],
          })
      }),
      messages: {
          'image.required':'Por favor selecione uma imagem',
      } 
    })
    
    const imageName= new Date().getTime().toString() + `.${req.image.extname}`
    await req.image.move(Application.publicPath('images'),{
        name: imageName
    })
      const post = new Post()
      post.image= `images/${imageName}`
      post.caption = req.caption
      post.userId = auth.user!.id
      post.save()
      return response.redirect(`/${auth.user?.username}`)
  
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
