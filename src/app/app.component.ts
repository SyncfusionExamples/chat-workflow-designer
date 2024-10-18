import { Component } from '@angular/core';
import { WorkflowDiagramComponent } from './components/workflow-diagram/workflow-diagram.component';
import { WorkflowComponent } from './components/workflow/workflow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowDiagramComponent, WorkflowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
}