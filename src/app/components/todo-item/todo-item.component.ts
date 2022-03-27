import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

const fadeStrikeThroughAnimation = trigger('fadeStrikeThrough', [
  state(
    'active',
    style({
      fontSize: '18px',
      color: 'black',
    })
  ),
  state(
    'completed',
    style({
      fontSize: '17px',
      color: 'lightgrey',
      textDecoration: 'line-through',
    })
  ),
  transition('active <=> completed', [animate(250)]),
]);

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [fadeStrikeThroughAnimation],
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() statusChange: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() todoChange: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() whenDeleteTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  isHovered = false;
  isEditing = false;

  constructor() {}

  ngOnInit(): void {}

  changeTodoStatus(): void {
    this.statusChange.emit({
      ...this.todo,
      isCompleted: !this.todo.isCompleted,
    });
  }

  submitEdit(event: KeyboardEvent) {
    const { keyCode } = event;
    event.preventDefault();
    if (keyCode === 13) {
      this.todoChange.emit(this.todo);
      this.isEditing = false;
    }
  }

  deleteTodo() {
    this.whenDeleteTodo.emit(this.todo);
  }
}
