import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class CheckDefinedPipe implements PipeTransform {
  transform(value: any, argumentMetadata: ArgumentMetadata) {
    if (argumentMetadata.type != "body") return;
    if (value) return value;
    throw new Error("Received data not defined");
  }
}