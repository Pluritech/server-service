import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerService } from './server.service';

export * from './server.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class ServerServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServerServiceModule,
      providers: [ServerService]
    };
  }
}
