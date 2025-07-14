import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';
import * as moment from 'moment';
import { UsersEntity } from 'src/rdb/entities';
import { FanProfilesRepository, UsersRepository } from 'src/rdb/repositories';
import { CreatorProfilesRepository } from 'src/rdb/repositories/creator-profiles.repository';
import { UploadsService } from 'src/uploads/uploads.service';
import { JwtUser } from './decorators/current-user.decorator';
import { UserRoles } from './decorators/roles.decorator';
import { CreatorSignupInput } from './dto/creator-signup.dto';
import { LoginInput } from './dto/login.dto';
import { SignupInput } from './dto/signup.dto';

const jwtVersion = 'v1';
const salt = 10;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private uploadsService: UploadsService,
    private usersRepository: UsersRepository,
    private fanProfilesRepository: FanProfilesRepository,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  async login(input: LoginInput) {
    const user = await this.usersRepository.findOne({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException({ message: 'Invalid credentials!' });

    const isCorrect = await bcryptjs.compare(input.password, user.password);
    if (!isCorrect) throw new UnauthorizedException({ message: 'Invalid credentials!' });

    return this.createToken(user);
  }

  async signup(input: SignupInput) {
    const userExists = await this.usersRepository.findOne({ where: { email: input.email } });
    if (userExists) throw new ConflictException('Email already exists!');

    const username = `${input.fullName
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')}-${randomBytes(3).toString('hex')}`;

    const userProfileEntity = this.usersRepository.create({
      email: input.email,
      password: await bcryptjs.hash(input.password, salt),
      fanProfile: this.fanProfilesRepository.create({
        fullName: input.fullName,
        username: username,
        avatarUrl: this.uploadsService.generateDefaultFanAvatarUrl(input.fullName.replace(/\s+/g, '+')),
        bannerUrl: this.uploadsService.generateDefaultFanBannerUrl(),
      }),
    });
    const user = await this.usersRepository.save(userProfileEntity);

    return this.createToken(user);
  }

  async creatorSignup(input: CreatorSignupInput) {
    const userExists = await this.usersRepository.findOne({ where: { email: input.email } });
    if (userExists) throw new ConflictException({ message: 'Email already exists!' });

    const username = `${input.fullName
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')}-${randomBytes(3).toString('hex')}`;

    const creatorProfileEntity = this.usersRepository.create({
      email: input.email,
      password: await bcryptjs.hash(input.password, salt),
      isCreator: true,
      creatorProfile: this.creatorProfilesRepository.create({
        fullName: input.fullName,
        gender: input.gender,
        region: input.region,
        username: username,
        avatarUrl: this.uploadsService.generateDefaultCreatorAvatarUrl(input.fullName),
        bannerUrl: this.uploadsService.generateDefaultCreatorBannerUrl(),
      }),
    });

    const creator = await this.usersRepository.save(creatorProfileEntity);

    return this.createToken(creator);
  }

  async getCurrentUser(jwtUser: JwtUser) {
    const fanProfile = await this.fanProfilesRepository.findOneOrFail({
      where: { fanId: jwtUser.sub },
      relations: { user: true },
      cache: true,
    });
    return fanProfile;
  }

  async getOnboardingCreator(jwtUser: JwtUser) {
    const creatorProfile = await this.creatorProfilesRepository.findOneOrFail({
      where: { creatorId: jwtUser.sub },
      relations: { user: true },
      cache: true,
    });

    return creatorProfile;
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
      roles: user.isCreator ? [UserRoles.CREATOR] : [UserRoles.USER],
    } satisfies Partial<JwtUser>;

    return {
      fanId: user.id,
      expiresIn: moment().add(72, 'hours').toDate().getTime(),
      accessToken: this.jwtService.sign(payload),
    };
  }
}
