import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Users } from "./Users";
import { Client } from "./Client";
import { Products } from "./Products";
import { Commissions } from "./Commissions";

@Table({
  tableName: Sells.VAR_TABLE_NAME,
})

export class Sells extends Model {
  public static VAR_TABLE_NAME = "sells" as string;
  public static VAR_ID = "id" as string;
  public static VAR_DATE = "date" as string;
  public static VAR_PRODUCTID = "productId" as string;
  public static VAR_CLIENT = "client" as string;
  public static VAR_VALUE = "value" as string;
  public static VAR_NEW_CLIENT = "new_client" as string;
  public static VAR_NEW_PRODUCT = "new_product" as string;
  public static VAR_COMMISSION_VALUE = 'commissionValue' as string;
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: Sells.VAR_ID
  })
  id !: number;

  @Column({
    type: DataType.STRING(100),
    field: Sells.VAR_DATE
  })
  date !: string;

  @ForeignKey(() => Users)
  @Column
  userId!: number;

  @BelongsTo(() => Users)
  user!: Users;


  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    field: Sells.VAR_PRODUCTID,
  })
  productId !: number;

  @BelongsTo(() => Products)
  product!: Products;

  @ForeignKey(() => Client)
  @Column
  clientId!: number;

  @BelongsTo(() => Client)
  client!: Client;


  @Column({
    type: DataType.DOUBLE,
    field: Sells.VAR_VALUE
  })
  value !: number;

  @Column({
    type: DataType.BOOLEAN,
    field: Sells.VAR_NEW_CLIENT,
  })
  new_client !: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: Sells.VAR_NEW_PRODUCT,
  })
  new_product !: boolean;

  @ForeignKey(() => Commissions)
  @Column
  commissionId!: number;

  @BelongsTo(() => Commissions)
  commission!: Commissions;

  @Column({
    type: DataType.FLOAT,
    field: Sells.VAR_COMMISSION_VALUE,
  })
  commissionValue !: number;
}