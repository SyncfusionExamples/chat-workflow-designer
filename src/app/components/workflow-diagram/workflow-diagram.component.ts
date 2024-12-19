import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, viewChild, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, HierarchicalTree, HierarchicalTreeService, HtmlModel, IClickEventArgs, IExportOptions, LayoutModel, LineDistribution, Node, NodeModel, PrintAndExport, SelectorConstraints, SelectorModel, SnapSettingsModel, TextModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { FieldDetails, FieldOptionDetail, FieldValidation, MessageDetails, RuleData, RuleData2 } from '../../models/appModel';
import { RULE_DATA, RULE_DATA2, RULE_DATA3 } from '../../data/rule-data';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButtonComponent, DropDownButtonModule, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { CommonModule } from '@angular/common';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { LIST_DATA } from '../../data/list-data';
import { ClickEventArgs, SidebarComponent, SidebarModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormsModule } from '@angular/forms';
import workflowData from '../../data/workflow-data.json'; // Adjust the path as needed
import { DropDownList, DropDownListComponent, DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextAreaModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TextFormatEnum, ChatWorkflowEditorTypeEnum, ChatWorkflowBlockTypeEnum } from '../../models/enum';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import sampleWorkflowData from '../../data/sample-workflow-data.json'; // Adjust the path as needed
import { AsyncSettingsModel, FileInfo, Uploader } from '@syncfusion/ej2-inputs';
import { WorkflowSidebarComponent } from '../workflow-sidebar/workflow-sidebar.component';  // Import child component


