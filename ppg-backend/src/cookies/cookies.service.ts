import { Injectable } from '@nestjs/common';
import * as cookie from 'cookie';
import * as createCsvWriter from 'csv-writer';
import * as fs from 'fs';

@Injectable()
export class CookiesService {
    private csvWriter;
    private filePath = 'users.csv';

    constructor() {
        this.csvWriter = createCsvWriter.createObjectCsvWriter({
            path: this.filePath,
            header: [
                { id: 'cookieName', title: 'COOKIE_NAME' },
                { id: 'cookieValue', title: 'COOKIE_VALUE' },
            ],
            append: true, // To append new cookies instead of overwriting
        });

        // Ensure the file exists and has headers
        if (!fs.existsSync(this.filePath)) {
            this.createFile();
        }
    }

    private createFile() {
        const headers = [
            { id: 'cookieName', title: 'COOKIE_NAME' },
            { id: 'cookieValue', title: 'COOKIE_VALUE' },
        ];

        this.csvWriter.writeRecords([]).then(() => console.log('CSV file created.'));
    }

    // Save cookies from request headers
    saveCookies(headers: string) {
        const cookies = cookie.parse(headers);
        for (const [cookieName, cookieValue] of Object.entries(cookies)) {
            this.saveCookie(cookieName, cookieValue);
        }
    }

    // Save a single cookie to the CSV file
    private saveCookie(cookieName: string, cookieValue: string) {
        const record = [{ cookieName, cookieValue }];
        this.csvWriter.writeRecords(record).then(() => {
            console.log(`Cookie ${cookieName} saved.`);
        });
    }

    // Load cookies from the CSV file
    loadCookies() {
        const cookies: Record<string, string> = {};

        if (fs.existsSync(this.filePath)) {
            const rows = fs.readFileSync(this.filePath, 'utf8').split('\n').slice(1); // Skip header row

            rows.forEach((row) => {
                const [cookieName, cookieValue] = row.split(',');
                cookies[cookieName] = cookieValue;
            });
        }

        return cookies;
    }
}
