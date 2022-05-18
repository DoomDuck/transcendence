import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
	static readonly favicon_link = "https://www.cdiscount.com/pdt2/c/o/r/1/700x700/340900cor/rw/cornilleau-6-balles-pro-blanches.jpg";

  	constructor(private readonly appService: AppService) {
  	}

  	@Get()
  	getHello(): string {
  	  	return this.appService.getHello();
  	}


  	@Get("favicon.ico")
	@Redirect(AppController.favicon_link)
  	getFavicon(): void {
		console.log("Hello");
  	}
}
