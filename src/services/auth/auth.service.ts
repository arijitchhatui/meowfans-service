import { splitFullName } from '@app/helpers';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';
import { UserRoles } from '../../util/enums';
import { AwsS3ClientService } from '../aws';
import { UsersEntity } from '../postgres/entities';
import { CreatorProfilesRepository, FanProfilesRepository, UsersRepository } from '../postgres/repositories';
import { JWT_VERSION, REMOVE_SPACE_REGEX, SALT, TokenType, USER_NAME_CASE_REGEX } from './constants';
import { JwtUser } from './decorators/current-user.decorator';
import { AdminSignupInput } from './dto/admin-signup.dto';
import { AuthOk } from './dto/auth.dto';
import { CreatorSignupInput } from './dto/creator-signup.dto';
import { FanSignupInput } from './dto/fan-signup.dto';
import { LoginInput } from './dto/login.dto';
import { VerifyJwtInput } from './dto/verify.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private configService: ConfigService,
    private fanProfilesRepository: FanProfilesRepository,
    private awsS3ClientService: AwsS3ClientService,
    private creatorProfilesRepository: CreatorProfilesRepository,
  ) {}

  public async validateUser(input: LoginInput): Promise<{ sub: string }> {
    const user = await this.usersRepository.findOne({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException({ message: 'Not found!' });

    const isCorrect = await bcryptjs.compare(input.password, user.password);
    if (!isCorrect) throw new UnauthorizedException({ message: 'Invalid credentials!' });

    return { sub: user.id };
  }

  public async login(userId: string): Promise<AuthOk> {
    const user = await this.usersRepository.findOneOrFail({ where: { id: userId } });

    await this.usersRepository.update({ id: user.id }, { lastLoginAt: new Date() });

    const { token: accessToken, payload: accessTokenPayLoad } = await this.createToken(
      user,
      TokenType.ACCESS_TOKEN,
      user.roles,
    );

    const { token: refreshToken } = await this.createToken(
      user,
      TokenType.REFRESH_TOKEN,
      user.roles,
      accessTokenPayLoad.jti,
    );

    return {
      userId: user.id,
      accessToken,
      refreshToken,
      roles: user.roles,
    };
  }

  public async fanSignup(input: FanSignupInput) {
    await this.scanAvailableEmail(input.email);
    const username = await this.scanOrCreateUsername(input.fullName);

    const userProfileEntity = this.usersRepository.create({
      email: input.email,
      roles: [UserRoles.FAN],
      username,
      password: await bcryptjs.hash(input.password, SALT),
      ...splitFullName(input.fullName),
      avatarUrl: this.awsS3ClientService.generateDefaultFanAvatarUrl(input.fullName.replace(/\s+/g, '+')),
      bannerUrl: this.awsS3ClientService.generateDefaultFanBannerUrl(),
      fanProfile: this.fanProfilesRepository.create({
        appliedAt: new Date(),
      }),
    });
    const user = await this.usersRepository.save(userProfileEntity);

    return this.login(user.id);
  }

  public async creatorSignup(input: CreatorSignupInput): Promise<AuthOk> {
    const { email, fullName, password } = input;
    await this.scanAvailableEmail(input.email);

    const username = await this.scanOrCreateUsername(input.username);

    const creatorProfileEntity = this.usersRepository.create({
      username,
      email,
      roles: [UserRoles.CREATOR],
      ...splitFullName(fullName),
      password: await bcryptjs.hash(password, SALT),
      avatarUrl: this.awsS3ClientService.generateDefaultCreatorAvatarUrl(fullName),
      bannerUrl: this.awsS3ClientService.generateDefaultCreatorBannerUrl(),

      creatorProfile: this.creatorProfilesRepository.create({
        acceptedAt: new Date(),
      }),
    });

    const creator = await this.usersRepository.save(creatorProfileEntity);
    return this.login(creator.id);
  }

  public async adminSignup(input: AdminSignupInput): Promise<AuthOk> {
    const { email, fullName, password } = input;

    const adminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD');
    if (adminPassword !== password) return {} as AuthOk;

    await this.scanAvailableEmail(input.email);
    const username = await this.scanOrCreateUsername(input.username);

    const adminProfileEntity = this.usersRepository.create({
      username,
      email,
      roles: [UserRoles.ADMIN],
      ...splitFullName(fullName),
      password: await bcryptjs.hash(password, SALT),
      avatarUrl: this.awsS3ClientService.generateDefaultCreatorAvatarUrl(fullName),
      bannerUrl: this.awsS3ClientService.generateDefaultCreatorBannerUrl(),

      creatorProfile: this.creatorProfilesRepository.create({
        acceptedAt: new Date(),
      }),
    });

    const admin = await this.usersRepository.save(adminProfileEntity);
    return this.login(admin.id);
  }

  public async getStatus(jwtUser: JwtUser): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: jwtUser.sub },
      cache: true,
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }

  public validateJwt(input: VerifyJwtInput): JwtUser | null {
    try {
      const jwtUser = this.jwtService.verify<JwtUser>(input.token);
      if (jwtUser.version !== JWT_VERSION) throw new UnauthorizedException();
      return jwtUser;
    } catch {
      return null;
    }
  }

  private async scanAvailableEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException({ message: 'EMAIL ALREADY EXISTS' });
  }

  public async scanOrCreateUsername(username: string): Promise<string> {
    const newUsername = username
      .toLowerCase()
      .replace(USER_NAME_CASE_REGEX, ' ')
      .replace(REMOVE_SPACE_REGEX, ' ')
      .concat(randomBytes(3).toString('hex'));

    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) return username;

    return newUsername;
  }

  private async createToken(
    user: UsersEntity,
    type: TokenType,
    roles: UserRoles[],
    associated_access_token_jti?: string,
  ): Promise<{ token: string; payload: Partial<JwtUser> }> {
    const payload = {
      sub: user.id,
      jti: randomUUID(),
      version: JWT_VERSION,
      roles,
      associated_access_token_jti,
    } satisfies Partial<JwtUser>;

    const expiresInMap = {
      [TokenType.REFRESH_TOKEN]: '30d',
      [TokenType.ACCESS_TOKEN]: '2d',
      [TokenType.EMAIL_LOGIN]: '1h',
      [TokenType.EMAIL_VERIFICATION]: '1h',
      [TokenType.PASSWORD_RESET]: '1h',
    };

    const expiresIn = expiresInMap[type] || '1d';

    return { token: this.jwtService.sign(payload, { expiresIn }), payload };
  }
}
