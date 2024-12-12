import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { Response, Express } from 'express';
import * as path from 'path';
import { FileService } from './file.service';

// Configure Multer storage
const storage = diskStorage({
    destination: './uploads', // Specify upload folder
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const multerOptions = {
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
};

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('Uploaded file:', file);

        if (!file) {
            return { message: 'No file uploaded' };
        }

        const fileType = file.mimetype;

        if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.originalname.endsWith('.xlsx')) {
            return this.fileService.processExcelFile(file);
        } else if (fileType === 'text/csv' || file.originalname.endsWith('.csv')) {
            return this.fileService.processCsvFile(file);
        } else {
            return { message: 'Invalid file type. Only CSV and Excel files are allowed.' };
        }
    }

    // View uploaded file
    @Get('view/:filename')
    async viewUploadedFile(@Param('filename') filename: string, @Res() res: Response) {
        // Correct path to the 'uploads' folder outside the 'src' folder
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    }

    // List all uploaded files
    @Get('list')
    async listFiles(@Res() res: Response) {
        const uploadsFolder = path.join(__dirname, '..', '..', 'uploads');

        // Check if the uploads folder exists
        if (fs.existsSync(uploadsFolder)) {
            // Read all files in the uploads directory
            const files = fs.readdirSync(uploadsFolder);

            return res.json({
                message: 'Files retrieved successfully',
                files: files
            });
        } else {
            return res.status(404).json({ message: 'Uploads folder not found' });
        }
    }
}
