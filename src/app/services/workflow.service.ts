import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatWorkflowRulesData2, WorkflowRulesData } from "../models/appModel";
import { WorkflowApiPaths } from "../api/workflowDesignerAPI";

@Injectable({
  providedIn: 'root'
})

export class WorkflowService {
  private baseUrl = 'https://localhost:44303/chatwidget-api/v1/workflow-designer';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // GET request to fetch the diagram data
  getDiagramData(workflowId: number): Promise<WorkflowRulesData>{
    const url = WorkflowApiPaths.getWorkflowRules
      .replace('{baseUrl}', this.baseUrl)
      .replace('{workflowId}', workflowId.toString());

      return this.http.get<WorkflowRulesData>(url, this.httpOptions).toPromise();
  }

  updateDiagramData(workflowId :number , ruleId: number, body : ChatWorkflowRulesData2) :  Promise<{ message: string }> {
    const url = WorkflowApiPaths.updateWorkflowRules
    .replace('{baseUrl}', this.baseUrl)
    .replace('{workflowId}', workflowId.toString())
    .replace('{ruleId}', ruleId.toString());

    return this.http.put<{ message: string }>(url, body, this.httpOptions).toPromise();
  }

  deleteDiagramData(workflowId :number , ruleId: number): Promise<{ message: string }> {
    const url = WorkflowApiPaths.updateWorkflowRules
    .replace('{baseUrl}', this.baseUrl)
    .replace('{workflowId}', workflowId.toString())
    .replace('{ruleId}', ruleId.toString());

    return this.http.put<{ message: string }>(url, this.httpOptions).toPromise();
  }
}