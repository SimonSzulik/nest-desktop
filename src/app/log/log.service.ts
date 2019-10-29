import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  public logs: any = [];
  public time = new Date();

  constructor() { }

  reset(): void {
    this.time = new Date();
    this.logs = [[this.time, 'client', 'Start log']]
  }

  log(message: string): void {
    this.logs.push([new Date(), 'client', message])
  }

}
