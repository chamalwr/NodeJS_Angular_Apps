import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateAuthor } from '../dto/create-author.dto';
import { UpdateAuthor } from '../dto/update-author.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  apiSerberBaseUrl = environment.libraryApiUrl;

  constructor(private httpClient: HttpClient) { }

  getAuthorById(id: string){
    return this.httpClient.get(`${this.apiSerberBaseUrl}/author/${id}`);
  }

  getAuthors(page?: number, take?: number){
    if(page && take){
      return this.httpClient.get(`${this.apiSerberBaseUrl}/authors?page=${page}&take=${take}`);
    }
    return this.httpClient.get(`${this.apiSerberBaseUrl}/authors`);
  }

  createAuthor(createAuthorDto: CreateAuthor){
    return this.httpClient.post(`${this.apiSerberBaseUrl}/author`, createAuthorDto);
  }

  updateAuthor(id: string, updateAuthorDto: UpdateAuthor){
    return this.httpClient.put(`${this.apiSerberBaseUrl}/book/${id}`, updateAuthorDto);
  }
}
