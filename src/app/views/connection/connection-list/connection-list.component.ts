import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Connection } from '../../../components/connection/connection';

import { FormatService } from '../../../services/format/format.service';


@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss']
})
export class ConnectionListComponent implements OnInit {
  @Input() connection: Connection;
  @Input() selective: boolean = false;

  constructor(
    private _formatService: FormatService,
  ) { }

  ngOnInit() {
  }

  synWeights(): any {
    if (!this.connection.projections.hasOwnProperty('weights')) {
      return this._formatService.format(1);
    }
    if (!this.connection.projections.weights.hasOwnProperty('parameterType')) {
      return this._formatService.format(this.connection.projections.weights);
    }
    if (this.connection.projections.weights.parameterType === 'constant') {
      return this._formatService.format(this.connection.projections.weights.specs.value);
    }
    return this.connection.projections.weights.parameterType;
  }

  synDelays(): any {
    if (!this.connection.projections.hasOwnProperty('delays')) {
      return this._formatService.format(1);
    }
    if (!this.connection.projections.delays.hasOwnProperty('parameterType')) {
      return this._formatService.format(this.connection.projections.delays);
    }
    if (this.connection.projections.delays.parameterType === 'constant') {
      return this._formatService.format(this.connection.projections.delays.specs.value);
    }
    return this.connection.projections.delays.parameterType;
  }

}
