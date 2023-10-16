
using { my.bookshop as shop } from '../db/cat-model';

@path:'/browse'
service CatalogService {
  @readonly entity BookSet  as projection on shop.Books;
  @readonly entity AuthorSet  as projection on shop.Authors;
  @insertonly entity OrderSet  as projection on shop.Orders;
}