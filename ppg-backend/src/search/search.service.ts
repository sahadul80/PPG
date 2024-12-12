import { Injectable } from '@nestjs/common';

export interface SearchItem {
    id: number;
    name: string;
    link: string;
}

@Injectable()
export class SearchService {
    private readonly items: SearchItem[] = [
        { id: 1, name: 'About', link: './about.html' },
        { id: 2, name: 'Service', link: '/index' },
        { id: 3, name: 'Feature', link: 'feature.html' },
        { id: 4, name: 'Countries', link: 'countries.html' },
        { id: 5, name: 'Testimonial', link: 'testimonial.html' },
        { id: 6, name: 'Training', link: 'training.html' },
        { id: 7, name: '404 Page', link: '404.html' },
        { id: 8, name: 'Contact', link: 'contact.html' },
    ];

    search(query: string): SearchItem[] {
        if (!query) return [];
        return this.items.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase()),
        );
    }
}
