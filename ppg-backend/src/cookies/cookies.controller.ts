import { Controller, Post, Body, Headers } from '@nestjs/common';
import { CookiesService } from './cookies.service';

@Controller('cookies')
export class CookiesController {
    constructor(private readonly cookieService: CookieService) { }

    @Post('save')
    saveCookie(@Headers('cookie') cookieHeader: string) {
        this.cookieService.saveCookies(cookieHeader);
        return { message: 'Cookies saved successfully' };
    }

    @Post('load')
    loadCookies() {
        return this.cookieService.loadCookies();
    }
}
