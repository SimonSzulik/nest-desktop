import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-config-dialog',
  templateUrl: './model-config-dialog.component.html',
  styleUrls: ['./model-config-dialog.component.scss']
})
export class ModelConfigDialogComponent implements OnInit {
  public options: any;
  private _idx: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modelService: ModelService,
    public dialogRef: MatDialogRef<ModelConfigDialogComponent>,
  ) {
  }

  ngOnInit() {
    // console.log(this.data)
    const modelSettings: any = this.modelService.getSettings(this.data.model);
    this._idx = modelSettings.params.map(param => param.id).indexOf(this.data.param);
    this.options = Object.assign({}, modelSettings.params[this._idx]);
    // this.options = params;
  }

  valueChanged(event: any): void {
    var value = event.target.value;
    var ticks = value.split(',');
    ticks = ticks.map(d => parseFloat(d));
    this.options.ticks = ticks;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const modelSettings: any = this.modelService.getSettings(this.data.model);
    modelSettings.params[this._idx] = this.options;
    // this._modelService.save(this.options);
    this.dialogRef.close();
  }

}
