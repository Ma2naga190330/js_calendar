// 予定追加
function addPlan(){
    // 追加ボタンの要素を取得
    const btnElm = document.getElementById('addBtn');
    // 追加ボタンが押されたらフォームの要素を取得する
    btnElm.addEventListener('click',async ()=>{
        // それぞれの入力値を取得
        let addDate = document.getElementById('addDate').value;
        let addTime = document.getElementById('addTime').value;
        let addPlan = document.getElementById('addPlan').value;
        console.log(`date>>`+addDate+' plan>>'+addPlan);
        try{
            // どれかが空白かどうかチェック
            if (addDate == '' || addPlan == ''||addTime==''){
                throw Error(message="未入力があります入力して下さい")
            }
            // 日付と時刻が重複しているかチェック
            if (await chackDuplicate(addDate,addTime)==true){
                throw Error(message="日付と時間が重複しています。\n入力しなおしてください")
            }
            // JSONにデータを追加
            fetch('/add', {
                // postでサーバーに送る
                method: 'POST',
                // Json形式で送る
                headers: {
                    'Content-Type': 'application/json'
                },
                // Json形式に変更
                body: JSON.stringify({
                    date: addDate,
                    time: addTime,
                    plan: addPlan
                })
            })
            alert("追加成功");
        }catch (e){
            // エラーメッセージを表示
            alert(e.message)
            // 強制リロード
            window.location.reload(true);
        }
    });
}

//Jsonデータの読み込み
async function readJson(){
    const dataResponse = await fetch('/data');
    return await dataResponse.json();
}
// 日付と時間が重複しているかの判定
async function chackDuplicate(date,time){
    // 既存のデータを取得
    const datas = await readJson();
    // 重複フラグ
    let flag = false
    for (data of datas){
        console.log(`input_plan.js>>${data.date}==${date},${data.time}==${time}`);
        // 日付と時間が重複しているかチェック
        if (data.date == date && data.time == time){
            // 重複していた場合trueを返す
            flag = true;
        }
    }
    return flag
}

// 予定追加関数
addPlan();