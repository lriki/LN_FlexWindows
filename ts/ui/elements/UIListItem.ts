import { assert } from "ts/core/Common";
import { DListItem } from "ts/design/DListItem";
import { DText } from "ts/design/DText";
import { VUIRect } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { UIText } from "./UIText";

export class UIListItem extends VUIContainer {
    private _design: DListItem;
    public rmmzCommandIndex: number;

    public constructor(design: DListItem) {
        super(design);
        this._design = design;
        this.rmmzCommandIndex = 0;

        if (this._design.text !== undefined) {
            const textDesign = new DText({text: this._design.text});
            const text = new UIText(textDesign);
            this.addLogicalChild(text);
        }
    }
    
    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        const window = context.currentWindow as Window_Selectable;
        assert(window);
        
        for (const child of this.children()) {
            const rect = window.itemLineRect(this.itemIndex) as any;
            child.arrange(context, rect);
        }
        super.setActualRect(finalArea);
        return finalArea;
    }
    
}
