import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join, extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Get()
  async findAll() {
    return await this.blogService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.blogService.findOne(id)
  }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: number) {
    return this.blogService.findByCategoryId(categoryId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images', // Save to public/images
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() image: Express.Multer.File, // Extract uploaded file
    @Res() res
  ) {
    if (!image) {
      // If no image is provided, respond with an error message
      return res.status(400).send('Image is required.');
    }

    createBlogDto.image = `/images/${image.filename}`; // Store the image path in DTO

    const blog = await this.blogService.create(createBlogDto);
    return res.status(201).json(blog);
  }



  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async update(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() image: Express.Multer.File, // Extract the uploaded file
    @Res() res
  ) {
    // Check if an image was uploaded
    if (image) {
      // Update the image path in the DTO
      updateBlogDto.image = `/images/${image.filename}`;
    }

    // Update blog record with the provided data
    const updatedBlog = await this.blogService.update(id, updateBlogDto);
    return res.status(200).json(updatedBlog);
  }
  x
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.blogService.remove(id)
  }
}
