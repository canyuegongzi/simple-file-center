import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {File} from './file.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column()
    parentId: number;

    @Column({default: 0})
    isDelete: number;

    @Column({nullable: true})
    desc: string;

    @Column()
    code: string;

    @OneToMany(type => File, file => file.category)
    files: File[];
}
