import { DAccordionLayout } from "ts/design/layout/DAccordionLayout";
import { DOrientation } from "ts/design/layout/DStackLayout";
import { VUIPoint, VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";

export class UIAccordionLayout extends VUIElement {
    public readonly design: DAccordionLayout;

    public constructor(design: DAccordionLayout) {
        super(design);
        this.design = design;
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        const visualChildren = this.visualChildren;
        const desiredSize = { width: 0, height: 0 };
        for (let i = 0; i < visualChildren.length; i++) {
            const child = visualChildren[i];
            if (context.testLayoutEnabled(child)) {
                child.measure(context, constraint);

                const childDesiredSize = child.desiredSize;
                if (this.design.orientation == DOrientation.Horizontal || this.design.orientation == DOrientation.ReverseHorizontal) {
                    // 横に並べるときは、width の総和と height の最大値を取る
                    desiredSize.width += childDesiredSize.width;
                    desiredSize.height = Math.max(desiredSize.height, childDesiredSize.height);
                }
                else {
                    // 縦に並べるときは、width の最大値と height の総和を取る
                    desiredSize.width = Math.max(desiredSize.width, childDesiredSize.width);
                    desiredSize.height += childDesiredSize.height;
                }
            }
        }
        return desiredSize;
    }

    
    override arrangeOverride(context: UIContext, borderBoxSize: VUISize): VUISize {
        const scrollOffset: VUIPoint = { x: 0, y: 0 };
        const finalSlotRect = this.makeContentBoxSize(borderBoxSize);
        const visualChildren = this.visualChildren;

        // まずは first と last のサイズを求める
        const firstChild = (visualChildren.length >= 1) ? visualChildren[0] : undefined;
        const lastChild = (visualChildren.length >= 2) ? visualChildren[visualChildren.length - 1] : undefined;
        let firstChildSize: VUISize = { width: 0, height: 0 };
        let lastChildSize: VUISize = { width: 0, height: 0 };
        if (firstChild) {
            firstChildSize = {
                width: Math.min(firstChild.desiredSize.width, finalSlotRect.width),
                height: Math.min(firstChild.desiredSize.height, finalSlotRect.height)
            };
        }
        if (lastChild) {
            lastChildSize = {
                width: Math.min(lastChild.desiredSize.width, finalSlotRect.width),
                height: Math.min(lastChild.desiredSize.height, finalSlotRect.height)
            };
        }

        // first と last 以外のサイズを求める
        const middleSize = {
            width: Math.max(0, finalSlotRect.width - firstChildSize.width - lastChildSize.width),
            height: Math.max(0, finalSlotRect.height - firstChildSize.height - lastChildSize.height)
        };

        
        let x = -scrollOffset.x;
        let y = -scrollOffset.y;
        const advanceCurrentPos = (rect: VUIRect) => {
            if (this.design.orientation == DOrientation.Horizontal) {
                x += rect.width;
            }
            else if (this.design.orientation == DOrientation.Vertical) {
                y += rect.height;
            }
            else {
                throw new Error("Invalid orientation");
            }
        }

        // First child.
        if (firstChild) {
            if (context.testLayoutEnabled(firstChild)) {
                const rect: VUIRect = {
                    x: x,
                    y: y,
                    width: firstChildSize.width,
                    height: lastChildSize.height,
                };
                firstChild.arrange(context, rect);
                advanceCurrentPos(rect);
            }
        }

        // Middle children.
        for (let i = 1; i < visualChildren.length - 1; i++) {
            const child = visualChildren[i];
            if (context.testLayoutEnabled(child)) {
                const rect: VUIRect = {
                    x: x,
                    y: y,
                    width: middleSize.width,
                    height: middleSize.height,
                };
                child.arrange(context, rect);
                advanceCurrentPos(rect);
            }
        }

        // Last child.
        if (lastChild) {
            if (context.testLayoutEnabled(lastChild)) {
                const rect: VUIRect = {
                    x: x,
                    y: y,
                    width: lastChildSize.width,
                    height: lastChildSize.height,
                };
                lastChild.arrange(context, rect);
            }
        }

        return { ...finalSlotRect };
    }
}
