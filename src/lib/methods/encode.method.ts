import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import { JwtFromRequestFunction } from 'passport-jwt';

@Injectable()
export class CryptoService {
  private SECRET_KEY: string;
  private INIT_VECTOR: string;
  private CIPHER_ALGO: string;
  private ENCODING: BufferEncoding;
  private DECODING: BufferEncoding;
  private HASH: string;

  constructor(private readonly configService: ConfigService) {
    this.SECRET_KEY = this.configService.getOrThrow('CRYPTO_SECRET_KEY');
    this.INIT_VECTOR = this.configService.getOrThrow('CRYPTO_INIT_VECTOR');
    this.CIPHER_ALGO = this.configService.getOrThrow('CRYPTO_CIPHER_ALGO');
    this.ENCODING = this.configService.getOrThrow('CRYPTO_INPUT_ENCODING');
    this.DECODING = this.configService.getOrThrow('CRYPTO_INPUT_DECODING');
    this.HASH = this.configService.getOrThrow('CRYPTO_HASH');
  }

  public encryptToken(token: string) {
    const cipher = this.createCipherIV();
    return cipher.update(token, this.ENCODING, this.DECODING) + cipher.final(this.DECODING);
  }

  public decryptToken(token: string): string {
    const decipher = this.createDecipherIV();
    return decipher.update(token, this.DECODING, this.ENCODING) + decipher.final(this.ENCODING);
  }

  private generateCryptoKeyBuffer() {
    return createHash(this.HASH).update(this.SECRET_KEY).digest().subarray(0, 32);
  }

  private generateIV() {
    return Buffer.from(this.INIT_VECTOR, this.DECODING);
  }

  private createCipherIV() {
    return createCipheriv(this.CIPHER_ALGO, this.generateCryptoKeyBuffer(), this.generateIV());
  }

  private createDecipherIV() {
    return createDecipheriv(this.CIPHER_ALGO, this.generateCryptoKeyBuffer(), this.generateIV());
  }
}
