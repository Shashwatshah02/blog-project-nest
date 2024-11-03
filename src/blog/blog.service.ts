import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Category } from 'src/category/category.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createBlogDto: CreateBlogDto): Promise<Blog> {
        const { title, content, categoryId, image } = createBlogDto;
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }

        const blog = this.blogRepository.create({ title, content, category, image});
        return await this.blogRepository.save(blog);
    }

    async findAll(): Promise<Blog[]> {
        return await this.blogRepository.find();
    }

    async findOne(id: number): Promise<Blog> {
        return await this.blogRepository.findOne({ where: { id } })
    }

    async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
        const { title, content, categoryId, image } = updateBlogDto;
        const blog = await this.blogRepository.findOne({ where: { id } });

        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        if (categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                throw new NotFoundException(`Category with ID ${categoryId} not found`);
            }
            blog.category = category;
        }

        blog.title = title;
        blog.content = content;
        blog.image = image;
        return await this.blogRepository.save(blog);
    }

    async remove(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({ where: { id } })
        return await this.blogRepository.remove(blog)
    }


}
