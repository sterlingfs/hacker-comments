import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { CommentsComponent } from './pages/comments/comments.component';
import { reducers } from './store/reducers';

import { EffectsModule } from '@ngrx/effects';
import * as effects from './store/effects/root.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { initializeApp } from 'firebase/app';
import { PostComponent } from './components/post/post.component';
import { StoryComponent } from './components/story/story.component';
const firebaseConfig = {
  projectId: 'hacker-news',
  databaseURL: 'https://hacker-news.firebaseio.com',
};
initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    CommentsComponent,
    PostComponent,
    StoryComponent,
  ],
  imports: [
    BrowserModule,
    StoreDevtoolsModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    BrowserAnimationsModule,

    /** Material */
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
