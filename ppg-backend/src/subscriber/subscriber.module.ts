import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [MailerModule.forRoot({
        transport: {
            host: 'smtp.gmail.com',
            port: 465,
            ignoreTLS: true,
            source: true,
            auth: {
                user: 'educationassistant566@gmail.com',
                pass: 'npbh qbks glbj opwo'
            }
        }
    }), ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'), // Serve files from the 'uploads' folder
        serveRoot: '/uploads', // The URL path to access uploaded files
    }),],
    providers: [SubscriberService],
    controllers: [SubscriberController],
})
export class SubscriberModule { }
