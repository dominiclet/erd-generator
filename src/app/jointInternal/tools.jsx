import {elementTools, linkTools, dia} from 'jointjs';

const customElementTools = {
    // Function to create element tools and attach them
    attachElementTool: function(elementView){
        var elementToolsView = new dia.ToolsView({
          tools: [new elementTools.Remove({
                    offset: {x: -20, y:-20},  
                  }), 
                  new elementTools.Boundary(),
                  new InfoButton(),
                  new elementTools.HoverConnect()
                ],
        });
        elementView.addTools(elementToolsView);
      },
}


const InfoButton = elementTools.Button.extend ({
    name: 'info-button',
    options: {
        markup: [{
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 7,
                'fill': '#001DFF',
                'cursor': 'pointer'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
        }],
        x: '100%',
        y: '100%',
        offset: {
            x: 20,
            y: 20
        },
        rotate: true,
        action: function(evt) {
            alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
        }
    }
});

export default customElementTools;