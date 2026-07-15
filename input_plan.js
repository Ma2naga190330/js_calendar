// 予定追加
function addPlan(){
    // 追加ボタンの要素を取得
    const btnElm = document.getElementById('addBtn');
    // 追加ボタンが押されたらフォームの要素を取得する
    btnElm.addEventListener('click',async ()=>{
        let addDate = document.getElementById('addDate').value;
        let addTime = document.getElementById('addTime').value;
        let addPlan = document.getElementById('addPlan').value;
        console.log(`date>>`+addDate+' plan>>'+addPlan);
        try{
            if (addDate == '' || addPlan == ''||addTime==''){
                throw Error(message="未入力があります入力して下さい")
            }
            if (await chackDuplicate(addDate,addTime)==true){
                throw Error(message="日付と時間が重複しています。\n入力しなおしてください")
            }
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
            alert(e.message)
        }finally{
            fetch("/input");
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
    const datas = await readJson();
    let flag = false
    for (data of datas){
        console.log(`input_plan.js>>${data.date}==${date},${data.time}==${time}`);
        if (data.date == date && data.time == time){
            flag = true;
        }
    }
    return flag
}


addPlan();