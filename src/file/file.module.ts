import { Module } from '@nestjs/common';
import { FilService } from './file.service';
import { FilResolver } from './file.resolver';
// import { FilResolver } from './file.resolver';



@Module({
  providers: [ FilResolver,FilService],
  exports:[FilService]
})
export class FileModule {}
