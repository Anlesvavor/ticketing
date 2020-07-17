import { Publisher, Subjects, TicketUpdatedEvent } from '@anlesvavortickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated  = Subjects.TicketUpdated;
}
