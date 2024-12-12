import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';

@Injectable()
export class FileService {
    async processCsvFile(file: Express.Multer.File) {
        const results = [];
        const filePath = file.path;

        // Parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log('CSV file processed:', results);
            });

        return {
            message: 'CSV file processed successfully',
            data: results,
        };
    }

    async processExcelFile(file: Express.Multer.File) {
        const filePath = file.path;
        const fileBuffer = fs.readFileSync(filePath);

        // Read the Excel file and convert it to JSON
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        const data: any[] = [];

        sheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const jsonSheet = XLSX.utils.sheet_to_json(sheet);
            data.push({ sheetName, data: jsonSheet });
        });

        console.log('Excel file processed:', data);

        return {
            message: 'Excel file processed successfully',
            data: data,
        };
    }
}
