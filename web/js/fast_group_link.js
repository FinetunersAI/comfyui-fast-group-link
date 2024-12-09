import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Comfy.FastGroupLink",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "FastGroupLink") return;

        // Store original onNodeCreated
        const onNodeCreated = nodeType.prototype.onNodeCreated;

        nodeType.prototype.onNodeCreated = function() {
            // Call original onNodeCreated if it exists
            const r = onNodeCreated?.apply(this, arguments);

            // Initialize properties
            this.properties = this.properties || {};
            this.properties["masterGroup"] = this.properties["masterGroup"] || "";
            this.properties["slaveGroup"] = this.properties["slaveGroup"] || "";
            this.serialize_widgets = true;
            this.size = [240, 120];  // Fixed expanded size
            this.modeOn = LiteGraph.ALWAYS;
            this.modeOff = LiteGraph.NEVER;
            
            // Add custom styles
            this.addProperty("bgcolor", "#454545");
            this.addProperty("boxcolor", "#666");
            this.shape = LiteGraph.BOX_SHAPE;
            this.round_radius = 8;
            
            // Remove inputs/outputs
            this.removable = true;
            this.removeInput(0);
            this.removeOutput(0);

            // Store states
            this.toggleValue = false;
            this.showGroups = true;  // Always expanded

            // Override the node's drawing function
            this.onDrawForeground = function(ctx) {
                // Draw background
                ctx.fillStyle = this.properties["bgcolor"] || "#454545";
                ctx.beginPath();
                ctx.roundRect(0, 0, this.size[0], this.size[1], this.round_radius);
                ctx.fill();

                const y = 15;
                
                // Draw ON/OFF text
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.fillText(this.toggleValue ? "ON" : "OFF", this.size[0]/2, y + 12);
                
                // Draw toggle track
                ctx.fillStyle = "#666";
                ctx.beginPath();
                ctx.roundRect(this.size[0] - 45, y + 2, 30, 16, 8);
                ctx.fill();

                // Draw toggle circle
                ctx.fillStyle = this.toggleValue ? "#4CAF50" : "#f44336";
                ctx.beginPath();
                ctx.arc(this.toggleValue ? this.size[0] - 23 : this.size[0] - 37, y + 10, 8, 0, Math.PI * 2);
                ctx.fill();

                // Draw widgets
                if (this.widgets) {
                    for (let i = 0; i < this.widgets.length; ++i) {
                        let w = this.widgets[i];
                        w.draw(ctx, this);
                    }
                }
            };

            // Handle mouse clicks
            this.onMouseDown = function(e, local_pos) {
                const y = 15;
                
                // Handle toggle click
                if (local_pos[1] >= y - 10 && local_pos[1] <= y + 20 &&
                    local_pos[0] >= this.size[0] - 45) {
                    this.toggleValue = !this.toggleValue;
                    this.updateGroupStates();
                    return true;
                }
            };

            // Refresh widgets on creation
            setTimeout(() => this.refreshWidgets(), 100);

            return r;
        };

        nodeType.prototype.onAdded = function(graph) {
            this.graph = graph;
            this.refreshWidgets();
            // Initial state setup
            this.updateGroupStates();
        };

        nodeType.prototype.updateGroupStates = function() {
            if (!this.graph) return;

            const masterGroup = this.graph._groups.find(g => g.title === this.properties["masterGroup"]);
            const slaveGroup = this.graph._groups.find(g => g.title === this.properties["slaveGroup"]);

            if (masterGroup) {
                masterGroup.recomputeInsideNodes();
                for (const node of masterGroup._nodes) {
                    node.mode = (this.toggleValue ? this.modeOn : this.modeOff);
                }
            }

            if (slaveGroup) {
                slaveGroup.recomputeInsideNodes();
                for (const node of slaveGroup._nodes) {
                    node.mode = (this.toggleValue ? this.modeOn : this.modeOff);
                }
            }

            app.graph.setDirtyCanvas(true, false);
        };

        nodeType.prototype.refreshWidgets = function() {
            if (!this.graph?._groups) return;
            
            const groups = [...this.graph._groups].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            const groupTitles = groups.map(g => g.title || "Untitled");
            
            // Clear existing widgets
            if (!this.widgets) {
                this.widgets = [];
            }
            this.widgets.length = 0;
            
            // Add master group selection
            const masterWidget = this.addWidget("combo", "Master Group", this.properties["masterGroup"], (v) => {
                this.properties["masterGroup"] = v;
                this.updateGroupStates();
            }, { values: groupTitles });
            
            // Add slave group selection
            const slaveWidget = this.addWidget("combo", "Slave Group", this.properties["slaveGroup"], (v) => {
                this.properties["slaveGroup"] = v;
                this.updateGroupStates();
            }, { values: groupTitles });
        };

        // Handle graph reloading
        nodeType.prototype.onConfigure = function(info) {
            // Restore properties
            if (info.properties) {
                this.properties = {...info.properties};
            }
            // Restore toggle state
            if (info.toggleValue !== undefined) {
                this.toggleValue = info.toggleValue;
            }
            // Update states after loading
            setTimeout(() => {
                this.updateGroupStates();
            }, 100);
        };

        // Save additional state
        const onSerialize = nodeType.prototype.onSerialize;
        nodeType.prototype.onSerialize = function(info) {
            if (onSerialize) {
                onSerialize.apply(this, arguments);
            }
            // Save toggle state
            info.toggleValue = this.toggleValue;
        };
    }
});

