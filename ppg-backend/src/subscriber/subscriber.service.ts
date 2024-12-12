import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

@Injectable()
export class SubscriberService {
    private readonly csvFilePath = path.join(__dirname, '..', 'subscriber.csv');

    constructor(private readonly mailerService: MailerService) { }
    async create(subscriber: { email: string }): Promise<{ email: string }> {
        try {
            // Ensure the CSV file exists
            if (!fs.existsSync(this.csvFilePath)) {
                console.log("Creating CSV file...");
                fs.writeFileSync(this.csvFilePath, 'email\n');
            }

            // Check for duplicate email
            const existingSubscribers = await this.getAllSubscribers();
            console.log("Existing Subscribers:", existingSubscribers);

            if (existingSubscribers.some((sub) => sub.email === subscriber.email)) {
                console.log("CSV File Path:", this.csvFilePath);
                throw new ConflictException('Email is already registered');
            }

            // Append the new subscriber to the CSV file
            const csvLine = `${subscriber.email}\n`;
            fs.appendFileSync(this.csvFilePath, csvLine);
            console.log("Email added to CSV:", subscriber.email);

            // Send a subscription email
            try {
                await this.mailerService.sendMail({
                    to: subscriber.email,
                    subject: 'Subscription to People Pulse Global Ltd.',
                    text: 'Welcome to our organization!',
                });
                console.log("Subscription email sent to:", subscriber.email);
            } catch (mailError) {
                console.error("Error sending email:", mailError);
            }

            return subscriber;
        } catch (error) {
            console.error("Error in create method:", error);
            throw error;
        }
    }

    async getAllSubscribers(): Promise<{ email: string; name?: string }[]> {
        const subscribers: { email: string; name?: string }[] = [];

        try {
            console.log("Checking if CSV file exists at path:", this.csvFilePath);

            // Check if the CSV file exists
            if (fs.existsSync(this.csvFilePath)) {
                console.log("CSV file found. Reading subscribers...");

                return new Promise((resolve, reject) => {
                    fs.createReadStream(this.csvFilePath)
                        .pipe(csvParser())
                        .on('data', (data) => {
                            console.log("Subscriber data parsed:", data);
                            subscribers.push(data);
                        })
                        .on('end', () => {
                            console.log("All subscribers successfully loaded:", subscribers);
                            resolve(subscribers);
                        })
                        .on('error', (error) => {
                            console.error("Error while reading the CSV file:", error);
                            reject(new Error("Failed to parse the CSV file. Please check its contents."));
                        });
                });
            } else {
                console.log("CSV file does not exist. Returning empty subscriber list.");
            }
        } catch (error) {
            console.error("Unexpected error occurred while getting all subscribers:", error);
            throw new Error("Failed to retrieve subscribers. Please try again.");
        }

        return subscribers;
    }

    async findSubscriberByEmail(email: string): Promise<{ email: string; }> {
        try {
            console.log("Looking for subscriber with email:", email);

            // Fetch all subscribers
            const subscribers = await this.getAllSubscribers();
            console.log("Current subscribers:", subscribers);

            // Find the subscriber with the given email
            const subscriber = subscribers.find((sub) => sub.email === email);
            console.log("Found subscriber:", subscriber);

            if (!subscriber) {
                console.log(`Subscriber with email ${email} not found.`);
                throw new NotFoundException(`Subscriber with email ${email} not found`);
            }

            return subscriber;
        } catch (error) {
            console.error("Error occurred while finding subscriber:", error);
            throw new Error("Failed to find subscriber. Please try again.");
        }
    }

    async removeSubscriber(email: string): Promise<void> {
        try {
            console.log("Starting removal process for email:", email);

            // Fetch all subscribers
            const subscribers = await this.getAllSubscribers();
            console.log("Current subscribers:", subscribers);

            // Filter out the subscriber to be removed
            const updatedSubscribers = subscribers.filter((sub) => sub.email !== email);
            console.log("Updated subscribers after removal:", updatedSubscribers);

            // Rewrite the CSV file
            const header = 'email,name\n';
            const csvContent = updatedSubscribers
                .map((sub) => `${sub.email},${sub.name || ''}`)
                .join('\n');

            console.log("New CSV content:", header + csvContent);

            // Write updated content to the file
            fs.writeFileSync(this.csvFilePath, header + csvContent);
            console.log(`Subscriber with email ${email} removed successfully.`);
        } catch (error) {
            console.error("Error occurred while removing subscriber:", error);
            throw new Error("Failed to remove subscriber. Please try again.");
        }
    }
}
