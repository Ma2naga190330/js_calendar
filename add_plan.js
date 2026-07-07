// 予定追加
function addPlan(){
    const btnElm = document.getElementById('addBtn');
    btnElm.addEventListener('click',()=>{
        let addDate = document.getElementById('addDate').value;
        let addTime = document.getElementById('addTime').value;
        let addPlan = document.getElementById('addPlan').value;
        console.log(`date>>`+addDate+' plan>>'+addPlan);
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
    });
}

addPlan();