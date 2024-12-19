import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WorkflowRulesData } from "../models/appModel";
import { WorkflowApiPaths } from "../api/workflowDesignerAPI";
import { Observable } from "rxjs";

@Injectable()
export class WorkflowService {
  private baseUrl = 'https://localhost:44303/chatwidget-api/v1/workflow-designer';
  
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // GET request to fetch the diagram data
  getDiagramData(workflowId: number) : Observable<WorkflowRulesData>{
    const url = WorkflowApiPaths.getWorkflowRules
      .replace('{baseUrl}', this.baseUrl)
      .replace('{workflowId}', workflowId.toString());

      return this.http.get<WorkflowRulesData>(url, this.httpOptions);
  }
}