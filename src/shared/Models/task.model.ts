import { Attachment } from './attachment.model';
import { Members } from './members.model';

export class GroupTasks {
  attachments: Attachment[];
  createdAt: string;
  description: string;
  endDate: string;
  members: Members[];
  startDate: string;
  status: string;
  title: string;
  updatedAt: string;
  createdBy: string;
  leader: string;
  completedDate: string;
  __v: Number;
  _id: string;
}

export class PersonalTasks {
  attachments: Attachment[];
  createdAt: string;
  description: string;
  endDate: string;
  startDate: string;
  status: string;
  title: string;
  updatedAt: string;
  completedDate: string;
  __v: Number;
  _id: string;
}
