Design(
//==============================================================================
// タイトル画面のデザインファイル
//==============================================================================
Scene({
    class: "Scene_Title",
    contents: [
        // コマンドウィンドウの位置とウィンドウスキンを変更する
        Window({
            class: "Window_TitleCommand",
            left: 480,
            top: 380,
            windowskin: "img/Window1",
        }),
        // 左下にバージョン情報のウィンドウを表示する
        Window({
            alignment: "bottom-left",
            contents: [
                Text({ text: "Ver: 0.1.0, Theme: Tutorial" }),
            ]
        })
    ],
})
);