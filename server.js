// 各種モジュールを取得
const http = require('http');
const fs = require('fs');
const path = require('path');
// サーバーの作成
const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        // get処理
        // index.htmlを読み込む
        fs.readFile('./index.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    else if(req.url==='/input'&&req.method==='GET'){
        // input_plan.htmlを入力
        fs.readFile('./input_plan.html',(err,data)=>{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(data);
        })
    }else if(req.url==='/data' && req.method==='GET'){
        // data.jsonを読み込む
        const filePath = path.join(__dirname, './data.json');
        const json = fs.readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        console.log("data.json>Success");
        res.end(json);
    }else if(req.url === '/front.js' && req.method==='GET'){
        // front.jsを読み込む
        fs.readFile(path.join(__dirname,'front.js'),(err,data)=>{
            res.writeHead(200,{'Content-Type':'application/javascript'});
            res.end(data);
        })
    }else if(req.url === '/add_plan.js' && req.method==='GET'){
        // add_plan.jsを読み込む
        fs.readFile(path.join(__dirname,'add_plan.js'),(err,data)=>{
            res.writeHead(200,{'Content-Type':'application/javascript'});
            res.end(data);
        })
    }else if (req.url === '/css' && req.method === 'GET') {
        // main.cssを取得
        fs.readFile(path.join(__dirname,'main.css'),(err,data)=>{
            res.writeHead(200,{'Content-Type':'text/css'});
            res.end(data)
        })
    }else if (req.url === '/add'&&req.method==='POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                // 受信したJSONをオブジェクト化
                const newData = JSON.parse(body);
                const filePath = path.join(__dirname, 'data.json');
                // 既存データを取得
                const currentData = JSON.parse(
                    fs.readFileSync(filePath, 'utf-8')
                );
                // 配列へ追加
                currentData.push(newData);
                // ファイルへ保存
                fs.writeFileSync(
                    filePath,
                    JSON.stringify(currentData, null, 2),
                    'utf-8'
                );
            } catch (err) {
                console.error(err);
            }
        });
    }else {
        // 404エラー対策
        console.log('404');
        res.writeHead(404); // ページなし
        res.end('Not Found');
    }
});




// サーバー起動（ポート3000）
server.listen(3000, () => {
    console.log('http://localhost:3000');
});

// 参考
// >node.jsのサーバー関連
// https://qiita.com/rvonzin0727/items/6240d09cb4876af38e33#json%E3%82%92%E8%BF%94%E5%8D%B4%E3%81%99%E3%82%8B%E5%AE%9F%E8%A3%85%E3%82%92%E3%81%97%E3%82%88%E3%81%86
// https://javascripttutorial.dokyumento.jp/nodejs-tutorial/nodejs-http-module/
// >Jsonの入力
// https://code.aetheria.jp/13886/
// fetchの説明
// https://qiita.com/nanasi-1/items/22f6acb6e011b1aadede
