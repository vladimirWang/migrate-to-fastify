START TRANSACTION;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE table gallery2.`User`;
TRUNCATE table gallery2.`Trolley`;
TRUNCATE table gallery2.`Product`;
TRUNCATE table gallery2.`Vendor`;
TRUNCATE table gallery2.`Product`;
TRUNCATE table gallery2.`Purchase`;
TRUNCATE table gallery2.`SaleOrder`;
TRUNCATE table gallery2.`TrolleyJoinProduct`;
TRUNCATE table gallery2.`ProductJoinPurchase`;
TRUNCATE table gallery2.`SaleOrderJoinProduct`;
-- TRUNCATE table gallery2.`SaleTrolley`;
-- TRUNCATE table gallery2.`SaleTrolleyJoinProduct`;
TRUNCATE table gallery2.`Platform`;
TRUNCATE table gallery2.`Express`;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入用户
insert into gallery2.`User` (username, password, email, updatedAt) values ('test1', '123456', 'test1@qq.com', NOW(3)), ('test', '123456', 'test2@qq.com', NOW(3));
-- 插入供应商
INSERT INTO gallery2.`Vendor` (name, updatedAt) values ('nike', NOW(3)),('puma', NOW(3)),('adidas', NOW(3)),('lining', NOW(3));
-- 插入商品
INSERT INTO gallery2.Product (name, vendorId, updatedAt, cost, balance, price) values
    ('nike球鞋1', 1, NOW(3), 10, 0, 100), ('nike篮球2', 1, NOW(3), 15, 0, 200), ('puma衣服2', 2, NOW(3), 20, 5, 300), ('adidas手套', 3, NOW(3), 30, 5, 400), ('lining口香糖', 4, NOW(3), 40, 2, 500),
    ('nike牛仔裤', 1, NOW(3), 10, 0, 100), ('nike橄榄球', 1, NOW(3), 15, 0, 200), ('puma棒球服', 2, NOW(3), 20, 5, 300), ('adidas数据线', 3, NOW(3), 30, 5, 400), ('lining牛奶', 4, NOW(3), 40, 2, 500),
    ('nike皮鞋', 1, NOW(3), 10, 0, 100), ('nike茶叶', 1, NOW(3), 15, 0, 200), ('puma折叠椅', 2, NOW(3), 20, 5, 300), ('adidas口罩', 3, NOW(3), 30, 5, 400), ('lining自行车', 4, NOW(3), 40, 2, 500);
-- 插入购物车
INSERT INTO gallery2.Trolley (userId, updatedAt ) values (1, NOW(3));
INSERT INTO gallery2.TrolleyJoinProduct (trolleyId, productId, count, cost) values (1, 1, 1, 100),(1, 2, 2, 100),(1, 3, 1, 100);
-- 插入进货单
INSERT INTO gallery2.Purchase (purchaseDate, totalCost, userId, updatedAt) values ("2025-02-01", 100, 1, NOW(3));
INSERT INTO gallery2.ProductJoinPurchase  (productId, purchaseId, cost, `count`) values (3, 1, 30, 2), (4, 1, 40, 1);
INSERT INTO gallery2.Purchase (purchaseDate, totalCost, userId, updatedAt, purchaseStatus) values ("2025-02-01", 150, 1, NOW(3), "FINISHED");
INSERT INTO gallery2.ProductJoinPurchase  (productId, purchaseId, cost, `count`) values (3, 2, 30, 5);
-- 插入待出货单
-- INSERT INTO gallery2.SaleTrolley (updatedAt, createdUserId) values (NOW(3), 1);
-- INSERT INTO gallery2.SaleTrolleyJoinProduct (saleTrolleyId, productId, price, `count`) values (1, 3, 30, 1), (1, 4, 40, 2);
-- 插入销售平台和快递公司
insert into gallery2.Platform (name) values ('线下'), ('闲鱼'), ('拼多多'), ('抖音');
insert into gallery2.Express (name) values ('顺丰'), ('韵达'), ('中通'), ('百世');

-- 插入出货单（已配送）
-- insert into gallery2.Sale (totalPrice, purchaseDate, platformId, updatedAt, createdUserId ) values ();
COMMIT;