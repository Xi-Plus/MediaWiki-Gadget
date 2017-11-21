# Xiplus-zhWP
我的維基百科編輯小工具

| 檔案 | 類型 | 功能 | 備註 |
| --- | --- | --- | --- |
| AFD-stats.js | v | 在存廢討論顯示已/未處理/需關閉個數 |  |
| AFDclose.js | e | 關閉存廢討論，供Twinkle無法處理狀況 |  |
| AFDnoRedirect.js | v | 存廢討論中重定向停用跳轉並高亮標示 |  |
| AFDpagelog.js | v | 存廢討論中增加頁面日誌連結 |  |
| APIedit.js | a | 在瀏覽模式下按規則編輯，需配合其他程式 |  |
| BD.js | e | 正規化BD模板 |  |
| Blocked.js | e | VIP標記封禁 |  |
| Checkuser-Preload.js | e | 用戶頁標記傀儡 |  |
| EditWatchlist-check.js | v | 編輯監視清單大量選取 |  |
| HRTProtectLink.js | v | 下拉選單增加HRT保護連結 |  |
| History-User-Color.js | h | 相同用戶高亮相同顏色 |  |
| LinkSearchEditlink.js | v | 在Special:LinkSearch顯示編輯連結 |  |
| LTAIPsort.js | v | 在LTA頁面排序IP列表 |  |
| MediawikiFetchFromMainpage.js | e | Mediawiki空間載入主頁面源碼 |  |
| Page-Preview.js | v | 在特殊頁預覽頁面狀況 | ```Special:短页面```、```Special:无跨wiki```、```Special:断链页面``` |
| PatrollCount.js | v | 頁頂顯示未巡查量 | 條目討論、用戶、用戶討論空間 |
| Quick-Patrol.js | v | 在```Special:最新页面```直接標記巡查 |  |
| Quick-fixlinkstyle.js | v | fixlinkstyle預設選項 | 需配合```fixlinkstyle``` |
| RFPP.js | e | RFPP標記保護 |  |
| RequestMove.js | e | 提出移動請求 |  |
| Revdel.js | e | RRD標記完成 |  |
| Template-transclusion-count.js | v | 顯示模板引用量 | 需配合```Template-transclusion-count.php``` |
| Template-transclusion-count.php |  |  | 配合```Template-transclusion-count.js``` |
| Twinkle-delete-reason.js | v | 更換Twinkle速刪理由 | 配合```Twinkle``` |
| Unsigned-last.js | a | 標記最後編輯用戶未簽名 |  |
| Unsigned.js | e | 標記用戶未簽名 |  |
| WatchAll.js | v | 在貢獻頁或分類頁監視所有頁面 | ```Special:Contributions```或```Category:``` |
| admin-backlog.js | v | 在頁頂顯示管理員積壓工作 | ```CSD```、```EP```、```Unblock``` |
| block-time-convert.js | v | 封禁執行頁轉換時間 | ```Special:Block``` |
| category-change.js | v | 添加使用過濾器來檢視分類變更連結 | 似乎已失效？ |
| delete-status.js | v | 顯示刪除狀態 | 包含```提刪者```、```貢獻者```、```刪除日誌``` |
| fix使用無效自封閉HTML標籤的頁面.js | e |  |  |
| forceEditSection.js | v | 在__NOEDITSECTION__的頁面仍然顯示編輯章節連結 |  |
| getSearchResult.js | v | 將搜尋結果產生列表 | 於```Special:Search``` |
| getdiff.js | o | 在差異/固定版本模式下取得差異/固定版本內部連結 | ```Special:Diff```或```Special:PermaLink``` |
| hide-logout-btn.js | v | 隱藏登出按鈕 |  |
| hide-rollback-link.js | ho | 隱藏回退按鈕 | 於```Special:Watchlist```、```Special:Recentchangeslinked```、```action=history``` |
| logout-check.js | v | 登出再次確認 |  |
| patrollink-click.js | v | 點擊巡查連結 | 我懶( |
| ping.js | e | 自動產生回覆並Ping上方留言者 |  |
| saveto.js | e | 快速插入{{saveto}} |  |
| shortcutbox-noredirect.js | v | shortcutbox重定向停用跳轉 |  |
| sidebar.js | v | 邊欄新增自訂內容 |  |
| translatewiki.js | v | 點擊文字產生translatewiki及本地連結 | 於```uselang=qqx``` |

註解：
* ```a```：在瀏覽模式下使用（```action=view```），需配合```APIedit.js```
* ```e```：在編輯模式下使用（```action=edit```、WikiEditor）
* ```h```：在瀏覽歷史時使用（```action=history```）
* ```v```：在瀏覽模式下使用（```action=view```）
* ```o```：特殊、請看備註
