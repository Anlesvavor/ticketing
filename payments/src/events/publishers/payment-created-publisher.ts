import { Subjects, Publisher, PaymentCreatedEvent } from '@anlesvavortickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
