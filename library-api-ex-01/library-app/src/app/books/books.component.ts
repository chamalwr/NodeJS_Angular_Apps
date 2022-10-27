import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BooksService } from '../core/services/books.service';

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Book {
	_id: string;
	name: string;
	isbn: string;
  author: Author;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  page = 1;
	pageSize = 10;
	collectionSize = 0;
	books: Book[] = [];
  loading: boolean = false;

  selectedBook: Book | undefined = {
    _id: '',
    name: '',
    isbn: '',
    author: {
      _id: '',
      firstName: '',
      lastName: '',
    },
  } || undefined

  ngOnInit(): void {
    this.getAllBooks(this.page, this.pageSize);
  }

	constructor(
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private readonly bookService: BooksService
  ) {
		this.refreshBooks();
	}

	refreshBooks() {
		this.books = this.books.map((book, i) => ({ id: i + 1, ...book })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

  openDetailBookView(content: any, bookDetail?: Book){
    this.selectedBook = bookDetail;
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (close) => {
      this.selectedBook = undefined;
    }).catch((error) => {
      this.selectedBook = undefined
    }).finally(() => {
      this.selectedBook = undefined;
    });
  }

  getAllBooks(page: number, take: number){
    this.bookService.getAllBooks(page, take).subscribe(({
      next: (data: any) => {
        if(data.loading){
          this.loading = true
        }
        this.loading = false;
        this.books = data.books;
        this.collectionSize = this.books.length;
      },
      error: (error: any) => {
        this.loading = false;
        this.toastr.error(`Something went wrong. Failed to get Books data`, 'Internal server error');
      }
    }));
  }

  getBookById(id: string){
    this.bookService.getBookById(id).subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }
        this.loading = false;
        
      },
      error: (error: any) => {
        this.loading = false;
        this.toastr.error(`Something went wrong`, 'Internal server error');
      }
    });
  }

}
