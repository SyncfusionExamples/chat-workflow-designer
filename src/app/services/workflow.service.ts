import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkflowApiPaths } from '../api/workflowDesignerAPI';
import { ChatWorkflowCommonObject, ChatWorkflowRulesUpdateRequest } from '../models/appModel';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private baseUrl = 'https://localhost:44303/chatwidget-api/v1/workflow-designer';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  updateRule(workflowId :number , ruleId: number, updateRuleRequest : ChatWorkflowRulesUpdateRequest) :  Promise<{ message: string }> {
    const url = WorkflowApiPaths.updateWorkflowRules
    .replace('{baseUrl}', this.baseUrl)
    .replace('{workflowId}', workflowId.toString())
    .replace('{ruleId}', ruleId.toString());

    return this.http.put<{ message: string }>(url, updateRuleRequest, this.httpOptions).toPromise();
  }

  deleteRule(workflowId :number, ruleId: number): Promise<{ message: string }> {
    const url = WorkflowApiPaths.deleteWorkflowRules
    .replace('{baseUrl}', this.baseUrl)
    .replace('{workflowId}', workflowId.toString())
    .replace('{ruleId}', ruleId.toString());

    return this.http.delete<{ message: string }>(url, this.httpOptions).toPromise();
  }

  addRule(addRuleRequest: ChatWorkflowCommonObject, branchValue : string | null): Promise<{ workflowRuleId: number, message: string }> {
    let url = WorkflowApiPaths.addWorkflowRules.replace('{baseUrl}', this.baseUrl);
    if (branchValue != null) {
      url += `?branchValue=${branchValue}`;
    }
    return this.http.post<{ workflowRuleId: number, message: string }>(url, addRuleRequest, this.httpOptions).toPromise();
  }
}
