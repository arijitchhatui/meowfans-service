import { registerEnumType } from '@nestjs/graphql';

export enum DataFetchType {
  Pagination = 'pagination',
  InfiniteScroll = 'infinite_scroll',
}

registerEnumType(DataFetchType, { name: 'DataFetchType' });
