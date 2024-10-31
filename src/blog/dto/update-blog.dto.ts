import { IsString, IsOptional, IsInt } from "class-validator";

export class UpdateBlogDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsOptional()
    @IsInt()
    categoryId?: number | null;

    @IsOptional()
    @IsString()
    image?: string;
}