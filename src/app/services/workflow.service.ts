import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkflowApiPaths } from '../api/workflowDesignerAPI';
import { ChatWorkflowRulesData2 } from '../models/appModel';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private baseUrl = 'https://localhost:44303/chatwidget-api/v1/workflow-designer';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  updateDiagramData(workflowId :number , ruleId: number, body : ChatWorkflowRulesData2) :  Promise<{ message: string }> {
    const url = WorkflowApiPaths.updateWorkflowRules
    .replace('{baseUrl}', this.baseUrl)
    .replace('{workflowId}', workflowId.toString())
    .replace('{ruleId}', ruleId.toString());

    return this.http.put<{ message: string }>(url, body, this.httpOptions).toPromise();
  }

  deleteDiagramData(ruleId: number): Promise<{ message: string }> {
    const url = WorkflowApiPaths.updateWorkflowRules
    .replace('{baseUrl}', this.baseUrl)
    .replace('{ruleId}', ruleId.toString());

    return this.http.put<{ message: string }>(url, this.httpOptions).toPromise();
  }
}
