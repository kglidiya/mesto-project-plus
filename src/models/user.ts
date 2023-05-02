import {
  model, Model, Schema, Document,
} from 'mongoose';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../errors/unauthorized-err';
import { LINK_REGEX, EMAIL_REGEX } from '../utils';

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      validate: {
        validator(v: string) {
          return EMAIL_REGEX.test(v);
        },
        message: 'Неверный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v: string) {
          return LINK_REGEX.test(v);
        },
        message: 'Неверный формат ссылки',
      },
    },
  },
  { versionKey: false },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
});

export default model<IUser, UserModel>('User', userSchema);
