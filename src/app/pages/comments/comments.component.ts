import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { NetworkStateRecord } from 'src/app/store/reducers';
import { State } from 'src/types/State';

import * as showdown from 'showdown';
import { status } from 'src/data/status';
const converter = new showdown.Converter();

// import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: [],
})
export class CommentsComponent {
  readonly posts = this.store.select(
    createSelector(
      createFeatureSelector<NetworkStateRecord>('network'),
      (slice) => {
        return Object.values(slice.item)
          .reverse()
          .slice(0, 150)
          .filter((n) => n.response?.type === 'comment')
          .map((e) => {
            const item = e.response;
            const parentItem = slice.item[item?.parent]?.response;
            const user = slice.user[item?.by]?.response;
            const poster = slice.user[parentItem?.by]?.response;

            function convert(text?: string) {
              return text ? converter.makeHtml(text) : undefined;
            }

            return {
              ...item,
              text: convert(item?.text),
              user,
              parentPost: {
                ...parentItem,
                text: convert(parentItem?.text),
                user: poster,
              },
              decoration: status[e.response?.by as keyof typeof status],
            };
          });
      }
    )
  );

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.posts.subscribe((d: any) => {
      console.log('-----', d);
    });

    // this.store.subscribe((d: any) => {
    //   console.log('-----', d.network.user);
    // });
  }
}
