import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest_crud',
    autoLoadEntities: true,
    synchronize: true,
  }),
    BlogModule,
    CategoryModule,
],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule { }
