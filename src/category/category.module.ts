import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Package, PackageSchema } from '../package/schemas/package.schema';
import { LandingPage, LandingPageSchema } from './schemas/landing-page.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
      { name: Package.name, schema: PackageSchema },
      { name: LandingPage.name, schema: LandingPageSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
