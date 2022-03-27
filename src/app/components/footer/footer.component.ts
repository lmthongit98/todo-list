import { map, Observable, Subject, takeUntil } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Filter, FilterButton } from 'src/app/models/filtering.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButton: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false },
  ];

  length = 0;
  hasCompleted$!: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.hasCompleted$ = this.todoService.todos$.pipe(
      map((todos) => todos.some((t) => t.isCompleted)),
      takeUntil(this.destroy$)
    );

    this.todoService.length$
      .pipe(takeUntil(this.destroy$))
      .subscribe((length) => (this.length = length));
  }

  filter(type: Filter) {
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }

  clearCompleted(){
    this.todoService.clearCompleted();
  }

  private setActiveFilterBtn(type: Filter) {
    this.filterButton.forEach((btn) => {
      btn.isActive = btn.type === type;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
