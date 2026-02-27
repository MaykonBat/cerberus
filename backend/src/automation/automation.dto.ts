/* istanbul ignore file */
import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { Exchange } from "commons";
import { ChainId } from "commons";

class ConditionDTO {
    @IsString()
    field!: string;

    @IsString()
    operator!: string;

    @IsString()
    value!: string;
}

export class AutomationDTO {
    @IsString()
    name!:string;

    @IsString()
    poolId!: string;
    
    @IsString()
    nextAmount!: string;

    @ValidateNested()
    @Type(() => ConditionDTO)
    openCondition!: ConditionDTO;

    @Optional()
    @ValidateNested()
    @Type(() => ConditionDTO)
    closeCondition?: ConditionDTO;

    @IsBoolean()
    @IsOptional()
    isOpened?: boolean;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsInt()
    exchange!: Exchange;

    @IsInt()
    network!: ChainId
}