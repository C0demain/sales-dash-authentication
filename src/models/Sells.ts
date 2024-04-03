import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName : Sells.VAR_TABLE_NAME,
})

export class Sells extends Model{
  public static VAR_TABLE_NAME = "sells" as string;
  public static VAR_ID = "id" as string;
  public static VAR_DATE = "date" as string;
  public static VAR_SELLER = "seller" as string;
  public static VAR_PRODUCT = "product" as string;
  public static VAR_CLIENT = "client" as string;
  public static VAR_CLIENT_DEPARTMENT = "client_department" as string;
  public static FLOAT_VALUE = 0.0 as number;


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

@Column({
    type : DataType.STRING(100),
    field : Sells.VAR_PRODUCT
})
product !: string;

@Column({
    type : DataType.STRING(100),
    field : Sells.VAR_CLIENT
})
client !: string

@Column({
    type : DataType.STRING(100),
   field : Sells.VAR_CLIENT_DEPARTMENT
})
client_department !: string;

@Column({
    type : DataType.FLOAT,
    field : Sells.VAR_PRODUCT
})
value !: number;

}