

import {Injectable} from '@nestjs/common';

import {AbcOrder, ModifyBO, CreateParam} from '../interface/service';
import {
    AbcOrderSaveRepo, OrderEntity,
} from '../interface/repository';
import {AbcPackageQueryRepo} from '@app/domain/package/interface/repository';
import {AbcStockQueryRepo} from '@app/domain/stock/interface/repository';
import {Left, Right} from '@app/tool/functor';


@Injectable()
export class OrderService extends AbcOrder {

    constructor (
        private readonly saveRepo : AbcOrderSaveRepo,
        private readonly stockQuery : AbcStockQueryRepo,
        private readonly packageQuery : AbcPackageQueryRepo,
    ) { super(); }

    async create (storage : CreateParam) : Promise<OrderEntity> {
        const {package_, ...other} = storage;
        return this.saveRepo.save({packageId : package_.id, ...other});
    }

    async modify (origin : OrderEntity, modifyBO : ModifyBO) {
        const {type, status, remark} = modifyBO;
        const timestamp = origin.timestamp;
        timestamp.finished = status == 'finish' ?
            (new Date()).valueOf() : timestamp.finished;
        const target = {
            ...origin, status : status || origin.status,
            type : type || origin.type,
            remark : remark || origin.remark,
            timestamp,
        };
        return this.saveRepo.modify(target, origin);
    }

    // 落库：暂不考虑库存容量大小；包裹stockId更新；采购单状态更新
    async inStock (order : OrderEntity) {
        const package_ = await this.packageQuery.fetchOne({id : order.packageId});
        if (package_.status != 'normal') {
            return Left.of('该包裹状态异常');
        }
        const id = order.target;
        if (!!parseInt(id)) {
            const stock = await this.stockQuery.fetchOne({id : parseInt(id)});
            if (stock?.status != 'available') return Left.of('该仓库当前不可用');
        }
        const orderTarget = {status : 'finish', ...order};
        const packageTarget = {stockId : id, ...package_};

        const result = await this.saveRepo.orderARModify(
            {order : orderTarget, package : packageTarget},
            {order, package : package_},
        );
        return Right.of(result);
    }

}
