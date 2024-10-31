import { Controller, Get, Post, Param, Render, Redirect, Body } from '@nestjs/common';
import { BlogService } from '../blog/blog.service';
import { CategoryService } from '../category/category.service';
import { CreateBlogDto } from '../blog/dto/create-blog.dto';
import { UpdateBlogDto } from '../blog/dto/update-blog.dto';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly blogService: BlogService,
    private readonly categoryService: CategoryService,
  ) {}

  // View all blogs
  @Get('blogs')
  @Render('admin/blog')
  async getBlogs() {
    const blogs = await this.blogService.findAll();
    return { blogs };
  }

  // View all categories
  @Get('categories')
  @Render('admin/categories')
  async getCategories() {
    const categories = await this.categoryService.findAll();
    return { categories };
  }

  // Render add blog form
  @Get('blogs/add')
  @Render('admin/add-blog')
  async addBlogForm() {
    const categories = await this.categoryService.findAll();
    return { categories };
  }

  // Handle new blog post
  @Post('blogs')
  @Redirect('/admin/blogs')
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    await this.blogService.create(createBlogDto);
  }

  // Render add category form
  @Get('categories/add')
  @Render('admin/add-category')
  addCategoryForm() {
    return {};
  }

  // Handle new category post
  @Post('categories')
  @Redirect('/admin/categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryService.create(createCategoryDto);
  }

  // Render update blog form
  @Get('blogs/edit/:id')
  @Render('admin/edit-blog')
  async editBlogForm(@Param('id') id: number) {
    const blog = await this.blogService.findOne(id);
    const categories = await this.categoryService.findAll();
    return { blog, categories };
  }

  // Handle blog update
  @Post('blogs/edit/:id')
  @Redirect('/admin/blogs')
  async updateBlog(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    await this.blogService.update(id, updateBlogDto);
  }

  // Render update category form
  @Get('categories/edit/:id')
  @Render('admin/edit-category')
  async editCategoryForm(@Param('id') id: number) {
    const category = await this.categoryService.findOne(id);
    return { category };
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
