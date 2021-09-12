import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import Post from './Post'
import Following from './Following'

export default class User extends BaseModel {

  @hasMany(()=>Following)
  public followings:HasMany<typeof Following>

  
 

  @hasMany(()=>Post)
  public posts:HasMany<typeof Post>
  
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({})
  public email: string

  @column({ serializeAs:null })
  public password: string

  @column({ serializeAs:null })
  public username: string

  @column({ serializeAs:null })
  public avatar: string

  @column({ serializeAs:null })
  public details: string

  @column.dateTime()
  public email_verified_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  
  @beforeSave()
  public static async HashPassword(user: User) {
    if (user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
  }

  public async sendVerificationEmail(){
    const url = Env.get('APP_URL') + Route.makeSignedUrl('verifyEmail',{params:{
      email: this.email}, expiresIn:'30m',})

    Mail.send((message) => {
            message
              .from('info@example.com')
              .to(this.email)
              .subject('Please verify your email')
              .htmlView('emails/verify', { user: this,url })
          })
}

public async followers(){
  const followers = await Following.query().where('following_id',this.id)
  return (await followers).length
}
}