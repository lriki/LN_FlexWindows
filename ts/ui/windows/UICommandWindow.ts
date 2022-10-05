import { assert } from "ts/core/Common";
import { DCommandItem } from "ts/design/DCommandItem";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { DText } from "ts/design/DText";
import { UICommandItem } from "../elements/UICommandItem";
import { UISelectableItem } from "../elements/UISelectableItem";
import { UIText } from "../elements/UIText";
import { UIWindow } from "./UIWindow";

export interface RmmzCommandItem {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: any;
}

export class UICommandWindow extends UIWindow {

    constructor(design: DCommandWindow) {
        super(design);
    }

    public addCommandItem(data: RmmzCommandItem, index: number): void {
        const template = this.design.props.itemTemplate;
        assert(template);
        const design = template.clone() as DCommandItem;
        design.props.text = data.name;
        design.props.symbol = data.symbol;
        design.props.enabled = data.enabled;
        const uiItem = new UICommandItem(design);
        
        if (design.children.length > 0) {
            throw new Error("not implemented");
        }
        else {
            const textDesign = new DText({text: data.name});
            const text = new UIText(textDesign);
            uiItem.addLogicalChild(text);
        }
        
        this.addSelectableItem(uiItem);
    }
}
