/**
 * 仓库的新建和修改
 */

import {Body, Controller, Post} from '@nestjs/common';

import {CreateDto, ModifyDto} from './dto/catagory';
import {AbcCatagoryQueryRepo} from '@app/domain/catagory/interface/repository';
import {AbcCatagory} from '@app/domain/catagory/interface/service';


@Controller('catagory')
 export class CatagoryController {

    constructor (
        private readonly catagoryQuery : AbcCatagoryQueryRepo,
        private readonly catagoryService : AbcCatagory,
    ) {}

    @Post('create')
    async create (@Body() body : CreateDto) {
        try {
            const catagory = await this.catagoryService.create(body);
            return {code : 0, data : catagory};
        } catch (e) {
            return {code : 5001, error : e};
        }
    }

    @Post('modify')
    async modify (@Body() {id, remark} : ModifyDto) {
        const catagory = await this.catagoryQuery.fetchOne({id});
        const modified = await this.catagoryService.modify(catagory, {remark});
        return {code : 0, data : modified};
    }

}
