import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SearchResult } from '../models/search-result.model';

@Injectable({
  providedIn: 'root',
})
export class SemanticSearchService {
  private readonly http = inject(HttpClient);
  private searchApiUrl: string = `${environment.apiUrl}/search`;

  public search(query: string) {
    return this.http.get<SearchResult[]>(`${this.searchApiUrl}`, {
      params: { query },
    });
  }

  public addDocument(content: string) {
    return this.http.post(`${this.searchApiUrl}/add`, { content });
  }
}
