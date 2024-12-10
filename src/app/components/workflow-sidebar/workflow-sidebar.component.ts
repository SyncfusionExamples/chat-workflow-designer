import { Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { ClickEventArgs, SidebarComponent, SidebarModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { TextFormatEnum, ChatWorkflowEditorTypeEnum, ChatWorkflowBlockTypeEnum } from '../../models/enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {WorkflowDiagramComponent} from '../workflow-diagram/workflow-diagram.component';
import { FieldDetails, FieldOptionDetail, FieldValidation, MessageDetails, RuleData2 } from '../../models/appModel';
import { NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';


@Component({
  selector: 'app-workflow-sidebar',
  standalone: true,
  imports: [SidebarModule, FormsModule, CommonModule, WorkflowDiagramComponent],
  templateUrl: './workflow-sidebar.component.html',
  styleUrl: './workflow-sidebar.component.scss'
})
export class WorkflowSidebarComponent {
  @ViewChild('sidebar') sidebar?: SidebarComponent;
  @ViewChild('ddlTextFormat') ddlTextFormat!: DropDownListComponent;

  public chatWorkflowEditorTypeEnum = ChatWorkflowEditorTypeEnum; 
  public chatWorkflowBlockTypeEnum = ChatWorkflowBlockTypeEnum;
  public buttons: Array<{ label: string, value: string, description:string|null }> = [];
  public options: Array<{ label: string, value: string }> = [];
  public sideBarLabel: string = '';
  public sideBarDescription: string = '';
  public sideBarPlaceholder: string = '';
  public fieldOptionMinValue: number = 1;
  public fieldOptionMaxValue: number = 1;
  public fieldOptionRegexValue: string = '';
  public fromDate: Date = new Date();
  public toDate: Date = new Date();

  public type: string = 'Push';
  public width: string ='280px';
  // public nodeLength: number = 0;
  public checkedIsPrivate: boolean = false;
  public customMessage: string = '';
  public newNodeWidth: number = 200;
  public newNodeHeight: number = 100;
  public newNode : NodeModel = {};

  @Input() nodeEditType!: number;
  @Input() nodeBlockType!: number;
  @Input() sidebarHeader!: string;
  @Input() clickedNodeId!: string;
  @Output() addNodeAndConnect = new EventEmitter<[string, NodeModel]>();
 
  constructor() {
  }
  
  onCloseSideBarClick(): void {
    this.sidebar?.hide();
    this.addNodeAndUpdate(this.clickedNodeId);
    this.buttons = [];
  }

  public onSideBarCreated(args: any) {
    (this.sidebar as SidebarComponent).hide();
    (this.sidebar as SidebarComponent).position = "Right";
  }

  onFormSubmit(): void {
    this.sidebar?.hide();
  }

  addButton(label: string, value: string, description: string | null, labelInput: HTMLInputElement, valueInput: HTMLInputElement, descriptionInput: HTMLInputElement | null): void {
     if (label.trim() && value.trim()) {
      this.buttons.push({ label, value, description });
      labelInput.value = '';
      valueInput.value = '';
      if (descriptionInput) {
        descriptionInput.value = '';
      }
    }
  }

  removeButton(index: number): void {
    this.buttons.splice(index, 1);
  }

  addNodeAndUpdate(sourceNodeId: string){
    let nodeLength = 11;
    // console.log(this.workflowDiagramComponent.getDiagramLength());
    switch(this.nodeBlockType){
      case (this.chatWorkflowBlockTypeEnum.SendTextMessage): {

        let messageInfo: MessageDetails = {
          text: this.customMessage,
          isPrivate: this.checkedIsPrivate,
          textFormat: this.ddlTextFormat.value as TextFormatEnum
        }
        let newNodeInfo: RuleData2 = {
          id : nodeLength + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 6,
          chatWorkflowEditorTypeId : null,
          fieldDetails : null,
          branchDetails: null,
          messageDetails: messageInfo,
          fieldOptionDetails: null
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
        break;
      } 
      case (this.chatWorkflowBlockTypeEnum.GetPickerInput):{
        switch(this.nodeEditType){
          case (this.chatWorkflowEditorTypeEnum.Boolean): {
            let fieldInfo: FieldDetails = {
              description : this.sideBarDescription ,
              label : this.sideBarLabel,
              placeholder : this.sideBarPlaceholder
            };
            let newNodeInfo: RuleData2 = {
              id : nodeLength + 1,
              chatWorkflowId : 1,
              successWorkflowId : 1,
              successRuleId : null,
              isActive : true,
              chatWorkflowBlockId : 4,
              chatWorkflowEditorTypeId : 1,
              fieldDetails : fieldInfo,
              branchDetails: null,
              messageDetails: null,
              fieldOptionDetails: null
            };
    
            this.newNodeHeight= 100; // Set a default height for the new node
            this.newNodeWidth = 150;
            this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
            break;
          }
          case(this.chatWorkflowEditorTypeEnum.Buttons): {
            let fieldInfo: FieldDetails = {
              description : this.sideBarDescription ,
              label : this.sideBarLabel,
              placeholder : this.sideBarPlaceholder
            };
    
            // Mapping buttons to fieldOptionInfo
            let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
              return {
                label: button.label,
                value: button.value
              };
            });
    
            let newNodeInfo: RuleData2 = {
              id : nodeLength + 1,
              chatWorkflowId : 1,
              successWorkflowId : 1,
              successRuleId : null,
              isActive : true,
              chatWorkflowBlockId : 4,
              chatWorkflowEditorTypeId : 2,
              fieldDetails : fieldInfo,
              branchDetails: null,
              messageDetails: null,
              fieldOptionDetails: fieldOptionInfo
            };
    
            this.newNodeHeight= 100 + (this.buttons.length * 20); // Set a default height for the new node
            this.newNodeWidth = 200;
            this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
            break;
          }
          case this.chatWorkflowEditorTypeEnum.DropDown: {
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder
              };
        
              // Mapping buttons to fieldOptionInfo
              let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
                return {
                  label: button.label,
                  value: button.value
                };
              });
        
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 4,
                chatWorkflowEditorTypeId : 3,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: fieldOptionInfo
              };
        
              this.newNodeHeight= 100; // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          }
          case (this.chatWorkflowEditorTypeEnum.MultiSelect): {
              let fieldValidationInfo: FieldValidation = {
                min: this.fieldOptionMinValue.toString(),
                max: this.fieldOptionMaxValue.toString()
              };
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder,
                fieldValidation: fieldValidationInfo
              };
    
              // Mapping buttons to fieldOptionInfo
              let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
                return {
                  label: button.label,
                  value: button.value
                };
              });
    
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 4,
                chatWorkflowEditorTypeId : 4,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: fieldOptionInfo
              };
    
              this.newNodeHeight= 100; // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          } 
          case (this.chatWorkflowEditorTypeEnum.List): {
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder,
              };
    
              // Mapping buttons to fieldOptionInfo
              let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
                return {
                  label: button.label,
                  value: button.value,
                  description: button.description !== null ? button.description : null
                };
              });
    
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 4,
                chatWorkflowEditorTypeId : 5,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: fieldOptionInfo
              };
    
              this.newNodeHeight= 100 + (this.buttons.length * 25); // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          } 
        }
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.GetTextInput):{
        switch(this.nodeEditType){
          case (this.chatWorkflowEditorTypeEnum.Text): {
            let fieldValidationInfo: FieldValidation = {
              max: this.fieldOptionMaxValue.toString()
            };
            let fieldInfo: FieldDetails = {
              description : this.sideBarDescription ,
              label : this.sideBarLabel,
              placeholder : this.sideBarPlaceholder,
              fieldValidation: fieldValidationInfo
            };
  
            let newNodeInfo: RuleData2 = {
              id : nodeLength + 1,
              chatWorkflowId : 1,
              successWorkflowId : 1,
              successRuleId : null,
              isActive : true,
              chatWorkflowBlockId : 5,
              chatWorkflowEditorTypeId : 7,
              fieldDetails : fieldInfo,
              branchDetails: null,
              messageDetails: null,
              fieldOptionDetails: null
            };
  
            this.newNodeHeight= 100; // Set a default height for the new node
            this.newNodeWidth = 200;
            this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
            break;
          } 
          case (this.chatWorkflowEditorTypeEnum.TextArea): {
              let fieldValidationInfo: FieldValidation = {
                max: this.fieldOptionMaxValue.toString()
              };
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder,
                fieldValidation: fieldValidationInfo
              };
    
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 5,
                chatWorkflowEditorTypeId : 8,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: null
              };
    
              this.newNodeHeight= 100; // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          } 
          case (this.chatWorkflowEditorTypeEnum.Date): {
            const today = new Date();
            // Format today's date as YYYY-MM-DD
            const minDate = today.toISOString().split('T')[0];
  
            // Calculate max date, e.g., 30 days from today
            const maxDateObj = new Date(today);
            maxDateObj.setDate(today.getDate() + 30);
            const maxDate = maxDateObj.toISOString().split('T')[0];
  
            let fieldValidationInfo: FieldValidation = {
              // min: this.fromDate.toString(),
              // max: this.toDate.toString()
              
              min: minDate,
              max: maxDate
            };
            let fieldInfo: FieldDetails = {
              description : this.sideBarDescription ,
              label : this.sideBarLabel,
              placeholder : this.sideBarPlaceholder,
              fieldValidation: fieldValidationInfo
            };
  
            let newNodeInfo: RuleData2 = {
              id : nodeLength + 1,
              chatWorkflowId : 1,
              successWorkflowId : 1,
              successRuleId : null,
              isActive : true,
              chatWorkflowBlockId : 5,
              chatWorkflowEditorTypeId : 9,
              fieldDetails : fieldInfo,
              branchDetails: null,
              messageDetails: null,
              fieldOptionDetails: null
            };
  
            this.newNodeHeight= 100; // Set a default height for the new node
            this.newNodeWidth = 200;
            this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
            break;
          } 
          case (this.chatWorkflowEditorTypeEnum.DateTime): {
              const now = new Date();
              // Current datetime formatted as ISO string
              const minDateTime = now.toISOString();
            
              // Max datetime, e.g., 30 days from now
              const maxDateTimeObj = new Date(now);
              maxDateTimeObj.setDate(now.getDate() + 30);
              const maxDateTime = maxDateTimeObj.toISOString();
    
              let fieldValidationInfo: FieldValidation = {
                min: minDateTime,
                max: maxDateTime
              };
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder,
                fieldValidation: fieldValidationInfo
              };
    
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 5,
                chatWorkflowEditorTypeId : 10,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: null
              };
    
              this.newNodeHeight= 100; // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          }
          case (this.chatWorkflowEditorTypeEnum.Number): {
            let fieldValidationInfo: FieldValidation = {
              min: this.fieldOptionMinValue.toString(),
              max: this.fieldOptionMaxValue.toString()
            };
            let fieldInfo: FieldDetails = {
              description : this.sideBarDescription ,
              label : this.sideBarLabel,
              placeholder : this.sideBarPlaceholder,
              fieldValidation: fieldValidationInfo
            };
  
            let newNodeInfo: RuleData2 = {
              id : nodeLength + 1,
              chatWorkflowId : 1,
              successWorkflowId : 1,
              successRuleId : null,
              isActive : true,
              chatWorkflowBlockId : 5,
              chatWorkflowEditorTypeId : 11,
              fieldDetails : fieldInfo,
              branchDetails: null,
              messageDetails: null,
              fieldOptionDetails: null
            };
  
            this.newNodeHeight= 100; // Set a default height for the new node
            this.newNodeWidth = 200;
            this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
            break;
          } 
          case (this.chatWorkflowEditorTypeEnum.Decimal): {
              let fieldValidationInfo: FieldValidation = {
                min: this.fieldOptionMinValue.toString(),
                max: this.fieldOptionMaxValue.toString()
              };
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder,
                fieldValidation: fieldValidationInfo
              };
    
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 5,
                chatWorkflowEditorTypeId : 12,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: null
              };
    
              this.newNodeHeight= 100; // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          } 
          case (this.chatWorkflowEditorTypeEnum.Regex): {
              let fieldValidationInfo: FieldValidation = {
                regex: this.fieldOptionRegexValue
              };
              let fieldInfo: FieldDetails = {
                description : this.sideBarDescription ,
                label : this.sideBarLabel,
                placeholder : this.sideBarPlaceholder,
                fieldValidation: fieldValidationInfo
              };
    
              let newNodeInfo: RuleData2 = {
                id : nodeLength + 1,
                chatWorkflowId : 1,
                successWorkflowId : 1,
                successRuleId : null,
                isActive : true,
                chatWorkflowBlockId : 5,
                chatWorkflowEditorTypeId : 13,
                fieldDetails : fieldInfo,
                branchDetails: null,
                messageDetails: null,
                fieldOptionDetails: null
              };
    
              this.newNodeHeight= 100; // Set a default height for the new node
              this.newNodeWidth = 200;
              this.newNode =  this.createNode(this.newNodeWidth, this.newNodeHeight, newNodeInfo);
              break;
          } 
        }
        break;
      }
    }

    this.addNodeAndConnect.emit([sourceNodeId, this.newNode]);
  }

  public createNode(width: number, height: number, nodeInfo: RuleData2): NodeModel {
    return {
      id: `node${nodeInfo.id}`,
      annotations: [],
      offsetX: 100,
      offsetY: 70,
      style: { fill: '#FFFFFF', strokeColor: '#0f2c60', strokeWidth: 5 },
      height: height,
      width: width,
      borderColor: '#0f2c60',
      borderWidth: 3,
      shape: { 
        type: 'HTML',
      },
      addInfo: nodeInfo
    };
  }

}
