// src/blog/dto/create-blog.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt()
  categoryId: number;
}
