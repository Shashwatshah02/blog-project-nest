// src/blog/dto/create-blog.dto.ts
import { IsInt, IsString, IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  categoryId: number;

  @IsNotEmpty() // Make the image field required
  image: string;
}

