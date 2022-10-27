import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {  
    path: 'books',
    loadChildren: ()=> import('./books/books.module').then(m => m.BooksModule)
  },
  {
    path: 'authors',
    loadChildren: () => import('./authors/authors.module').then(m => m.AuthorsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
