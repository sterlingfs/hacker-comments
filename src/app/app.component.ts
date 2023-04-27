import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.route.paramMap.subscribe((map) => {
      // console.log('>>> PARAM_MAP_DID_CHANGE', map);
    });

    this.route.queryParamMap.subscribe((map) => {
      // console.log('>>> QUERY_PARAM_MAP_DID_CHANGE', map);
    });

    // perform get only if no cache

    this.store.subscribe((s) => {
      // console.log('>>> STATE', s);
    });

    // const unSub = onChildAdded(query(r), (s) => {
    //   console.log('>>> CHILD', s.val());
    // });

    // this.store.
  }
}
