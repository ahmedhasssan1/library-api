import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UploadApiResponse } from 'cloudinary'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import { uploadPhotoDto } from './dto/uploadPhoto.input'
import { cloudinaryConfig } from './configCloudinary/clouddinary.config'

@Injectable()
export class FilService {
  constructor (private configService: ConfigService) {
    cloudinaryConfig(this.configService)
  }

  async uploadImage (
    createImageInput: uploadPhotoDto,
    dirUpload: string = 'avatars',
  ): Promise<string> {
    try {
      const { createReadStream, filename } = await createImageInput.file

      if (!createReadStream || typeof createReadStream !== 'function') {
        throw new HttpException('Invalid file input', HttpStatus.BAD_REQUEST)
      }

      const stream = createReadStream()

      console.log('Uploading image...')

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: dirUpload,
            public_id: `${Date.now()}-${filename}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error || !result) {
              console.error('Cloudinary Upload Error:', error)
              reject(
                new HttpException(
                  'Image upload failed',
                  HttpStatus.BAD_REQUEST,
                ),
              )
            } else {
              resolve(result)
            }
          },
        )

        stream.pipe(uploadStream)
      })

      if (!result || !result.secure_url) {
        throw new HttpException(
          'Cloudinary response invalid',
          HttpStatus.BAD_REQUEST,
        )
      }

      console.log('Upload successful:', result.secure_url)
      return result.secure_url
    } catch (error) {
      console.error('Upload Error:', error)
      throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  
}