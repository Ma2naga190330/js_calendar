function postValue(){
    const dateElm = document.getElementById('updateDate');
    const timeElm = document.getElementById('updateTime');
    const planElm = document.getElementById('updatePlan');

    dateElm.value="2026-06-23";
    timeElm.value="00:00";
    planElm.value="test"
}

//Jsonデータの読み込み
async function readJson(){
    const dataResponse = await fetch('/data');
    return await dataResponse.json();
}

// 更新一覧を作成
async function updateEventList(){
    // 更新一覧を入れる定数を定義
    const str = [];
    // JSONデータの取得
    const datas = await readJson();
    // 更新一覧を入れる要素を取得
    const tableElm = document.getElementById('planlist');
    console.log(datas);
    // dataの時系列を並び替え
    datas.sort((a, b) =>
        a.date > b.date ? 1 : -1  
        );
    console.log(datas);
    // idの一覧を入れる配列
    const ids = [];
    // idを初期化
    let id="";
    // 更新一覧の見出しを入れる
    str.push(`<tr><th>date</th><th>time</th><th>plan</th></tr>`)
    for (const data of datas){
        // idを作成しidsに格納する
        id = "plan"+data.date+"-"+data.time;
        ids.push(id);
        // 更新一覧を追加する
        str.push(`
            <form>
                <tr class="">
                    <td><input type="date" value="${data.date}" class="${id}" readonly></td>
                    <td><input type="time" value="${data.time}" class="${id}"></td>
                    <td><input type="text" value="${data.plan}" class="${id}"></td>
                </tr>
            </form>
            `)
        }
    // htmlに更新一覧を追加
    tableElm.innerHTML = str.join("");
    // 更新ボタンのイベントを作成
    updateSubmit(ids);
}

// 更新ボタンの関数
function updateSubmit(ids){
    // 更新ボタンの要素を取得
    const submitElm = document.getElementById('update_submit');
    // アップデートするデータを取得
    const updata = [];
    // 更新ボタンをクリックした処理
    submitElm.addEventListener("click",async ()=>{
        console.log("update_submit");
        console.log("ids>>"+ids);
        // 今回更新一覧すべてを読み取りdata.jsonを上書きする
        for (id of ids){
            // クラスidの要素を取得する
            const Elm = document.getElementsByClassName(id);
            console.log(Elm);
            // データを連想配列に変更して配列に格納する
            updata.push({
                date: Elm[0].value,
                time: Elm[1].value,
                plan: Elm[2].value
            })
        }
        // 更新するために/updにデータを送信
        await fetch('/upd', {
            // postでサーバーに送る
            method: 'POST',
            // Json形式で送る
            headers: {
                'Content-Type': 'application/json'
            },
            // Json形式に変更
            body: JSON.stringify(updata)
        })
        alert("更新成功");
        // 強制リロード
        window.location.reload(true);
    });
}
// 
updateEventList();