import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { Subcategory, SubcategorySchema } from './schemas/subcategory.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema },
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
