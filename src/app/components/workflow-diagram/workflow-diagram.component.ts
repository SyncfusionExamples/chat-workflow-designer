import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, viewChild, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, 
  HierarchicalTree, HierarchicalTreeService, HtmlModel, IClickEventArgs, IExportOptions, LayoutModel, LineDistribution, Node, NodeModel, PrintAndExport, 
  SelectorConstraints, SelectorModel, SnapSettingsModel, TextModel, UserHandleEventsArgs, UserHandleModel, DataSourceModel, 
  DataBindingService, SnapConstraints} from '@syncfusion/ej2-angular-diagrams';
import { BranchDetail, ChatWorkflowRulesData, FieldDetails, FieldOptionDetail, FieldValidation, MessageDetails } from '../../models/appModel';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButtonComponent, DropDownButtonModule, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { CommonModule } from '@angular/common';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { LIST_DATA } from '../../data/list-data';
import { ClickEventArgs, ContextMenuComponent, ContextMenuModule, MenuComponent, MenuItemModel, MenuModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextAreaModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TextFormatEnum, ChatWorkflowEditorTypeEnum, ChatWorkflowBlockTypeEnum } from '../../models/enum';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { AsyncSettingsModel, FileInfo, Uploader } from '@syncfusion/ej2-inputs';
import { WorkflowSidebarComponent } from '../workflow-sidebar/workflow-sidebar.component';  // Import child component
import { Adaptor, DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { WorkflowService } from '../../services/workflow.service';
import { HttpErrorResponse } from '@angular/common/http';


Diagram.Inject(HierarchicalTree, LineDistribution, PrintAndExport);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  providers: [HierarchicalTreeService, DataBindingService, WorkflowService],
  imports: [DiagramModule,ContextMenuModule , MenuModule, DialogModule, DropDownButtonModule, ButtonModule, CommonModule, ListViewModule, DropDownListModule, MultiSelectModule, NumericTextBoxModule, TextBoxModule, TextAreaModule, DatePickerModule, DateTimePickerModule, SwitchModule, ToolbarModule, UploaderModule, WorkflowSidebarComponent],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent implements AfterViewInit {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dropdownbutton') dropdownbutton!: DropDownButtonComponent;
  @ViewChild('listview') listView!: ListViewComponent;
  @ViewChild('workflowSidebar') sidebarComponent!: WorkflowSidebarComponent;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild('contextmenu') contextmenu!: ContextMenuComponent;

  @Input() workflowID!: number | null;

  public chatWorkflowEditorTypeEnum = ChatWorkflowEditorTypeEnum; 
  public chatWorkflowBlockTypeEnum = ChatWorkflowBlockTypeEnum;
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

  public menuItems: MenuItemModel[] = [
    {
      text: 'View',
      items: [
          {
              text: 'Toolbars',
              items: [
                  { text: 'Menu Bar' },
                  { text: 'Bookmarks Toolbar' },
                  { text: 'Customize' },
              ]
          },
          {
              text: 'Zoom',
              items: [
                  { text: 'Zoom In' },
                  { text: 'Zoom Out' },
                  { text: 'Reset' },
              ]
          },
          { text: 'Full Screen' }
      ]
  }
  ];
  public listdata: { [key: string]: any }[] = LIST_DATA;
  public fields: {[key: string]: string} ={ tooltip: 'text'};
  public headertitle = 'Block';
  public animation: Object  = { duration: 0};
  public isParentListItem : boolean = false;
  

  private nodeIdCounter: number = 0;
  private connectorIdCounter: number = 0;
  public newNodeData: ChatWorkflowRulesData[] = [];

  public sidebarHeader!: string;
  public nodeBlockType!: number;
  public nodeEditType!: number;
  public selectedBlockId!: string;
  public selectedWorkFlowId!: number;
  public clickedNodeRuleId: number;

  public dataSourceSettings!: DataSourceModel;

  constructor(private workflowService: WorkflowService) {
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
            data.chatWorkflowId = this.workflowID;
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
    constraints:  SnapConstraints.All,
    gridType: 'Dots'
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
      this.selectedBlockId = clickedBlock.id;
      this.clickedNodeRuleId = (clickedBlock.data as ChatWorkflowRulesData).id;
      this.selectedWorkFlowId = this.workflowID;
      const index = this.diagram.nodes.findIndex(node => node.id === this.selectedBlockId);
      let isBranchNode = (this.diagram.nodes[index].data as ChatWorkflowRulesData).chatWorkflowBlockId == 10;
      if(isLastNode && this.diagram.selectedItems.userHandles) {
        if(!isBranchNode){
          this.diagram.selectedItems.userHandles[0].visible = true;
        }
        this.diagram.selectedItems.userHandles[1].visible = true;
        this.diagram.selectedItems.userHandles[2].visible = true;
      }
      else if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[0].visible = false;
        this.diagram.selectedItems.userHandles[1].visible = true;
        this.diagram.selectedItems.userHandles[2].visible = false;
      }
    }
  }

  public getDiagramLength(): number{
    return this.diagram.nodes.length;
  }

  public checkBranchAdd(branchInfo : BranchDetail[] | null, value: string ): boolean{
    if(branchInfo != null){
      for (const branch of branchInfo) {
        if (branch.value === value && branch.successRuleId == null) {
          return true;
        }
      }
    }
    return false;
  }

  // Method to add a new node and connect it
  // public onDiagramRefresh(): void {
  //   this.diagram.setProperties({ nodes: [], connectors: [] }, true);
  //   this.diagram.refresh();
  // }

  public onDiagramRefresh(): void {
    this.diagram.setProperties({ nodes: [], connectors: [] }, true);
      this.diagram.refresh();
  }

  // on node delete 
  public onDeleteNode(nodeObject) : void {
    let ruleData : ChatWorkflowRulesData = nodeObject.data as ChatWorkflowRulesData;
    const index = this.diagram.nodes.findIndex(node => (node.data as ChatWorkflowRulesData).successRuleId === ruleData.id);
    this.workflowService.deleteRule(ruleData.chatWorkflowId, ruleData.id).then((result) => {
      console.log(result.message);
      this.diagram.setProperties({ nodes: [], connectors: [] }, true);
      this.diagram.refresh();
    }).catch((e : HttpErrorResponse) =>{
      if(e&& e.error?.Message){
        console.log("Delete failed");
      }
    });
  }

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'addBlock') {
      if(this.diagram.selectedItems.userHandles){
        this.diagram.selectedItems.userHandles[0].visible = false;
        this.diagram.selectedItems.userHandles[1].visible = false;
        this.diagram.selectedItems.userHandles[2].visible = false;
      }
      var addbtn=document.getElementById('addbtn');
      var addPos = addbtn.getBoundingClientRect();
      this.contextmenu.open(addPos.top + window.scrollY, addPos.left+window.scrollX);
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
      this.onDeleteNode(nodeObject);
    }
  }

  public onOpenDropDownButton(args: OpenCloseMenuEventArgs, option: any | null, index: number | null) {
    console.log("Drop :" + args.element);
    if (index != null) {
      this.dropdownbutton.toggle();
      if (this.diagram.selectedItems.userHandles) {
        this.diagram.selectedItems.userHandles[1].visible = false;
        this.diagram.selectedItems.userHandles[2].visible = false;
      }
    }
    else {
      let dropDownContainer = document.querySelector('.dropDown-container') as HTMLElement;
      args.element.parentElement!.style.top = dropDownContainer.getBoundingClientRect().top + dropDownContainer.offsetHeight + 'px';

      let ulElement = document.querySelector('ul') as HTMLElement;
      args.element.parentElement!.style.left = dropDownContainer.getBoundingClientRect().left - (ulElement.getBoundingClientRect().width / 2) + (dropDownContainer.getBoundingClientRect().width / 2) + 'px';
    }
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
      while ((this.listView as any).curDSLevel.length > 0) {
        this.listView.back();
      }
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