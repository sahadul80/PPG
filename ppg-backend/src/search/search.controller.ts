import { Controller, Get, Query } from '@nestjs/common';
import { SearchService, SearchItem } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    search(@Query('q') query: string): SearchItem[] {
        return this.searchService.search(query);
    }
}
