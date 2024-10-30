import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
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

    @Post()
    async create(@Body() createBlogDto: CreateBlogDto){
        return await this.blogService.create(createBlogDto)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateBlogDto:UpdateBlogDto){
        return await this.blogService.update(id, updateBlogDto)
    }

    @Delete(':id')
    async remove(@Param('id') id: number){
        return await this.blogService.remove(id)
    }
}
