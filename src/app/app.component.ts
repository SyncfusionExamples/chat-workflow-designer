import { Component } from '@angular/core';
import { WorkflowDiagramComponent } from './components/workflow-diagram/workflow-diagram.component';

@Component({
    selector: 'app-root',
    imports: [WorkflowDiagramComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent {
public workflowID: number = 8;
}