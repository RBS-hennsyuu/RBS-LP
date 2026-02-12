/**
 * RBS LP 資料請求フォーム処理
 * 
 * セットアップ手順：
 * 1. Google スプレッドシートを新規作成
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付け
 * 4. CONFIG の SPREADSHEET_ID を設定
 * 5. デプロイ > 新しいデプロイ > ウェブアプリ
 *    - 実行ユーザー: 自分
 *    - アクセス権: 全員
 * 6. デプロイ後のURLをscript.jsに設定
 */

// ===== 設定 =====
const CONFIG = {
  // スプレッドシートID（URLの /d/XXXXX/edit のXXXXX部分）
  SPREADSHEET_ID: '1Lebm-lSQ_xlZJ9q23oMSnQz6TGpgD_3kfAQZduEAkd4',
  
  // シート名
  SHEET_NAME: '資料請求',
  
  // 送信元メールの表示名
  SENDER_NAME: 'RBS リペアスクール',
  
  // 資料ページURL
  DOCUMENTS_URL: 'https://rbs-lp.web.app/documents.html'
};

// ===== メイン処理 =====

/**
 * POSTリクエストを処理
 */
function doPost(e) {
  try {
    // JSONデータをパース
    const data = JSON.parse(e.postData.contents);
    
    // スプレッドシートに保存
    saveToSpreadsheet(data);
    
    // 自動返信メール送信
    sendAutoReplyEmail(data);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: '送信完了' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンス
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * スプレッドシートにデータを保存
 */
function saveToSpreadsheet(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // シートがなければ作成してヘッダーを追加
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(['受付日時', 'メールアドレス', '年齢幅', '都道府県', '流入経路', '経験年数']);
    
    // ヘッダー行のスタイル設定
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
  
  // データを追加
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  sheet.appendRow([
    timestamp,
    data.email || '',
    data.age_range || '',
    data.prefecture || '',
    data.source || '',
    data.experience_years || ''
  ]);
}

/**
 * 自動返信メールを送信
 */
function sendAutoReplyEmail(data) {
  const recipient = data.email;
  const subject = '資料請求ありがとうございます';
  
  const body = `
この度は、RBS リペアスクールの資料請求をいただき、
誠にありがとうございます。

下記のアドレスにてアクセスをお願いします。

▼ 資料ページ
${CONFIG.DOCUMENTS_URL}

ご不明な点がございましたら、
お気軽にお問い合わせください。

━━━━━━━━━━━━━━━━━━━━━━━━
RBS リペアスクール
https://rbs-lp.web.app
━━━━━━━━━━━━━━━━━━━━━━━━
`;

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body,
    name: CONFIG.SENDER_NAME
  });
}

/**
 * テスト用関数（Apps Script エディタから実行可能）
 */
function testSubmission() {
  const testData = {
    email: 'test@example.com',
    age_range: '30s',
    prefecture: 'tokyo',
    source: 'youtube',
    experience_years: '未経験'
  };
  
  saveToSpreadsheet(testData);
  console.log('テストデータをスプレッドシートに保存しました');
  
  // メール送信テストは実際のメールアドレスに変更してから実行
  // sendAutoReplyEmail(testData);
}
