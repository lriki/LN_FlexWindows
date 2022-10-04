import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UIContext } from "ts/ui/UIContext";
import { UIWindow } from "ts/ui/UIWindow";

declare global {
    interface Window_Base {
        _flexWindowDesignRevision: number | undefined;
        _flexInfoContents: Bitmap | undefined;
        _flexInfoSprite: Sprite | undefined;
        _flexUIWindow: UIWindow | undefined;
    }
}

const _Window_Base_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(rect: Rectangle): void {
    // 本来であれば LogicalChild に追加した後の Layout で位置が決定されるのが自然だが、
    // Rect は先にオーバーライドしておかないと、初期レイアウトが上手く動かない。
    let actualRect = rect;
    //const manager = FlexWindowsManager.instance;
    const currentScene = SceneManager._scene;
    const uiScene = currentScene._flexUIScene;
    if (uiScene) {
        const initialRect = uiScene.getRmmzWindowInitialRect(this.constructor.name);
        if (initialRect) {
            actualRect = new Rectangle(initialRect.x, initialRect.y, initialRect.width, initialRect.height);
        }
    }
    
    _Window_Base_initialize.call(this, actualRect);
}

const _Window_Base_createContents = Window_Base.prototype.createContents;
Window_Base.prototype.createContents = function() {
    _Window_Base_createContents.call(this);
    const width = this.contentsWidth();
    const height = this.contentsHeight();
    this._flexInfoContents = new Bitmap(width, height);
    this._flexInfoSprite = new Sprite(this._flexInfoContents);
    this._clientArea.addChild(this._flexInfoSprite);

    this._flexInfoSprite.visible = false;
    this._flexInfoSprite.x = 0;
    this._flexInfoSprite.y = 0;
    this._flexInfoContents.fillRect(0, 0, width, this.lineHeight(), "rgba(0, 0, 0, 0.75)");
    this._flexInfoContents.drawText(this.constructor.name, 0, 0, width, this.lineHeight(), "left");
}

const _Window_Base_destroyContents = Window_Base.prototype.destroyContents;
Window_Base.prototype.destroyContents = function() {
    _Window_Base_destroyContents.call(this);
    if (this._flexInfoSprite) {
        this._clientArea.removeChild(this._flexInfoSprite);
        this._flexInfoSprite = undefined;
    }
    if (this._flexInfoContents) {
        this._flexInfoContents.destroy();
        this._flexInfoContents = undefined;
    }
}

const _Window_Base_update = Window_Base.prototype.update;
Window_Base.prototype.update = function() {
    _Window_Base_update.call(this);
    if (this._flexInfoSprite) {
        this._flexInfoSprite.visible = FlexWindowsManager.instance.displayWindowInfo;
    }
    // if (this._flexUILayoutContext) {
    //     this._flexUILayoutContext.update();
    // }
}
