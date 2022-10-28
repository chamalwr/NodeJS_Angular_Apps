import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, map, Observable, OperatorFunction } from 'rxjs';
import { CreateBook } from '../core/dto/create-book.dto';
import { UpdateBook } from '../core/dto/update-book.dto';
import { AuthorsService } from '../core/services/authors.service';
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

type AuthorType = {  _id: string, firstName: string, lastName: string };

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  pageSize = 6;
  collectionSize = 0;
  currentPage: number = 1;
  totalPages: number = 0;

	books: Book[] = [];
  authors: Author[] = [];
  loading: boolean = false;
  currentBookModal: any;

  editBookForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    isbn: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    author: new FormControl(null, [Validators.required]),
  });

  createBookForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    isbn: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    author: new FormControl(null, [Validators.required]),
  });

  formatter = (state: AuthorType) => state.firstName + " " + state.lastName;

  selectedBook: Book = {
    _id: '',
    name: '',
    isbn: '',
    author: {
      _id: '',
      firstName: '',
      lastName: '',
    }
  };

  ngOnInit(): void {
    this.getAllBooks(this.currentPage, this.pageSize);
    this.getAuthors();
  }

	constructor(
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private readonly bookService: BooksService,
    private readonly authorService: AuthorsService,
  ) {
	}

	refreshBooks(event: any, changedPageSize?: boolean) {
    if(changedPageSize) {
      this.currentPage = 1;
      this.pageSize = event;
      this.bookService.getAllBooks(this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          if(data.loading){
            this.loading = true;
          }
          this.loading = false;
          this.books = data.books;
          this.currentPage = data.currentPage;
          this.collectionSize = Math.ceil(data.totalPages * this.pageSize);
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
        },
        error: (error: any) => {
          this.toastr.error(`Failed to get books details : ${error.message}`, 'Internal Server Error');
        }
      });
    }else {
      this.bookService.getAllBooks(event, this.pageSize).subscribe({
        next: (data: any) => {
          this.books = data.books;
          this.currentPage = data.currentPage;
        },
        error: (error: any) => {
          this.toastr.error(`Failed to get books details : ${error.message}`, 'Internal Server Error');
        }
      });
    }
   
	}

  openDetailBookView(content: any, bookDetail?: Book){
    this.selectedBook = bookDetail;
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (close) => {
      this.selectedBook =  {
        _id: '',
        name: '',
        isbn: '',
        author: {
          _id: '',
          firstName: '',
          lastName: '',
        }
      };
    }).catch((error) => {
      this.selectedBook =  {
        _id: '',
        name: '',
        isbn: '',
        author: {
          _id: '',
          firstName: '',
          lastName: '',
        }
      };
    });
  }

  openCreateBookModal(content: any){
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(this.createBookForm.valid){
        const createBookDto: CreateBook = {
          name: this.createBookForm.value.name,
          isbn: this.createBookForm.value.isbn,
          author: this.createBookForm.value.author._id,
        }
        this.bookService.createABook(createBookDto).subscribe({
          next: (result: any) => {
            if(result.loading) {
              this.loading = true;
            }
            this.loading = false;
            this.toastr.success(`${result.name} is Added`, 'New Book Added!');
            window.location.reload();
          },
          error: (error: any) => {
            this.loading = false;
            console.log(error);
            this.toastr.error(`Creating New Book Failed! : ${error.message}`, 'Internal Server Error');
          }
        });
      }else {
        this.toastr.warning(`Please check the correct book details and try again`, `User Input Mismatch`)
      }
    }, (close) => {
    }).catch((error) => {
      console.log(error);
      this.toastr.error(`Creating New Book Failed!: ${error.message}`, 'Internal Server Error');
    })
  }

  getAllBooks(page: number, take: number){
    this.bookService.getAllBooks(page, take).subscribe(({
      next: (data: any) => {
        if(data.loading){
          this.loading = true
        }
        this.loading = false;
        this.books = data.books;
        this.collectionSize = Math.ceil(data.totalPages * this.pageSize);
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      },
      error: (error: any) => {
        this.loading = false;
        this.toastr.error(`Something went wrong. Failed to get Books data`, 'Internal server error');
      }
    }));
  }

  async getBookById(id: string){
    return await firstValueFrom(this.bookService.getBookById(id)) as Book;
  }

  getAuthors(){
    this.authorService.getAuthors().subscribe({
      next: (data: any) => {
        if(data.loading){
          this.loading = true;
        }

        this.loading = true;
        this.authors = data.authors;
      },
      error: (error: any) => {
        this.loading = false;
        this.toastr.error(`Something went wrong. Failed to get Authors data`, 'Internal server error');
      }
    });
  }

  async openUpdateBookDataModal(content: any, bookId: string){
    const bookDetails: Book = await this.getBookById(bookId);
    this.editBookForm.setValue({
      name: bookDetails.name,
      isbn: bookDetails.isbn,
      author: bookDetails.author,
    });
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(this.editBookForm.valid){
        const updateBookDto: UpdateBook = {
          name: this.editBookForm.value.name,
          isbn: this.editBookForm.value.isbn,
          author: this.editBookForm.value.author._id,
        }
        this.bookService.updateBook(bookId, updateBookDto).subscribe({
          next: (result: any) => {
            if(result.loading) {
              this.loading = true;
            }
            this.loading = false;
            this.toastr.success(`Book updating completed for ${result.name}`, 'Update Successfull');
            window.location.reload();
          },
          error: (error: any) => {
            this.loading = false;
            this.toastr.warning(`Book detail update failed!`, 'Internal Server Error');
          }
        });
      }else {
        this.toastr.warning(`Please check the correct book details and try again`, `User Input Mismatch`)
      }
    }, (close) => {
    }).catch((error) => {
      this.toastr.warning(`Book detail update failed!`, 'Internal Server Error');
    })
  }

  search: OperatorFunction<string, readonly {_id: string, firstName: string}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.authors.filter(category => new RegExp(term, 'mi').test(category.firstName)).slice(0, 10))
  )
}
