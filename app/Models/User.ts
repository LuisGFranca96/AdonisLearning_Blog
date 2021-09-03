import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import { nanoid } from 'nanoid'
import Env from '@ioc:Adonis/Core/Env'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({})
  public email: string

  @column({ serializeAs:null })
  public password: string

  @column()
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

  public async sendVerificationEmail(session){
    const token= nanoid()
    session.put(`token-${this.id}`,token)
    const url= `${Env.get('APP_URL')}/confirm-email/${this.id}/${token}`

   await Mail.send ((message) => {
            message
              .from('info@example.com')
              .to(this.email)
              .subject('Please verify your email')
              .htmlView('emails/verify', { user: this,url })
          })
}
}