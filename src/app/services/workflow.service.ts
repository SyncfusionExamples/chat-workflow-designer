import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatWorkflowRulesData, WorkflowRulesData } from "../models/appModel";
import { WorkflowApiPaths } from "../api/workflowDesignerAPI";
import { Observable } from "rxjs";

@Injectable()
export class WorkflowService {
  private baseUrl = 'https://localhost:44303/chatwidget-api/v1/workflow-designer';
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // // GET request to fetch the diagram data
  getDiagramData1(workflowId: number) {
    return this.http.get<ChatWorkflowRulesData[]>(WorkflowApiPaths.getWorkflowRules.replace('{baseUrl}', this.baseUrl).replace('{workflowId}', workflowId.toString()), this.httpOptions).toPromise();
  }

  // GET request to fetch the diagram data
  getDiagramData(workflowId: number) : Observable<WorkflowRulesData>{
    const url = WorkflowApiPaths.getWorkflowRules
      .replace('{baseUrl}', this.baseUrl)
      .replace('{workflowId}', workflowId.toString());

    try {
      // Await the response and parse it according to the ApiResponse structure
      return this.http.get<WorkflowRulesData>(url, this.httpOptions);
    } catch (error) {
      console.error('Error fetching diagram data', error);
      throw error;
    }
  }
}