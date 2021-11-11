import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

const OUT_OF = $localize`:out of|Used in paginator for saying x items "out of" n:z`;

@Injectable()
export class MatPaginatorI18nService extends MatPaginatorIntl {
  itemsPerPageLabel = $localize`:items per page label|Items per page label in paginator:Položek na stránce`;
  nextPageLabel     = $localize`:next page label|Next page label in paginator:Další stránka`;
  previousPageLabel = $localize`:previous page|Previous page label in paginator:Předchozí stránka`;

  getRangeLabel = function (page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return `0 ${OUT_OF} ${length}`;
    }
    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} ${OUT_OF} ${length}`;
  };
}