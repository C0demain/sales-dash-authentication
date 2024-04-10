import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Users } from "./Users";
import { Client } from "./Client";
import { Products } from "./Products";

@Table({
    tableName : Sells.VAR_TABLE_NAME,
})

export class Sells extends Model{
  public static VAR_TABLE_NAME = "sells" as string;
  public static VAR_ID = "id" as string;
  public static VAR_DATE = "date" as string;
  public static VAR_SELLER = "seller" as string;
  public static VAR_PRODUCTID = "productid" as string;
  public static VAR_CLIENT = "client" as string;
  public static VAR_VALUE = "value" as string;
  public static VAR_CLIENT_NAME = "client_name" as string;


@Column({
    type : DataType.INTEGER,
    primaryKey: true,
    autoIncrement : true,
    field: Sells.VAR_ID
})
id !: number;

@Column({
    type : DataType.STRING(100),
    field : Sells.VAR_DATE
})
date !: string;

@Column({
    type : DataType.STRING(100),
    field : Sells.VAR_SELLER
})
seller !: string;

@ForeignKey(() => Users)
  @Column
  userId!: number;

  @BelongsTo(() => Users)
  user!: Users;


@ForeignKey(() => Products) 
  @Column({
    type : DataType.INTEGER,
    field : Sells.VAR_PRODUCTID,
  })
  productid !: number;

  @BelongsTo(() => Products)
  product!: Products;


@Column({
  type : DataType.STRING(100),
  field : Sells.VAR_CLIENT_NAME,
})
clientname !: string;

@ForeignKey(() => Client) 
  @Column
  clientId!: number;

  @BelongsTo(() => Client)
  client!: Client;


@Column({
    type : DataType.DOUBLE,
    field : Sells.VAR_VALUE
})
value !: number;

}