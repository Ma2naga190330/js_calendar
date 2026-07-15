// 予定追加
function addPlan(){
    // 追加ボタンの要素を取得
    const btnElm = document.getElementById('addBtn');
    // 追加ボタンが押されたらフォームの要素を取得する
    btnElm.addEventListener('click',()=>{
        let addDate = document.getElementById('addDate').value;
        let addTime = document.getElementById('addTime').value;
        let addPlan = document.getElementById('addPlan').value;
        console.log(`date>>`+addDate+' plan>>'+addPlan);
        try{
            if (addDate == '' || addPlan == ''||addTime==''){
                throw Error(message="未入力があります入力して下さい")
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
            // 強制リロード
            window.location.reload(true);
        }
    });
}

addPlan();