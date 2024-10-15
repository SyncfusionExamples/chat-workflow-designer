import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorModel, Diagram, DiagramComponent, DiagramModule, LayoutModel, NodeModel, TextModel } from '@syncfusion/ej2-angular-diagrams';
Diagram.Inject(ComplexHierarchicalTree);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DiagramModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  @ViewChild('diagram') diagram!: DiagramComponent;
  public nodes: NodeModel[] = [
    { id: 'node1' },
    { id: 'node2' },
    { id: 'node3' },
    { id: 'node4' },
    { id: 'node5' },
    { id: 'node6' },
    { id: 'node7' },
  ];

  public connectors: ConnectorModel[] = [
    { id: 'node1-node1', sourceID: 'node1', targetID: 'node1' },
    { id: 'node2-node1', sourceID: 'node2', targetID: 'node1' },
    { id: 'node3-node2', sourceID: 'node3', targetID: 'node2' },
    { id: 'node3-node3', sourceID: 'node3', targetID: 'node3' },
    { id: 'node4-node2', sourceID: 'node4', targetID: 'node2' },
    { id: 'node4-node3', sourceID: 'node4', targetID: 'node3' },
    { id: 'node5-node5', sourceID: 'node5', targetID: 'node5' },
    { id: 'node5-node6', sourceID: 'node5', targetID: 'node6' },
  ];

  public created(): void {
    (this.diagram as DiagramComponent).fitToPage();
  };

  public layout: LayoutModel = {
    type: 'ComplexHierarchicalTree',
    connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
    horizontalSpacing: 40, verticalSpacing: 40, horizontalAlignment: "Left", verticalAlignment: "Top",
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
    orientation: 'TopToBottom'
};

  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.width = 70;
    obj.height = 70;
    obj.annotations = [{ content: obj.id }];
    obj.style = {
      fill: '#6BA5D7',
      strokeColor: 'none',
      strokeWidth: 2,
    };
    obj.borderColor = 'black';
    obj.backgroundColor = '#6BA5D7';
    obj.borderWidth = 1;
    (obj.shape as TextModel).margin = {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5,
    };
    return obj;
  }

  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.style = { strokeColor: '#6BA5D7', strokeWidth: 1 };
    connector.targetDecorator = {
      style: {
        fill: '#000000',
        strokeColor: '#000000',
      },
      width: 5,
      height: 5
    };
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    return connector;
  }
}

