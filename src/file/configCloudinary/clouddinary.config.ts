import { ConfigService } from '@nestjs/config'
import {v2 as cloudinary} from 'cloudinary'

export const cloudinaryConfig=(configService:ConfigService)=>{


    cloudinary.config({
        cloud_name:configService.get<string>('cloud_name'),
        api_key:configService.get<string>('cloudinary_api_key'),
        api_secret:configService.get<string>('cloudinary_api_secret')
    })


}
export default cloudinary