import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';

@Controller('subscriber')
export class SubscriberController {
    constructor(private readonly subscriberService: SubscriberService) { }

    @Post('add')
    async createSubscriber(@Body() subscriber: { email: string; }) {
        return this.subscriberService.create(subscriber);
    }

    @Get()
    async getAllSubscribers() {
        return this.subscriberService.getAllSubscribers();
    }

    @Get('found/:email')
    async findSubscriberByEmail(@Param('email') email: string) {
        return this.subscriberService.findSubscriberByEmail(email);
    }

    @Delete('delete/:email')
    async removeSubscriber(@Param('email') email: string) {
        await this.subscriberService.removeSubscriber(email);
        return { message: `Subscriber with email ${email} has been removed.` };
    }
}
