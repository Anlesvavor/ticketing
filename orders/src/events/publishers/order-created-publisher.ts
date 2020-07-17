import { Publisher, OrderCreatedEvent, Subjects } from '@anlesvavortickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

