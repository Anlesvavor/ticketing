import { Publisher, OrderCancelledEvent, Subjects } from '@anlesvavortickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

