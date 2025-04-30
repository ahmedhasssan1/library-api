import { ConfigService } from '@nestjs/config'
import {v2 as cloudinary} from 'cloudinary'

export const cloudinaryConfig=(configService:ConfigService)=>{


    cloudinary.config({
        cloud_name:'duj5aatpw',
        api_key:'674196652231976',
        api_secret:'XgNYLL2YWD1ALUqjXHs6_WQaWW8'
    })


}
export default cloudinary