import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AttachmentRoutingModule } from './attachment-routing.module';
import { AttachmentComponent } from './attachment.component';
import { AttachmentOverviewComponent } from './attachment-overview/attachment-overview.component';
import { AttachmentPreviewComponent } from './attachment-preview/attachment-preview.component';
import { AttachmentNavbarComponent } from './attachment-navbar/attachment-navbar.component';
import { AttachmentListComponent } from './attachment-list/attachment-list.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { AddAttachmentComponent } from './add-attachment/add-attachment.component';
import { PersonalAttachmentListComponent } from './personal-attachment-list/personal-attachment-list.component';
import { AddPersonalAttachmentComponent } from './add-personal-attachment/add-personal-attachment.component';
import { NoAttachmentComponent } from './no-attachment/no-attachment.component';

@NgModule({
  declarations: [
    AttachmentComponent,
    AttachmentOverviewComponent,
    AttachmentPreviewComponent,
    AttachmentNavbarComponent,
    AttachmentListComponent,
    ViewDocumentComponent,
    AddAttachmentComponent,
    PersonalAttachmentListComponent,
    AddPersonalAttachmentComponent,
    NoAttachmentComponent,
  ],
  imports: [
    CommonModule,
    AttachmentRoutingModule,
    MatDialogModule,
    PdfViewerModule,
  ],
  entryComponents: [
    AttachmentListComponent,
    ViewDocumentComponent,
    AddAttachmentComponent,
    PersonalAttachmentListComponent,
  ],
})
export class AttachmentModule {}
