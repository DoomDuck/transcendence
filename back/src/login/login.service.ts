import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';

@Injectable()
export class LoginService {
  readonly auth_url: string;

  constructor(configService: ConfigService) {
    const appId = configService.get<string>('PUBLIC_APP_42_ID');
    const redirectURI = configService.get<string>('REDIRECT_URI');

    if (!(appId && redirectURI)) throw Error('Could not get environment');

    const encodedURI = encodeURIComponent(redirectURI);

    this.auth_url = `${AUTH_URL}?client_id=${appId}&redirect_uri=${encodedURI}&response_type=code`;
  }
}
