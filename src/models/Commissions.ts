import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: Commissions.VAR_TABLE_NAME,
})

export class Commissions extends Model {
    public static VAR_TABLE_NAME = "commissions" as string;
    public static VAR_ID = "id" as string;
    public static VAR_TITLE = "title" as string;
    public static VAR_PERCENTAGE = "percentage" as string;

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: Commissions.VAR_ID
    })
    id !: number;

    @Column({
        type: DataType.STRING(100),
        field: Commissions.VAR_TITLE
    })
    title !: string;

    @Column({
        type: DataType.DOUBLE,
        field: Commissions.VAR_PERCENTAGE
    })
    percentage !: number;
}