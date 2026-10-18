import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class MessageComponent {
  @Input() message!: Message;
}
