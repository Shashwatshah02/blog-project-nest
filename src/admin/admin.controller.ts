import { Controller, Get, Post, Param, Render, Redirect, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { BlogService } from '../blog/blog.service';
import { CategoryService } from '../category/category.service';
import { CreateBlogDto } from '../blog/dto/create-blog.dto';
import { UpdateBlogDto } from '../blog/dto/update-blog.dto';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly blogService: BlogService,
    private readonly categoryService: CategoryService,
  ) { }

  // View all blogs
  @Get('blogs')
  @Render('theme/blog-list')
  async getBlogs() {
    const blogs = await this.blogService.findAll();
    // console.log(blogs);
    return { blogs };
  }

  // View all categories
  @Get('categories')
  @Render('theme/category-list')
  async getCategories() {
    const categories = await this.categoryService.findAll();
    return { categories };
  }

  // Render add blog form
  @Get('blogs/create')
  @Render('theme/blog-create')
  async addBlogForm() {
    const categories = await this.categoryService.findAll();
    return { categories };
  }

  // Handle new blog post
  @Post('blogs/create')
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
  @Redirect('/admin/blogs')
  async createBlog(@Body() createBlogDto: CreateBlogDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    const imagePath = `/images/${file.filename}`;
    createBlogDto.image = imagePath;
    await this.blogService.create(createBlogDto);
  }

  // Render add category form
  @Get('categories/create')
  @Render('theme/category-create')
  addCategoryForm() {
    return {};
  }

  // Handle new category post
  @Post('categories/create')
  @Redirect('theme/category-list')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryService.create(createCategoryDto);
  }

  // Render update blog form
  @Get('blogs/edit/:id')
  @Render('theme/edit-blog')
  async editBlogForm(@Param('id') id: number) {
    const blog = await this.blogService.findOne(id);
    const categories = await this.categoryService.findAll();
    console.log(blog.category.id);
    return { blog, categories };

  }

  // Handle blog update

  @Post('blogs/edit/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images',  // Set the upload directory
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
  }))
  @Redirect('/admin/blogs')
  async updateBlog(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      const imagePath = `/images/${file.filename}`;
      updateBlogDto.image = imagePath; // Update DTO with new image path

      // Optional: Delete the old image file
      const existingBlog = await this.blogService.findOne(id);
      if (existingBlog && existingBlog.image) {
        const oldImagePath = join(__dirname, '../../public', existingBlog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Remove old image
        }
      }
    }

    await this.blogService.update(id, updateBlogDto);
  }


  // Render update category form
  @Get('categories/edit/:id')
  @Render('theme/category-edit')
  async editCategoryForm(@Param('id') id: number) {
    const category = await this.categoryService.findOne(id);
    console.log(category);
    return { category, id };
  }

  // Handle category update
  @Post('categories/edit/:id')
  @Redirect('/admin/categories')
  async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    await this.categoryService.update(id, updateCategoryDto);
  }

  // Delete a blog
  @Post('blogs/delete/:id')
  @Redirect('/admin/blogs')
  async deleteBlog(@Param('id') id: number) {
    await this.blogService.remove(id);
  }

  // Delete a category
  @Post('categories/delete/:id')
  @Redirect('/admin/categories')
  async deleteCategory(@Param('id') id: number) {
    await this.categoryService.remove(id);
  }

  // View a specific blog by ID
  @Get('blogs/view/:id')
  @Render('admin/view-blog')
  async viewBlog(@Param('id') id: number) {
    const blog = await this.blogService.findOne(id);
    return { blog };
  }

  // View a specific category by ID
  @Get('categories/view/:id')
  @Render('admin/view-category')
  async viewCategory(@Param('id') id: number) {
    const category = await this.categoryService.findOne(id);
    return { category };
  }
}
