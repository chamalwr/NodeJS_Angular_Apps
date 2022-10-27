import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateBook } from '../dto/create-book.dto';
import { UpdateBook } from '../dto/update-book.dto';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  apiSerberBaseUrl = environment.libraryApiUrl;

  constructor(private httpClient: HttpClient) { }

  getBookById(id: string){
    return this.httpClient.get(`${this.apiSerberBaseUrl}/book/${id}`);
  }

  getAllBooks(page: number, take: number){
    return this.httpClient.get(`${this.apiSerberBaseUrl}/books?page=${page}&take=${take}`); 
  }

  createABook(createBookDto: CreateBook){
    return this.httpClient.post(`${this.apiSerberBaseUrl}/book`, createBookDto);
  }

  updateBook(id: string, updateBook: UpdateBook){
    return this.httpClient.put(`${this.apiSerberBaseUrl}/book/${id}`, updateBook);
  }

}
