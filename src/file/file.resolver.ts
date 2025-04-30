import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilService } from './file.service';
import { uploadPhotoDto } from './dto/uploadPhoto.input';

@Resolver()
export class FilResolver {
  constructor(private readonly filService: FilService) {}

  @Mutation(() => String)
  async uploadPhoto(
    @Args('createImageInput') createImageInput: uploadPhotoDto,
  ): Promise<string> {
    return this.filService.uploadImage(createImageInput);
  }
}
