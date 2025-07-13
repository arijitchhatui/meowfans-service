import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAssetInput {
  @Field()
  blurredUrl: string;

  @Field()
  rawUrl: string;

  @Field()
  type: string;

  @Field()
  mimeType: string;

  @Field({ defaultValue: false })
  isVideo: boolean;

  @Field()
  contentType: string;
}
