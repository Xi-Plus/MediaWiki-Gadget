# Xiplus-zhWP
我的維基百科編輯小工具

| 檔案 | 類型 | 功能 | 備註 |
| --- | --- | --- | --- |
| get-list | o | 取得頁面標題列表 |  |
| one-click-edit | v | 一鍵編輯 |  |
| AFD-stats.js | v | 在存廢討論顯示已/未處理/需關閉個數 |  |
| AFDclose.js | e | 關閉存廢討論，供Twinkle無法處理狀況 |  |
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
| MarkRights.js<br>MarkRights.css | v | 在最近更改、監視清單、歷史標記用戶權限 |  |
| MediawikiFetchFromMainpage.js | e | Mediawiki空間載入主頁面源碼 |  |
| Page-Preview.js | v | 在特殊頁預覽頁面狀況 | `Special:短页面`、`Special:无跨wiki`、`Special:断链页面` |
| PatrollCount.js | v | 頁頂顯示未巡查量 | 條目討論、用戶、用戶討論空間 |
| Quick-fixlinkstyle.js | v | fixlinkstyle預設選項 | 需配合`fixlinkstyle` |
| RFCU-stats.js | v | 在WP:RFCUHAM的目錄標記處理結果 |  |
| RFPP.js | e | RFPP標記保護 |  |
| RequestMove.js | e | 提出移動請求 |  |
| Revdel.js | e | RRD標記完成 |  |
| SRGreport.js | e | 在meta:SRG快速請求 |  |
| SpecialInterlanguageLink.js | v | 特殊頁跨語言連結 |  |
| T210739.js | o | 在移動頁面時增加刪除目標頁按鈕 | `Special:MovePage` |
| Template-transclusion-count.js<br>Template-transclusion-count.php | v | 顯示模板引用量 |  |
| Twinkle-delete-reason.js | v | 更換Twinkle速刪理由 | 配合`Twinkle` |
| Unsigned-last.js | a | 標記最後編輯用戶未簽名 |  |
| Unsigned.js | e | 標記用戶未簽名 |  |
| WatchAll.js | v | 在貢獻頁或分類頁監視所有頁面 | `Special:Contributions`或`Category:` |
| admin-backlog.js | v | 在頁頂顯示管理員積壓工作 | `CSD`、`EP`、`Unblock` |
| afd-page-log-link.js | v | 在存廢討論段落標題增加日誌連結 |  |
| apply-edit-from-abuselog.js | o | 將過濾器日誌的編輯內容載入到編輯框 | `Special:AbuseLog` |
| auto-unblock.js | o | 封禁期限小於現在自動變成解封 | `Special:Block` |
| block-time-convert.js | v | 封禁執行頁轉換時間 | `Special:Block` |
| category-change.js | v | 添加使用過濾器來檢視分類變更連結 | 似乎已失效？ |
| check-report-in-copyvio-cat.js | v | 在Category:怀疑侵犯版权页面中顯示未提報的頁面 |  |
| close-affp.js | v | 關閉防濫用過濾器/錯誤報告 |  |
| close-move.js | v | 關閉移動請求 |  |
| close-rfpp.js | v | 關閉請求保護頁面 |  |
| close-rrd.js | v | 關閉修訂版本刪除請求 |  |
| close-vip.js | v | 關閉當前的破壞 |  |
| contribution-filter.js | v | 篩選貢獻頁 | `Special:Contributions` |
| csd-reason-in-csd-cat.js | v | 在分類:快速刪除候選顯示頁面速刪理由 |  |
| delete-status.js | v | 顯示刪除狀態 | 包含`提刪者`、`貢獻者`、`刪除日誌` |
| disable-redirect.js | v | 在一些地方禁用連結的重定向 |  |
| editchangetags-link.js | v | 增加編輯標籤連結 |  |
| ep-done.js | e | 關閉編輯請求 |  |
| fix使用無效自封閉HTML標籤的頁面.js | e |  |  |
| forceEditSection.js | v | 在__NOEDITSECTION__的頁面仍然顯示編輯章節連結 |  |
| formerly.js | e | 加入formerly模板 |  |
| get-translatewiki-link.js | 點擊文字產生translatewiki及本地連結 | `uselang=qqx` |
| getdiff.js | o | 在差異/固定版本模式下取得差異/固定版本內部連結 | `Special:Diff`或`Special:PermaLink` |
| hide-logout-btn.js | v | 隱藏登出按鈕 |  |
| hide-long-summary.js | h | 隱藏過長的編輯摘要 |  |
| hide-rollback-link.css | ho | 隱藏回退按鈕 | 於`Special:Watchlist`、`Special:Recentchangeslinked`、`action=history` |
| hide-rollback-link.js | ho | 隱藏回退按鈕 | 於`Special:Watchlist`、`Special:Recentchangeslinked`、`action=history` |
| highlight-newpages.js | v | 在新頁面醒目標記 | `Special:Newpages` |
| highlight-redirect-in-afd.css | v | 在存廢討論醒目標記重定向 |  |
| history-filter.js | h | 篩選頁面歷史 |  |
| list-user-last-active.js | o | 在用戶列表顯示用戶最近編輯時間 | `Special:ListUsers` |
| logout-check.js | v | 登出再次確認 |  |
| mass-revision-delete.js | o | 在用戶貢獻批量版本刪除 | `Special:Contributions` |
| patrollink-click.js | v | 點擊巡查連結 | 我懶( |
| ping.js | e | 自動產生回覆並Ping上方留言者 |  |
| quick-patrol.js | v | 在`Special:最新页面`直接標記巡查 |  |
| replacement-display.js | v | 替換維基語法後重新顯示頁面 | 不能用 |
| saveto.js | e | 快速插入{{saveto}} |  |
| shortcutbox-noredirect.js | v | shortcutbox重定向停用跳轉 |  |
| summary-preset.js | e | 修改編輯摘要選單 |  |
| templates-last-edit | a | 在頁面資訊頁顯示嵌入模板最近編輯時間 |  |
| translatewiki-fix-punctuation.js | e | 在translatewiki修正標點符號 |  |
| unblock-zh-ipbe.js | o | 快速處理unblock-zh | `Special:UserRights` |
| watchlist-markseen.js | o | 在監視清單標記單一頁面已讀 | `Special:Watchlist` |

註解：
* `a`：在瀏覽模式下使用（`action=view`），需配合`APIedit.js`
* `e`：在編輯模式下使用（`action=edit`、WikiEditor）
* `h`：在瀏覽歷史時使用（`action=history`）
* `v`：在瀏覽模式下使用（`action=view`）
* `o`：特殊、請看備註
