import { LocalStorageService } from './local-storage.service';
import { Filter } from './../models/filtering.model';
import { Todo } from './../models/todo.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private static readonly TodoStorageKey = 'todos';

  private todos!: Todo[];
  private filteredTodos!: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private displayTodoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodoSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {}

  fetchFromLocalStorage() {
    this.todos =
      this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos]; // deep clone
    this.updateTodosData();
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }

  addTodo(content: string) {
    const id = new Date(Date.now()).getTime();
    const newTodo = new Todo(id, content);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    const todoToUpdate = this.todos[index];
    todoToUpdate.isCompleted = isCompleted;
    this.todos.splice(index, 1, todoToUpdate);
    this.updateToLocalStorage();
  }

  editTodo(id: number, content: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    const todoToUpdate = this.todos[index];
    todoToUpdate.content = content;
    this.todos.splice(index, 1, todoToUpdate);
    this.updateToLocalStorage();
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.updateToLocalStorage();
  }

  toggleAll() {
    this.todos = this.todos.map((todo) => {
      return {
        ...todo,
        isCompleted: !this.todos.every((t) => t.isCompleted),
      };
    });
    this.updateToLocalStorage();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateToLocalStorage();
  }

  filterTodos(currentFilter: Filter, isFiltering: boolean = true) {
    this.currentFilter = currentFilter;

    switch (currentFilter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter((todo) => !todo.isCompleted);
        break;

      case Filter.Completed:
        this.filteredTodos = this.todos.filter((todo) => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos];
        break;
    }

    if (isFiltering) {
      this.updateTodosData();
    }
  }

  private updateTodosData() {
    this.displayTodoSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
