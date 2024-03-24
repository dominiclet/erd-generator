import {elementTools, linkTools, dia} from 'jointjs';

const customElementTools = {
    // Function to create element tools and attach them
    attachElementTool: function(elementView){
        var elementToolsView = new dia.ToolsView({
          tools: [new elementTools.Remove({
                    markup: [{
                        tagName: 'circle',
                        selector: 'button',
                        attributes:{
                            'r': 10,
                            'fill':'#ed0028',
                            'cursor': 'pointer',
                        }
                    }],
                    offset: {
                        x: -20, 
                        y:-20
                    },  
                  }), 
                  new elementTools.Boundary(),
                  new InfoButton(),
                  new SettingsButton(),
                  new elementTools.Connect()
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
                'r': 10,
                'fill': '#001DFF',
                'cursor': 'pointer'
            }
        }],
        // x: '100%',
        // y: '100%',
        offset: {
            x: 10,
            y: -20
        },
        rotate: true,
        action: function(evt) {
            alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
        }
    }
});


const SettingsButton = elementTools.Button.extend ({
    name: 'Settings-button',
    options: {
        markup: [{
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 10,
                'fill': '#0e6121',
                'cursor': 'pointer'
            }
        }],
        // x: '100%',
        // y: '0%',
        offset: {
            x: 40,
            y: -20
        },
        rotate: true,
        action: function(evt) {
            alert("Add modal edit window here");
        }
    }
});

export default customElementTools;