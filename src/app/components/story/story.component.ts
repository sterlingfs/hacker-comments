import { Component, Input } from '@angular/core';
import { ListItem } from 'src/types/ListItem';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent {
  @Input() story?: ListItem;
}
