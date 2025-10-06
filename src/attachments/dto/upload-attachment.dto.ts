import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UploadAttachmentDto {
  @ApiProperty({
    required: false,
    example: 'images/screenshots',
    description: 'Optional subfolder path for the attachment',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\-_/]*$/, {
    message:
      'Folder path can only contain letters, numbers, dashes, underscores and forward slashes',
  })
  folderPath?: string;
}
