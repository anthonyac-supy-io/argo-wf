import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocalizedPayload {
  @Expose()
  readonly en: string;

  @Expose()
  readonly ar?: string;
}
export class IdType {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
export class SimpleUser {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly lastName: string;
}
export class SimpleOptionalEntity extends IdType {
  @Expose()
  readonly name?: LocalizedPayload;
}
