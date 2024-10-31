import { Category } from "src/category/category.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Category, (category) => category.blogs, { nullable: true, onDelete: 'SET NULL', eager: true })
    category: Category;

    @Column()  // Add the image column
    image: string;

}