Diagram.Inject(HierarchicalTree, LineDistribution, PrintAndExport);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  providers: [HierarchicalTreeService],
  imports: [DiagramModule, DialogModule, DropDownButtonModule, CommonModule, ListViewModule, DropDownListModule, MultiSelectModule, NumericTextBoxModule, TextBoxModule, TextAreaModule, DatePickerModule, DateTimePickerModule, SwitchModule, ToolbarModule, UploaderModule, WorkflowSidebarComponent],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent implements AfterViewInit{
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dropdownbutton') dropdownbutton!: DropDownButtonComponent;
  @ViewChild('listview') listView!: ListViewComponent;
  @ViewChild('workflowSidebar') sidebarComponent!: WorkflowSidebarComponent;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  public chatWorkflowEditorTypeEnum = ChatWorkflowEditorTypeEnum; 
  public chatWorkflowBlockTypeEnum = ChatWorkflowBlockTypeEnum;
  // public data: RuleData[] = RULE_DATA;
  public data: RuleData2[] = RULE_DATA3;
  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];
  public closeOnDocumentClick: boolean = true;
  public sidebarInput: string = '';
  public ddlFields: Object = { text: 'label', value: 'value' };

  public handles: UserHandleModel[] = [
    {
      name: 'plusIcon',
      visible: false,
      offset: 0.4,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    }
  ];

  public listdata: { [key: string]: any }[] = LIST_DATA;
  public fields: {[key: string]: string} ={ tooltip: 'text'};
  public headertitle = 'Block';
  public animation: Object  = { duration: 0};
  public isParentListItem : boolean = false;
  

  private nodeIdCounter: number = 0;
  private connectorIdCounter: number = 0;
  public newNodeData: RuleData2[] = [];
  textFormatDDLOptions: Array<{ text: string, value: number }>;
  ddlTextFormatFields: Object = { text: 'text', value: 'value' };

  public sidebarHeader!: string;
  public nodeBlockType!: number;
  public nodeEditType!: number;
  public selectedBlockId!: string;
  public selectedWorkFlowId!: number;

  constructor() {
    // Initialize nodes and connectors based on the data
    this.initializeDiagramElements();
    this.textFormatDDLOptions = this.enumToArray(TextFormatEnum);
  }

  ngAfterViewInit() {
  }

  // Convert enum to array of objects
  private enumToArray(enumObj: any): Array<{ text: string, value: number }> {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => {
        return {
          text: key,
          value: enumObj[key as keyof typeof enumObj]
        }
      });
  }
  
  private initializeDiagramElements(): void {
    this.selectedWorkFlowId = 1; // Get from DB
    sampleWorkflowData.forEach(item => {
      let buttonCount = 0;
      if(item.chatWorkflowEditorTypeId == 2){
        buttonCount = item.fieldOptionDetails?.length || 0;
      }
      // Create nodes based on the data
      this.nodes.push({
        id: `node${item.id}`,
        // annotations: [{ content: `node${item['id']}` }],
        width: 200,
        height: 150 + (buttonCount * 25),
        addInfo: item
      });

      // Create connectors from success_rule_id
      if (item['successRuleId']) {
        this.connectors.push({
          id: `connector${item['id']}-s${item['successRuleId']}`,
          sourceID: `node${item['id']}`,
          targetID: `node${item['successRuleId']}`,
          // annotations: [{ content: 'success', alignment: 'Center'}]
        });
      }
      // if (item.branchDetails) {
      //   item.branchDetails.forEach(branch: any => {
      //     if (branch.successRuleId) {
      //       this.connectors.push({
      //         id: `connector${item.id}-s${branch.successRuleId}`,
      //         sourceID: `node${item.id}`,
      //         targetID: `node${branch.successRuleId}`,
      //         annotations: [{ content: 'success', alignment: 'Center' }]
      //       });
      //     }
      //   });
      // }
    });
  }

  public onDiagramCreated(): void {
    (this.diagram as DiagramComponent).fitToPage();
  };

  // Configure snapSettings to hide grid lines
  public snapSettings: SnapSettingsModel = {
    horizontalGridlines: { lineColor: 'transparent', lineIntervals: [] },
    verticalGridlines: { lineColor: 'transparent', lineIntervals: [] },
    constraints: 0 // Disable all snapping
  };

  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles,
  };

  public layout: LayoutModel = {
    type: 'HierarchicalTree',
    connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
    horizontalSpacing: 40,
    verticalSpacing: 40,
    horizontalAlignment: 'Left',
    verticalAlignment: 'Top',
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
    orientation: 'TopToBottom',
  };

  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.style = {
      fill: '#FFFFFF',
      strokeColor: '#0f2c60',
      strokeWidth: 5,
    };
    obj.borderWidth = 1,
    obj.borderColor = '#0f2c60',
    (obj.shape as HtmlModel).type = 'HTML'
    return obj;
  }

  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Select;
    (
      (connector as ConnectorModel).targetDecorator as DecoratorModel
    ).height = 5;
    ((connector as ConnectorModel).targetDecorator as DecoratorModel).width = 5;
    connector.style = { strokeColor: '#6BA5D7', strokeWidth: 1 };
    return connector;
  }

  public onNodeClick(args: IClickEventArgs): void {
    if (args.actualObject instanceof Node) {
      const clickedBlock = args.actualObject as Node;
      let isLastNode = clickedBlock.outEdges.length == 0;
      if(isLastNode && this.diagram.selectedItems.userHandles) {
        this.diagram.selectedItems.userHandles[0].visible = true;
      }
      else if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[0].visible = false;
      }
       this.selectedBlockId = clickedBlock.id;
    }
  }

  public getDiagramLength(): number{
    return this.diagram.nodes.length;
  }

  // Method to add a new node and connect it
  public onaddNodeAndConnect([sourceNodeId, newNode]: [string, NodeModel]): void {
    // Add the new node to the diagram
    this.diagram.addNode(newNode);
    // Create a new connector to link the new node to the source node
    const newConnectorId = `connector${++this.connectorIdCounter}`;
    const newConnector: ConnectorModel = {
      id: newConnectorId,
      sourceID: sourceNodeId,
      targetID: newNode.id,
      type: 'Orthogonal',
      style: { strokeColor: '#6BA5D7', strokeWidth: 1 }
    };
    // Add the connector to the diagram
    this.diagram.addConnector(newConnector);
    this.diagram.doLayout();
  }

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'plusIcon') {
      this.dropdownbutton.toggle();
    }
  }

  public onOpenDropDownButton(args: OpenCloseMenuEventArgs) {
    if(this.diagram.selectedItems.userHandles){
      this.diagram.selectedItems.userHandles[0].visible = false;
    }
    let dropDownContainer = document.querySelector('.dropDown-container') as HTMLElement;
    args.element.parentElement!.style.top = dropDownContainer.getBoundingClientRect().top + dropDownContainer.offsetHeight +'px';

    let ulElement = document.querySelector('ul') as HTMLElement;
    args.element.parentElement!.style.left = dropDownContainer.getBoundingClientRect().left - (ulElement.getBoundingClientRect().width / 2)+ (dropDownContainer.getBoundingClientRect().width / 2)+'px' ;
  }

  public onBeforeCloseDropDownButton(args: BeforeOpenCloseMenuEventArgs) {
    args.cancel = this.isParentListItem;
    if (!(this.isParentListItem || ((args.event.target as HTMLElement).closest(".bc-block-option.e-listview")==null))) {
      // this.sidebarComponent?.sidebar?.show();
      this.sidebarComponent?.dialog.show();
    }
  }

  public onSelectListView(args: SelectEventArgs) {
    this.isParentListItem = args.item.classList.contains("e-has-child");
    const selectedItem = args.item;
    const selectedItemId = selectedItem.getAttribute('data-uid');
    const selectedItemText = args.item ? args.item.textContent : null;
    if (selectedItemId && /^0[1-3]$/.test(selectedItemId)) { // Check if the ID is '01', '02', or '03'
      this.sidebarHeader = selectedItemText ? selectedItemText.trim() + ' Block' : '';
    }
    if(!this.isParentListItem && typeof args?.data === 'object' && 'editerTypeId' in args.data) {
      this.nodeBlockType = (args.data as { blockid: number })['blockid'];
      this.nodeEditType = (args.data as { editerTypeId: number })['editerTypeId'];
    }
  }

  public onBeforeOpenDropDownButton() {
    this.isParentListItem = false; // The value is reset here, to handle document click case of dropdown
    // Reset ListView to its initial state before opening
    if (this.listView) {
      this.listView.dataSource = this.listdata; // Reset data
      this.listView.refresh();
    }
  }

  public onClicked(args: ClickEventArgs) {
    if (args.item.id === 'save') {
      this.download(this.diagram.saveDiagram());
    }
    if (args.item.id === 'open') {
      this.fileInput.nativeElement.click();
    }
  }

  // Save the diagram object as a JSON file.
  public download(data: string): void {
    // MIME type for JSON data.
    let mimeType='data:text/json;charset=utf-8,';
    // Checks for MS browser to use the msSaveBlob method.
    if ((window.navigator as any).msSaveBlob) {
        // Creates a new Blob object containing the JSON data.
        let blob: Blob = new Blob([data], { type: mimeType });
        // Saves or opens the blob depending on the browser capability.
        (window.navigator as any).msSaveOrOpenBlob(blob, 'Diagram.json');
    } else {
        // Encodes the JSON data as a data URL.
        let dataStr: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
        // Creates an anchor element to facilitate downloading.
        let downloadAnchor: HTMLAnchorElement = document.createElement('a');
        downloadAnchor.href = dataStr;
        downloadAnchor.download = 'Diagram.json';
        document.body.appendChild(downloadAnchor);
        // Triggers the download process.
        downloadAnchor.click();
        // Removes the anchor element from the document.
        downloadAnchor.remove();
    } 
  }

  onFileSelected(event: any) {
    // console.log(event);
    // const file: any = event.target.files[0];
    const file: any = this.fileInput.nativeElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = this.loadDiagram.bind(this);
  }

  loadDiagram(event: ProgressEvent<FileReader>) {
    const jsonString = event.target?.result as string;
    this.diagram.loadDiagram(jsonString);
    this.fileInput.nativeElement.value = '';
  }

}