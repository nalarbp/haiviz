/*
When you want to add menu icon
1. rootReducer: add layout, add activeChart (layoutKey need to be 1 word, camelCase format works, underscore will be separated on dashboard see step 7)
2. page_haiviz -> btn_SideMenu: title, disabled, icon
3. add or edit icon in photoshop
4. util/loadShowcaseData.js -> add new layoutKey to activeChart
5. page_haiviz/comp_Dashboard.js -> add createChart, make new module component
6. add module-settings on root rootReducer, add settings-reducer,
7. add settings-action.js, add constant
*/
