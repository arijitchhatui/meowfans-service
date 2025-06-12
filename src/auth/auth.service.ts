import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';
import * as moment from 'moment';
import { UsersEntity } from 'src/rdb/entities';
import { UserProfilesRepository, UsersRepository } from 'src/rdb/repositories';
import { JwtUser } from './decorators/current-user.decorator';
import { UserRoles } from './decorators/roles.decorator';
import { LoginInput } from './dto/login.dto';
import { SignupInput } from './dto/signup.dto';

const jwtVersion = 'v1';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private userProfilesRepository: UserProfilesRepository,
  ) {}

  async login(input: LoginInput) {
    const user = await this.usersRepository.findOne({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException();

    const isCorrect = await bcryptjs.compare(input.password, user.password);
    if (!isCorrect) throw new UnauthorizedException();

    return this.createToken(user);
  }

  async signup(input: SignupInput) {
    const userExists = await this.usersRepository.findOne({ where: { email: input.email } });
    if (userExists) throw new ConflictException('Email already exists!');

    const username = `${input.fullName
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')}-${randomBytes(3).toString('hex')}`;

    const userEntity = this.usersRepository.create({
      email: input.email,
      password: await bcryptjs.hash(input.password, 10),
      userProfile: this.userProfilesRepository.create({
        fullName: input.fullName,
        username: username,
      }),
    });
    const user = await this.usersRepository.save(userEntity);

    return this.createToken(user);
  }

  async getCurrentUser(jwtUser: JwtUser) {
    const userProfile = await this.userProfilesRepository.findOneOrFail({
      where: { userId: jwtUser.sub },
      relations: { user: true },
      cache: true,
    });
    return userProfile;
  }

  validateJwt(jwtUser: JwtUser) {
    if (jwtUser.version !== jwtVersion) throw new UnauthorizedException();
    return jwtUser;
  }

  private createToken(user: UsersEntity) {
    const payload = {
      sub: user.id,
      jti: randomUUID(),
      version: jwtVersion,
      roles: user.isAdmin ? [UserRoles.USER] : [UserRoles.USER],
    } satisfies Partial<JwtUser>;

    return {
      userId: user.id,
      expiresIn: moment().add(72, 'hours').toDate().getTime(),
      accessToken: this.jwtService.sign(payload),
    };
  }
}
