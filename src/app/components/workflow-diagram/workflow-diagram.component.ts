import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, viewChild, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, 
  HierarchicalTree, HierarchicalTreeService, HtmlModel, IClickEventArgs, IExportOptions, LayoutModel, LineDistribution, Node, NodeModel, PrintAndExport, 
  SelectorConstraints, SelectorModel, SnapSettingsModel, TextModel, UserHandleEventsArgs, UserHandleModel, DataSourceModel, 
  DataBindingService} from '@syncfusion/ej2-angular-diagrams';
import { ChatWorkflowRulesData, FieldDetails, FieldOptionDetail, FieldValidation, MessageDetails, RuleData2 } from '../../models/appModel';
import { RULE_DATA, RULE_DATA2, RULE_DATA3 } from '../../data/rule-data';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButtonComponent, DropDownButtonModule, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { CommonModule } from '@angular/common';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { LIST_DATA } from '../../data/list-data';
import { ClickEventArgs, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormsModule } from '@angular/forms';
import workflowData from '../../data/workflow-data.json'; // Adjust the path as needed
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextAreaModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TextFormatEnum, ChatWorkflowEditorTypeEnum, ChatWorkflowBlockTypeEnum } from '../../models/enum';
import { ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import sampleWorkflowData from '../../data/sample-workflow-data.json'; // Adjust the path as needed
import { AsyncSettingsModel, FileInfo, Uploader } from '@syncfusion/ej2-inputs';
import { WorkflowSidebarComponent } from '../workflow-sidebar/workflow-sidebar.component';  // Import child component
import { Adaptor, DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';


Diagram.Inject(HierarchicalTree, LineDistribution, PrintAndExport);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  providers: [HierarchicalTreeService, DataBindingService],
  imports: [DiagramModule, DialogModule, DropDownButtonModule, ButtonModule, CommonModule, ListViewModule, DropDownListModule, MultiSelectModule, NumericTextBoxModule, TextBoxModule, TextAreaModule, DatePickerModule, DateTimePickerModule, ToolbarModule, UploaderModule, WorkflowSidebarComponent, CheckBoxModule],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent implements AfterViewInit {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dropdownbutton') dropdownbutton!: DropDownButtonComponent;
  @ViewChild('listview') listView!: ListViewComponent;
  @ViewChild('workflowSidebar') sidebarComponent!: WorkflowSidebarComponent;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Input() workflowID!: number | null;

  public chatWorkflowEditorTypeEnum = ChatWorkflowEditorTypeEnum; 
  public chatWorkflowBlockTypeEnum = ChatWorkflowBlockTypeEnum;
  public data: RuleData2[] = RULE_DATA3;
  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];
  public closeOnDocumentClick: boolean = true;
  public sidebarInput: string = '';
  public ddlFields: Object = { text: 'label', value: 'value' };

  public handles: UserHandleModel[] = [
    {
      name: 'addBlock',
      visible: false,
      offset: 0.4,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    },
    {
      name: 'editBlock',
      visible: false,
      offset: 0.4,
      side: 'Right',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    },
    {
      name: 'deleteBlock',
      visible: false,
      offset: 0.4,
      side: 'Right',
      margin: { top: 0, bottom: 0, left: 45, right: 0 },
      backgroundColor: 'skyblue',
    },
  ];

  public listdata: { [key: string]: any }[] = LIST_DATA;
  public fields: {[key: string]: string} ={ tooltip: 'text'};
  public headertitle = 'Block';
  public animation: Object  = { duration: 0};
  public isParentListItem : boolean = false;
  

  private nodeIdCounter: number = 0;
  private connectorIdCounter: number = 0;
  public newNodeData: RuleData2[] = [];

  public sidebarHeader!: string;
  public nodeBlockType!: number;
  public nodeEditType!: number;
  public selectedBlockId!: string;
  public selectedWorkFlowId!: number;

  public dataSourceSettings!: DataSourceModel;

  constructor() {
  }

  ngOnInit() {
    
    let baseUrl = 'https://localhost:44303/chatwidget-api/v1/workflow-designer/'+ this.workflowID+'/rules';

    this.dataSourceSettings = {
      id: 'id', parentId: 'parentRuleId',
      dataManager: new DataManager (
            { 
              url: baseUrl, 
              crossDomain: true 
            },
          ),
          //binds the external data with node
          doBinding: (nodeModel: NodeModel, data: ChatWorkflowRulesData, diagram: Diagram) => {
            let buttonCount = 0;
            if(data.chatWorkflowEditorTypeId == 2) {
              buttonCount = data.fieldOptionDetails?.length || 0;
            }
            nodeModel.id= `node${data.id}`;
            nodeModel.width= 200;
            nodeModel.height= 150 + (buttonCount * 25);
          }
    };
  }

  ngAfterViewInit() {

  }

  public onDiagramCreated(): void {
  }

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
    horizontalAlignment: 'Center',
    verticalAlignment: 'Center',
    margin: { left: 0, right: 0, top: 50, bottom: 0 },
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
        this.diagram.selectedItems.userHandles[1].visible = true;
        this.diagram.selectedItems.userHandles[2].visible = true;
      }
      else if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[0].visible = false;
        this.diagram.selectedItems.userHandles[1].visible = true;
        this.diagram.selectedItems.userHandles[2].visible = false;
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
    const index = this.diagram.nodes.findIndex(node => node.id === sourceNodeId);
    (this.diagram.nodes[index].data as RuleData2).successRuleId = (newNode.data as RuleData2).id;
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

  public onUpdateNode([sourceNodeId, newNode]: [string, RuleData2]) : void {
    const index = this.diagram.nodes.findIndex(node => node.id === sourceNodeId);
    newNode.id  = (this.diagram.nodes[index].data as RuleData2).id;
    this.diagram.nodes[index].data = newNode;
    this.diagram.refresh();
  }

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'addBlock') {
      if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[0].visible = false;
        this.diagram.selectedItems.userHandles[1].visible = false;
        this.diagram.selectedItems.userHandles[2].visible = false;
      }
      this.dropdownbutton.toggle();
    }
    else if(event.element.name === 'editBlock'){
      if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[1].visible = false;
        this.diagram.selectedItems.userHandles[2].visible = false;
      }
      let nodeObject = this.diagram.getNodeObject(this.selectedBlockId);
      this.sidebarComponent?.setBlockValues(nodeObject);
      this.sidebarComponent?.sidebar?.show();
    }
    else if(event.element.name === 'deleteBlock'){
      if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[1].visible = false;
        this.diagram.selectedItems.userHandles[2].visible = false;
      }
      let nodeObject = this.diagram.getNodeObject(this.selectedBlockId);
      let id = (nodeObject.data as RuleData2).id;
      const index = this.diagram.nodes.findIndex(node => (node.data as RuleData2).successRuleId === id);
      (this.diagram.nodes[index].data as RuleData2).successRuleId = null;
      this.diagram.remove(nodeObject);
    }
  }

  public onOpenDropDownButton(args: OpenCloseMenuEventArgs) {
    let dropDownContainer = document.querySelector('.dropDown-container') as HTMLElement;
    args.element.parentElement!.style.top = dropDownContainer.getBoundingClientRect().top + dropDownContainer.offsetHeight +'px';

    let ulElement = document.querySelector('ul') as HTMLElement;
    args.element.parentElement!.style.left = dropDownContainer.getBoundingClientRect().left - (ulElement.getBoundingClientRect().width / 2)+ (dropDownContainer.getBoundingClientRect().width / 2)+'px' ;
  }

  public onBeforeCloseDropDownButton(args: BeforeOpenCloseMenuEventArgs) {
    args.cancel = this.isParentListItem;
    if (!(this.isParentListItem || ((args.event.target as HTMLElement).closest(".bc-block-option.e-listview")==null))) {
      this.sidebarComponent?.sidebar?.show();
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