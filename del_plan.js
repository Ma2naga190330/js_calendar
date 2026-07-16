//Jsonデータの読み込み
async function readJson(){
    const dataResponse = await fetch('/data');
    return await dataResponse.json();
}

// 削除一覧をテーブルに追加
async function delPlanList(){
    // 削除一覧を登録する定数の定義
    const str = [];
    try{
        // データを取得
        const datas = await readJson();
        // 代入するタグの要素を取得
        const tableElm = document.getElementById('planlist');
        console.log(datas);
        // dataの時系列を並び替え
        datas.sort((a, b) =>
            a.date > b.date ? 1 : -1  
            );
        console.log(datas);
        // テーブルの見出しを設定
        str.push(`<tr><th class="table_datetime">datetime</th><th>plan</th></tr>`)
        for (const data of datas){
            // テーブルの要素を代入
            str.push(`
                <form>
                    <tr class="plan${data.date}d">
                        <td class="table_datetime">${data.date} - ${data.time}</td>
                        <td>${data.plan}</td>
                        <td><button id="btn${data.date}-${data.time}" style="width:100%; background-color:red; color:white;">削除</button>
                    </tr>
                </form>
                `)
            }
        // 削除一覧をHTMLに送る
        tableElm.innerHTML = str.join("");
        // 削除イベントを追加
        delEvent(datas);
    }catch (e){
        console.error(e);
    }
}

// 削除イベントを追加する関数
function delEvent(datas){
    // 削除イベントを追加
    for (const data of datas){
        // 削除のトリガーになる要素を取得
        const Elm = document.getElementById(`btn${data.date}-${data.time}`);
        console.log(`btn${data.date}-${data.time}`);
        // 削除ボタンが押されたら削除する
        Elm.addEventListener("click",()=>{
            console.log(`${data.date}-${data.time}`);
            // 削除を行う
            postdata(data.date,data.time);
        });
    }
}

// 削除を行う関数
function postdata(delDate,delTime){
    // 削除を行う/delにデータを送付
    fetch('/del', {
            // postでサーバーに送る
            method: 'POST',
            // Json形式で送る
            headers: {
                'Content-Type': 'application/json'
            },
            // Json形式に変更
            body: JSON.stringify({
                date: delDate,
                time: delTime,
                plan: ""
            })
        })
    // 強制リロード
    window.location.reload(true);
}

// 削除一覧を返す
delPlanList();