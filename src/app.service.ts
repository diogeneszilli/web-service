import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPlatforms(): Promise<string> {
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${this.configService.get('CORE_API_URL')}/platforms`,
        {
          headers: {
            'Content-Type': 'application/json',
            'core-api-key': this.configService.get('CORE_API_KEY'),
          },
        },
      );
      data.platforms.forEach((platform) => console.log(platform));
      return 'Successful';
    } catch (error) {
      throw new HttpException(
        {
          status: error.response?.status || 503,
          error: `Core API request: ${
            error.response?.statusText || 'Unavailable'
          }.`,
        },
        error.response?.status || 503,
      );
    }
  }
}
