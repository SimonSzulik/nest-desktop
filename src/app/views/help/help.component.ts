import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  public help: string = '';
  private _subscription: any;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._subscription = this._route.params.subscribe((params: string[]): void => {
      if (params.hasOwnProperty('help')) {
        this.help = params['help'];
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

}
