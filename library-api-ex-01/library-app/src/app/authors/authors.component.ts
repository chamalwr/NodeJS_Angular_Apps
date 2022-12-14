import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { CreateAuthor } from '../core/dto/create-author.dto';
import { UpdateAuthor } from '../core/dto/update-author.dto';
import { AuthorsService } from '../core/services/authors.service';

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  pageSize = 6;
  collectionSize = 0;
  currentPage: number = 1;
  totalPages: number = 0;

  authors: Author[] = [];
  loading: boolean = false;
  
  editAuthorForm = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

  createAuthorForm = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private readonly authorService: AuthorsService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.getAllAuthors(this.currentPage, this.pageSize);
  }

  getAllAuthors(page: number, take: number){
    this.authorService.getAuthors(page, take).subscribe({
      next: (data: any) => {
        if(data.loading){
          this.loading = true;
        }
        this.loading = false;
        this.authors = data.authors;
        this.collectionSize = Math.ceil(data.totalPages * this.pageSize);
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      },
      error: (error: any) => {
        this.toastr.error(`Failed to get authors data! Error ${error.message}`, `Internal Server Error`);
      }
    });
  }

  async getAuthorById(id: string){
    return await firstValueFrom(this.authorService.getAuthorById(id)) as Author;
  }

  async openEditAuthorModal(content: any, authorId: string){
    const author = await this.getAuthorById(authorId);
    this.editAuthorForm.setValue({
      firstName: author.firstName,
      lastName: author.lastName,
    });
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(this.editAuthorForm.valid) {
        const updateAuthorDto: UpdateAuthor = {
          firstName: this.editAuthorForm.value.firstName,
          lastName: this.editAuthorForm.value.lastName,
        }
        this.authorService.updateAuthor(authorId, updateAuthorDto).subscribe({
          next: (data: any) => {
            if(data.loading){
              this.loading = true;
            }
            this.loading = false;
            this.toastr.success(`${data.firstName} ${data.lastName}'s details updated!`, `Author Details Updating Complete`);
            window.location.reload();
          },
          error: (error: any) => {
            this.loading = false;
            this.toastr.warning(`${error.error.message}`, `Failed to Update Author Details`);
          }
        })
      }else {
        this.toastr.warning('Invalid author data, check values and try again', 'Input data mismatch');
      }
    }, (close) => {
      this.editAuthorForm.setValue({
        firstName: null,
        lastName: null,
      });
    }).catch((error) => {
      this.loading = false;
      this.toastr.error(`Failed to update author details. Error : ${error.message}`, `Internal Server Error`);
    });
  }

  async openAddNewAuthorModal(content: any){
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(this.createAuthorForm.valid){
        const createAuthorDto: CreateAuthor = {
          firstName: this.createAuthorForm.value.firstName,
          lastName: this.createAuthorForm.value.lastName,
        }
        this.authorService.createAuthor(createAuthorDto).subscribe({
          next: (data: any) => {
            if(data.loading){
              this.loading = true;
            }
            this.loading = false;
            this.toastr.success(`New Author Created as ${data.firstName} ${data.lastName}`, `Creating new Author Completed!`);
            window.location.reload();
          },
          error: (error: any) => {
            this.loading = false;
            this.toastr.warning(`${error.error.message}`, `Failed to Create new Author`);
          }
        })
      }else {
        this.toastr.warning('Invalid author data, check values and try again', 'Input data mismatch');
      }
    }, (close) => {
      this.createAuthorForm.setValue({
        firstName: null,
        lastName: null,
      });
    }).catch((error) => {
      this.loading = false;
      this.toastr.error(`Failed to create new author. Error : ${error.message}`, `Internal Server Error`);
    });
  }

  refreshAuthors(event: any, changedPageSize?: boolean) {
		if(changedPageSize){
      this.currentPage = 1;
      this.pageSize = event;
      this.authorService.getAuthors(this.currentPage, event).subscribe({
        next: (data: any) => {
          if(data.loading){
            this.loading = true;
          }
          this.loading = false;
          this.authors = data.authors;
          this.currentPage = data.currentPage;
          this.collectionSize = Math.ceil(data.totalPages * this.pageSize);
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
        },
        error: (error: any) => {
          this.toastr.error(`Failed to get authors details : ${error.message}`, 'Internal Server Error');
        }
      })
    }else{
      this.authorService.getAuthors(event, this.pageSize).subscribe({
        next: (data: any) => {
          this.authors = data.authors;
          this.currentPage = data.currentPage;
        },
        error: (error: any) => {
          this.toastr.error(`Failed to get authors details : ${error.message}`, 'Internal Server Error');
        }
      });
    }
	}
}
