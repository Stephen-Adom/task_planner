import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttachmentOverviewComponent } from './attachment-overview/attachment-overview.component';
import { AttachmentComponent } from './attachment.component';

const routes: Routes = [
  {
    path: '',
    component: AttachmentComponent,
    children: [
      {
        path: 'overview',
        component: AttachmentOverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttachmentRoutingModule {}
