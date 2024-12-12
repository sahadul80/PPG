import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express'; // Import MulterModule

@Module({
    imports: [MulterModule.register()], // Register MulterModule
    controllers: [FileController], // Register the controller
    providers: [FileService], // Register the service
})
export class FileModule { }
