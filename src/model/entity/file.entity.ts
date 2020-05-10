import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from './category.entity';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column('text', {nullable: false})
    time: string;

    @Column({nullable: false})
    url: string;

    @ManyToOne(type => Category, category => category.files)
    category: Category;

    @Column({default: 0})
    isDelete: number;

    @Column()
    encoding: string;

    @Column()
    size: string;

    @Column()
    destination: string;

    @Column({default: 0, comment: '服务器类别'})
    serverCategory: number;

    @Column({default: null, nullable: true, comment: '用户'})
    userName: string;
}
