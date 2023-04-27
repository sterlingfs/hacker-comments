import { Component, Input } from '@angular/core';
import { ListItem } from 'src/types/ListItem';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
[x: string]: any;
  @Input() post?: ListItem;
}
