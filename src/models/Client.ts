import { Model, Table, Column, DataType, HasOne, HasMany, PrimaryKey } from "sequelize-typescript";
import { Sells } from "./Sells";

@Table({
    tableName : Client.VAR_TABLE_NAME,
})

export class Client extends Model{

  public static VAR_TABLE_NAME = "clients" as string;
  public static VAR_ID = "id" as string;
  public static VAR_NAME = "name" as string;
  public static VAR_SEGMENT = "segment" as string;
  public static VAR_CPF_CNPJ = "cpf_cnpj" as string;


  @Column({
    type : DataType.INTEGER,
    autoIncrement: true,
    field: Client.VAR_ID,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    field: Client.VAR_NAME,
  })
  name!: string;

  @Column({
    type : DataType.STRING(100),
    field : Client.VAR_SEGMENT
  })
  segment !: string;

  @Column({
    type : DataType.STRING,
    primaryKey : true,
    field : Client.VAR_CPF_CNPJ
  })
  cpf !: string;

  @HasMany(() => Sells)
  sells!: Sells[];

}