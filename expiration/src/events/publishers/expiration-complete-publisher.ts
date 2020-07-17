import { Subjects, Publisher, ExpirationCompleteEvent } from '@anlesvavortickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
