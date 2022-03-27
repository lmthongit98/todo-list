import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {

  @Input() todo!: Todo;
  @Output() statusChange: EventEmitter<Todo> = new EventEmitter<Todo>();

  isHovered = false;
  isEditing = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  changeTodoStatus(): void {
    this.statusChange.emit({...this.todo, isCompleted: !this.todo.isCompleted});
  }

}
